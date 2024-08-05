from flask import Blueprint, render_template, session, redirect, url_for, flash
from .auth import login_and_role_required

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/patient_dashboard')
@login_and_role_required('Patient')
def patient_dashboard():
    return render_template('dashboard/dashboard_patient.html')

@dashboard_bp.route('/doctor_dashboard')
@login_and_role_required('Doctor')
def doctor_dashboard():
    return render_template('dashboard/base_dashboard.html')

@dashboard_bp.route('/admin_dashboard')
@login_and_role_required('Admin')
def admin_dashboard():
    return render_template('dashboard/dashboard_admin.html')