const mongoose = require("mongoose");

const phishingDomainSchema = new mongoose.Schema({
  domain: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true
  },
  risk_score: { 
    type: Number, 
    required: true,
    min: 0, 
    max: 100 
  },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed"], 
    required: true,
    default: "Pending"
  },
  comment: { 
    type: String, 
    default: "No comment provided." 
  }
}, { timestamps: true });

const PhishingDomain = mongoose.model("PhishingDomain", phishingDomainSchema);
module.exports = PhishingDomain;
