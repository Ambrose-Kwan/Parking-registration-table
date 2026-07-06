"""Shared helpers for car plate registry import and export."""

import argparse
import re
import shutil
from pathlib import Path

from openpyxl import Workbook, load_workbook

NO_DIGIT_LABEL = "No Digit"
MASTER_HEADERS = ("Car Plate (CAR NO)", "Flat / Remarks", "First Digit")
SHEET_TITLE_TEMPLATE = "Plates containing digit [{n}] (auto-append)"
CUSTOM_TITLE = "Custom plates and other records (auto-append)"
ROW_HEADERS = ("Car Plate (CAR NO)", "Flat / Remarks")
CUSTOM_SHEET = "Custom Plates"


def number_sheet_name(number):
    return f"Sheet {number}"


def get_number_sheet(workbook, number):
    for name in (number_sheet_name(number), f"工作表 {number}"):
        if name in workbook.sheetnames:
            return workbook[name]
    raise KeyError(f"Sheet {number} not found in workbook")


def get_custom_sheet(workbook):
    for name in (CUSTOM_SHEET, "自訂車牌及其他"):
        if name in workbook.sheetnames:
            return workbook[name]
    raise KeyError(f"{CUSTOM_SHEET} sheet not found in workbook")


def normalize_car(value):
    """Turn Excel cell values into a clean car plate string."""
    if value is None:
        return None

    if isinstance(value, float) and value.is_integer():
        text = str(int(value))
    elif isinstance(value, int):
        text = str(value)
    else:
        text = str(value).strip()

    return text or None


def normalize_flat(value):
    """Turn Excel cell values into a flat / remarks string."""
    if value is None:
        return None

    if isinstance(value, float) and value.is_integer():
        text = str(int(value))
    elif isinstance(value, int):
        text = str(value)
    else:
        text = str(value).strip()

    return text or None


def first_digit_1_to_9(car):
    """Return the first digit 1-9 found in the plate, or None."""
    match = re.search(r"[1-9]", car)
    return int(match.group()) if match else None


def read_source_records(source_path):
    """Read all car/flat pairs from a Car_Flat_Numbers workbook."""
    workbook = load_workbook(source_path, data_only=True, read_only=True)
    records = {}

    for sheet_name in workbook.sheetnames:
        sheet = workbook[sheet_name]
        rows = list(sheet.iter_rows(values_only=True))
        if len(rows) < 4:
            continue

        for row in rows[3:]:
            if not row:
                continue

            for col in range(0, len(row) - 1, 2):
                car = normalize_car(row[col] if col < len(row) else None)
                flat = normalize_flat(row[col + 1] if col + 1 < len(row) else None)
                if car is None:
                    continue
                records[car] = flat

    workbook.close()
    return records


def classify_records(records):
    """Split records into MasterData rows and sheet buckets 1-9 plus custom."""
    master_rows = []
    buckets = {number: [] for number in range(1, 10)}
    custom_rows = []

    for car in sorted(records, key=lambda item: item.upper()):
        flat = records[car]
        digit = first_digit_1_to_9(car)
        row = (car, flat)

        if digit is None:
            master_rows.append((car, flat, NO_DIGIT_LABEL))
            custom_rows.append(row)
        else:
            master_rows.append((car, flat, float(digit)))
            buckets[digit].append(row)

    return master_rows, buckets, custom_rows


def clear_sheet_data(sheet, start_row):
    """Remove old data rows while keeping headers."""
    if sheet.max_row >= start_row:
        sheet.delete_rows(start_row, sheet.max_row - start_row + 1)


def write_rows(sheet, start_row, rows, columns=2):
    """Append rows starting at start_row."""
    for offset, row in enumerate(rows):
        row_index = start_row + offset
        for col_index in range(columns):
            sheet.cell(row=row_index, column=col_index + 1, value=row[col_index])


def build_workbook(template_path, master_rows, buckets, custom_rows):
    """Fill a copied template workbook with converted data."""
    workbook = load_workbook(template_path)

    master = workbook["MasterData"]
    clear_sheet_data(master, 2)
    for offset, row in enumerate(master_rows):
        for col_index, value in enumerate(row, start=1):
            master.cell(row=2 + offset, column=col_index, value=value)

    for number in range(1, 10):
        sheet = get_number_sheet(workbook, number)
        clear_sheet_data(sheet, 4)
        write_rows(sheet, 4, buckets[number])

    custom = get_custom_sheet(workbook)
    clear_sheet_data(custom, 4)
    write_rows(custom, 4, custom_rows)

    return workbook


def create_workbook_from_scratch(master_rows, buckets, custom_rows):
    """Create the output workbook without an existing template file."""
    workbook = Workbook()
    master = workbook.active
    master.title = "MasterData"
    master.append(list(MASTER_HEADERS))
    for row in master_rows:
        master.append(list(row))

    for number in range(1, 10):
        sheet = workbook.create_sheet(number_sheet_name(number))
        sheet["A1"] = SHEET_TITLE_TEMPLATE.format(n=number)
        sheet["A3"], sheet["B3"] = ROW_HEADERS
        write_rows(sheet, 4, buckets[number])

    custom = workbook.create_sheet(CUSTOM_SHEET)
    custom["A1"] = CUSTOM_TITLE
    custom["A3"], custom["B3"] = ROW_HEADERS
    write_rows(custom, 4, custom_rows)

    return workbook


def export_records_to_excel(records, output_path, template_path=None):
    """Write registry records to a formatted car plate workbook."""
    master_rows, buckets, custom_rows = classify_records(records)

    if template_path and Path(template_path).exists():
        if Path(output_path).resolve() != Path(template_path).resolve():
            shutil.copy2(template_path, output_path)
        workbook = build_workbook(output_path, master_rows, buckets, custom_rows)
    else:
        workbook = create_workbook_from_scratch(master_rows, buckets, custom_rows)

    workbook.save(output_path)
    workbook.close()

    return {
        "total": len(records),
        "numbered": sum(len(buckets[number]) for number in range(1, 10)),
        "custom": len(custom_rows),
        "by_sheet": {number: len(buckets[number]) for number in range(1, 10)},
    }


def convert_car_flat_excel(source_path, output_path, template_path=None):
    """Convert a Car_Flat_Numbers file directly into the registry workbook format."""
    records = read_source_records(source_path)
    return export_records_to_excel(records, output_path, template_path)


def main():
    parser = argparse.ArgumentParser(
        description="Convert Car_Flat_Numbers.xlsx into a sorted registry workbook."
    )
    parser.add_argument(
        "--source",
        default=r"c:\Users\user\Downloads\Car_Flat_Numbers.xlsx",
        help="Input Excel file",
    )
    parser.add_argument(
        "--template",
        default=None,
        help="Optional template Excel file to preserve layout",
    )
    parser.add_argument(
        "--output",
        default=r"c:\Users\user\Downloads\Car_Flat_Registry_Output.xlsx",
        help="Output Excel file",
    )
    args = parser.parse_args()

    stats = convert_car_flat_excel(args.source, args.output, args.template)
    print(f"Saved: {args.output}")
    print(f"Total records: {stats['total']}")
    print(f"Numbered plates (sheets 1-9): {stats['numbered']}")
    print(f"Custom plates: {stats['custom']}")
    for number in range(1, 10):
        print(f"  Sheet {number}: {stats['by_sheet'][number]}")


if __name__ == "__main__":
    main()
