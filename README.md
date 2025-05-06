# Diabefit

[👉 Try the app here](https://diabefit.web.app/)

**Diabefit** is a smart and user-friendly tool designed to support people with type 1 diabetes (or anyone on intensive insulin therapy) in managing their condition. It simplifies bolus calculations, connects with FreeStyle Libre CGM, and uses AI to analyze glucose trends and suggest smarter insulin dosing.

> 🎥 **Watch the promo video below** to see how Diabefit can make your daily diabetes management easier and less stressful!  
> 
---

## 📁 Project Structure

This repository contains four main components:

### `diabefit-ui`
The frontend of the application, built with **React** and designed as a **Progressive Web App (PWA)**.

Features:
- Clean and responsive user interface
- Integration with CGM (FreeStyle Libre)
- Meal and bolus planning
- Insulin-on-board (IOB) calculation
- Built-in **AI engine** that suggests optimal bolus doses based on your glucose and meal history
- Personalized user settings
- Multilingual support (currently English and Polish) via **i18n**

---

### `diabefit-proxy`
A lightweight **Node.js proxy** used to:
- Forward API calls to the Django backend
- Safely communicate with the **LibreView API** for CGM data access

---

### `diabefit-service`
The backend written in **Django**, handling:
- Firebase-based authentication
- Storage and retrieval of meals, insulin doses, and user data
- REST API for frontend and AI integration

---

### `diabefit-ai-model`
Exploratory and experimental AI models to improve bolus prediction.  
Key points:
- Various models were tested on real-world diabetes data
- The most effective model was **XGBRegressor**, which provided consistent and sensible bolus dose predictions based on glucose, insulin, and meal history
- This model is already integrated and live in the application

---

## 🧠 AI Features

Diabefit includes a working AI-based prediction engine that:
- Learns from your past glucose, meals, and insulin data
- Suggests personalized bolus doses at the right time
- Helps uncover individual glucose trends

> The AI model is already implemented and being improved over time.

---

## 🎓 About the Project

Diabefit is not a certified medical device – it is intended for educational and research purposes.

