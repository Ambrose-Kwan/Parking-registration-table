import os

import pytest
from openpyxl import Workbook, load_workbook

from project import (
    enter_data,
    export_registry_to_excel,
    get_all_records,
    get_record,
    import_from_excel,
    init_db,
    validate_car,
)

TEST_DB = "test_parking.db"
TEST_IMPORT = "test_import.xlsx"
TEST_EXPORT = "test_export.xlsx"


@pytest.fixture
def conn():
    if os.path.exists(TEST_DB):
        os.remove(TEST_DB)
    connection = init_db(TEST_DB)
    yield connection
    connection.close()
    if os.path.exists(TEST_DB):
        os.remove(TEST_DB)


def test_validate_car():
    assert validate_car("FU 403") == "FU 403"
    assert validate_car("  AE 2  ") == "AE 2"
    assert validate_car(403) == "403"

    with pytest.raises(ValueError):
        validate_car("")

    with pytest.raises(ValueError):
        validate_car("   ")

    with pytest.raises(ValueError):
        validate_car(None)


def test_enter_data(conn):
    enter_data(conn, "FU 403", "P18")
    row = conn.execute(
        "SELECT flat FROM registry WHERE car = ?",
        ("FU 403",),
    ).fetchone()
    assert row[0] == "P18"

    enter_data(conn, "FU 403", "P20")
    row = conn.execute(
        "SELECT flat FROM registry WHERE car = ?",
        ("FU 403",),
    ).fetchone()
    assert row[0] == "P20"

    with pytest.raises(ValueError):
        enter_data(conn, "", "P18")


def test_get_record(conn):
    enter_data(conn, "AIA HK", "C22A")
    assert get_record(conn, "AIA HK") == "C22A"

    assert get_record(conn, "MISSING") is None

    with pytest.raises(ValueError):
        get_record(conn, "")


def _write_car_flat_import_file():
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "r1"
    sheet.append(["Title"])
    sheet.append([None])
    sheet.append(["CAR NO", "Flat", "CAR NO", "Flat"])
    sheet.append(["FU 403", "P18", "AIA HK", "C22A"])
    sheet.append(["AE 2", "C82", None, None])
    workbook.save(TEST_IMPORT)
    workbook.close()


def test_import_from_excel(conn):
    _write_car_flat_import_file()
    count = import_from_excel(conn, TEST_IMPORT)
    assert count == 3
    assert get_record(conn, "FU 403") == "P18"
    assert get_record(conn, "AIA HK") == "C22A"
    assert get_record(conn, "AE 2") == "C82"
    os.remove(TEST_IMPORT)


def test_export_registry_to_excel(conn):
    enter_data(conn, "FU 403", "P18")
    enter_data(conn, "AIA HK", "C22A")
    enter_data(conn, "AE 2", "C82")

    stats = export_registry_to_excel(conn, TEST_EXPORT)
    assert stats["total"] == 3
    assert stats["custom"] == 1

    workbook = load_workbook(TEST_EXPORT, data_only=True)
    assert "MasterData" in workbook.sheetnames
    assert "Sheet 4" in workbook.sheetnames
    assert "Custom Plates" in workbook.sheetnames

    master = list(workbook["MasterData"].iter_rows(min_row=2, values_only=True))
    assert any(row[0] == "FU 403" and row[1] == "P18" for row in master)

    custom = list(workbook["Custom Plates"].iter_rows(min_row=4, values_only=True))
    assert ("AIA HK", "C22A") in custom

    workbook.close()
    os.remove(TEST_EXPORT)
