import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './InstructorSummaryView.css';

const InstructorSummaryView = ({ setRoute }) => {
  const [summaryData, setSummaryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'studentId', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSummaryData = async () => {
      setIsLoading(true);
      try {
        const res = await API.get('/peer-assessment/summary-view');
        setSummaryData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error('Error fetching summary data:', err.message);
        setError('Failed to load summary data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummaryData();
  }, []);

  const handleBackToDashboard = useCallback(() => {
    if (setRoute) {
      setRoute('instructor-dashboard');
    } else {
      console.error('setRoute function is not defined');
      alert('Unable to navigate back to the dashboard');
    }
  }, [setRoute]);

  const handleExport = async () => {
    setIsExporting(true);
    if (exportFormat === 'pdf') {
      await exportToPDF();
    } else {
      exportToCSV();
    }
    setIsExporting(false);
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    doc.text('Summary of Peer Assessments', 20, 10);
    doc.autoTable({
      startY: 20,
      head: [['Student ID', 'Last Name', 'First Name', 'Team', 'Cooperation', 'Conceptual', 'Practical', 'Work Ethic', 'Average', 'Peers Responded']],
      body: filteredData.map(student => [
        student.studentId,
        student.lastname,
        student.firstname,
        student.team,
        student.cooperation,
        student.conceptual,
        student.practical,
        student.workEthic,
        student.average,
        student.responseCount,
      ]),
    });
    doc.save('Summary_Assessment_Report.pdf');
  };

  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Student ID,Last Name,First Name,Team,Cooperation,Conceptual,Practical,Work Ethic,Average,Peers Responded\n';

    filteredData.forEach(student => {
      csvContent += `${student.studentId},${student.lastname},${student.firstname},${student.team},${student.cooperation},${student.conceptual},${student.practical},${student.workEthic},${student.average},${student.responseCount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Summary_Assessment_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (key) => {
    const sortableColumns = ['studentId', 'lastname', 'firstname', 'cooperation', 'conceptual', 'practical', 'workEthic', 'average'];
    if (!sortableColumns.includes(key)) return;

    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = summaryData.filter(
      (student) =>
        student.studentId.toString().includes(term) ||
        student.firstname.toLowerCase().includes(term) ||
        student.lastname.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  const renderSortIcon = (column) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <div className="summary-view-container">
      <h2>Summary of Results</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="export-section">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="export-select"
        >
          <option value="pdf">Export as PDF</option>
          <option value="csv">Export as CSV</option>
        </select>
        <button onClick={handleExport} className="export-button" disabled={isExporting}>
          {isExporting ? <div className="spinner"></div> : 'Export'}
        </button>
      </div>
      <div className="search-input-container">
        <span className="search-input-icon">🔍</span> {/* You can replace this with a FontAwesome or Material icon if preferred */}
        <input
          type="text"
          placeholder="Search by name or student ID"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : filteredData.length > 0 ? (
        <table className="summary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('studentId')}>
                Student ID {renderSortIcon('studentId')}
              </th>
              <th onClick={() => handleSort('lastname')}>
                Last Name {renderSortIcon('lastname')}
              </th>
              <th onClick={() => handleSort('firstname')}>
                First Name {renderSortIcon('firstname')}
              </th>
              <th>Team</th>
              <th onClick={() => handleSort('cooperation')}>
                Cooperation {renderSortIcon('cooperation')}
              </th>
              <th onClick={() => handleSort('conceptual')}>
                Conceptual Contribution {renderSortIcon('conceptual')}
              </th>
              <th onClick={() => handleSort('practical')}>
                Practical Contribution {renderSortIcon('practical')}
              </th>
              <th onClick={() => handleSort('workEthic')}>
                Work Ethic {renderSortIcon('workEthic')}
              </th>
              <th onClick={() => handleSort('average')}>
                Average {renderSortIcon('average')}
              </th>
              <th>Peers who responded</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student, index) => (
              <tr key={index}>
                <td>{student.studentId}</td>
                <td>{student.lastname}</td>
                <td>{student.firstname}</td>
                <td>{student.team}</td>
                <td>{student.cooperation}</td>
                <td>{student.conceptual}</td>
                <td>{student.practical}</td>
                <td>{student.workEthic}</td>
                <td>{student.average}</td>
                <td>{student.responseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No summary data available.</p>
      )}
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>
    </div>
  );
};

export default InstructorSummaryView;
