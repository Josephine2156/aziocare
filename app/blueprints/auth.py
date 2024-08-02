from flask import Blueprint, request, redirect, url_for, flash, render_template, jsonify
from pymongo.errors import WriteError
from marshmallow import ValidationError
from app.schemas import UserSchema
from app.extensions import mongo
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

user_schema = UserSchema()

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form.to_dict()
        try:
            validated_data = user_schema.load(data)
            # Remove confirm_password from validated_data
            validated_data.pop('confirm_password')
            # hash password before storing in db
            validated_data['password'] = generate_password_hash(validated_data['password'])
            mongo.db.users.insert_one(validated_data)
            flash("User registered successfully!", "success")
            return redirect(url_for('common.homepage'))
        except ValidationError as err:
            for field, messages in err.messages.items():
                for message in messages:
                    flash(f"{field}: {message}", "danger")
            return render_template('auth/register.html', data=data)
        except WriteError as e:
            flash(str(e), "danger")
            return render_template('auth/register.html', data=data)
    return render_template('auth/register.html')


@auth_bp.route('/health', methods=['GET'])
def health_check():
    try:
        # Try to list collections to check the connection
        mongo.db.list_collection_names()
        return jsonify({"status": "success", "message": "Database connected successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500