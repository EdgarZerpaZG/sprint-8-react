import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { supabase } from "../lib/supabaseClient";
import { useAdminProfiles } from "../hooks/useAdminProfiles";

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("useAdminProfiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createProfile should insert correct payload into user_profiles", async () => {
    const mockSelectFn = vi
      .fn()
      .mockResolvedValue({ data: [{ id: "new-id" }], error: null });

    const mockInsertFn = vi.fn().mockReturnValue({
      select: mockSelectFn,
    });

    (supabase.from as any).mockReturnValue({
      insert: mockInsertFn,
    });

    const { result } = renderHook(() => useAdminProfiles(false));

    const payload = {
      username: "john",
      email: "john@test.com",
      name: "John",
      lastname: "Doe",
      phone: "123456789",
      location: "Barcelona",
      hobby: "padel",
    };

    await act(async () => {
      await result.current.createProfile(payload);
    });

    expect(supabase.from).toHaveBeenCalledWith("user_profiles");

    const firstCall = mockInsertFn.mock.calls[0][0][0];
    expect(firstCall).toMatchObject({
      username: payload.username,
      email: payload.email,
      name: payload.name,
      lastname: payload.lastname,
      location: payload.location,
      hobby: payload.hobby,
    });
  });
});