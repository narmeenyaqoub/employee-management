import { useState } from "react";
import "../styles/employeeform.css";

// Only letters, spaces, hyphens and apostrophes — no digits or other symbols.
// Covers names like "Anne-Marie" or "O'Neil" while blocking things like "John3".
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]*$/;

function EmployeeForm({ onAddEmployee, message }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [nameError, setNameError] = useState("");

  function handleNameChange(event) {
    const value = event.target.value;

    // Silently strip out anything that isn't a letter/space/hyphen/apostrophe,
    // so numbers and symbols simply can't be typed into this field.
    const cleaned = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, "");

    if (cleaned !== value) {
      setNameError("Numbers and symbols aren't allowed in the name field.");
    } else {
      setNameError("");
    }

    setName(cleaned);
  }

  function handleSubmit(event) {

    event.preventDefault();

    if (
      !name ||
      !email ||
      !department ||
      !role
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (!NAME_REGEX.test(name) || !name.trim()) {
      setNameError("Please enter a valid name using letters only.");
      return;
    }

    const employee = {

      name: name.trim(),
      email,
      department,
      role

    };

    
    onAddEmployee(employee);

    setName("");
    setEmail("");
    setDepartment("");
    setRole("");
    setNameError("");
  }
  return (

    <div className="form-container">
      <h2>Add New Employee</h2>
      <p className="subtitle">Fill in the details to add a new employee</p>
      {message && (
        <p className="success-message">{message}</p>
      )}
      <form className="employee-form" onSubmit={handleSubmit}>

        <div className="form-grid">

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="Enter employee name"
              value={name}
              onChange={handleNameChange}
            />
            {nameError && <p className="field-error">{nameError}</p>}
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="Enter employee email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="form-group">
            <label>Role *</label>
            <input
              type="text"
              placeholder="Enter employee role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

        </div>

        <div className="button-group">

          <button type="submit" className="submit-btn">
            Add Employee
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setName("");
              setEmail("");
              setDepartment("");
              setRole("");
            }}
          >
            Cancel
          </button>



        </div>
      </form>
    </div>

  );

}

export default EmployeeForm;