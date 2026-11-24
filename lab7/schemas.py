from pydantic import BaseModel, Field, ConfigDict


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1)
    price: float = Field(..., ge=0)
    stock: int = Field(..., ge=0)


class ProductStockUpdate(BaseModel):
    stock: int = Field(..., ge=0)


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: float
    stock: int