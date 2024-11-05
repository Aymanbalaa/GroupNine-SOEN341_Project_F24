// components/EvaluationSummary.js
import React from 'react';
import PropTypes from 'prop-types';

const EvaluationSummary = ({ evaluations }) => {
  return (
    <div className="container">
      <h2>Evaluation Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Cooperation</th>
            <th>Conceptual</th>
            <th>Practical</th>
            <th>Work Ethic</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation) => (
            <tr key={evaluation.studentId}>
              <td>{evaluation.studentId}</td>
              <td>{evaluation.firstname}</td>
              <td>{evaluation.lastname}</td>
              <td>{evaluation.cooperation}</td>
              <td>{evaluation.conceptual}</td>
              <td>{evaluation.practical}</td>
              <td>{evaluation.workEthic}</td>
              <td>{(
                (evaluation.cooperation +
                  evaluation.conceptual +
                  evaluation.practical +
                  evaluation.workEthic) /
                4
              ).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

EvaluationSummary.propTypes = {
  evaluations: PropTypes.array.isRequired,
};

export default EvaluationSummary;
