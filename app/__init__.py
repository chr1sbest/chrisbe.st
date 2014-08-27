from flask import Flask
from flask.ext.mail import Mail
from config import ADMINS, MAIL_SERVER, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD

app = Flask(__name__)
app.config.from_object('config')
mail = Mail(app)

from app import views
