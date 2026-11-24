from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import Product
from schemas import ProductCreate, ProductOut, ProductStockUpdate

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Lab 7 — Products API")


@app.get("/api/products", response_model=list[ProductOut])
def list_products(
    minPrice: Optional[float] = Query(None, ge=0),
    maxPrice: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if minPrice is not None and maxPrice is not None:
        if minPrice > maxPrice:
            raise HTTPException(status_code=400, detail="minPrice не может быть больше maxPrice")
        query = query.filter(Product.price.between(minPrice, maxPrice))
    elif minPrice is not None:
        query = query.filter(Product.price >= minPrice)
    elif maxPrice is not None:
        query = query.filter(Product.price <= maxPrice)

    return query.all()


@app.post("/api/products", response_model=ProductOut, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    if payload.price < 0 or payload.stock < 0:
        raise HTTPException(status_code=400, detail="price и stock должны быть >= 0")

    product = Product(
        name=payload.name,
        price=payload.price,
        stock=payload.stock,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@app.patch("/api/products/{product_id}", response_model=ProductOut)
def update_stock(
    product_id: int,
    payload: ProductStockUpdate,
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")

    if payload.stock < 0:
        raise HTTPException(status_code=400, detail="stock должен быть >= 0")

    product.stock = payload.stock
    db.commit()
    db.refresh(product)
    return product


@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    db.delete(product)
    db.commit()
    return None