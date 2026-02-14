import mysql.connector
from flask import g
import os

def get_db():
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASS', 'password'),
            database=os.getenv('DB_NAME', 'jignasa_db')
        )
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_app(app):
    app.teardown_appcontext(close_db)