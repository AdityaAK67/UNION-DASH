const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const connectDB = require("./db/dbConn.js");
const PhishingDomain = require("./models/PhishingDomain");

dotenv.config();
const app = express();
const PORT = 5000;
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Phishing Dashboard Backend");
});

const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

// Fetch all domains
app.get("/api/domains", async (req, res) => {
  try {
    const domains = await PhishingDomain.find();
    res.json(domains);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new domain
app.post("/api/add-domain", async (req, res) => {
  try {
    const { domain, risk_score, status } = req.body;
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

// Update status of a domain
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

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// Upload & Update JSON data
app.post("/api/update-domains", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, "utf8");
    const newDomains = JSON.parse(fileData);

    if (!Array.isArray(newDomains)) {
      return res.status(400).json({ success: false, message: "Invalid JSON format." });
    }

    let added = 0, updated = 0;

    for (let domainObj of newDomains) {
      const { domain, risk_score, status, comment } = domainObj;
      if (!domain || !risk_score || !status) {
        continue;
      }

      const existingDomain = await PhishingDomain.findOne({ domain });
      if (existingDomain) {
        if (
          existingDomain.status !== status ||
          existingDomain.risk_score !== risk_score ||
          existingDomain.comment !== comment
        ) {
          existingDomain.risk_score = risk_score;
          existingDomain.status = status;
          existingDomain.comment = comment;
          await existingDomain.save();
          updated++;
        }
      } else {
        const newDomain = new PhishingDomain({ domain, risk_score, status, comment });
        await newDomain.save();
        added++;
      }
    }

    fs.unlinkSync(filePath);
    res.json({
      success: true,
      message: "Data updated successfully.",
      added,
      updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating data", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
