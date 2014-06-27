import os

MAIL_USE_TLS = False
MAIL_USE_SSL = True

MAIL_SERVER = os.environ.get('HOSTNAME')
MAIL_PORT = os.environ.get('port')
MAIL_USERNAME = os.environ.get('login')
MAIL_PASSWORD = os.environ.get('password')

#MAIL_SERVER = 'smtp.mailgun.org'
#MAIL_PORT = 587
#MAIL_USERNAME = '' <-- find on mailgun
#MAIL_PASSWORD = '' <-- find on mailgun

ADMINS = ['chr2sbest@gmail.com']
