const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Sample data for phishing domains
let phishingDomains = [
  { id: 1, domain: "unionbank-phish.com", risk_score: 95, status: "Pending" },
  { id: 2, domain: "paypal-secure-login.com", risk_score: 85, status: "In Progress" },
  { id: 3, domain: "amazon-login.net", risk_score: 45, status: "Completed" },
  { id: 4, domain: "bankofamerica-secure.com", risk_score: 70, status: "Pending" }
];

// Middleware
app.use(cors());
app.use(express.json());

// Route for root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Phishing Dashboard Backend');
});

// API route to fetch phishing domains
app.get('/api/domains', (req, res) => {
  res.json(phishingDomains);
});

// API route to update the status of a phishing domain
app.post('/api/update-status', (req, res) => {
  const { id, status } = req.body;

  const domain = phishingDomains.find(d => d.id === id);
  if (domain) {
    domain.status = status;
    res.json({ success: true, message: 'Status updated successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Domain not found' });
  }
});

// API route to add a new phishing domain
app.post('/api/add-domain', (req, res) => {
  const { domain, risk_score, status } = req.body;
  const newDomain = {
    id: phishingDomains.length + 1,
    domain,
    risk_score,
    status
  };
  phishingDomains.push(newDomain);
  res.json({ success: true, message: 'Domain added successfully', domain: newDomain });
});

// API route to delete a phishing domain
app.delete('/api/delete-domain/:id', (req, res) => {
  const { id } = req.params;
  const domainIndex = phishingDomains.findIndex(d => d.id === parseInt(id));
  if (domainIndex !== -1) {
    phishingDomains.splice(domainIndex, 1);
    res.json({ success: true, message: 'Domain deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Domain not found' });
  }
});

// Route to display phishing domains in a formatted manner
app.get('/view-domains', (req, res) => {
  let html = `
    <html>
      <head>
        <title>Phishing Domains</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Phishing Domains</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>Domain</th>
            <th>Risk Score</th>
            <th>Status</th>
          </tr>`;
  phishingDomains.forEach(domain => {
    html += `
          <tr>
            <td>${domain.id}</td>
            <td>${domain.domain}</td>
            <td>${domain.risk_score}</td>
            <td>${domain.status}</td>
          </tr>`;
  });
  html += `
        </table>
      </body>
    </html>`;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});