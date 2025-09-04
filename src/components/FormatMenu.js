import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

const formatOptions = [
  { label: 'Auto-fit Columns', value: 'autoFitColumns' },
  { label: 'Header Formatting', value: 'headerFormatting' },
  { label: 'Zebra Stripes', value: 'zebraStripes' },
  { label: 'Add Borders', value: 'addBorders' },
  { label: 'Convert to Excel Table', value: 'convertToTable' },
  { label: 'Back to Main Menu', value: 'back' }
];

export function FormatMenu({ onSelect }) {
  return React.createElement(Box, { flexDirection: 'column' },
    React.createElement(Text, { bold: true }, 'Table Formatting'),
    React.createElement(SelectInput, {
      items: formatOptions,
      onSelect: item => onSelect(item.value)
    }),
    React.createElement(Text, { dimColor: true }, 'Use ↑/↓ to navigate, Enter to select.')
  );
}
