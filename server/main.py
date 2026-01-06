from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CursorPoint(BaseModel):
    x: float
    y: float
    t: float

class FrustrationPayload(BaseModel):
    history: List[CursorPoint]
    type: str # "THRASHING" or "RAGE_CLICK"

@app.get("/")
def read_root():
    return {"status": "Genesis Cortex Online", "system": "NOMINAL"}

@app.post("/analyze")
def analyze_frustration(payload: FrustrationPayload):
    print(f"⚠️ Received Signal: {payload.type}")
    
    # 1. Convert to NumPy for speed
    points = np.array([[p.x, p.y] for p in payload.history])
    
    if len(points) < 2:
        return {"verdict": "INSUFFICIENT_DATA"}

    # 2. Calculate Entropy (Variance)
    std_dev = np.std(points, axis=0)
    variance_score = float(np.mean(std_dev))
    print(f"📊 Variance Analysis: {variance_score:.2f}")

    # 3. The "Doctor's Prescription"
    # If variance is LOW (tight knots), they are stuck -> Offer Help.
    # If variance is HIGH (wild shaking), they are angry -> Apologize/Reset.
    
    action = "MONITOR"
    if payload.type == "RAGE_CLICK":
        action = "MUTATE_UI_HELP" # Specific command to Next.js
    elif payload.type == "THRASHING" and variance_score < 50:
        action = "MUTATE_UI_SIMPLIFY" # They are lost in a small area

    return {
        "received": True,
        "variance": variance_score,
        "action": action, # <--- The critical instruction
        "confidence": 0.98
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)