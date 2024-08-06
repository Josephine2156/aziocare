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
        data = request.json # Get JSON data from the request
        validated_data = user_schema.load(data) # Use the Marshmallow schema (user_schema) to deserialize, then validate input data
        validated_data.pop('confirm_password')
        validated_data['password'] = generate_password_hash(validated_data['password']) #hash password before storing in db
        if 'date_of_birth' in validated_data:
            date_of_birth = validated_data['date_of_birth']
            validated_data['date_of_birth'] = datetime(date_of_birth.year, date_of_birth.month, date_of_birth.day) #convert to datetime object
        mongo.db.users.insert_one(validated_data) #store validated data in db
        return jsonify({"message": "User registered successfully!"}), 201 #success message
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400 #validation errors
    except WriteError as e:
        return jsonify({"error": str(e)}), 400 #db write errors
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500 #internal server error

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json #get json data from request

        #extract email and password from the data for validation
        email = data.get('email') 
        password = data.get('password') 

        #check if email entered exists in db
        user = mongo.db.users.find_one({'email': email}) 

        #validation errors
        if user is None:
            return jsonify({"error": "Account does not exist, please register."}), 400 

        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Incorrect password, please try again."}), 400

        #store session data
        session['user_id'] = str(user['_id'])
        session['role'] = user.get('role', 'Patient')
        session['first_name'] = user['first_name']
        session['last_name'] = user['last_name']
        session['loggedin'] = True

        return jsonify({"message": "Logged in successfully.", "role": session['role']}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500 #internal server error

