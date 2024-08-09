from marshmallow import Schema, fields, validate, validates_schema, ValidationError

class AppointmentSchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    doctor_id = fields.Str(required=True)  # Reference to the doctor's _id
    appointment_date = fields.DateTime(required=True)
    reason = fields.Str(required=True, validate=validate.Length(min=1, error="Reason for appointment is required."))
    notes = fields.Str()

appointment_schema = AppointmentSchema()
