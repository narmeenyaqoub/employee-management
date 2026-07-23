const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// A secret key used to sign tokens — in a real app this would be in an environment variable
const JWT_SECRET = "my-secret-key-for-assignment";

// Only letters, spaces, hyphens and apostrophes — no digits or other symbols.
// Covers names like "Anne-Marie" or "O'Neil" while blocking things like "John3".
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

function isValidName(name) {
  return typeof name === "string" && name.trim().length > 0 && NAME_REGEX.test(name.trim());
}

// ---- Middleware to protect routes ----
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

// ---- Register endpoint ----
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() ||
    !email?.trim() ||
    !password?.trim()) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email address.",
    });
  }

  if (!isValidName(name)) {
    return res.status(400).json({
      error: "Name can only contain letters, spaces, hyphens, and apostrophes — no numbers.",
    });
  }

  const existingUser = db.getOne("SELECT id FROM users WHERE email = ?", [email]);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "A user with that email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
    name.trim(),
    email,
    hashedPassword,
  ]);
  const newUserId = db.lastInsertId();

  // Never send the password back, even hashed
  res.status(201).json({ id: newUserId, name: name.trim(), email });
});

// ---- Login endpoint ----
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.getOne("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ---- Get all users (protected) ----
app.get("/api/users", authenticateToken, (req, res) => {
  const users = db.getAll("SELECT id, name, email FROM users");
  res.json(users);
});

// ---- Get single user profile (protected) ----
app.get("/api/users/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = db.getOne("SELECT id, name, email FROM users WHERE id = ?", [userId]);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json(user);
});

// ---- Update a user (protected) ----
app.put("/api/users/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = db.getOne("SELECT * FROM users WHERE id = ?", [userId]);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const { name, email } = req.body;

  if (name && !isValidName(name)) {
    return res.status(400).json({
      error: "Name can only contain letters, spaces, hyphens, and apostrophes — no numbers.",
    });
  }

  const updatedName = name ? name.trim() : user.name;
  const updatedEmail = email || user.email;

  db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    updatedName,
    updatedEmail,
    userId,
  ]);

  res.json({ id: userId, name: updatedName, email: updatedEmail });
});

// ---- Create employee (protected) ----
app.post("/api/employees", authenticateToken, (req, res) => {
  const { name, email, department, role } = req.body;

  if (!name?.trim() ||
    !email?.trim() ||
    !department?.trim() ||
    !role?.trim()) {
    return res
      .status(400)
      .json({ error: "Name, email, department, and role are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email address.",
    });
  }
  const existingEmployee = db.getOne(
    "SELECT id FROM employees WHERE email = ?",
    [email]
  );

  if (existingEmployee) {
    return res.status(400).json({
      error: "An employee with this email already exists.",
    });
  }
  const validDepartments = ["IT", "HR", "Finance", "Marketing"];

  if (!validDepartments.includes(department)) {
    return res.status(400).json({
      error: "Invalid department."
    });
  }

  if (!isValidName(name)) {
    return res.status(400).json({
      error: "Name can only contain letters, spaces, hyphens, and apostrophes — no numbers.",
    });
  }

  db.run(
    "INSERT INTO employees (name, email, department, role) VALUES (?, ?, ?, ?)",
    [name.trim(), email, department, role]
  );
  const newEmployeeId = db.lastInsertId();

  res.status(201).json({
    id: newEmployeeId,
    name: name.trim(),
    email,
    department,
    role,
  });
});

// ---- Get all employees (protected) ----
app.get("/api/employees", authenticateToken, (req, res) => {
  const employees = db.getAll("SELECT * FROM employees");
  res.json(employees);
});

// ---- Get single employee profile (protected) ----
app.get("/api/employees/:id", authenticateToken, (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employee = db.getOne("SELECT * FROM employees WHERE id = ?", [employeeId]);

  if (!employee) {
    return res.status(404).json({ error: "Employee not found." });
  }

  res.json(employee);
});

// ---- Update employee (protected) ----
app.put("/api/employees/:id", authenticateToken, (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employee = db.getOne("SELECT * FROM employees WHERE id = ?", [employeeId]);

  if (!employee) {
    return res.status(404).json({ error: "Employee not found." });
  }

  const { name, email, department, role } = req.body;

  if (name && !isValidName(name)) {
    return res.status(400).json({
      error: "Name can only contain letters, spaces, hyphens, and apostrophes — no numbers.",
    });
  }

  const updated = {
    name: name ? name.trim() : employee.name,
    email: email || employee.email,
    department: department || employee.department,
    role: role || employee.role,
  };

  db.run(
    "UPDATE employees SET name = ?, email = ?, department = ?, role = ? WHERE id = ?",
    [updated.name, updated.email, updated.department, updated.role, employeeId]
  );

  res.json({ id: employeeId, ...updated });
});

// ---- Delete employee (protected) ----
app.delete("/api/employees/:id", authenticateToken, (req, res) => {
  const employeeId = parseInt(req.params.id);
  const employee = db.getOne("SELECT id FROM employees WHERE id = ?", [employeeId]);

  if (!employee) {
    return res.status(404).json({ error: "Employee not found." });
  }

  db.run("DELETE FROM employees WHERE id = ?", [employeeId]);
  res.json({ message: "Employee deleted successfully." });
});

// The database must finish loading before the server starts accepting requests.
db.initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Data is stored persistently in backend/data.sqlite`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
