from fastapi import FastAPI, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from datetime import datetime
import os

PORT = int(os.getenv("PORT", 8000))
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="Clock & Timezones API")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", include_in_schema=False)
async def root():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/about", include_in_schema=False)
async def about():
    return FileResponse(STATIC_DIR / "about.html")

@app.get("/api/time")
async def api_time(format: str = Query("24", description="Формат: 24 или 12")):
    try:
        now = datetime.now()

        if format == "12":
            time_str = now.strftime("%I:%M:%S %p")
            fmt = "12h"
        else:
            time_str = now.strftime("%H:%M:%S")
            fmt = "24h"
        return {
            "time": time_str,
            "timezone": "UTC",
            "format": fmt,
        }
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"},
        )
@app.get("/sw.js", include_in_schema=False)
async def service_worker():
    return FileResponse(
        STATIC_DIR / "sw.js",
        media_type="application/javascript",
        headers={"Cache-Control": "no-cache"},
    )


@app.get("/manifest.json", include_in_schema=False)
async def manifest():
    return FileResponse(
        STATIC_DIR / "manifest.json",
        media_type="application/manifest+json",
    )


@app.get("/api/status")
async def status():
    return {"status": "ok", "service": "clock-api"}


if __name__ == "__main__":
    import uvicorn
    print(f"Server started on port {PORT}")
    uvicorn.run(app, host="localhost", port=PORT)