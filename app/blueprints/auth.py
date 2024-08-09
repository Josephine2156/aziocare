from flask import Blueprint, request, jsonify, session, redirect, url_for
from pymongo.errors import WriteError
from marshmallow import ValidationError
from app.schemas import UserSchema, PatientSchema
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson.objectid import ObjectId

auth_bp = Blueprint('auth', __name__)

user_schema = UserSchema()
patient_schema = PatientSchema()

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
        return jsonify({"message": "Registration succesful! Please log in."}), 201 #success message
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400 #validation errors
    except WriteError as e:
        return jsonify({"error": str(e)}), 400 #db write errors
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500 #internal server error

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json  # get json data from request

        # extract email and password from the data for validation
        email = data.get('email') 
        password = data.get('password') 

        # check if email entered exists in db
        user = mongo.db.users.find_one({'email': email}) 

        # validation errors
        if user is None:
            return jsonify({"error": "Account does not exist, please register."}), 400 

        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Incorrect password, please try again."}), 400

        # store session data
        session['user_id'] = str(user['_id'])
        session['role'] = user.get('role', 'Patient')
        session['first_name'] = user['first_name']
        session['last_name'] = user['last_name']
        session['loggedin'] = True

        # Check if the user is a patient and if their profile is complete
        if session['role'] == 'Patient':
            patient = mongo.db.patients.find_one({"user_id": ObjectId(session['user_id'])})
            if not patient:
                return jsonify({"message": "Please complete your Patient Profile", "user_id": session['user_id'], "role": session['role']}), 200

        return jsonify({"message": "Logged in successfully.", "role": session['role'], "user_id": session['user_id']}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500  # internal server error

    

@auth_bp.route('/patient/<patient_id>', methods=['GET'])
def get_patient_profile(patient_id):
    # Fetch the patient profile
    patient = patient_schema(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    # Fetch the user data using user_id
    user = user_schema(patient["user_id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Combine the patient data with the user data
    patient_profile = {
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "date_of_birth": user["date_of_birth"],
        "email": user["email"],
        "phone": patient["phone"],
        "verification_status": patient["verification_status"],
        "nhi_number": patient["nhi_number"]  # Include the NHI number
    }

    return jsonify(patient_profile)


@auth_bp.route('/patient/check/<user_id>', methods=['GET'])
def check_patient_profile(user_id):
    patient = mongo.db.patients.find_one({"user_id": ObjectId(user_id)})
    if not patient:
        # Redirect to the profile completion page
        return redirect(url_for('auth.complete_patient_profile', user_id=user_id))
    else:
        # Redirect to the dashboard or patient profile view
        return redirect(url_for('auth.get_patient_profile', patient_id=str(patient["_id"])))

@auth_bp.route('/patient/complete/<user_id>', methods=['GET', 'POST'])
def complete_patient_profile(user_id):
    if request.method == 'POST':
        data = request.json
        # Add the user_id from the URL parameter to the data being validated
        data['user_id'] = user_id

        # Validate incoming data using PatientSchema
        try:
            validated_data = patient_schema.load(data)
        except ValidationError as err:
            return jsonify({"errors": err.messages}), 400

        # Save the validated patient profile to the database
        patient_id = mongo.db.patients.insert_one({
            "user_id": ObjectId(user_id),
            "phone": validated_data["phone"],
            "nhi_number": validated_data["nhi_number"],
        }).inserted_id

        return jsonify({"message": "Profile completed successfully.", "patient_id": str(patient_id)}), 200

    # If accessed via GET
    elif request.method == 'GET':
        # Fetch the user's information from the users collection
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"first_name": 1, "last_name": 1, "email": 1, "date_of_birth": 1, "_id": 0})

        if not user:
            return jsonify({"error": "User not found."}), 404

        # Return the user's details
        return jsonify({
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "date_of_birth": user["date_of_birth"].strftime("%d/%m/%Y")  # Format DOB as a string
        }), 200

    # Default response for unexpected method types
    return jsonify({"error": "Invalid request method."}), 405


