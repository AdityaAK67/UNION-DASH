import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, User, Power, X, Bell, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Graph from "./Graph";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [domains, setDomains] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newDomain, setNewDomain] = useState({ domain: "", risk_score: "", status: "Pending" });
  const navigate = useNavigate(); // Initialize useNavigate
   
  const fetchDomains = () => {
    axios.get("http://localhost:5000/api/domains").then((res) => setDomains(res.data));
  };
  
  useEffect(() => {
    fetchDomains();
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDomains();
    setTimeout(() => setRefreshing(false), 3000);
  };

  const handleAddDomain = async () => {
    if (!newDomain.domain || !newDomain.risk_score || !newDomain.status) return;
    const res = await axios.post("http://localhost:5000/api/add-domain", newDomain);
    setDomains([...domains, res.data.domain]);
    setNewDomain({ domain: "", risk_score: "", status: "Pending" });
    setShowForm(false);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-[#0b0f35] shadow-lg rounded-lg mb-6">
        <h1 className="text-2xl font-bold tracking-tighter leading-10">Phishing Domain Dashboard</h1>
        <div className="flex gap-6 items-center">
          <button className="relative hover:text-blue-500 transition duration-200 ease-in-out">
            <Bell className="text-white" size={22} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">1</span>
          </button>
          <button
            className="flex items-center hover:text-blue-500 transition duration-200 ease-in-out text-white"
            onClick={() => navigate("/login")}
          >
            <User className="mr-2 text-white" size={20} />
            Login
          </button>
          <button className="flex items-center hover:text-red-500 transition duration-200 ease-in-out">
            <Power className="mr-2 text-red-500" size={20} />
            Logout
          </button>
        </div>
      </nav>

      {/* Search, Refresh, Add Buttons */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4 w-full">
          <input
            type="text"
            placeholder="Search domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-4 w-3/4 px-6 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-white"
          />
          <button className="p-2 bg-[#0b0f35] rounded-md hover:bg-gray-600 transition">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition w-full max-w-xs"
        >
          <RefreshCw className={`w-5 text-white ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FFEB00] text-black rounded-md hover:bg-blue-600 transition w-full max-w-xs">
          {showForm ? <X className="w-5 text-white" /> : <Plus className="w-5 text-white" />}
          <span className="text-sm font-semibold">Add Domain</span>
        </button>
      </div>

      {/* Add Domain Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0b0f35] shadow-lg rounded-lg p-4 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg px-1 font-semibold">Add New Domain</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500">
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Domain"
              value={newDomain.domain}
              onChange={(e) => setNewDomain({ ...newDomain, domain: e.target.value })}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-white"
            />
            <input
              type="number"
              placeholder="Risk Score"
              value={newDomain.risk_score}
              onChange={(e) => setNewDomain({ ...newDomain, risk_score: e.target.value })}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-white"
            />
            <select
              value={newDomain.status}
              onChange={(e) => setNewDomain({ ...newDomain, status: e.target.value })}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-white"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              onClick={handleAddDomain}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 transition"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </motion.div>
      )}

      {/* Domains Table */}
      <div className="bg-[#0b0f35] shadow-lg rounded-lg p-4 max-h-[52vh] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0b0f35] rounded-xl">
              <th className="p-3 border-b text-white">DOMAIN</th>
              <th className="p-3 border-b text-white">RISK SCORE</th>
              <th className="p-3 border-b text-white">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {domains.filter((d) => d.domain.includes(search)).map((d, index) => {
              const riskScore = parseInt(d.risk_score, 10);
              const riskColor =
                riskScore >= 75 ? "bg-red-500" :
                  riskScore >= 30 ? "bg-yellow-500" :
                    "bg-green-500";

              return (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-slate-700 transition"
                >
                  <td className="p-3 border-b">{d.domain}</td>
                  <td className="p-3 border-b flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${riskColor}`}></span>
                    {d.risk_score}
                  </td>
                  <td className="p-3 border-b">{d.status}</td>
                </motion.tr>
              );
            })}
          </tbody>


        </table>
      </div>
      <Graph domains={domains} />
    </div>
  );
}
