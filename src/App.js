import React, { useState, useEffect } from 'react';
import { Text, Box, useApp, useInput } from 'ink';
import ExcelJS from 'exceljs';
import { Menu } from './components/Menu.js';
import { SheetList } from './components/SheetList.js';
import { SheetPreview } from './components/SheetPreview.js';

export function App({ filePath }) {
  const { exit } = useApp();
  const [screen, setScreen] = useState('menu');
  const [workbook, setWorkbook] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);

  useInput((input, key) => {
    if (input === 'q') exit();
    if (key.leftArrow && screen !== 'menu') {
      if (screen === 'sheetList') setScreen('menu');
      if (screen === 'sheetPreview') setScreen('sheetList');
    }
  });

  useEffect(() => {
    async function loadWorkbook() {
      const wb = new ExcelJS.Workbook();
      try {
        await wb.xlsx.readFile(filePath);
        setWorkbook(wb);
      } catch (e) {
        setError('Failed to load Excel file: ' + e.message);
      }
    }
    loadWorkbook();
  }, [filePath]);

  if (error) {
    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
      React.createElement(Text, { color: 'red' }, error),
      React.createElement(Text, { dimColor: true }, 'Press q to quit.')
    );
  }

  if (!workbook) {
    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
      React.createElement(Text, { color: 'cyanBright' }, 'xlsxdash'),
      React.createElement(Text, null, `Loaded file: ${filePath}`),
      React.createElement(Text, null, 'Loading workbook...')
    );
  }

  if (screen === 'menu') {
    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
      React.createElement(Text, { color: 'cyanBright' }, 'xlsxdash'),
      React.createElement(Text, null, `Loaded file: ${filePath}`),
      React.createElement(Menu, {
        onSelect: (val) => {
          if (val === 'view') setScreen('sheetList');
          else if (val === 'quit') exit();
          else setScreen(val); // for future features
        }
      })
    );
  }

  if (screen === 'sheetList') {
    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
      React.createElement(SheetList, {
        workbook,
        onSelectSheet: (ws) => {
          setSelectedSheet(ws);
          setScreen('sheetPreview');
        },
        onBack: () => setScreen('menu')
      })
    );
  }

  if (screen === 'sheetPreview' && selectedSheet) {
    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
      React.createElement(SheetPreview, {
        worksheet: selectedSheet,
        onBack: () => setScreen('sheetList')
      })
    );
  }

  return React.createElement(Box, { flexDirection: 'column', padding: 1 },
    React.createElement(Text, { color: 'cyanBright' }, 'xlsxdash'),
    React.createElement(Text, null, `Loaded file: ${filePath}`),
    React.createElement(Text, { color: 'yellow' }, 'Feature coming soon!'),
    React.createElement(Text, { dimColor: true }, 'Press q to quit, or ← to go back.')
  );
}
