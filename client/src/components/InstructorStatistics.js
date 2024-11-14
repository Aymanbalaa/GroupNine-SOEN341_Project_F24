import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';
import API from '../api';
import './InstructorStatistics.css';

// Register all required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InstructorStatistics = ({ setRoute }) => {
  const [summaryData, setSummaryData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState('team'); // Set default view to 'team' to display team averages first

  useEffect(() => {
    // Fetch individual student data
    const fetchData = async () => {
      try {
        const studentRes = await API.get('/peer-assessment/summary-view');
        setSummaryData(studentRes.data);

        // Calculate team averages based on individual data
        const teamAverages = calculateTeamAverages(studentRes.data);
        setTeamData(teamAverages);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError('Failed to load data');
      }
    };
    fetchData();
  }, []);

  if (error) return <p>{error}</p>;

  // Function to calculate team averages from individual data
  const calculateTeamAverages = (data) => {
    const teamScores = {};

    data.forEach((student) => {
      const { team, cooperation, conceptual, practical, workEthic } = student;

      if (!teamScores[team]) {
        teamScores[team] = {
          cooperation: 0,
          conceptual: 0,
          practical: 0,
          workEthic: 0,
          count: 0,
        };
      }

      // Accumulate scores and increment count for each team
      teamScores[team].cooperation += parseFloat(cooperation);
      teamScores[team].conceptual += parseFloat(conceptual);
      teamScores[team].practical += parseFloat(practical);
      teamScores[team].workEthic += parseFloat(workEthic);
      teamScores[team].count += 1;
    });

    // Calculate averages
    return Object.keys(teamScores).map((teamName) => ({
      name: teamName,
      cooperation: (teamScores[teamName].cooperation / teamScores[teamName].count).toFixed(2),
      conceptual: (teamScores[teamName].conceptual / teamScores[teamName].count).toFixed(2),
      practical: (teamScores[teamName].practical / teamScores[teamName].count).toFixed(2),
      workEthic: (teamScores[teamName].workEthic / teamScores[teamName].count).toFixed(2),
    }));
  };

  // Prepare data for individual student chart
  const individualLabels = summaryData.map((student) => student.firstname + ' ' + student.lastname);
  const individualData = {
    labels: individualLabels,
    datasets: [
      {
        label: 'Cooperation',
        data: summaryData.map((student) => student.cooperation),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Conceptual Contribution',
        data: summaryData.map((student) => student.conceptual),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Practical Contribution',
        data: summaryData.map((student) => student.practical),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Work Ethic',
        data: summaryData.map((student) => student.workEthic),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  // Prepare data for team average chart
  const teamLabels = teamData.map((team) => team.name);
  const teamAverageData = {
    labels: teamLabels,
    datasets: [
      {
        label: 'Cooperation',
        data: teamData.map((team) => team.cooperation),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Conceptual Contribution',
        data: teamData.map((team) => team.conceptual),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Practical Contribution',
        data: teamData.map((team) => team.practical),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Work Ethic',
        data: teamData.map((team) => team.workEthic),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  // Chart options optimized for laptop screens
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: { labels: { font: { size: 12 } } },
      title: {
        display: true,
        text: view === 'individual' ? 'Average Scores by Student' : 'Average Scores by Team',
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="statistics-container">
      <div className="statistics-content">
        <h2 className="statistics-title">Performance Metrics</h2>

        {/* Toggle Button */}
        <button onClick={() => setView(view === 'individual' ? 'team' : 'individual')} className="toggle-button">
          {view === 'individual' ? 'View Team Averages' : 'View Individual Averages'}
        </button>
        {/* Chart with scrolling */}
        <div className="chart-scroll-wrapper">
          <div className="chart-wrapper">
            <Bar key={JSON.stringify(view === 'individual' ? individualData : teamAverageData)}
                 data={view === 'individual' ? individualData : teamAverageData}
                 options={options} />
          </div>
        </div>

        <button
          onClick={() => setRoute('instructor-dashboard')}
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default InstructorStatistics;
