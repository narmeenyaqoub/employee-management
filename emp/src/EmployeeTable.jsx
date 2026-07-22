import "./EmployeeTable.css";

function EmployeeTable({ employees, onView, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>
                <span className="dept-badge">{emp.department}</span>
              </td>
              <td>{emp.role}</td>
              <td>
                <button
                  className="action-btn view-btn"
                  onClick={() => onView(emp)}
                >
                  View
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDelete(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && (
        <p className="empty-state">No employees yet — add one above.</p>
      )}
    </div>
  );
}

export default EmployeeTable;
