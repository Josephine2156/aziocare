from marshmallow import Schema, fields, validate

class PrescriptionRequestSchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    doctor_id = fields.Str(required=True)  # Reference to the doctor's _id
    request_date = fields.DateTime(required=True)
    status = fields.Str(required=True, validate=validate.OneOf(["pending", "approved", "rejected", "completed"], error="Status must be either 'pending', 'approved', 'rejected', or 'completed'."))
    medications = fields.List(fields.Nested(
        fields.Dict({
            'medication_id': fields.Str(required=True),  # Reference to the medication's _id in the medication collection
            'dosage': fields.Str(required=True, validate=validate.Length(min=1, error="Dosage is required.")),
            'frequency': fields.Str(required=True, validate=validate.Length(min=1, error="Frequency is required.")),
            'duration': fields.Str(required=True, validate=validate.Length(min=1, error="Duration is required.")),
        })
    ))
    notes = fields.Str()

prescription_request_schema = PrescriptionRequestSchema()
