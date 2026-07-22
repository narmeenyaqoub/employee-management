import { useState } from "react";
import EmployeeForm from "./components/EmployeeForm";

function EmployeePage() {
  const [employees, setEmployees] = useState([]);

  function addEmployee(employee) {
    setEmployees([...employees, employee]);
  }

  return (
    <EmployeeForm onAddEmployee={addEmployee} />
  );
}

export default EmployeePage;