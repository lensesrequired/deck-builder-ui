from flask import Flask, Response
import time
app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return {'time': time.time()}
