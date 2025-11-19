import re
import uvicorn

import cv2

import base64

import numpy as np

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data_models import FramePayload

app = FastAPI(
    title = "Color Spot",
    description = "Real life color picker",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://localhost:5173"
    ],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

def rgb_to_hex(r: int, g: int, b: int) -> str:
    return "#{:02x}{:02x}{:02x}".format(r, g, b)

@app.post("/color")
def pick_color(payload: FramePayload):
    img_b64 = re.sub(r"^data:image\/.+;base64,", "", payload.image)

    try:
        img_bytes = base64.b64decode(img_b64)
    except Exception:
        return {
            "error": "Invalid base64 image data"
        }
        
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if img is None: 
        return {
            "error": "Failed to decode image"
        }
        
    h, w = img.shape[:2]
    
    x = max(0, min(payload.x, w - 1))
    y = max(0, min(payload.y, h - 1))

    b, g, r = img[int(y), int(x)]
    
    hex = rgb_to_hex(int(r), int(g), int(b))

    return {
        "x": x,
        "y": y,
        "r": int(r),
        "g": int(g),
        "b": int(b),
        "hex": hex,
    }

@app.get("/test")
def root():
    return {
        "response": "Backend is running"
    }

if __name__ == "__main__":
    uvicorn.run(
        "__main__:app",
        host = "127.0.0.1",
        port = 8000,
        reload = True
    )