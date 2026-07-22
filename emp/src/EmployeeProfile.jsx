function EmployeeProfile({ employee, onBack }) {
  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "left" }}>
      <h2>Employee Profile</h2>
      <p>
        <strong>Name:</strong> {employee.name}
      </p>
      <p>
        <strong>Email:</strong> {employee.email}
      </p>
      <p>
        <strong>Department:</strong> {employee.department}
      </p>
      <p>
        <strong>Role:</strong> {employee.role}
      </p>
      <button
        onClick={onBack}
        style={{ marginTop: "16px", padding: "8px 16px" }}
      >
        Back
      </button>
    </div>
  );
}

export default EmployeeProfile;
