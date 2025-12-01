import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UserForm from "../components/User/UserForm"; // ajusta la ruta si es distinta
import type { User } from "../types/userTypes";

describe("UserForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders in create mode and submits new user", () => {
    const handleSubmit = vi.fn();

    render(<UserForm initialData={null} onSubmit={handleSubmit} />);

    expect(screen.getByText("Create User")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "jdoe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Madrid" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      username: "jdoe",
      name: "John",
      lastname: "Doe",
      email: "john@example.com",
      location: "Madrid",
    } satisfies User);

    const usernameAfter = screen.getByPlaceholderText(
      "Username"
    ) as HTMLInputElement;
    expect(usernameAfter.value).toBe("");
  });

  it("renders in edit mode with initial data and submits updated user", () => {
    const handleSubmit = vi.fn();

    const initialData: User = {
      _id: "some-id",
      username: "existing-user",
      name: "Alice",
      lastname: "Smith",
      email: "alice@example.com",
      location: "Barcelona",
    };

    render(<UserForm initialData={initialData} onSubmit={handleSubmit} />);

    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update/i })
    ).toBeInTheDocument();

    expect(
      (screen.getByPlaceholderText("Username") as HTMLInputElement).value
    ).toBe("existing-user");
    expect(
      (screen.getByPlaceholderText("Name") as HTMLInputElement).value
    ).toBe("Alice");

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Alice Updated" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      ...initialData,
      name: "Alice Updated",
    } satisfies User);
  });
});