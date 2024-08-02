from flask import Blueprint, app, render_template

common_bp = Blueprint('common',__name__)

@common_bp.route('/')
def homepage():
    return render_template("Arsha/index.html")