const express = require("express");
const app = express();
require("dotenv").config();     // Load dotenv for fetching data
require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const staffRoutes = require("./routes/staffRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./cron/campaignStatusJob");
const contactRoutes = require("./routes/contactRoutes");
const contactListRoutes = require("./routes/contactListRoutes");
const emailTemplateRoutes = require("./routes/emailTemplateRoutes");
const senderRoutes = require("./routes/senderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api", contactRoutes);
app.use("/api/contact_lists", contactListRoutes);
app.use("/api/email_templates", emailTemplateRoutes);
app.use("/api/senders", senderRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);

module.exports = app;

