from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from fatsecret import Fatsecret

consumer_key = 'a10b021da4fa4e4abaf91c1f047ea9c6'
consumer_secret = '712c2646d33a48caa69ddb4a5574febf'

@csrf_exempt
def search(request):
    fs = Fatsecret(consumer_key, consumer_secret)
    foods = fs.foods_search(request.GET.get('name', ''), request.GET.get('page', '0'), request.GET.get('size', '50'))
    return JsonResponse(foods, safe=False)
