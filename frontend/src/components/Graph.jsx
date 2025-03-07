import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

export default function Graph({ domains }) {
    if (!domains || domains.length === 0)
        return <p className="text-center text-gray-400">No data available.</p>;

    // Transform data for different charts
    const riskScoreData = domains.map((d) => ({
        domain: d.domain,
        risk_score: parseInt(d.risk_score, 10),
    }));
    
    const riskOverTime = domains.map((d, i) => ({
        time: `T${i + 1}`,
        risk_score: parseInt(d.risk_score, 10),
    }));

    const pieData = domains.map((d) => ({
        name: d.domain,
        value: parseInt(d.risk_score, 10),
    }));

    // Sort domains by _id in descending order (latest first)
   const sortedDomains = [...domains].sort((a, b) => b._id.localeCompare(a._id));

    const COLORS = ["#FFEB00", "#FF5733", "#33FF57", "#339FFF", "#FF33A6"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
            {/* Bar Chart */}
            <div className="bg-[#0b0f35] p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-3 text-center">Domains by Risk Score</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={riskScoreData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="domain" tick={false} /> {/* Hides website names */}
                        <YAxis tick={{ fill: "#fff" }} />
                        <Tooltip
                            content={({ payload }) => {
                                if (payload && payload.length) {
                                    const { domain, risk_score } = payload[0].payload;
                                    return (
                                        <div className="bg-black p-2 rounded-md text-white">
                                            <p><strong>Domain:</strong> <a href={`http://${domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-400">{domain}</a></p>
                                            <p><strong>Risk Score:</strong> {risk_score}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Bar dataKey="risk_score" animationDuration={1000}>
                            {riskScoreData.map((entry, index) => {
                                let color = entry.risk_score >= 75 ? "#FF5733" :
                                    entry.risk_score >= 30 ? "#FFEB00" :
                                        "#33FF57";
                                return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>



            {/* Line Chart */}
            <div className="bg-[#0b0f35] p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-3 text-center">Risk Score Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={riskOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fill: "#fff" }} />
                        <YAxis tick={{ fill: "#fff" }} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="risk_score"
                            stroke="#FFEB00"
                            strokeWidth={2}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            {/* Pie Chart */}
            <div className="bg-[#0b0f35] p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3 text-center">Recently Added Domains</h2>
            <div className="overflow-auto max-h-64">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-2">Domain</th>
                            <th className="p-2">Risk Score</th>
                            <th className="p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedDomains.map((domain) => (
                            <tr key={domain._id} className="border-b border-gray-600 hover:bg-gray-800">
                                <td className="p-2">{domain.domain}</td>
                                <td className="p-2">{domain.risk_score}</td>
                                <td className="p-2">{domain.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

            {/* Area Chart */}
            <div className="bg-[#0b0f35] p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-3 text-center">Risk Trend Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={riskOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fill: "#fff" }} />
                        <YAxis tick={{ fill: "#fff" }} />
                        <Tooltip />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="risk_score"
                            stroke="#FFEB00"
                            fill="#FFEB00"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
