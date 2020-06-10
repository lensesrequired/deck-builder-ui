from flask import Flask, jsonify
import time
app = Flask(__name__)

# @app.route('/', defaults={'path': ''})
@app.route('/time')
def time_route():
    return jsonify(time=time.time())
