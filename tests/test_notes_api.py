from __future__ import annotations

from datetime import datetime

from fastapi.testclient import TestClient

from app.main import app
from app.repositories import notes_repository

client = TestClient(app)


def setup_function() -> None:  # type: ignore[override]
    # Reset repository state between tests
    notes_repository._notes.clear()  # type: ignore[attr-defined]
    notes_repository._next_id = 1  # type: ignore[attr-defined]


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_note_success() -> None:
    payload = {"title": "Test Note", "content": "This is a test"}
    response = client.post("/notes/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == payload["title"]
    assert data["content"] == payload["content"]
    assert "created_at" in data and "updated_at" in data


def test_create_note_validation_error() -> None:
    payload = {"title": "", "content": ""}
    response = client.post("/notes/", json=payload)
    assert response.status_code == 422


def test_list_notes_empty() -> None:
    response = client.get("/notes/")
    assert response.status_code == 200
    assert response.json() == []


def test_list_notes_non_empty_and_ordering() -> None:
    first = client.post("/notes/", json={"title": "First", "content": "one"}).json()
    second = client.post("/notes/", json={"title": "Second", "content": "two"}).json()

    # Update first to change its updated_at
    client.put(f"/notes/{first['id']}", json={"title": "First updated"})

    response = client.get("/notes/")
    assert response.status_code == 200
    notes = response.json()
    assert len(notes) == 2
    # First note should now appear before second due to updated_at desc
    assert notes[0]["id"] == first["id"]


def test_get_note_success_and_not_found() -> None:
    created = client.post("/notes/", json={"title": "Note", "content": "body"}).json()

    response = client.get(f"/notes/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]

    response = client.get("/notes/999")
    assert response.status_code == 404


def test_update_note_success_and_not_found() -> None:
    created = client.post("/notes/", json={"title": "Note", "content": "body"}).json()

    response = client.put(
        f"/notes/{created['id']}", json={"title": "Updated", "content": "new body"}
    )
    assert response.status_code == 200
    updated = response.json()
    assert updated["title"] == "Updated"
    assert updated["content"] == "new body"
    assert updated["updated_at"] != created["updated_at"]

    response = client.put("/notes/999", json={"title": "x"})
    assert response.status_code == 404


def test_update_note_requires_at_least_one_field() -> None:
    created = client.post("/notes/", json={"title": "Note", "content": "body"}).json()

    response = client.put(f"/notes/{created['id']}", json={})
    assert response.status_code == 400


def test_delete_note_success_and_not_found() -> None:
    created = client.post("/notes/", json={"title": "Note", "content": "body"}).json()

    response = client.delete(f"/notes/{created['id']}")
    assert response.status_code == 204

    # Subsequent get should 404
    response = client.get(f"/notes/{created['id']}")
    assert response.status_code == 404

    # Deleting again should 404
    response = client.delete(f"/notes/{created['id']}")
    assert response.status_code == 404


def test_search_notes_matches_and_no_matches_case_insensitive() -> None:
    client.post("/notes/", json={"title": "Shopping list", "content": "Buy Milk"})
    client.post("/notes/", json={"title": "Work", "content": "Finish report"})

    response = client.get("/notes/", params={"query": "milk"})
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["title"] == "Shopping list"

    response = client.get("/notes/", params={"query": "xyz"})
    assert response.status_code == 200
    assert response.json() == []


def test_search_without_query_behaves_like_list() -> None:
    client.post("/notes/", json={"title": "Note1", "content": "body1"})
    response = client.get("/notes/")
    all_notes = response.json()

    response = client.get("/notes/", params={"query": None})
    assert response.status_code == 200
    assert response.json() == all_notes
