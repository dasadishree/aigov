#flask server connecting python w nextjs api

from flask import Flask, request, jsonify
from flask_cors import CORS
from main import explainIngredients

app=Flask(__name__)
CORS(app)

# ai analysis
@app.route("/analyze", methods=["POST"])
def analyze():
    data=request.json
    ingredients=data.get("ingredients", "")

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400
    
    result=explainIngredients(ingredients)
    return jsonify({"analysis": result})

# image scan
@app.route("/scan", methods=["POST"])
def scan():
    file=request.files["image"]
    print(file.filename)
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(port=5000, debug=True)