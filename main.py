#ai logic

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

    RULES: 
    - Output ONLY in the format shown
    - Do NOT add introductions, summaries, or extra text
    - Each ingredient must be numbered
    - Use exactly three bullets per ingredient

    FORMAT (EXACT)
    - Ingredient name: (don't return "1. Ingredient name: sugar", just return "1. Sugar")
    - Why it's used: ...
    - Positive health/energy effects: ...
    - Negative health/energy effects: ...

    Ingredients:
    {ingredientList}
    """

    data ={
        "model": "openai/gpt-5-mini",
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

#input test
# ingredients = input("Paste ingredient list here:")
# output=explainIngredients(ingredients)
# print("\n---Ingredient Explanation---\n")
# print(output)