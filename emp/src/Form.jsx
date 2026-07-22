import { useState } from "react";
import EmployeeForm from "./components/EmployeeForm";

function EmployeePage() {
  const [message, setMessage] = useState("");
  async function addEmployee(employee) {

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:5000/api/employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(employee)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Employee added successfully!");
        console.log(data);
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  }


  return (
    <EmployeeForm onAddEmployee={addEmployee} message={message} />
  );
}

export default EmployeePage;