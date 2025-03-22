import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  // State to hold logged account username
  const [username, setUsername] = useState(sessionStorage.getItem('username'));

  // State to hold data
  const [countsData, setCountsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [recordsData, setRecordsData] = useState([]);

  // Fixed data for Summary Table
  const summaryData = [
    { modelPrediction: 'Fake', userEvaluation: 'No', adminEvaluation: 'False', countKey: 'FalseNegative' },
    { modelPrediction: 'Fake', userEvaluation: 'Yes', adminEvaluation: 'True', countKey: 'TrueNegative' },
    { modelPrediction: 'Real', userEvaluation: 'No', adminEvaluation: 'False', countKey: 'FalsePositive' },
    { modelPrediction: 'Real', userEvaluation: 'Yes', adminEvaluation: 'True', countKey: 'TruePositive' }
  ];

  // Fetch counts data from the backend
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/counts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setCountsData(data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  // Fetch users data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setUsersData(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch records data from the backend
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/records');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setRecordsData(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  // Removes username once logged out
  const handleLogout = () => {
    sessionStorage.removeItem('username');
    setUsername(null);
    window.location.href = '/';
  };

  return (
    <div className="admin-page">
      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>VERITASIUM</div>
        <div className="nav-buttons">
          <a onClick={() => window.location.href = '/Admin'}>Refresh</a>
          <a className='admin'>Admin: {username}</a>
          <a onClick={handleLogout}>Logout</a>
        </div>
      </nav>
      <h1>Admin Dashboard</h1>

      <div className="topcontainer">
        <div className="summarytable">
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
              {summaryData.map((item, index) => {
                const count = countsData.length > 0 ? countsData[0][item.countKey] : 0;

                return (
                  <tr key={index}>
                    <td>{item.modelPrediction}</td>
                    <td>{item.userEvaluation}</td>
                    <td>{item.adminEvaluation}</td>
                    <td>{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="accountstable">
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
              {usersData.map((user, index) => (
                <tr key={index}>
                  <td>{user.userID}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='recordsbuttons'>
        <form className='recordsform' onSubmit={(e) => e.preventDefault()}>
          <input className='inputsearch' type='text' placeholder='Search for name, User ID,...'></input>
          <button className='recordsbutton'>Search</button>
          <button className='recordsbutton'>Download CSV</button>
        </form>
      </div>

      <div className="recordstable">
        <h2>Records Table</h2>
        <table>
          <thead>
            <tr>
              <th>News ID</th>
              <th>User ID</th>
              <th>News Type</th>
              <th>News Link</th>
              <th>Model Prediction</th>
              <th>User Evaluation</th>
              <th>Admin Evaluation</th>
              <th>Date of Submission</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {recordsData.length > 0 ? (
              recordsData.map((record, index) => (
                <tr key={index}>
                  <td>{record.newsId}</td>
                  <td>{record.userId}</td>
                  <td>{record.newsType}</td>
                  <td><a href={record.newsLink} target="_blank" rel="noopener noreferrer">{record.newsLink}</a></td>
                  <td>{record.newsPrediction}</td>
                  <td>{record.userEvaluation}</td>
                  <td>{record.adminEvaluation}</td>
                  <td>{record.dateOfSubmission}</td>
                  <td><button className='update'>Update</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;