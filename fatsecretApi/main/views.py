from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
from oauthlib.oauth1 import Client
import json
from rauth.service import OAuth1Service

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


