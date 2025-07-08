#!/usr/bin/env node
import meow from 'meow';
import { render } from 'ink';
import React from 'react';
import { App } from '../src/App.js';

const cli = meow(`\n  Usage\n    $ xlsxdash <file.xlsx>\n`, {
  importMeta: import.meta,
  flags: {},
});

if (cli.input.length === 0) {
  console.error('Please provide an .xlsx file path.');
  process.exit(1);
}

render(React.createElement(App, { filePath: cli.input[0] }));
