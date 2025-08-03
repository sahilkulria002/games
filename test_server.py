#!/usr/bin/env python3

from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    print("Starting test server...")
    print("Game will be available at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
