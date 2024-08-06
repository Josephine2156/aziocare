from marshmallow import Schema, fields, validate, validates, validates_schema, ValidationError
from datetime import date
from app.extensions import mongo
import re

class UserSchema(Schema):
    password = fields.Str(
        required=True,
        validate=[
            validate.Length(min=8, error="Password must be at least 8 characters long.")
        ]
    )
    confirm_password = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(
        required=True,
        validate=validate.OneOf(["Patient", "Doctor", "Admin"], error="Role must be either 'Patient', 'Doctor', or 'Admin'.")
    )
    first_name = fields.Str(required=True, validate=validate.Length(min=1, error="First name is required."))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, error="Last name is required."))
    date_of_birth = fields.Date(required=True)

    @validates('password')
    def validate_alphanumeric_password(self, value):
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', value):
            raise ValidationError("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.")

    @validates_schema
    def validate_password_confirmation(self, data, **kwargs):
        if data.get('password') != data.get('confirm_password'):
            raise ValidationError("Passwords must match", field_names=["confirm_password"])

    @validates('email')
    def validate_unique_email(self, value):
        if mongo.db.users.find_one({'email': value}):
            raise ValidationError("Email already registered.")

    @validates('date_of_birth')
    def validate_date_of_birth(self, value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 16:
            raise ValidationError("You must be at least 16 years old to register.")

user_schema = UserSchema()
