const mongoose = require("mongoose");

const phishingDomainSchema = new mongoose.Schema({
  domain: { 
    type: String, 
    required: true, 
    unique: true 
    },
  risk_score: { 
    type: Number, 
    required: true 
    },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed"], 
        required: true },
});
const PhishingDomain = mongoose.model("PhishingDomain", phishingDomainSchema);
module.exports = PhishingDomain;
