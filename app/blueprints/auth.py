from flask import Blueprint, request, jsonify, session
from pymongo.errors import WriteError
from marshmallow import ValidationError
from app.schemas import UserSchema
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        validated_data = user_schema.load(data)
        validated_data.pop('confirm_password')
        validated_data['password'] = generate_password_hash(validated_data['password'])
        if 'date_of_birth' in validated_data:
            date_of_birth = validated_data['date_of_birth']
            validated_data['date_of_birth'] = datetime(date_of_birth.year, date_of_birth.month, date_of_birth.day)
        mongo.db.users.insert_one(validated_data)
        return jsonify({"message": "User registered successfully!"}), 201
    except ValidationError as err:
        return jsonify(err.messages), 400
    except WriteError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user = mongo.db.users.find_one({'email': email})

        if user is None:
            return jsonify({"error": "Account does not exist, please register."}), 400

        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Incorrect password, please try again."}), 400

        session['user_id'] = str(user['_id'])
        session['role'] = user.get('role', 'Patient')
        session['first_name'] = user['first_name']
        session['last_name'] = user['last_name']
        session['loggedin'] = True

        return jsonify({"message": "Logged in successfully.", "role": session['role']}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500
