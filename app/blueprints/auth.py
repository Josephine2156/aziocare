from flask import Blueprint, request, redirect, url_for, flash, render_template, jsonify, session
from pymongo.errors import WriteError
from marshmallow import ValidationError
from app.schemas import UserSchema
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import functools
from bson.objectid import ObjectId

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

user_schema = UserSchema()


def login_and_role_required(*roles):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Check if user is logged in
            if 'loggedin' not in session:
                flash('Please log in to access the page.', 'danger')
                return redirect(url_for('auth.login'))
            # Check if user has one of the required roles
            if session.get('role') not in roles:
                flash('You do not have permission to view the page.', 'danger')
                return redirect(url_for('auth.login'))
            return func(*args, **kwargs)
        return wrapper
    return decorator

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    data = {}
    if request.method == 'POST':
        data = request.form.to_dict()
        try:
            validated_data = user_schema.load(data)
            # Remove confirm_password from validated_data
            validated_data.pop('confirm_password')
            # Hash password before storing in db
            validated_data['password'] = generate_password_hash(validated_data['password'])
            if 'date_of_birth' in validated_data:
            # Convert datetime.date to datetime.datetime
                date_of_birth = validated_data['date_of_birth']
                validated_data['date_of_birth'] = datetime(date_of_birth.year, date_of_birth.month, date_of_birth.day)

            mongo.db.users.insert_one(validated_data)
            flash("User registered successfully!", "success")
            return redirect(url_for('auth.login'))
        except ValidationError as err:
            for field, messages in err.messages.items():
                for message in messages:
                    flash(f"{field}: {message}", "danger")
        except WriteError as e:
            flash(str(e), "danger")
    return render_template('auth/register.html', data=data)



@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Searches for a user in the MongoDB users collection with the specified email and returns the first document that matches the query or None if no match is found
        user = mongo.db.users.find_one({'email': email})

        if user is None:
            flash('Account does not exist, please register.', 'danger')
            return redirect(url_for('auth.register'))

        if not check_password_hash(user['password'], password):
            flash('Incorrect password, please try again.', 'danger')
            return redirect(url_for('auth.login'))

        session['user_id'] = str(user['_id'])
        session['role'] = user.get('role', 'Patient')  # Default to 'Patient' if no role is found
        session['first_name'] = user['first_name']
        session['last_name'] = user['last_name']
        print (session['first_name'])
        session['loggedin'] = True
        flash('Logged in successfully.', 'success')

        # Redirect to the appropriate dashboard based on role
        if session['role'] == 'Patient':
            return redirect(url_for('dashboard.patient_dashboard'))
        elif session['role'] == 'Doctor':
            return redirect(url_for('dashboard.doctor_dashboard'))
        elif session['role'] == 'Admin':
            return redirect(url_for('dashboard.admin_dashboard'))
        else:
            flash('Role not recognized.', 'danger')
            return redirect(url_for('auth.login'))

    return render_template('auth/login.html')