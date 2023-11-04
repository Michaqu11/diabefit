import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rauth.service import OAuth1Service

from storage.database import is_user_exist, get_user_insulin_correction, get_user_units, get_user_insulin, set_user, \
    get_user_all_units, set_user_settings, set_user_libre_api, get_user_target_range, get_user_diabetes_type, \
    get_user_libre_api

consumer_key = "a10b021da4fa4e4abaf91c1f047ea9c6"
consumer_secret = "712c2646d33a48caa69ddb4a5574febf"
base_url = "https://platform.fatsecret.com/rest/server.api"


def get_session():
    service = OAuth1Service(
        name='fatsecret',
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

    response = session.get("https://platform.fatsecret.com/rest/server.api", params={
        "method": "foods.search.v2",
        "search_expression": food_name,
        "page_number": page_number,
        "format": "json",
    })

    return response.json()


def autocomplete(search_expression):
    session = get_session()

    response = session.get("https://platform.fatsecret.com/rest/server.api", params={
        "method": "foods.autocomplete.v2",
        "expression": search_expression,
        "format": "json",
    })

    return response.json()


@csrf_exempt
def search(request):
    food_search_results = search_food(request.GET.get('name'), request.GET.get('page'))
    return JsonResponse(food_search_results, safe=False)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        user = is_user_exist(body['id'])
        if not user:
            result = set_user(body['id'])
            return JsonResponse({"result": True if result else False}, safe=False)
        return JsonResponse({"result": True}, safe=False)
    return JsonResponse({"result": False}, safe=False)


@csrf_exempt
def units(request):
    result = {
        "units": get_user_units(request.GET.get('id'), request.GET.get('hour'))
    }

    return JsonResponse(result, safe=False)


@csrf_exempt
def all_units(request):
    result = {
        "units": get_user_all_units(request.GET.get('id'))
    }

    return JsonResponse(result, safe=False)


@csrf_exempt
def insulin_correction(request):
    result = {
        "insulinCorrection": get_user_insulin_correction(request.GET.get('id'))
    }

    return JsonResponse(result, safe=False)


@csrf_exempt
def insulin(request):
    result = get_user_insulin(request.GET.get('id'))

    return JsonResponse(result, safe=False)


@csrf_exempt
def range(request):
    result = get_user_target_range(request.GET.get('id'))

    return JsonResponse(result, safe=False)


@csrf_exempt
def all_settings(body):
    id = body['id']
    result = {
        "diabetesType": get_user_diabetes_type(id),
        "units": get_user_all_units(id),
        "insulinCorrection": get_user_insulin_correction(id),
        "insulin": get_user_insulin(id),
        "targetRange": get_user_target_range(id)
    }

    return JsonResponse(result, safe=False)


@csrf_exempt
def set_settings(body):
    result = set_user_settings(body)
    return JsonResponse({"result": result}, safe=False)


@csrf_exempt
def settings(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    if request.method == 'POST':
        return set_settings(body)
    else:
        return all_settings(body)


@csrf_exempt
def set_libre(body):
    result = set_user_libre_api(body)
    return JsonResponse({"result": result}, safe=False)


@csrf_exempt
def get_libre(body):
    api = get_user_libre_api(body['id'])
    return JsonResponse(api, safe=False)


@csrf_exempt
def libre(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    if request.method == 'POST':
        return set_libre(body)
    else:
        return get_libre(body)
