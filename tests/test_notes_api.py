import os

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine


@pytest.fixture(autouse=True, scope="module")
def setup_database():
    # Use a separate test database file
    test_db_path = "./test_notes.db"
    if os.path.exists(test_db_path):
        os.remove(test_db_path)

    # Recreate tables on the test engine
    Base.metadata.create_all(bind=engine)
    yield
    # Teardown
    if os.path.exists(test_db_path):
        os.remove(test_db_path)


client = TestClient(app)


def test_create_note_success():
    response = client.post("/api/v1/notes/", json={"content": "Test note"})
    assert response.status_code == 201
    data = response.json()
    assert data["id"] > 0
    assert data["content"] == "Test note"


def test_create_note_too_long():
    long_content = "x" * 501
    response = client.post("/api/v1/notes/", json={"content": long_content})
    assert response.status_code == 422


def test_create_note_empty_after_strip():
    response = client.post("/api/v1/notes/", json={"content": "   "})
    assert response.status_code == 422
    assert response.json()["detail"] == "Note content must not be empty."


def test_list_notes():
    # Ensure at least one note exists
    client.post("/api/v1/notes/", json={"content": "Another note"})
    response = client.get("/api/v1/notes/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_delete_note():
    # Create a note to delete
    create_resp = client.post("/api/v1/notes/", json={"content": "To be deleted"})
    note_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/api/v1/notes/{note_id}")
    assert delete_resp.status_code == 204

    # Verify it is gone
    list_resp = client.get("/api/v1/notes/")
    ids = [n["id"] for n in list_resp.json()]
    assert note_id not in ids


def test_delete_note_not_found():
    response = client.delete("/api/v1/notes/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found."
