import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UserTable from "../components/User/UserTable";
import type { User } from "../types/userTypes";

describe("UserTable", () => {
  const mockUsers: User[] = [
    {
      _id: "id-1",
      username: "user1",
      name: "User",
      lastname: "One",
      email: "user1@example.com",
      location: "Madrid",
    },
    {
      _id: "id-2",
      username: "user2",
      name: "User",
      lastname: "Two",
      email: "user2@example.com",
      location: "Barcelona",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a row for each user", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThanOrEqual(3);
  });

  it("calls onEdit with the correct user when Edit button is clicked", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons.length).toBe(2);

    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("calls onDelete with the correct id when Delete button is clicked", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBe(2);

    fireEvent.click(deleteButtons[1]);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("id-2");
  });

  it("does not call onDelete if user._id is undefined", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const usersWithoutId: User[] = [
      {
        username: "noid",
        name: "No",
        lastname: "Id",
        email: "noid@example.com",
        location: "Nowhere",
      },
    ];

    render(
      <UserTable
        users={usersWithoutId}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).not.toHaveBeenCalled();
  });
});