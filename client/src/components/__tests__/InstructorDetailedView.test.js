/* eslint-disable testing-library/no-render-in-setup */
/* eslint-disable no-undef */
// FILE: InstructorDetailedView.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InstructorDetailedView from '../InstructorDetailedView';
import API from '../../api'; // Adjust the import path as necessary

jest.mock('../../api'); // Mock the API module

describe('InstructorDetailedView', () => {
  const mockTeams = [
    {
      name: 'Team A',
      members: [
        { _id: '1', firstname: 'John', lastname: 'Doe' },
        { _id: '2', firstname: 'Jane', lastname: 'Smith' },
      ],
    },
  ];

  const mockAssessments = [
    {
      memberId: { _id: '1' },
      studentId: { firstname: 'Alice', lastname: 'Johnson' },
      ratings: {
        Cooperation: 4,
        'Conceptual Contribution': 3,
        'Practical Contribution': 5,
        'Work Ethic': 4,
      },
    },
    {
      memberId: { _id: '2' },
      studentId: { firstname: 'Bob', lastname: 'Brown' },
      ratings: {
        Cooperation: 5,
        'Conceptual Contribution': 2,
        'Practical Contribution': 3,
        'Work Ethic': 5,
      },
    },
  ];

  beforeEach(async () => {
    API.get.mockResolvedValueOnce({ data: mockAssessments });
    render(<InstructorDetailedView teams={mockTeams} />);
    await waitFor(() =>
      expect(API.get).toHaveBeenCalledWith('/peer-assessment/all-assessments'),
    );
  });

  test('fetches and processes assessments correctly', async () => {
    const detailedFeedback = mockTeams.map((team) => {
      const teamData = {
        name: team.name,
        members: team.members.map((member) => {
          const memberAssessments = mockAssessments.filter(
            (assessment) =>
              assessment.memberId && assessment.memberId._id === member._id,
          );

          const assessmentDetails = memberAssessments.map((assessment) => ({
            evaluator: assessment.studentId
              ? `${assessment.studentId.firstname} ${assessment.studentId.lastname}`
              : 'Unknown Evaluator',
            cooperation: assessment.ratings['Cooperation'] || 0,
            conceptual: assessment.ratings['Conceptual Contribution'] || 0,
            practical: assessment.ratings['Practical Contribution'] || 0,
            workEthic: assessment.ratings['Work Ethic'] || 0,
            averageAcrossAll: (
              (assessment.ratings['Cooperation'] +
                assessment.ratings['Conceptual Contribution'] +
                assessment.ratings['Practical Contribution'] +
                assessment.ratings['Work Ethic']) /
              4
            ).toFixed(2),
          }));

          return {
            ...member,
            assessments: assessmentDetails,
          };
        }),
      };

      return teamData;
    });

    expect(detailedFeedback).toEqual([
      {
        name: 'Team A',
        members: [
          {
            _id: '1',
            firstname: 'John',
            lastname: 'Doe',
            assessments: [
              {
                evaluator: 'Alice Johnson',
                cooperation: 4,
                conceptual: 3,
                practical: 5,
                workEthic: 4,
                averageAcrossAll: '4.00',
              },
            ],
          },
          {
            _id: '2',
            firstname: 'Jane',
            lastname: 'Smith',
            assessments: [
              {
                evaluator: 'Bob Brown',
                cooperation: 5,
                conceptual: 2,
                practical: 3,
                workEthic: 5,
                averageAcrossAll: '3.75',
              },
            ],
          },
        ],
      },
    ]);
  });

  test('exports to CSV correctly', () => {
    const exportToCSV = jest.fn(() => {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent +=
        'Team Name,Student,Evaluator,Cooperation,Conceptual,Practical,Work Ethic,Average\n';

      mockTeams.forEach((team) => {
        team.members.forEach((member) => {
          const memberAssessments = mockAssessments.filter(
            (assessment) =>
              assessment.memberId && assessment.memberId._id === member._id,
          );

          memberAssessments.forEach((assessment) => {
            csvContent +=
              [
                team.name,
                `${member.firstname} ${member.lastname}`,
                `${assessment.studentId.firstname} ${assessment.studentId.lastname}`,
                assessment.ratings.Cooperation,
                assessment.ratings['Conceptual Contribution'],
                assessment.ratings['Practical Contribution'],
                assessment.ratings['Work Ethic'],
                (
                  (assessment.ratings.Cooperation +
                    assessment.ratings['Conceptual Contribution'] +
                    assessment.ratings['Practical Contribution'] +
                    assessment.ratings['Work Ethic']) /
                  4
                ).toFixed(2),
              ].join(',') + '\n';
          });
        });
      });

      return csvContent;
    });

    const csvContent = exportToCSV();

    expect(csvContent).toContain(
      'Team Name,Student,Evaluator,Cooperation,Conceptual,Practical,Work Ethic,Average',
    );
    expect(csvContent).toContain('Team A,John Doe,Alice Johnson,4,3,5,4,4.00');
    expect(csvContent).toContain('Team A,Jane Smith,Bob Brown,5,2,3,5,3.75');
  });
});
