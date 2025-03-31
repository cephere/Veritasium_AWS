import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import './Admin.css';
import './navbar.css';


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


    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/get_users",
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(username)
        setUsersData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRecords = async () => {
      try {
        const response = await axios.get("https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/get_records",
          { headers: { "Content-Type": "application/json" } }
        );
  
  
        setRecordsData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchCounts();
    fetchUsers();
    fetchRecords();
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await axios.get('https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/get_count',
        { headers: { "Content-Type": "application/json" } }
      )
      setCountsData(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

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

  const searchRecords = async (search = '', filter = 'All') => {
    try {
      const response = await axios.post("https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/search_record",
        {
          search : search,
          filter : filter
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setRecordsData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    searchRecords(searchTerm, filterOption);
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = ['News ID', 'User  ID', 'News Type', 'News Link', 'Model Prediction', 'User  Evaluation', 'Admin Evaluation', 'Date of Submission'];
    csvRows.push(headers.join(','));

    recordsData.forEach(record => {
      const row = [
        record.news_id,
        record.user_id,
        record.news_type,
        record.news_link,
        record.news_prediction,
        record.user_evaluation,
        record.admin_evaluation,
        record.submission_date
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
    if (!updatedEvaluation.trim()) return; // Prevent empty updates
  
    try {
      await axios.post(
        "https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/update_record",
        { 
          adminEvaluation: updatedEvaluation,
          recordId: recordId
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      // Update local state to reflect the new evaluation
      setRecordsData(prevRecords =>
        prevRecords.map(record =>
          record.news_id === recordId
            ? { ...record, admin_evaluation: updatedEvaluation }
            : record
        )
      );
  
      // Reset editing state
      setEditingRecordId(null);
      setUpdatedEvaluation('');
      fetchCounts();
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };
  

  return (
    <div className="admin-page">
      <div className="topnav">
          <div className="nav-left">
              <NavLink to="/"><h2>VERITASIUM: FAKE NEWS DETECTION</h2></NavLink>
          </div>
          <div className="nav-right">
            <a onClick={() => window.location.href = '/Admin'}>Refresh</a>
              <h3>Hello, {username}!</h3>
              <img className="icon" src="icon.png" alt="User Icon" />
              <h3>|</h3>
              <NavLink to="/" onClick={handleLogout}>Logout</NavLink>
          </div>
      </div>
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
                  <td>{user.user_id}</td>
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
                  <td>{record.news_id}</td>
                  <td>{record.user_id}</td>
                  <td>{record.news_type}</td>
                  <td className='news-link'><a href={record.news_link} target="_blank" rel="noopener noreferrer">{record.news_link}</a></td>
                  <td>{record.news_prediction}</td>
                  <td>{record.user_evaluation}</td>
                  <td>
                    {editingRecordId === record.news_id ? (
                      <input
                        type="text"
                        className="admin-evaluation-input"
                        value={updatedEvaluation || ''}
                        onChange={(e) => setUpdatedEvaluation(e.target.value)}
                      />
                    ) : (
                      record.admin_evaluation
                    )}
                  </td>
                  <td>{record.submission_date}</td>
                  <td>
                    {editingRecordId === record.news_id ? (
                      <button className='update' onClick={() => handleUpdate(record.news_id)}>Save</button>
                    ) : (
                      <button className='update' onClick={() => {
                        setEditingRecordId(record.news_id);
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