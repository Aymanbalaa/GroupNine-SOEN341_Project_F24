import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './InstructorDetailedView.css';

const InstructorDetailedView = ({ setRoute }) => {
  const [detailedData, setDetailedData] = useState([]);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchDetailedData = async () => {
      try {
        const teamRes = await API.get('/team/all');
        const teams = teamRes.data;

        const assessmentRes = await API.get('/peer-assessment/all-assessments');
        const assessments = assessmentRes.data;

        const detailedFeedback = teams.map((team) => {
          const teamData = {
            name: team.name,
            members: team.members.map((member) => {
              const memberAssessments = assessments.filter(
                (assessment) => assessment.memberId && assessment.memberId._id === member._id
              );

              const assessmentDetails = memberAssessments.map((assessment) => ({
                evaluator: assessment.studentId
                  ? `${assessment.studentId.firstname} ${assessment.studentId.lastname}`
                  : 'Unknown Evaluator',
                cooperation: assessment.ratings["Cooperation"] || 0,
                conceptual: assessment.ratings["Conceptual Contribution"] || 0,
                practical: assessment.ratings["Practical Contribution"] || 0,
                workEthic: assessment.ratings["Work Ethic"] || 0,
                averageAcrossAll: (
                  (assessment.ratings["Cooperation"] +
                    assessment.ratings["Conceptual Contribution"] +
                    assessment.ratings["Practical Contribution"] +
                    assessment.ratings["Work Ethic"]) / 4
                ).toFixed(2),
                comments: assessment.comments || {},
              }));

              return {
                student: `${member.firstname} ${member.lastname}`,
                assessments: assessmentDetails,
              };
            }),
          };
          return teamData;
        });

        setDetailedData(detailedFeedback);
      } catch (err) {
        console.error('Error fetching detailed view:', err.message);
        setError('Failed to load detailed assessment data');
      }
    };

    fetchDetailedData();
  }, []);

  const handleBackToDashboard = useCallback(() => {
    if (setRoute) {
      setRoute('instructor-dashboard');
    } else {
      console.error('setRoute function is not defined');
      alert('Unable to navigate back to the dashboard');
    }
  }, [setRoute]);

  // Function to handle export
  const handleExport = async () => {
    setIsExporting(true);
    if (exportFormat === 'pdf') {
      await exportToPDF();
    } else {
      exportToCSV();
    }
    setIsExporting(false);
  };

  // Export to PDF
const exportToPDF = async () => {
  const doc = new jsPDF();
  let yPosition = 20; // Initial vertical position for the content
  doc.text('Detailed Assessment Report', 20, yPosition);
  yPosition += 10; // Move down a bit for the next section

  detailedData.forEach((team) => {
    doc.text(`Team Name: ${team.name}`, 20, yPosition);
    yPosition += 10; // Move down before listing members

    team.members.forEach((member) => {
      doc.text(`Student: ${member.student}`, 20, yPosition);
      yPosition += 10; // Move down before adding the table

      doc.autoTable({
        startY: yPosition,
        head: [['Evaluator', 'Cooperation', 'Conceptual', 'Practical', 'Work Ethic', 'Average']],
        body: member.assessments.map((assessment) => [
          assessment.evaluator,
          assessment.cooperation,
          assessment.conceptual,
          assessment.practical,
          assessment.workEthic,
          assessment.averageAcrossAll,
        ]),
      });

      
      yPosition = doc.lastAutoTable.finalY + 10; // Update yPosition to the end of the table + margin
    });

    yPosition += 10; // Add some space before the next team section
  });

  doc.save('Detailed_Assessment_Report.pdf');
};


  // Export to CSV
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Team Name,Student,Evaluator,Cooperation,Conceptual,Practical,Work Ethic,Average\n';

    detailedData.forEach((team) => {
      team.members.forEach((member) => {
        member.assessments.forEach((assessment) => {
          csvContent += `${team.name},${member.student},${assessment.evaluator},${assessment.cooperation},${assessment.conceptual},${assessment.practical},${assessment.workEthic},${assessment.averageAcrossAll}\n`;
        });
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Detailed_Assessment_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="detailed-view-container">
      <h2>Detailed View of Assessments</h2>
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
      {detailedData.length > 0 ? (
        detailedData.map((team, teamIndex) => (
          <div key={teamIndex} className="team-section">
            <h3>Team Name: {team.name}</h3>
            {team.members.map((member, memberIndex) => (
              <div key={memberIndex} className="member-section">
                <h4>Student Name: {member.student}</h4>
                {member.assessments.length > 0 ? (
                  <table className="assessment-table">
                    <thead>
                      <tr>
                        <th>Evaluator</th>
                        <th>Cooperation</th>
                        <th>Conceptual</th>
                        <th>Practical</th>
                        <th>Work Ethic</th>
                        <th>Average Across All</th>
                      </tr>
                    </thead>
                    <tbody>
                      {member.assessments.map((assessment, assessmentIndex) => (
                        <tr key={assessmentIndex}>
                          <td>{assessment.evaluator}</td>
                          <td>{assessment.cooperation}</td>
                          <td>{assessment.conceptual}</td>
                          <td>{assessment.practical}</td>
                          <td>{assessment.workEthic}</td>
                          <td>{assessment.averageAcrossAll}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-evaluations">No evaluations available for this student.</p>
                )}
                <CollapsibleComments assessments={member.assessments} />
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No assessment data available.</p>
      )}
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>
    </div>
  );
};

const CollapsibleComments = ({ assessments }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div className="comments-section">
      <h5 onClick={toggleExpanded} className="comments-toggle">
        {expanded ? 'Hide Comments' : 'Show Comments'}
      </h5>
      {expanded && (
        <div className="comments-content">
          {assessments.length > 0 ? (
            assessments.map((assessment, assessmentIndex) => (
              <div key={assessmentIndex} className="individual-comment">
                {Object.entries(assessment.comments).map(([dimension, comment]) => (
                  <p key={dimension}>
                    <strong>{assessment.evaluator} - {dimension} Comment:</strong> {comment || 'No comment provided'}
                  </p>
                ))}
              </div>
            ))
          ) : (
            <p className="no-comments">No comments available for this student.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorDetailedView;
