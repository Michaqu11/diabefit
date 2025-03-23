import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rauth.service import OAuth1Service
import pickle
import base64
from .classifier import train_insulin_classifier, predict_insulin_dose 


from storage.database import (
    delete_user_own_product,
    get_user_own_products,
    is_user_exist,
    get_user_insulin_correction,
    get_user_units,
    get_user_insulin,
    push_user_own_product,
    set_user,
    get_user_all_units,
    set_user_settings,
    set_user_libre_api,
    get_user_target_range,
    get_user_diabetes_type,
    get_user_libre_api,
)

consumer_key = "a10b021da4fa4e4abaf91c1f047ea9c6"
consumer_secret = "712c2646d33a48caa69ddb4a5574febf"
base_url = "https://platform.fatsecret.com/rest/server.api"


def get_session():
    service = OAuth1Service(
        name="fatsecret",
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        request_token_url="https://www.fatsecret.com/oauth/request_token",
        access_token_url="https://www.fatsecret.com/oauth/access_token",
        authorize_url="https://www.fatsecret.com/oauth/authorize",
        base_url="https://platform.fatsecret.com/rest/server.api",
    )

    return service.get_session()


def search_food(food_name, page_number):
    session = get_session()

    response = session.get(
        "https://platform.fatsecret.com/rest/server.api",
        params={
            "method": "foods.search.v2",
            "search_expression": food_name,
            "page_number": page_number,
            "format": "json",
        },
    )

    return response.json()


def autocomplete(search_expression):
    session = get_session()

    response = session.get(
        "https://platform.fatsecret.com/rest/server.api",
        params={
            "method": "foods.autocomplete.v2",
            "expression": search_expression,
            "format": "json",
        },
    )

    return response.json()


@csrf_exempt
def search(request):
    food_search_results = search_food(request.GET.get("name"), request.GET.get("page"))
    return JsonResponse(food_search_results, safe=False)


@csrf_exempt
def libreConnection(request):
    token = request.GET.get("token")
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
        "Accept": "*/*",
        "version": "4.7.0",
        "product": "llu.android",
        "authorization": f"Bearer {token}",
    }
    session = requests.Session()

    response = session.get(
        "https://api-eu.libreview.io/llu/connections", headers=headers, proxies={'http':'', 'https':''}
    )
    data = response.json()

    return JsonResponse(data, safe=False)


@csrf_exempt
def login(request):
    if request.method == "POST":
        body_unicode = request.body.decode("utf-8")
        body = json.loads(body_unicode)
        user = is_user_exist(body["id"], body["token"])
        if not user:
            result = set_user(body["id"], body["token"])
        else:
            result = {
                "settings": all_settings(body["id"], body["token"]),
                "libreAPI": get_libre(body["id"], body["token"]),
            }

        return JsonResponse(result, safe=False)
    return JsonResponse({"result": False}, safe=False)


@csrf_exempt
def units(request):
    result = {
        "units": get_user_units(
            request.GET.get("id"), request.GET.get("hour"), request.GET.get("token")
        )
    }

    return JsonResponse(result, safe=False)


@csrf_exempt
def all_units(request):
    result = {
        "units": get_user_all_units(request.GET.get("id"), request.GET.get("token"))
    }

    return JsonResponse(result, safe=False)


@csrf_exempt
def insulin_correction(request):
    result = {
        "insulinCorrection": get_user_insulin_correction(
            request.GET.get("id"), request.GET.get("token")
        )
    }

    return JsonResponse(result, safe=False)


@csrf_exempt
def insulin(request):
    result = get_user_insulin(request.GET.get("id"), request.GET.get("token"))

    return JsonResponse(result, safe=False)


@csrf_exempt
def range(request):
    result = get_user_target_range(request.GET.get("id"), request.GET.get("token"))

    return JsonResponse(result, safe=False)


@csrf_exempt
def all_settings(id, token):
    result = {
        "diabetesType": get_user_diabetes_type(id, token),
        "units": get_user_all_units(id, token),
        "insulinCorrection": get_user_insulin_correction(id, token),
        "insulin": get_user_insulin(id, token),
        "targetRange": get_user_target_range(id, token),
    }

    return result


@csrf_exempt
def set_settings(body):
    result = set_user_settings(body)
    return JsonResponse({"result": result}, safe=False)


@csrf_exempt
def settings(request):
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    if request.method == "POST":
        return set_settings(body)
    else:
        return JsonResponse(all_settings(body["id"], body["token"]), safe=False)


@csrf_exempt
def set_libre(body):
    result = set_user_libre_api(body)
    return JsonResponse({"result": result}, safe=False)


@csrf_exempt
def get_libre(id, token):
    api = get_user_libre_api(id, token)
    return api


@csrf_exempt
def libre(request):
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)
    if request.method == "POST":
        return set_libre(body)
    else:
        return JsonResponse(
            {"libreAPI": get_libre(body["id"], body["token"])}, safe=False
        )

@csrf_exempt
def push_food(body):
    result = push_user_own_product(body)
    return JsonResponse({"result": result}, safe=False)

@csrf_exempt
def own_product(request):
    if request.method == "POST":
        body_unicode = request.body.decode("utf-8")
        body = json.loads(body_unicode)
        return push_food(body)
    elif request.method == "DELETE":
        user_id = request.GET.get('id')
        display_name = request.GET.get('displayName')
        token = request.GET.get('token')
        result = delete_user_own_product(user_id, display_name, token)
        return JsonResponse(
            {"result": result}, safe=False
        )
    else:
        user_id = request.GET.get('id') 
        token = request.GET.get('token')
        return JsonResponse(
            {"ownProduct": get_user_own_products(user_id, token)}, safe=False
        )


@csrf_exempt
def train_model(request):
    """
    Endpoint to train the insulin classifier model using uploaded CSV and JSON files.
    Returns the trained model and related data in the response.
    Expects a POST request with 'csv_file' and 'json_file' in the form data.
    """
    if request.method == 'POST':
        try:
            # Check if files are provided in the request
            if 'csv_file' not in request.FILES or 'json_file' not in request.FILES:
                return JsonResponse({'status': 'error', 'message': 'CSV and JSON files are required'}, status=400)

            # Get temporary file paths for uploaded files
            csv_file_path = request.FILES['csv_file'].temporary_file_path()
            json_file_path = request.FILES['json_file'].temporary_file_path()

            # Optional parameters from the request (if provided)
            params = json.loads(request.POST.get('params', '{}'))

            # Train the model using the provided files
            model_data = train_insulin_classifier(csv_file_path, json_file_path, params)

            # Serialize the model_data dictionary to a binary format using pickle
            serialized_model_data = pickle.dumps(model_data)

            # Encode the binary data to base64 for safe JSON transmission
            encoded_model_data = base64.b64encode(serialized_model_data).decode('utf-8')

            return JsonResponse({
                'status': 'success',
                'message': 'Model trained successfully',
                'model_data': encoded_model_data,
                'cv_rmse': f"{model_data['model'].predict(model_data['X_test']).mean():.2f}"
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f"Training failed: {str(e)}"}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def predict_dose(request):
    """
    Endpoint to predict glucose and suggest insulin dose based on meal data.
    Expects a POST request with JSON body containing model_data (from /train/) and meal details.
    """
    if request.method == 'POST':
        try:
            # Parse JSON data from request body
            data = json.loads(request.body)
            required_fields = ['model_data', 'glucose_pre', 'insulin', 'carbs', 'fats', 'prot', 'timestamp']
            if not all(field in data for field in required_fields):
                return JsonResponse({'status': 'error', 'message': 'Missing required fields'}, status=400)

            # Decode the base64-encoded model_data back to binary
            encoded_model_data = data['model_data']
            serialized_model_data = base64.b64decode(encoded_model_data)

            # Deserialize the binary data back to the model_data dictionary
            model_data = pickle.loads(serialized_model_data)

            # Extract meal data and make prediction
            result = predict_insulin_dose(
                model_data,
                glucose_pre=float(data['glucose_pre']),
                insulin=float(data['insulin']),
                carbs=float(data['carbs']),
                fats=float(data['fats']),
                prot=float(data['prot']),
                timestamp=data['timestamp']
            )

            return JsonResponse({
                'status': 'success',
                'data': result
            })
        except ValueError as e:
            return JsonResponse({'status': 'error', 'message': f"Invalid input data: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f"Prediction failed: {str(e)}"}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)