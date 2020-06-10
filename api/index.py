import os
from flask import Flask, jsonify, send_file
import time
from PIL import Image
import io
import sys
app = Flask(__name__)

# @app.route('/', defaults={'path': ''})
@app.route('/time')
def time_route():
    print("time")
    return jsonify(time=time.time())

@app.route('/photo')
def photo_route():
    print("photo")
    try:
        print("try")
        script_dir = os.path.dirname(__file__)
        rel_path = "../public/cards/characters/01.png"
        abs_file_path = os.path.join(script_dir, rel_path)
        print("path", abs_file_path)
        image = Image.open(abs_file_path)
        img_io = io.StringIO()
        image.save(img_io, 'PNG', quality=70)
        img_io.seek(0)
    except:
        print("error", sys.exc_info()[0])
    return send_file(img_io, mimetype='image/png')
