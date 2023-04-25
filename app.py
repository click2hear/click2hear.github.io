from flask import Flask
from flask_ngrok import run_with_ngrok
from flask import render_template


app = Flask(__name__)
# run_with_ngrok(app)  # Start ngrok when app is run but only works on port 5000, map dokcer port to 5000, only then it works


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/manisha')
def manisha():
    return render_template('manisha.html')


@app.route('/SOP')
def SOP():
    return render_template('sop.html')


@app.route('/2.5D')
def two_five_d():
    return render_template('two_five_d.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8787)
