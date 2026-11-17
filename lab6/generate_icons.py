from PIL import Image, ImageDraw

def make_icon(size, path):
    img = Image.new("RGB", (size, size), "#0f172a")
    d = ImageDraw.Draw(img)
    r = size // 2
    d.ellipse((r*0.2, r*0.2, size - r*0.2, size - r*0.2), outline="#38bdf8", width=size//20)
    d.line((r, r*0.4, r, r), fill="#38bdf8", width=size//30)
    d.line((r, r, r + r*0.5, r), fill="#38bdf8", width=size//30)
    img.save(path)

make_icon(192, "static/icons/icon-192.png")
make_icon(512, "static/icons/icon-512.png")
print("OK")