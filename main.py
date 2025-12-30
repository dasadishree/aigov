import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client=OpenAI(api_key=os.getenv("API_KEY"))

def explainIngredients(ingredientList):
    prompt=f"""
    Explain each ingredient below. 
    For each ingredient, say:
    - What it is (both scientifically and common names)
    - Why it's used
    - Possible effects, both positive and negative
    Make this understandable to the average person so that they can make informed decisions and actually understand what they are eating/consuming.set

    Ingredients:
    {ingredientList}
    """

    response= client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You're an assistant/food nutrition scientist helping the average person understand ingredient lists for their food items"},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content

#input
ingredients = input("Paste ingredient list here:")
output=explainIngredients(ingredients)
print("\n---Ingredient Explanation---\n")
print(output)