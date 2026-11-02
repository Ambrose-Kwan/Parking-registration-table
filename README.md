# Parking Registration Table

A small Python command-line tool that keeps a **car plate → flat** parking registry in SQLite, imports it from an Excel workbook, and exports it back to Excel with every plate sorted into sheets by its first digit (1–9), plus a separate sheet for custom plates that contain no digit.

## Features

- **SQLite registry** – a single `registry` table (`car TEXT PRIMARY KEY, flat TEXT`) in `parking.db`, created automatically on first run.
- **Plate normalisation** – plates are trimmed; numeric values read from Excel (e.g. `1234` or `1234.0`) are converted to clean strings; empty plates are rejected with a `ValueError`.
- **Upsert on import** – records are written with `INSERT OR REPLACE`, so re-importing a plate updates its flat instead of duplicating it.
- **Excel import** – reads every worksheet of the source workbook from row 4 down, taking column pairs as `(car plate, flat)`.
- **Excel export, grouped by first digit**
  - `MasterData` – every record with the columns *Car Plate (CAR NO)*, *Flat / Remarks* and *First Digit*.
  - `Sheet 1` … `Sheet 9` – plates whose first digit is 1–9 (data from row 4).
  - `Custom Plates` – plates with no digit (labelled `No Digit`).
- **Optional template** – export can fill a copy of an existing template workbook (Chinese sheet names `工作表 n` and `自訂車牌及其他` are also recognised); without a template the workbook is built from scratch.
- **Summary statistics** – after export the tool prints the total, numbered and custom-plate counts, and per-sheet counts when run as a standalone converter.

## Tech stack

- Python 3
- `sqlite3` (standard library)
- [openpyxl](https://openpyxl.readthedocs.io/) for reading and writing `.xlsx`
- [pytest](https://pytest.org/) for tests

## Getting started

```bash
git clone https://github.com/Ambrose-Kwan/Parking-registration-table.git
cd Parking-registration-table
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Supply your own Excel data file when you import or convert. This repository does not include one.

### Interactive menu

```bash
python project.py
```

```
1. Import Car_Flat_Numbers Excel
2. Export registry to Excel
3. Quit
```

- **Import** loads the source workbook into `parking.db`.
- **Export** asks for an output path (`.xlsx` is appended if missing) and an optional template, then writes the grouped workbook.

> The default source and output paths in the code point to a Windows Downloads folder (`c:\Users\user\Downloads\...`). Enter your own path at the prompt, or change the defaults in `project.py` / `convert_car_flat_excel.py`.

### Standalone converter (Excel → grouped Excel)

```bash
python convert_car_flat_excel.py --source path/to/Car_Flat_Numbers.xlsx \
                                 --output path/to/output.xlsx \
                                 [--template path/to/template.xlsx]
```

### Tests

```bash
pytest
```

The five tests in `test_project.py` cover plate validation, insert/replace, lookup, importing a generated workbook, and exporting it (checking totals, the custom-plate count and the sheet names).

## Project structure

```
.
├── project.py                 # SQLite registry, import/export, interactive menu
├── convert_car_flat_excel.py  # Excel reader, first-digit grouping, workbook writer, CLI
├── test_project.py            # pytest suite
├── requirements.txt           # pytest, openpyxl
├── Car_Flat_Numbers.xlsx      # source workbook
└── parking.db                 # SQLite database
```

## Main functions (`project.py`)

| Function | Purpose |
| --- | --- |
| `init_db(db_path="parking.db")` | Create the `registry` table if it does not exist |
| `validate_car(car)` | Normalise a plate and reject empty values |
| `enter_data(car, flat)` | Insert or replace one record |
| `get_record(car)` | Return the flat for a plate, or `None` |
| `get_all_records()` | All records ordered by plate (case-insensitive) |
| `import_from_excel(path)` | Load records from a workbook (`FileNotFoundError` / `ValueError` if missing or empty) |
| `export_registry_to_excel(output, template=None)` | Write the grouped workbook (`ValueError` if the registry is empty) |
