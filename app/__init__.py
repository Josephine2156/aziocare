from flask import Flask
from .config import Config
from .extensions import mongo
from .blueprints import common_bp, auth_bp, dashboard_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__, static_folder='../frontend/public', template_folder='templates')
    app.config.from_object(Config)
    CORS(app)

    mongo.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(common_bp)
    app.register_blueprint(dashboard_bp)

    return app
