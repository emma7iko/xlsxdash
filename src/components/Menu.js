import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

const menuOptions = [
  { label: 'View worksheets', value: 'view' },
  { label: 'Format tables', value: 'format' },
  { label: 'Highlight invalid formulas', value: 'highlight' },
  { label: 'Suggest/add charts', value: 'charts' },
  { label: 'Export as data_processed.xlsx', value: 'export' },
  { label: 'Quit', value: 'quit' }
];

export function Menu({ onSelect }) {
  return React.createElement(Box, { flexDirection: 'column' },
    React.createElement(Text, { bold: true }, 'Main Menu'),
    React.createElement(SelectInput, {
      items: menuOptions,
      onSelect: item => onSelect(item.value)
    }),
    React.createElement(Text, { dimColor: true }, 'Use ↑/↓ to navigate, Enter to select, q to quit.')
  );
}
