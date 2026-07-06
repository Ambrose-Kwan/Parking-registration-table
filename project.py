import os
import sqlite3

from convert_car_flat_excel import export_records_to_excel, read_source_records


def init_db(db_path="parking.db"):
    #Connect to SQLite and create the registry table if needed.
    conn = sqlite3.connect(db_path)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS registry (
            car TEXT PRIMARY KEY,
            flat TEXT
        )
        """
    )
    conn.commit()
    return conn


def validate_car(car):
    #Return a normalized plate string, or raise ValueError if empty.
    if car is None:
        raise ValueError("Car plate cannot be empty")

    if isinstance(car, float) and car.is_integer():
        text = str(int(car))
    elif isinstance(car, int):
        text = str(car)
    else:
        text = str(car).strip()

    if not text:
        raise ValueError("Car plate cannot be empty")

    return text


def enter_data(conn, car, flat):
    #Validate and save or replace a car plate record.
    plate = validate_car(car)
    flat_value = None if flat is None else str(flat).strip() or None
    conn.execute(
        "INSERT OR REPLACE INTO registry (car, flat) VALUES (?, ?)",
        (plate, flat_value),
    )
    conn.commit()


def get_record(conn, car):
    #Return the flat for a car plate, or None if not found.
    plate = validate_car(car)
    row = conn.execute(
        "SELECT flat FROM registry WHERE car = ?",
        (plate,),
    ).fetchone()
    return row[0] if row else None


def get_all_records(conn):
    #Return all car/flat pairs stored in the database.
    rows = conn.execute("SELECT car, flat FROM registry ORDER BY car COLLATE NOCASE").fetchall()
    return {car: flat for car, flat in rows}


def import_from_excel(conn, filepath):
    #Import a Car_Flat_Numbers workbook into the database.
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Excel file not found: {filepath}")

    records = read_source_records(filepath)
    if not records:
        raise ValueError("No car records found in Excel file")

    for car, flat in records.items():
        enter_data(conn, car, flat)

    return len(records)


def export_registry_to_excel(conn, output_path, template_path=None):
    #Export database records to a formatted registry workbook.
    records = get_all_records(conn)
    if not records:
        raise ValueError("No records in database. Import an Excel file first.")

    return export_records_to_excel(records, output_path, template_path)


def main():
    conn = init_db()
    default_output = r"c:\Users\user\Downloads\Car_Flat_Registry_Output.xlsx"

    print("Parking Registry")
    print("1. Import Car_Flat_Numbers Excel")
    print("2. Export registry to Excel")
    print("3. Quit")

    while True:
        choice = input("Choice: ").strip()

        if choice == "1":
            filepath = input("Car_Flat_Numbers Excel path: ").strip()
            try:
                count = import_from_excel(conn, filepath)
                print(f"Imported {count} record(s) from {filepath}.")
                print("Choose option 2 to export the registry.")
            except (FileNotFoundError, ValueError) as error:
                print(error)

        elif choice == "2":
            output = input(f"Output file (Enter for {default_output}): ").strip()
            if not output:
                output = default_output
            if not output.lower().endswith(".xlsx"):
                output += ".xlsx"

            template = input("Template file (Enter to skip): ").strip()
            if not template:
                template = None

            try:
                stats = export_registry_to_excel(conn, output, template)
                print(f"Saved registry to {output}")
                print(f"Total: {stats['total']}, Custom plates: {stats['custom']}")
            except (ValueError, FileNotFoundError) as error:
                print(error)

        elif choice == "3":
            conn.close()
            print("Goodbye.")
            break

        else:
            print("Invalid choice. Enter 1, 2, or 3.")


if __name__ == "__main__":
    main()
