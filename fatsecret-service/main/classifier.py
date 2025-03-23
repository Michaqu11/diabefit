import pandas as pd
import numpy as np
import json
from datetime import timedelta
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
import xgboost as xgb

def train_insulin_classifier(csv_file_path, json_file_path, params=None):
    """
    Trains a model based on glucose and meal data from CSV and JSON files.
    Returns a dictionary with data needed for testing and further use.
    
    Args:
        csv_file_path (str): Path to the CSV file with glucose data
        json_file_path (str): Path to the JSON file with meal data
        params (dict, optional): Additional model parameters (e.g., n_estimators, max_depth)
    
    Returns:
        dict: Dictionary containing X_train, X_test, y_train, y_test, model, mean_icr_by_part, scaler
    """
    # Default model parameters if none provided
    default_params = {
        'n_estimators': 100,
        'max_depth': 3,
        'learning_rate': 0.1,
        'random_state': 42,
        'reg_lambda': 1.0,
        'reg_alpha': 0.1
    }
    if params:
        default_params.update(params)

    # 1. Load data
    glucose_data = pd.read_csv(csv_file_path, skiprows=1, delimiter=',', low_memory=False)
    glucose_data['date'] = pd.to_datetime(glucose_data['Device Timestamp'], format='%d-%m-%Y %H:%M', errors='coerce')
    glucose_data['glucose'] = glucose_data['Historic Glucose mg/dL'].combine_first(glucose_data['Scan Glucose mg/dL'])
    glucose_data = glucose_data[['date', 'glucose']].dropna(subset=['date', 'glucose']).sort_values('date')

    with open(json_file_path, 'r') as f:
        meals_data = json.load(f)

    # 2. Process data
    processed_data = []
    for user_id, records in meals_data.items():
        for record in records:
            calculator = record.get('calculatorData')
            if calculator and calculator.get('glucose') and calculator.get('units', {}).get('short'):
                date = pd.to_datetime(calculator['date'], errors='coerce').replace(tzinfo=None)
                insulin = calculator['units']['short']
                glucose_pre = calculator['glucose']
                carbs = sum(meal.get('carbs', 0) for meal in record.get('meals', []))
                fats = sum(meal.get('fats', 0) for meal in record.get('meals', []))
                prot = sum(meal.get('prot', 0) for meal in record.get('meals', []))
                
                glucose_window = glucose_data[
                    (glucose_data['date'] >= date + timedelta(hours=1)) & 
                    (glucose_data['date'] <= date + timedelta(hours=2.5))
                ]
                if not glucose_window.empty:
                    glucose_post = np.mean(glucose_window['glucose'].values)
                    processed_data.append([date, glucose_pre, glucose_post, insulin, carbs, fats, prot])

    df = pd.DataFrame(processed_data, columns=['date', 'glucose_pre', 'glucose_post', 'insulin', 'carbs', 'fats', 'prot'])

    # 3. Prepare features
    df['WW'] = df['carbs'] / 10  # WW = carbohydrate exchange units (Węglowodanowe Wymienniki)
    df['insulin_per_ww'] = np.where(df['WW'] > 0, df['insulin'] / df['WW'], 0)
    df['hour'] = df['date'].dt.hour + df['date'].dt.minute / 60
    df['part_of_day'] = df['date'].dt.hour.apply(lambda h: 0 if 6 <= h < 12 else 1 if 12 <= h < 18 else 2 if 18 <= h < 24 else 3)

    # Calculate ICR (Insulin-to-Carb Ratio) for each part of the day
    ok_glucose = df[(df['glucose_post'] >= 80) & (df['glucose_post'] <= 150)]
    mean_icr_by_part = ok_glucose.groupby('part_of_day')['insulin_per_ww'].mean().to_dict()
    default_icr = ok_glucose['insulin_per_ww'].mean() if not ok_glucose.empty else 1.0
    for part in range(4):  # Ensure ICR exists for all parts of the day (0-3)
        mean_icr_by_part.setdefault(part, default_icr)

    X = df[['glucose_pre', 'insulin', 'WW', 'fats', 'prot', 'insulin_per_ww', 'hour', 'part_of_day']]
    y = df['glucose_post']

    # Remove infinite values and NaNs
    mask = ~(np.isinf(X).any(axis=1) | X.isna().any(axis=1) | np.isinf(y) | y.isna())
    X = X[mask]
    y = y[mask]

    # Normalize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 4. Split data and train the model
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    model = xgb.XGBRegressor(objective='reg:squarederror', **default_params)
    model.fit(X_train, y_train)

    # Cross-validation (optional, for informational purposes)
    cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='neg_mean_squared_error')
    rmse_cv = np.sqrt(-cv_scores)
    print(f"Average RMSE (CV): {rmse_cv.mean():.2f} (+/- {rmse_cv.std() * 2:.2f})")

    # Return the data needed for testing and predictions
    return {
        'X_train': X_train,
        'X_test': X_test,
        'y_train': y_train,
        'y_test': y_test,
        'model': model,
        'mean_icr_by_part': mean_icr_by_part,
        'scaler': scaler
    }

def predict_insulin_dose(model_data, glucose_pre, insulin, carbs, fats, prot, timestamp):
    """
    Predicts post-meal glucose and suggests an insulin dose based on meal data.
    
    Args:
        model_data (dict): Data returned by train_insulin_classifier
        glucose_pre (float): Pre-meal glucose level (mg/dL)
        insulin (float): Administered insulin dose (units)
        carbs (float): Carbohydrates (g)
        fats (float): Fats (g)
        prot (float): Proteins (g)
        timestamp (str): Meal timestamp in ISO format (e.g., '2025-03-22T09:30:00')
    
    Returns:
        dict: Prediction and suggestion results
    """
    model = model_data['model']
    scaler = model_data['scaler']
    mean_icr_by_part = model_data['mean_icr_by_part']

    # Process input data
    date = pd.to_datetime(timestamp)
    ww = carbs / 10  # Convert carbs to WW (carbohydrate exchange units)
    insulin_per_ww = insulin / ww if ww > 0 else 0
    hour = date.hour + date.minute / 60
    part_of_day = 0 if 6 <= date.hour < 12 else 1 if 12 <= date.hour < 18 else 2 if 18 <= date.hour < 24 else 3

    # Prepare input data for prediction
    input_data = pd.DataFrame([[glucose_pre, insulin, ww, fats, prot, insulin_per_ww, hour, part_of_day]],
                             columns=['glucose_pre', 'insulin', 'WW', 'fats', 'prot', 'insulin_per_ww', 'hour', 'part_of_day'])
    input_scaled = scaler.transform(input_data)

    # Predict post-meal glucose
    glucose_post_pred = model.predict(input_scaled)[0]

    # Classify dose and suggest insulin
    mean_icr = mean_icr_by_part.get(part_of_day, 1.0)  # Get ICR for the given part of the day
    target_glucose = 110
    sensitivity = 40

    if insulin_per_ww > 2 * mean_icr:
        feedback = 2
    elif insulin_per_ww < 0.5 * mean_icr and (glucose_post_pred > 150 or (glucose_pre > 120 and glucose_post_pred > 130)):
        feedback = -1
    elif insulin_per_ww < 0.5 * mean_icr and glucose_post_pred > 180:
        feedback = -2
    elif glucose_post_pred < 70:
        feedback = 2
    elif 70 <= glucose_post_pred < 80:
        feedback = 1
    elif 80 <= glucose_post_pred <= 150:
        feedback = 0
    elif 150 < glucose_post_pred <= 180:
        feedback = -1
    elif 180 < glucose_post_pred <= 240:
        feedback = -2
    else:
        feedback = -3

    glucose_diff = glucose_post_pred - target_glucose
    correction = glucose_diff / sensitivity  # Positive if too high, negative if too low
    carb_insulin = ww * mean_icr  # Base insulin for carbs
    pre_correction = max(0, (glucose_pre - 120) / sensitivity)  # Correction for high pre-meal glucose
    suggested_insulin = max(0, carb_insulin + pre_correction + correction)

    feedback_desc = {
        -3: "Significantly too low dose", -2: "Too low dose", -1: "Slightly too low dose",
        0: "OK", 1: "Slightly too high dose", 2: "Too high dose"
    }
    part_of_day_desc = {0: "Morning", 1: "Afternoon", 2: "Evening", 3: "Night"}

    return {
        'predicted_glucose': float(glucose_post_pred),
        'feedback': feedback_desc[feedback],
        'suggested_insulin': float(suggested_insulin),
        'part_of_day': part_of_day_desc[part_of_day],
        'icr_used': float(mean_icr)
    }

# Example usage (for local testing)
if __name__ == "__main__":
    # Train the model
    model_data = train_insulin_classifier('Michał._glucose_8-3-2025.csv', 'data (6).json')
    
    # Predict for a sample meal
    result = predict_insulin_dose(
        model_data,
        glucose_pre=150,
        insulin=2,
        carbs=50,
        fats=10,
        prot=5,
        timestamp='2025-03-22T09:30:00'
    )
    print(result)