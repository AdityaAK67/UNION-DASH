const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/dbConn.js");
const PhishingDomain = require("./models/PhishingDomain");

dotenv.config();
const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Phishing Dashboard Backend");
});

// GET all phishing domains
app.get("/api/domains", async (req, res) => {
  try {
    const domains = await PhishingDomain.find();
    res.json(domains);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST route to add a new phishing domain
app.post("/api/add-domain", async (req, res) => {
  try {
    const { domain, risk_score, status } = req.body;

    // Check if domain already exists
    const existingDomain = await PhishingDomain.findOne({ domain });
    if (existingDomain) {
      return res.status(400).json({ success: false, message: "Domain already exists" });
    }

    const newDomain = new PhishingDomain({ domain, risk_score, status });
    await newDomain.save();

    res.json({ success: true, message: "Domain added successfully", domain: newDomain });
  } catch (error) {
    res.status(500).json({ message: "Error adding domain", error });
  }
});

// PUT route to update domain status
app.put("/api/update-status", async (req, res) => {
  try {
    const { id, status } = req.body;

    const domain = await PhishingDomain.findById(id);
    if (!domain) {
      return res.status(404).json({ success: false, message: "Domain not found" });
    }

    domain.status = status;
    await domain.save();

    res.json({ success: true, message: "Status updated successfully", domain });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
});

// DELETE route to remove a phishing domain
app.delete("/api/delete-domain/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const domain = await PhishingDomain.findByIdAndDelete(id);

    if (!domain) {
      return res.status(404).json({ success: false, message: "Domain not found" });
    }

    res.json({ success: true, message: "Domain deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting domain", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
