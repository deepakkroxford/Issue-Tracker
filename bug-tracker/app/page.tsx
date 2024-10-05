'use client'; // Ensure this component is a Client Component
import React, { useEffect, useState } from 'react';

interface Issue {
    id: number;
    title: string;
    status: 'OPEN' | 'CLOSED';
}

const Dashboard = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await fetch('/api/issues');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setIssues(data);
            } catch (error) {
                console.error('Failed to fetch issues:', error);
                setError('Failed to load issues. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    const updateIssueStatus = async (id: number, status: 'OPEN' | 'CLOSED') => {
        try {
            const response = await fetch(`/api/issues/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }), // Sending the updated status
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update the local state directly to reflect the change
            setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                    issue.id === id ? { ...issue, status } : issue
                )
            );
        } catch (error) {
            console.error('Failed to update issue status:', error);
        }
    };

    // Filter issues based on the selected filter
    const filteredIssues = issues.filter(issue => 
        filter === 'ALL' || issue.status === filter
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 rounded ${filter === 'ALL' ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'} transition`}
                >
                    All Issues
                </button>
                <button
                    onClick={() => setFilter('OPEN')}
                    className={`px-4 py-2 rounded ${filter === 'OPEN' ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'} transition`}
                >
                    Open Issues
                </button>
                <button
                    onClick={() => setFilter('CLOSED')}
                    className={`px-4 py-2 rounded ${filter === 'CLOSED' ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'} transition`}
                >
                    Closed Issues
                </button>
            </div>
            <ul className="space-y-2">
                {filteredIssues.map(issue => (
                    <li key={issue.id} className={`flex items-center justify-between p-3 rounded-md ${issue.status === 'CLOSED' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-black'}`}>
                        <div className="flex-1">
                            <span className="font-semibold">{issue.title}</span> - <strong>{issue.status}</strong>
                        </div>
                        <select
                            value={issue.status}
                            onChange={(e) => updateIssueStatus(issue.id, e.target.value as 'OPEN' | 'CLOSED')}
                            className="ml-4 border border-gray-300 rounded-md p-1 bg-white hover:bg-gray-100 transition"
                        >
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
