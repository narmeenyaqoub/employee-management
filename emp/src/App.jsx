import { useState, useEffect } from "react";
import Login from "./Login";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import EmployeeProfile from "./EmployeeProfile";
import Profile from "./Profile";
import krgLogo from "./assets/krg_logo.webp";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  async function fetchEmployees(currentToken) {
    const response = await fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${currentToken}` },
    });
    const data = await response.json();
    setEmployees(data);
  }

  useEffect(() => {
    if (token) fetchEmployees(token);
  }, [token]);

  async function handleAddEmployee(employee) {
    const response = await fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employee),
    });
    const newEmployee = await response.json();
    setEmployees([...employees, newEmployee]);
  }

  async function handleDeleteEmployee(id) {
    await fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmployees(employees.filter((emp) => emp.id !== id));
  }

  function handleLogout() {
    setToken(null);
    setEmployees([]);
    setViewingEmployee(null);
  }

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  if (viewingEmployee) {
    return (
      <div className="app-container">
        <EmployeeProfile
          employee={viewingEmployee}
          onBack={() => setViewingEmployee(null)}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-left">
          <img src={krgLogo} alt="KRG Logo" />
          <div>
            <p className="app-header-title">Employee Management System</p>
            <p className="app-header-subtitle">
              Department of Technology and Innovation
            </p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <h2 className="section-title">Employees</h2>
      <EmployeeForm onAddEmployee={handleAddEmployee} />
      <EmployeeTable
        employees={employees}
        onView={(emp) => setViewingEmployee(emp)}
        onDelete={handleDeleteEmployee}
      />
      <Profile />
    </div>
  );
}

export default App;
