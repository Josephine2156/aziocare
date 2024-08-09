from marshmallow import Schema, fields, validates_schema, ValidationError, validate
import re

class PatientSchema(Schema):
    user_id = fields.Str(required=True)  # Reference to the user's _id in the users collection
    phone = fields.Str(required=True, validate=validate.Length(min=9, max=12, error="Phone number must be between 9 and 12 digits long."))
    nhi_number = fields.Str(required=True, validate=validate.Regexp(r'^[A-Z]{3}\d{4}$', error="NHI number must be in the format ABC1234."))


    @validates_schema
    def validate_phone_numbers(self, data, **kwargs):
        phone_pattern = re.compile(r'^0[2-9]\d{7,10}$')
        if not phone_pattern.match(data.get('phone')):
            raise ValidationError("Invalid phone number format.", field_names=["phone"])

patient_schema = PatientSchema()
