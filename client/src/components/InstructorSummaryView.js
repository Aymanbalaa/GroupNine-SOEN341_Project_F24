import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './InstructorSummaryView.css';

const InstructorSummaryView = ({ setRoute }) => {
  const [summaryData, setSummaryData] = useState([]);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const res = await API.get('/peer-assessment/summary-view');
        setSummaryData(res.data);
      } catch (err) {
        console.error('Error fetching summary data:', err.message);
        setError('Failed to load summary data');
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

  // Export data to PDF
  const exportToPDF = async () => {
    const doc = new jsPDF();
    doc.text('Summary of Peer Assessments', 20, 10);
    doc.autoTable({
      startY: 20,
      head: [['Student ID', 'Last Name', 'First Name', 'Team', 'Cooperation', 'Conceptual', 'Practical', 'Work Ethic', 'Average', 'Peers Responded']],
      body: summaryData.map(student => [
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

  // Export data to CSV
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Student ID,Last Name,First Name,Team,Cooperation,Conceptual,Practical,Work Ethic,Average,Peers Responded\n';

    summaryData.forEach(student => {
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
      {summaryData.length > 0 ? (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Team</th>
              <th>Cooperation</th>
              <th>Conceptual Contribution</th>
              <th>Practical Contribution</th>
              <th>Work Ethic</th>
              <th>Average</th>
              <th>Peers who responded</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((student, index) => (
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
