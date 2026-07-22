const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ---- NEW: in-memory "users table" ----
let users = [];
let nextUserId = 1;

// ---- NEW: Register endpoint ----
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "A user with that email already exists." });
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: nextUserId++,
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  // Never send the password back, even hashed
  res
    .status(201)
    .json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

const jwt = require("jsonwebtoken"); // add this near your other requires at the top

// A secret key used to sign tokens — in a real app this would be in an environment variable
const JWT_SECRET = "my-secret-key-for-assignment";

// ---- NEW: Middleware to protect routes ----
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // expected format: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = decoded; // attach user info (id, email) to the request
    next(); // continue to the actual route
  });
}

// ---- NEW: Login endpoint ----
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Create a token containing the user's id
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ---- NEW: Get all users (protected) ----
app.get("/api/users", authenticateToken, (req, res) => {
  // Never send passwords back
  const safeUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }));
  res.json(safeUsers);
});

// ---- NEW: Get single user profile (protected) ----
app.get("/api/users/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json({ id: user.id, name: user.name, email: user.email });
});

// ---- NEW: Update a user (protected) ----
app.put("/api/users/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json({ id: user.id, name: user.name, email: user.email });
});

// ---- NEW: in-memory "employees table" ----
let employees = [];
let nextEmployeeId = 1;

// ---- NEW: Create employee (protected) ----
app.post("/api/employees", authenticateToken, (req, res) => {
  const { name, email, department, role } = req.body;

  if (!name || !email || !department || !role) {
    return res
      .status(400)
      .json({ error: "Name, email, department, and role are required." });
  }

  const newEmployee = {
    id: nextEmployeeId++,
    name,
    email,
    department,
    role,
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// ---- NEW: Get all employees (protected) ----
app.get("/api/employees", authenticateToken, (req, res) => {
  res.json(employees);
});

// ---- NEW: Get single employee profile (protected) ----
app.get("/api/employees/:id", authenticateToken, (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employee = employees.find((e) => e.id === employeeId);

  if (!employee) {
    return res.status(404).json({ error: "Employee not found." });
  }

  res.json(employee);
});

// ---- NEW: Update employee (protected) ----
app.put("/api/employees/:id", authenticateToken, (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employee = employees.find((e) => e.id === employeeId);

  if (!employee) {
    return res.status(404).json({ error: "Employee not found." });
  }

  const { name, email, department, role } = req.body;
  if (name) employee.name = name;
  if (email) employee.email = email;
  if (department) employee.department = department;
  if (role) employee.role = role;

  res.json(employee);
});

// ---- NEW: Delete employee (protected) ----
app.delete("/api/employees/:id", authenticateToken, (req, res) => {
  const employeeId = parseInt(req.params.id);
  const index = employees.findIndex((e) => e.id === employeeId);

  if (index === -1) {
    return res.status(404).json({ error: "Employee not found." });
  }

  employees.splice(index, 1);
  res.json({ message: "Employee deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
