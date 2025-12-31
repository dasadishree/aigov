import os
import requests
# from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")
url="https://ai.hackclub.com/proxy/v1/chat/completions"

def explainIngredients(ingredientList):
    prompt=f"""
    Explain each ingredient below. 
    For each ingredient, output in this format:

    Ingredient:
    - What it is (both scientifically and common names)
    - Why it's used
    - Possible heatlh/energy effects, sorted into positive and negative
    Make this understandable to the average person so that they can make informed decisions and actually understand what they are eating/consuming

    Ingredients:
    {ingredientList}
    """

    data ={
        "model": "qwen/qwen3-32b",
        "messages": [
            {"role": "system", "content": "You're an assistant/food nutrition scientist helping the average person understand ingredient lists for their food items"},
            {"role": "user", "content" : prompt}
        ]
    }

    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

#input
ingredients = input("Paste ingredient list here:")
output=explainIngredients(ingredients)
print("\n---Ingredient Explanation---\n")
print(output)