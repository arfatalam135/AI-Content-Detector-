from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
from keras.preprocessing import image
import numpy as np
import shutil
import os

app = FastAPI(title="AI Content Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = ResNet50(weights="imagenet")

@app.post("/analyze")
async def analyze_image(media: UploadFile = File(...)):
    if not media.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        return JSONResponse(status_code=400, content={"error": "Only image files are supported."})

    os.makedirs("temp", exist_ok=True)
    temp_path = f"temp/{media.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(media.file, buffer)

    img = image.load_img(temp_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)

    preds = model.predict(x)
    decoded = decode_predictions(preds, top=3)[0]
    os.remove(temp_path)

    ai_keywords = ["cartoon", "digital", "mask", "computer", "animated"]
    explanation = "Top prediction: " + decoded[0][1]
    ai_score = sum([1 for _, label, _ in decoded if any(k in label.lower() for k in ai_keywords)])

    if ai_score > 0:
        result = "AI-Generated"
        confidence = 0.90
    else:
        result = "Human-Made"
        confidence = 0.95

    return {
        "result": result,
        "confidence": confidence,
        "explanation": explanation
}
