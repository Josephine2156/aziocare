from marshmallow import Schema, fields, validate, validates_schema, ValidationError

class DoctorPrescriptionRequestSchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    doctor_id = fields.Str(required=True)  # Reference to the doctor's _id
    practice_id = fields.Str(required=True)  # Reference to the practice's _id in the PracticeSchema
    request_date = fields.DateTime(required=True)
    status = fields.Str(required=True, validate=validate.OneOf(["pending", "approved", "rejected", "completed"]))
    medications = fields.List(fields.Nested(
        fields.Dict({
            'medication_id': fields.Str(required=True),  # Reference to the medication's _id in the MedicationSchema
            'dosage': fields.Str(required=True, validate=validate.Length(min=1)),
            'frequency': fields.Str(required=True, validate=validate.Length(min=1)),
            'duration': fields.Str(required=True, validate=validate.Length(min=1)),
        })
    ))
    pharmacy_name = fields.Str(required=True, validate=validate.Length(min=1))
    pharmacy_address = fields.Str(required=True, validate=validate.Length(min=1))
    notes = fields.Str()



prescription_request_schema = DoctorPrescriptionRequestSchema()
