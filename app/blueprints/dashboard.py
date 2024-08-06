from flask import Blueprint, render_template, session, redirect, url_for, flash


dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/patient_dashboard')

def patient_dashboard():
    return render_template('dashboard/dashboard_patient.html')

@dashboard_bp.route('/doctor_dashboard')

def doctor_dashboard():
    return render_template('dashboard/dashboard_doctor.html')

@dashboard_bp.route('/admin_dashboard')

def admin_dashboard():
    return render_template('dashboard/dashboard_admin.html')