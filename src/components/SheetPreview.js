import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

function getPreviewRows(worksheet, page, pageSize) {
  const rows = [];
  const start = page * pageSize;
  const end = start + pageSize;
  for (let i = start; i < end && i < worksheet.rowCount; i++) {
    const row = worksheet.getRow(i + 1);
    rows.push(row.values.slice(1)); // skip first null value
  }
  return rows;
}

export function SheetPreview({ worksheet, onBack }) {
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(worksheet.rowCount / pageSize);

  useInput((input, key) => {
    if (key.leftArrow) onBack();
    if (key.downArrow && page < totalPages - 1) setPage(p => p + 1);
    if (key.upArrow && page > 0) setPage(p => p - 1);
  });

  const rows = getPreviewRows(worksheet, page, pageSize);

  return React.createElement(Box, { flexDirection: 'column' },
    React.createElement(Text, { bold: true }, `Preview: ${worksheet.name}`),
    React.createElement(Text, { dimColor: true }, `Page ${page + 1} of ${totalPages}`),
    ...rows.map((row, idx) => React.createElement(Text, { key: idx }, row.map(cell => `${cell}`).join(' | '))),
    React.createElement(Text, { dimColor: true }, '↑/↓ to scroll, ← to go back, q to quit')
  );
}
