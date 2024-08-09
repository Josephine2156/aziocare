from marshmallow import Schema, fields, validate

class MedicationSchema(Schema):
    medication_id = fields.Str(required=True)  # Unique identifier for the medication
    name = fields.Str(required=True, validate=validate.Length(min=1, error="Medication name is required."))
    dosage_form = fields.Str(required=True, validate=validate.Length(min=1, error="Dosage form is required."))
    strength = fields.Str(required=True, validate=validate.Length(min=1, error="Strength is required."))
    manufacturer = fields.Str(required=True, validate=validate.Length(min=1, error="Manufacturer is required."))

medication_schema = MedicationSchema()
