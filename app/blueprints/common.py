from flask import Blueprint, app, render_template

common_bp = Blueprint('common',__name__)

@common_bp.route('/')
def homepage():
    return render_template("common/homepage.html")

@common_bp.route('/profile')
def profile():
    return render_template("common/profile.html")