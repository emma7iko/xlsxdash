import React, { useState, useEffect } from 'react';
import { Text, Box, useApp, useInput } from 'ink';
import ExcelJS from 'exceljs';
import { Menu } from './components/Menu.js';
import { SheetList } from './components/SheetList.js';
import { SheetPreview } from './components/SheetPreview.js';
import { FormatMenu } from './components/FormatMenu.js';

export function App({ filePath }) {
  const { exit } = useApp();
  const [screen, setScreen] = useState('menu');
  const [workbook, setWorkbook] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useInput((input, key) => {
    if (input === 'q') exit();
    if (key.leftArrow && screen !== 'menu') {
      if (screen === 'sheetList') setScreen('menu');
      if (screen === 'sheetPreview') setScreen('sheetList');
      if (screen === 'formatMenu') setScreen('menu');
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

  const autoFitColumns = async () => {
    workbook.worksheets.forEach(worksheet => {
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const length = cell.value ? cell.value.toString().length : 0;
          if (length > maxLength) {
            maxLength = length;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      });
    });
    await workbook.xlsx.writeFile('data_processed.xlsx');
    setStatusMessage('Successfully formatted and saved to data_processed.xlsx');
    setScreen('menu');
  };

  const formatHeader = async () => {
    workbook.worksheets.forEach(worksheet => {
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCCCCC' }
        };
      });
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];
    });
    await workbook.xlsx.writeFile('data_processed.xlsx');
    setStatusMessage('Successfully formatted and saved to data_processed.xlsx');
    setScreen('menu');
  };

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

  if (statusMessage) {
    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
        React.createElement(Text, { color: 'green' }, statusMessage),
        React.createElement(Text, { dimColor: true }, 'Press q to quit.')
    );
  }

  if (screen === 'menu') {
    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
      React.createElement(Text, { color: 'cyanBright' }, 'xlsxdash'),
      React.createElement(Text, null, `Loaded file: ${filePath}`),
      React.createElement(Menu, {
        onSelect: (val) => {
          if (val === 'view') setScreen('sheetList');
          else if (val === 'format') setScreen('formatMenu');
          else if (val === 'quit') exit();
          else setScreen(val); // for future features
        }
      })
    );
  }

  if (screen === 'formatMenu') {
    return React.createElement(Box, { flexDirection: 'column', padding: 1 },
      React.createElement(FormatMenu, {
        onSelect: async (val) => {
          if (val === 'autoFitColumns') {
            await autoFitColumns();
          } else if (val === 'headerFormatting') {
            await formatHeader();
          } else if (val === 'back') {
            setScreen('menu');
          } else {
            setStatusMessage(`'${val}' feature coming soon!`);
            setScreen('menu');
          }
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
