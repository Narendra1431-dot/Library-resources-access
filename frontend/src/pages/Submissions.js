import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [newSubmission, setNewSubmission] = useState({
    title: '',
    type: 'paper',
    description: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/submissions/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const submitContribution = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/submissions', newSubmission, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewSubmission({ title: '', type: 'paper', description: '' });
      setShowForm(false);
      fetchSubmissions();
      alert('Submission successful!');
    } catch (error) {
      alert('Submission failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Research Contributions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Submit New Contribution'}
        </button>
      </div>

      {showForm && (
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Submit Research Contribution</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newSubmission.title}
                onChange={(e) => setNewSubmission({ ...newSubmission, title: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={newSubmission.type}
                onChange={(e) => setNewSubmission({ ...newSubmission, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="paper">Research Paper</option>
                <option value="project">Mini Project</option>
                <option value="blog">Technical Blog</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newSubmission.description}
                onChange={(e) => setNewSubmission({ ...newSubmission, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows="4"
                placeholder="Describe your contribution"
              />
            </div>
            <button
              onClick={submitContribution}
              className="bg-accent text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission._id} className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{submission.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 capitalize">{submission.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                {submission.status}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{submission.description}</p>
            <div className="text-sm text-gray-500">
              Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
            </div>
          </div>
        ))}

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No submissions yet. Start contributing to the academic community!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
