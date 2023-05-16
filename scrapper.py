from bs4 import BeautifulSoup
import requests
import json


base = 'https://www.fitatu.com'
products = []


def read_products(url):
    product = {
        'url': url
    }
    print('product: ', product, "\n")
    products.append(product)

def checkChild(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    list = soup.find("ul", class_="links-list")
    if not list:
        return True
    return False

def find_subcategory(url):
    while True:
        page = requests.get(url)
        soup = BeautifulSoup(page.content, 'html.parser')
        list = soup.find("ul", class_="links-list")
        if not list or checkChild(url):
            read_products(url)
            break

        header_list = list.findAll("li")
        for el in header_list:
            direction = el.find("a").get('href')
            find_subcategory(base + direction)




if __name__ == '__main__':
    url = base + '/catalog/pl'
    find_subcategory(url)
    print(products)
    with open('./files/products.json', 'w') as json_file:
	    json.dump(products, json_file)
