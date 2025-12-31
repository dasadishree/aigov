#flask server connecting python w nextjs api

from flask import Flask, request, jsonify
from flask_cors import CORS
from main import explainIngredients

app=Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data=request.json
    ingredients=data.get("ingredients", "")

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400
    
    result=explainIngredients(ingredients)
    return jsonify({"analysis": result})

if __name__ == "__main__":
    app.run(port=5000, debug=True)