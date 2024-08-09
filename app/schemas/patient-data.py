from marshmallow import Schema, fields, validate, validates, validates_schema, ValidationError
from datetime import date
from app.extensions import mongo
import re

class MedicalHistorySchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    condition = fields.Str(required=True, validate=validate.Length(min=1, error="Condition is required."))
    diagnosis_date = fields.Date(required=True)
    treatment = fields.Str()

medical_history_schema = MedicalHistorySchema()



class ProcedureSchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    procedure_name = fields.Str(required=True, validate=validate.Length(min=1, error="Procedure name is required."))
    date = fields.Date(required=True)
    outcome = fields.Str()

procedure_schema = ProcedureSchema()

class LabTestResultSchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    test_name = fields.Str(required=True, validate=validate.Length(min=1, error="Test name is required."))
    date = fields.Date(required=True)
    result = fields.Str(required=True, validate=validate.Length(min=1, error="Result is required."))
    notes = fields.Str()

lab_test_result_schema = LabTestResultSchema()

class ImmunizationSchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    immunization_name = fields.Str(required=True, validate=validate.Length(min=1, error="Immunization name is required."))
    date = fields.Date(required=True)
    notes = fields.Str()

immunization_schema = ImmunizationSchema()

class AppointmentSchema(Schema):
    patient_id = fields.Str(required=True)  # Reference to the patient's _id
    doctor_id = fields.Str(required=True)  # Reference to the doctor's _id
    appointment_date = fields.DateTime(required=True)
    reason = fields.Str(required=True, validate=validate.Length(min=1, error="Reason for appointment is required."))
    notes = fields.Str()

appointment_schema = AppointmentSchema()
