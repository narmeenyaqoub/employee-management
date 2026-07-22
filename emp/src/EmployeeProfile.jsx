import "./EmployeeProfile.css";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function EmployeeProfile({ employee, onBack }) {
  return (
    <div className="profile-wrapper">
      <button className="profile-back-btn" onClick={onBack}>
        ← Back to employees
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{getInitials(employee.name)}</div>
          <div className="profile-heading">
            <h2 className="profile-name">{employee.name}</h2>
            <p className="profile-role">{employee.role}</p>
            <span className="profile-dept-badge">{employee.department}</span>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-details">
          <div className="profile-field">
            <span className="profile-label">Email Address</span>
            <a className="profile-value profile-email" href={`mailto:${employee.email}`}>
              {employee.email}
            </a>
          </div>

          <div className="profile-field">
            <span className="profile-label">Employee ID</span>
            <span className="profile-value">#{String(employee.id).padStart(4, "0")}</span>
          </div>

          <div className="profile-field">
            <span className="profile-label">Department</span>
            <span className="profile-value">{employee.department}</span>
          </div>

          <div className="profile-field">
            <span className="profile-label">Role</span>
            <span className="profile-value">{employee.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
