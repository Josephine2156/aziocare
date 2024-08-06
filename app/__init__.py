from flask import Flask, send_from_directory
from .config import Config
from .extensions import mongo
from .blueprints import auth_bp, dashboard_bp
from flask_cors import CORS
import os

def create_app():
    app = Flask(
        __name__,
        static_folder=os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'frontend', 'build'),
        template_folder=os.path.join(os.path.abspath(os.path.dirname(__file__)), 'templates')
    )
    app.config.from_object(Config)
    
    # Enable CORS for all routes
    CORS(app)
    
    mongo.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(dashboard_bp)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react_app(path):
        print(f"Requested path: {path}")
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app
