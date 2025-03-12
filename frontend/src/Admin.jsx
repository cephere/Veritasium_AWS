import React from 'react';
import './Admin.css'; // Optional: for styling

const Admin = () => {
  // Sample data for the tables
  const summaryData = [
    { modelPrediction: 'Fake', userEvaluation: 'True', adminEvaluation: 'Fake', count: 10 },
    { modelPrediction: 'True', userEvaluation: 'False', adminEvaluation: 'True', count: 5 },
  ];

  const accountsData = [
    { userId: 1, username: 'john_doe', email: 'john@example.com' },
    { userId: 2, username: 'jane_smith', email: 'jane@example.com' },
  ];

  const recordsData = [
    { newsId: 1, userId: 1, newsType: 'Article', newsLink: 'http://example.com/news1', newsPrediction: 'Fake', userEvaluation: 'True', adminEvaluation: 'Fake', dateOfSubmission: '2023-10-01', update: 'Reviewed' },
    { newsId: 2, userId: 2, newsType: 'Video', newsLink: 'http://example.com/news2', newsPrediction: 'True', userEvaluation: 'False', adminEvaluation: 'True', dateOfSubmission: '2023-10-02', update: 'Pending' },
  ];

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="tables-container">
        <div className="summary-accounts">
          <div className="summary-table">
            <h2>Summary Table</h2>
            <table>
              <thead>
                <tr>
                  <th>Model Prediction</th>
                  <th>User Evaluation</th>
                  <th>Admin Evaluation</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.modelPrediction}</td>
                    <td>{item.userEvaluation}</td>
                    <td>{item.adminEvaluation}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="accounts-table">
            <h2>Accounts Table</h2>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {accountsData.map((account, index) => (
                  <tr key={index}>
                    <td>{account.userId}</td>
                    <td>{account.username}</td>
                    <td>{account.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="records-table">
        <h2>Records Table</h2>
        <table>
          <thead>
            <tr>
              <th>News ID</th>
              <th>User ID</th>
              <th>News Type</th>
              <th>News Link</th>
              <th>News Prediction</th>
              <th>User Evaluation</th>
              <th>Admin Evaluation</th>
              <th>Date of Submission</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {recordsData.map((record, index) => (
              <tr key={index}>
                <td>{record.newsId}</td>
                <td>{record.userId}</td>
                <td>{record.newsType}</td>
                <td><a href={record.newsLink} target="_blank" rel="noopener noreferrer">{record.newsLink}</a></td>
                <td>{record.newsPrediction}</td>
                <td>{record.userEvaluation}</td>
                <td>{record.adminEvaluation}</td>
                <td>{record.dateOfSubmission}</td>
                <td>{record.update}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;