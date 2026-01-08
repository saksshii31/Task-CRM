const db = require("../config/db");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { generate } = require("../config/jwt");
const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
const nodemailer = require("nodemailer");
const crypto = require("crypto");


//register-controller

const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      company_name,
      phone_number,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !confirm_password ||
      !company_name ||
      !phone_number
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Password do not match!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email=?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    await db.query(
      `INSERT INTO users 
       (first_name, last_name, email, password, company_name, phone_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hashed, company_name, phone_number]
    );

    console.log("USER REGISTERED SUCCESSFULLY");
    return res.status(201).json({ message: "Registered Successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//login-controller

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    //  Get user
    const [users] = await db.query(
      "SELECT id, email, password FROM users WHERE email=?",
      [email]
    );

    if (!users.length) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    //  Get role + permissions
    const [roles] = await db.query(
      `SELECT r.id, r.name, r.permissions
       FROM staff s
       JOIN roles r ON r.id = s.role_id
       WHERE s.user_id = ?`,
      [user.id]
    );

    if (!roles.length) {
      return res.status(403).json({ message: "No role assigned" });
    }

    const role = roles[0];

    //  JWT payload includes permissions
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role.name,
        permissions: role.permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: role.name,
        permissions: role.permissions
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};



//change password controller

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { currentPassword, newPassword } = req.body;

    const [rows] = await db.query(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      rows[0].password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//forget password controller

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [users] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await db.query(
      "UPDATE users SET reset_token=?, reset_token_expire=? WHERE email=?",
      [token, expire, email]
    );

    const link = `http://localhost:3000/resetPassword/${token}`;
    console.log(link)

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `<p>Click to reset password:</p><a href="${link}">${link}</a>`,
    });

    res.json({ message: "Reset link sent successfully" });

  } catch (err) {
    console.error("FORGET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//reset password controller

const resetPassword = async (req, res) => {
  try {
    console.log("RESET PASSWORD API HIT");
    console.log("BODY:", req.body);

    const { token, password, confirm_password } = req.body;

    if (!token || !password || !confirm_password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const [results] = await db.query(
      "SELECT id FROM users WHERE reset_token = ? AND reset_token_expire > NOW()",
      [token]
    );

    console.log("QUERY RESULTS:", results);

    if (results.length === 0) {
      console.log("Token not found or expired for token:", token);
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE id = ?",
      [hashedPassword, results[0].id]
    );

    console.log("PASSWORD RESET SUCCESS for user ID:", results[0].id);
    return res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//logout controller

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    console.log("USER LOGGED OUT");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = {
  register,
  login,
  forgetPassword,
  resetPassword,
  logout,
  changePassword,
};

