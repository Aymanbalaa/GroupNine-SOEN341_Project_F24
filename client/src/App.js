// src/App.js
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CreateTeamFromCsv from './components/CreateTeamFromCsv';
import CreateTeamManually from './components/CreateTeamManually';
import InstructorDetailedView from './components/InstructorDetailedView';
import InstructorSummaryView from './components/InstructorSummaryView';
import PeerAssessment from './components/PeerAssessment';
import ViewAssessments from './components/ViewAssessments';
import EditEvaluation from './components/EditEvaluation';
import AnonymousFeedback from './components/AnonymousFeedback';
import AssessmentForm from './components/AssessmentForm';

const App = () => {
  const [route, setRoute] = useState('login'); // Set initial route

  // Function to render components based on the current route
  const renderComponent = () => {
    switch (route) {
      case 'register':
        return <Register setRoute={setRoute} />;
      case 'dashboard':
        return <Dashboard setRoute={setRoute} />;
      case 'instructor-dashboard':
        return <InstructorDashboard setRoute={setRoute} />;
      case 'create-team-from-csv':
        return <CreateTeamFromCsv setRoute={setRoute} />;
      case 'peer-assessment':
        return <PeerAssessment setRoute={setRoute} />;
      case 'view-assessments':
        return <ViewAssessments role="student" setRoute={setRoute} />;
      case 'edit-evaluation':
        return <EditEvaluation setRoute={setRoute} />;
      case 'anonymous-feedback':
        return <AnonymousFeedback setRoute={setRoute} />;
      case 'assessment-form':
        return <AssessmentForm setRoute={setRoute} />;
      case 'create-team-manually':
        return <CreateTeamManually setRoute={setRoute} />;
      case 'load-team-csv':
        return <CreateTeamFromCsv setRoute={setRoute} />;
      case 'detailed-view':
        return <InstructorDetailedView  setRoute={setRoute}/>;
      case 'summary-view':
        return <InstructorSummaryView setRoute={setRoute} />;
        
      case 'login':
      default:
        return <Login setRoute={setRoute} />;
    }
  };

  return (
    <div className="app-container">
      {renderComponent()}
    </div>
  );
};

export default App;
