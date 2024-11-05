// components/EvaluationDetail.js
import React from 'react';
import PropTypes from 'prop-types';

const EvaluationDetail = ({ evaluation }) => {
  return (
    <div className="container">
      <h2>Detailed Evaluation for {evaluation.firstname} {evaluation.lastname}</h2>
      <table>
        <thead>
          <tr>
            <th>Evaluator</th>
            <th>Cooperation</th>
            <th>Conceptual</th>
            <th>Practical</th>
            <th>Work Ethic</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {evaluation.details.map((detail, index) => (
            <tr key={index}>
              <td>{detail.evaluatorName}</td>
              <td>{detail.cooperation}</td>
              <td>{detail.conceptual}</td>
              <td>{detail.practical}</td>
              <td>{detail.workEthic}</td>
              <td>{detail.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

EvaluationDetail.propTypes = {
  evaluation: PropTypes.object.isRequired,
};

export default EvaluationDetail;
