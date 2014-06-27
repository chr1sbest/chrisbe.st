from app import app, mail
from flask import render_template, flash, request, redirect, url_for
from flask.ext.mail import Message

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/cozy')
def cozy():
    return render_template("cozy.html")

@app.route('/send_message', methods = ['POST'])
def send_message():
    """
    Send email from #contact form to chr2sbest@gmail.com inbox
    """
    print request.method
    email = request.form['email']
    message = request.form['message']
    content = """
    Email: {0}
    Message: {1}
    """.format(email, message)
    msg = Message('New Message', 
                  sender='postmaster@app19945528.mailgun.org', 
                  recipients =['chr2sbest@gmail.com'])
    msg.body = content
    mail.send(msg) 
    return render_template("/index.html")

@app.route('/success')
def success():
    return render_template('/success.html')
