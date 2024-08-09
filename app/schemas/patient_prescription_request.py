from marshmallow import Schema, fields, validate, validates_schema, ValidationError

class PatientPrescriptionRequestSchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    doctor_id = fields.Str(required=True) #Reference to the doctor's id
    medication_id = fields.Str(required=True)  # Reference to the medication's _id in the MedicationSchema
    practice_id = fields.Str(required=True)  # Reference to the practice's _id in the PracticeSchema
    pharmacy_name = fields.Str(required=True, validate=validate.Length(min=1))
    pharmacy_address = fields.Str(required=True, validate=validate.Length(min=1))
    notes = fields.Str()  # Patient can add notes or reasons for the request



patient_prescription_request_schema = PatientPrescriptionRequestSchema()
