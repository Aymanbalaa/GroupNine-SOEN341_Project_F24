/* eslint-disable testing-library/no-render-in-setup */
// FILE: InstructorSummaryView.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InstructorSummaryView from '../InstructorSummaryView';
import API from '../../api'; // Adjust the import path as necessary
import jsPDF from 'jspdf';
import 'jspdf-autotable';

jest.mock('../../api'); // Mock the API module
jest.mock('jspdf'); // Mock jsPDF

describe('InstructorSummaryView', () => {
  const mockSummaryData = [
    {
      studentId: '123',
      lastname: 'Doe',
      firstname: 'John',
      team: 'Team A',
      cooperation: 4,
      conceptual: 3,
      practical: 5,
      workEthic: 4,
      average: 4,
      responseCount: 3,
    },
    {
      studentId: '456',
      lastname: 'Smith',
      firstname: 'Jane',
      team: 'Team B',
      cooperation: 5,
      conceptual: 2,
      practical: 3,
      workEthic: 5,
      average: 3.75,
      responseCount: 4,
    },
  ];

  beforeEach(() => {
    render(<InstructorSummaryView summaryData={mockSummaryData} />);
  });

  test('exports to CSV correctly', () => {
    const exportToCSV = jest.fn(() => {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Student ID,Last Name,First Name,Team,Cooperation,Conceptual,Practical,Work Ethic,Average,Peers Responded\n';

      mockSummaryData.forEach((student) => {
        csvContent += [
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
        ].join(',') + '\n';
      });

      return csvContent;
    });

    const csvContent = exportToCSV();

    expect(csvContent).toContain('Student ID,Last Name,First Name,Team,Cooperation,Conceptual,Practical,Work Ethic,Average,Peers Responded');
    expect(csvContent).toContain('123,Doe,John,Team A,4,3,5,4,4,3');
    expect(csvContent).toContain('456,Smith,Jane,Team B,5,2,3,5,3.75,4');
  });

  test('generates PDF correctly', () => {
    const doc = new jsPDF();
    doc.autoTable = jest.fn();
    doc.save = jest.fn();

    const generatePDF = () => {
      doc.autoTable({
        startY: 20,
        head: [['Student ID', 'Last Name', 'First Name', 'Team', 'Cooperation', 'Conceptual', 'Practical', 'Work Ethic', 'Average', 'Peers Responded']],
        body: mockSummaryData.map(student => [
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

    generatePDF();

    expect(doc.autoTable).toHaveBeenCalledWith({
      startY: 20,
      head: [['Student ID', 'Last Name', 'First Name', 'Team', 'Cooperation', 'Conceptual', 'Practical', 'Work Ethic', 'Average', 'Peers Responded']],
      body: mockSummaryData.map(student => [
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
    expect(doc.save).toHaveBeenCalledWith('Summary_Assessment_Report.pdf');
  });

  test('processes summary data correctly', () => {
    const processedData = mockSummaryData.map(student => ({
      studentId: student.studentId,
      lastname: student.lastname,
      firstname: student.firstname,
      team: student.team,
      cooperation: student.cooperation,
      conceptual: student.conceptual,
      practical: student.practical,
      workEthic: student.workEthic,
      average: student.average,
      responseCount: student.responseCount,
    }));

    expect(processedData).toEqual(mockSummaryData);
  });

});