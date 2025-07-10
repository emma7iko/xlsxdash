# xlsxdash

A beautiful, interactive Terminal UI (TUI) dashboard for exploring and enhancing Excel `.xlsx` files right from your terminal.

## Features (MVP)
- Open any `.xlsx` file in a responsive TUI
- View and navigate worksheets
- Format tables (headers, borders, zebra rows)
- Highlight invalid or broken formulas
- Suggest and add basic charts (line, bar)
- Export a modified Excel file (`data_processed.xlsx`)
- Keyboard shortcuts: arrows to navigate, `q` to quit

## Usage

```
$ xlsxdash data.xlsx
```

## Requirements
- Node.js 18+

## Installation (Development)

```
git clone <this-repo>
cd xlsxdash
npm install
npm link
```

## Run

```
xlsxdash data.xlsx
```

## Stack
- [ink](https://github.com/vadimdemedes/ink) (TUI)
- [exceljs](https://github.com/exceljs/exceljs) (Excel processing)
- [meow](https://github.com/sindresorhus/meow) (CLI)

---

### Roadmap / Future Features
- Fixing broken formulas
- KPI summaries
- Exporting charts as images
- AI suggestions for visualizations
