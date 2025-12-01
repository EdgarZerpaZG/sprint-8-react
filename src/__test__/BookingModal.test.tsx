import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingModal from "../components/calendar/BookingModal";
import { supabase } from "../lib/supabaseClient";

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    rpc: vi.fn(),
    from: vi.fn(),
  },
}));

describe("BookingModal", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    start: "2025-01-20T10:00:00",
    end: "2025-01-20T11:00:00",
    resource: "roomA",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should save a booking when form is submitted", async () => {
    // Usuario autenticado
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: "mock-user-id" } } },
    });

    // RPC dice que hay disponibilidad
    (supabase.rpc as any).mockResolvedValue({
      data: true,
      error: null,
    });

    // Mock de insert + select encadenado
    const mockSelectFn = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockInsertFn = vi.fn().mockReturnValue({ select: mockSelectFn });

    (supabase.from as any).mockReturnValue({
      insert: mockInsertFn,
    });

    render(<BookingModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Event or Title"), {
      target: { value: "Test Meeting" },
    });

    fireEvent.click(screen.getByRole("button", { name: /book/i }));

    await waitFor(() => {
      expect(mockInsertFn).toHaveBeenCalled();
    });

    expect(defaultProps.onSuccess).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should show an error if the time slot is not available", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: "mock-user-id" } } },
    });

    // RPC dice que NO hay disponibilidad
    (supabase.rpc as any).mockResolvedValue({
      data: false,
      error: null,
    });

    render(<BookingModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Event or Title"), {
      target: { value: "Meeting" },
    });

    fireEvent.click(screen.getByRole("button", { name: /book/i }));

    const errorMsg = await screen.findByText(/ya está ocupado/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("should show an error if user is not logged in", async () => {
    // Sin sesión
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
    });

    render(<BookingModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Event or Title"), {
      target: { value: "Meeting" },
    });

    fireEvent.click(screen.getByRole("button", { name: /book/i }));

    const errorMsg = await screen.findByText(/Debes iniciar sesión/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("should update a booking when in edit mode", async () => {
    // Usuario autenticado
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { id: "mock-user-id" } } },
    });

    // RPC dice que hay disponibilidad
    (supabase.rpc as any).mockResolvedValue({
      data: true,
      error: null,
    });

    // Mock de update + eq + select encadenado
    const mockSelectFn = vi.fn().mockResolvedValue({
      data: [{ id: "booking-1" }],
      error: null,
    });

    const mockEqFn = vi.fn().mockReturnThis();

    const mockUpdateFn = vi.fn().mockReturnValue({
      eq: mockEqFn,
      select: mockSelectFn,
    });

    (supabase.from as any).mockReturnValue({
      update: mockUpdateFn,
    });

    const onClose = vi.fn();
    const onSuccess = vi.fn();

    render(
      <BookingModal
        {...defaultProps}
        mode="edit"
        bookingId="booking-1"
        initialTitle="Old title"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    // Cambiar título
    fireEvent.change(screen.getByPlaceholderText("Event or Title"), {
      target: { value: "Updated Meeting" },
    });

    // Guardar cambios
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockUpdateFn).toHaveBeenCalled();
      expect(mockSelectFn).toHaveBeenCalled();
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("should delete a booking when delete button is clicked", async () => {
    // Confirmación del navegador
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    const onClose = vi.fn();
    const onSuccess = vi.fn();

    // Mock de delete + eq encadenado (promise en el then)
    const mockEqFn = vi.fn().mockReturnThis();

    const deleteQuery = {
      eq: mockEqFn,
      then: (resolve: any) => resolve({ data: null, error: null }),
    };

    const mockDeleteFn = vi.fn().mockReturnValue(deleteQuery);

    (supabase.from as any).mockReturnValue({
      delete: mockDeleteFn,
    });

    render(
      <BookingModal
        {...defaultProps}
        mode="edit"
        bookingId="booking-1"
        initialTitle="Meeting"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    // Click en "Delete booking"
    fireEvent.click(
      screen.getByRole("button", { name: /delete booking/i })
    );

    await waitFor(() => {
      expect(mockDeleteFn).toHaveBeenCalled();
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});