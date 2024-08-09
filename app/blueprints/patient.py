from flask import Blueprint, request, jsonify, session, redirect, url_for
from pymongo.errors import WriteError
from marshmallow import ValidationError
from app.schemas import UserSchema, PatientSchema
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson.objectid import ObjectId


patient_bp = Blueprint('patient', __name__)

user_schema = UserSchema()
patient_schema = PatientSchema()

#pass patient ID as string param
@patient_bp.route('/patient_profile/<patient_id>', methods=['GET'])
def get_patient_profile(patient_id):
    try:
        # Fetch the patient profile from MongoDB, convert patient ID to object ID to query correctly in Mongo DB
        patient = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        # Fetch the user data using the user_id from the patient document
        user = mongo.db.users.find_one({"_id": ObjectId(patient["user_id"])})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Serialize the patient and user data (convert object to JSON)
        patient_data = patient_schema.dump(patient)
        user_data = user_schema.dump(user)

        # Combine the patient data with the user data
        patient_profile = {
            "first_name": user_data.get("first_name"),
            "last_name": user_data.get("last_name"),
            "date_of_birth": user_data.get("date_of_birth"),
            "email": user_data.get("email"),
            "phone": patient_data.get("phone"),
            "nhi_number": patient_data.get("nhi_number")  
        }

        return jsonify(patient_profile), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@patient_bp.route('/complete_profile/<user_id>', methods=['GET', 'POST'])
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
        }).inserted_id   #inserted_id attribute provides the value of the _id field for the inserted document.

        session["patient_id"] = str(patient_id) #store patient id in session
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
