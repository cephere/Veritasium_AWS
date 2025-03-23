import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [countsData, setCountsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [recordsData, setRecordsData] = useState([]);
  const [filterOption, setFilterOption] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [updatedEvaluation, setUpdatedEvaluation] = useState('');

  // Pagination states
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentRecordPage, setCurrentRecordPage] = useState(1);
  const usersPerPage = 5;
  const recordsPerPage = 10;

  const summaryData = [
    { modelPrediction: 'Fake', userEvaluation: 'No', adminEvaluation: 'False', countKey: 'FalseNegative' },
    { modelPrediction: 'Fake', userEvaluation: 'Yes', adminEvaluation: 'True', countKey: 'TrueNegative' },
    { modelPrediction: 'Real', userEvaluation: 'No', adminEvaluation: 'False', countKey: 'FalsePositive' },
    { modelPrediction: 'Real', userEvaluation: 'Yes', adminEvaluation: 'True', countKey: 'TruePositive' }
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/counts');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCountsData(data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/records');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRecordsData(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchCounts();
    fetchUsers();
    fetchRecords();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    setUsername(null);
    window.location.href = '/';
  };

  // Pagination logic for users
  const indexOfLastUser  = currentUserPage * usersPerPage;
  const indexOfFirstUser  = indexOfLastUser  - usersPerPage;
  const currentUsers = usersData.slice(indexOfFirstUser , indexOfLastUser );
  const totalUserPages = Math.ceil(usersData.length / usersPerPage);

  // Pagination logic for records
  const indexOfLastRecord = currentRecordPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = recordsData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalRecordPages = Math.ceil(recordsData.length / recordsPerPage);

  const renderPagination = (currentPage, totalPages, setCurrentPage) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button key={i} onClick={() => setCurrentPage(i)} className={currentPage === i ? 'active' : ''}>
            {i}
          </button>
        );
      } else if (pages[pages.length - 1] !== '...') {
        pages.push(<span className='ellipsis' key={`dot-${i}`}>...</span>);
      }
    }
    return pages;
  };

  const fetchRecords = async (search = '', filter = 'All') => {
    try {
      const response = await fetch(`http://localhost:8080/api/search?search=${search}&filter=${filter}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setRecordsData(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecords(searchTerm, filterOption);
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = ['News ID', 'User  ID', 'News Type', 'News Link', 'Model Prediction', 'User  Evaluation', 'Admin Evaluation', 'Date of Submission'];
    csvRows.push(headers.join(','));

    recordsData.forEach(record => {
      const row = [
        record.newsId,
        record.userId,
        record.newsType,
        record.newsLink,
        record.newsPrediction,
        record.userEvaluation,
        record.adminEvaluation,
        record.dateOfSubmission
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'adminrecords.csv');
    a.click();
  };

  const handleUpdate = async (recordId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/records/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminEvaluation: updatedEvaluation }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      
      // Re-fetch records after update
      await fetchRecords();
      
      setEditingRecordId(null);
      setUpdatedEvaluation('');
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Failed to update the record. Please try again.');
    }
  };

  return (
    <div className="admin-page">
      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>VERITASIUM</div>
        <div className="nav-buttons">
          <a onClick={() => window.location.href = '/Admin'}>Refresh</a>
          <div className='adminuser'>
            <a>Admin: {username}</a>
          </div>
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
              {currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.userID}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {renderPagination(currentUserPage, totalUserPages, setCurrentUserPage)}
          </div>
        </div>
      </div>

      <div className="recordstable">
        <h2>Records Table</h2>
        <div className='recordsbuttons'>
          <form className='recordsform' onSubmit={handleSearch}>
            <select className='filter' value={filterOption} onChange={(e) => {setFilterOption(e.target.value); setSearchTerm('');}}>
              <option className='options' value='All'>All</option>
              <option className='options' value='User ID'>User  ID</option>
              <option className='options' value='NewsType'>News Type</option>
            </select>
            <input className='inputsearch' type='text' placeholder='Search for name, User ID,...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <button className='recordsbutton'>Search</button>
            <button className='downloadcsv' onClick={downloadCSV}>Download CSV</button>
          </form>
        </div>
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
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.newsId}</td>
                  <td>{record.userId}</td>
                  <td>{record.newsType}</td>
                  <td className='news-link'><a href={record.newsLink} target="_blank" rel="noopener noreferrer">{record.newsLink}</a></td>
                  <td>{record.newsPrediction}</td>
                  <td>{record.userEvaluation}</td>
                  <td>
                    {editingRecordId === record.newsId ? (
                      <input
                        type="text"
                        className="admin-evaluation-input"
                        value={updatedEvaluation}
                        onChange={(e) => setUpdatedEvaluation(e.target.value)}
                      />
                    ) : (
                      record.adminEvaluation
                    )}
                  </td>
                  <td>{new Date(record.dateOfSubmission).toLocaleDateString('en-CA')}</td>
                  <td>
                    {editingRecordId === record.newsId ? (
                      <button className='update' onClick={() => handleUpdate(record.newsId)}>Save</button>
                    ) : (
                      <button className='update' onClick={() => {
                        setEditingRecordId(record.newsId);
                        setUpdatedEvaluation(record.adminEvaluation);
                      }}>Update</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          {renderPagination(currentRecordPage, totalRecordPages, setCurrentRecordPage)}
        </div>
      </div>
    </div>
  );
};

export default Admin;