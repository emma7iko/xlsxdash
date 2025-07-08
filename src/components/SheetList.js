import React, { useState } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

export function SheetList({ workbook, onSelectSheet, onBack }) {
  const sheetItems = workbook.worksheets.map(ws => ({
    label: ws.name,
    value: ws.id
  }));

  return React.createElement(Box, { flexDirection: 'column' },
    React.createElement(Text, { bold: true }, 'Worksheets'),
    React.createElement(SelectInput, {
      items: sheetItems,
      onSelect: item => {
        const ws = workbook.getWorksheet(item.label);
        onSelectSheet(ws);
      }
    }),
    React.createElement(Text, { dimColor: true }, 'Enter to select, q to quit, ← to go back'),
    React.createElement(Text, { dimColor: true, color: 'blue' }, 'Tip: Use arrows to navigate')
  );
}
