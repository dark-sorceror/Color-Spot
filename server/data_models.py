from pydantic import BaseModel

class FramePayload(BaseModel):
    image: str
    x: float
    y: float