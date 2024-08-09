from marshmallow import Schema, fields, validate

class PracticeSchema(Schema):
    practice_id = fields.Str(required=True)  # Unique identifier for the practice
    name = fields.Str(required=True, validate=validate.Length(min=1, error="Practice name is required."))
    address = fields.Str(required=True, validate=validate.Length(min=1, error="Address is required."))
    city = fields.Str(required=True, validate=validate.Length(min=1, error="City is required."))
    postcode = fields.Str(required=True, validate=validate.Length(min=4, max=4, error="Postcode must be 4 digits long."))
    country = fields.Str(required=True, validate=validate.Length(min=1, error="Country is required."))
    phone = fields.Str(required=True, validate=validate.Length(min=9, max=12, error="Phone number must be between 9 and 12 digits long."))

practice_schema = PracticeSchema()
