from flask import Flask
from .config import Config
from .extensions import mongo
from .blueprints import common_bp, auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mongo.init_app(app)

    app.register_blueprint(common_bp)
    app.register_blueprint(auth_bp)

    return app
