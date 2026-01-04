#flask server connecting python w nextjs api

from flask import Flask, request, jsonify
from flask_cors import CORS
from main import explainIngredients
from PIL import Image
import requests
import os

app=Flask(__name__)
CORS(app)

OCR_SPACE=os.environ.get("OCR_KEY")
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
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image upploaded"}), 400
    
    try:
        response=requests.post(
            "https://api.ocr.space/parse/image",
            files={"filename": (file.filename, file.stream, file.content_type)},
            data={"apikey": OCR_SPACE, "language": "eng"},
        )
        result=response.json()
        text=result.get("ParsedResults", [{}])[0].get("ParsedText", "")
        return jsonify({"text": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)