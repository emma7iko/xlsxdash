import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

function getPageData(worksheet, page, pageSize) {
  const headers = (worksheet.getRow(1).values.slice(1) || []).map(h => h ? h.toString() : '');
  const rows = [];
  const start = page * pageSize + 1; // +1 to skip header row
  const end = start + pageSize;

  for (let i = start; i < end && i < worksheet.rowCount; i++) {
    const row = worksheet.getRow(i + 1);
    rows.push((row.values.slice(1) || []).map(c => c ? c.toString() : ''));
  }
  return { headers, rows };
}

const columnColors = ['yellow', 'green', 'magenta', 'cyan', 'red', 'blue'];

function Table({ headers, data }) {
  const columnWidths = headers.map((header, i) =>
    Math.max(
      (header || '').length,
      ...data.map(row => (row[i] || '').length)
    )
  );

  const renderRow = (row, isHeader = false) => (
    React.createElement(Box, { key: isHeader ? 'header' : row.join('-') },
      row.map((cell, i) => (
        React.createElement(Box, {
          key: i,
          width: columnWidths[i] + 2,
          borderStyle: 'single',
          borderRight: i < row.length - 1,
          borderLeft: false,
          borderTop: false,
          borderBottom: false,
        },
          React.createElement(Text, {
            bold: isHeader,
            color: isHeader ? 'white' : columnColors[i % columnColors.length],
          }, cell)
        )
      ))
    )
  );

  const renderDivider = () => {
    const totalWidth = columnWidths.reduce((sum, width) => sum + width + 3, 0) -1;
    return React.createElement(Text, { dimColor: true }, '─'.repeat(totalWidth));
  }

  return (
    React.createElement(Box, { flexDirection: 'column', borderStyle: 'single' },
      renderRow(headers, true),
      renderDivider(),
      data.map(row => renderRow(row))
    )
  );
}

export function SheetPreview({ worksheet, onBack }) {
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(Math.max(0, worksheet.rowCount -1) / pageSize);

  useInput((input, key) => {
    if (key.leftArrow) onBack();
    if (key.downArrow && page < totalPages - 1) setPage(p => p + 1);
    if (key.upArrow && page > 0) setPage(p => p - 1);
  });

  const { headers, rows } = getPageData(worksheet, page, pageSize);

  return React.createElement(Box, { flexDirection: 'column' },
    React.createElement(Text, { bold: true }, `Preview: ${worksheet.name}`),
    React.createElement(Text, { dimColor: true }, `Page ${page + 1} of ${totalPages}`),
    React.createElement(Table, { headers, data: rows }),
    React.createElement(Text, { dimColor: true }, '↑/↓ to scroll, ← to go back, q to quit')
  );
}
