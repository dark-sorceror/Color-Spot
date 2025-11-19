from pydantic import BaseModel

class FramePayload(BaseModel):
    image: str
    x: int
    y: int