#flask server connecting python w nextjs api

from flask import Flask, request, jsonify
from flask_cors import CORS
from main import explainIngredients
from PIL import Image
import easyocr

app=Flask(__name__)
CORS(app)

reader = easyocr.Reader(["en"])

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
    
    img = Image.open(file.stream).convert("RGB")
    ocr_results = reader.readtext(img)
    text = " ".join([r[1] for r in ocr_results])
    return jsonify({"text": text})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)