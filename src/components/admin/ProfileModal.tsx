import { useEffect, useMemo, useState } from "react";
import type {
  UserProfile,
  UserProfileCreateInput,
} from "../../types/usersTypes";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: UserProfile | null;
  onClose: () => void;
  onSubmit: (payload: UserProfileCreateInput) => Promise<void>;
  loading?: boolean;
};

const emptyForm: UserProfileCreateInput = {
  auth_user_id: null,
  username: "",
  email: "",
  name: "",
  lastname: "",
  phone: "",
  location: "",
  hobby: "",
  is_active: true,
};

export default function ProfileModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  loading = false,
}: Props) {
  const [form, setForm] = useState<UserProfileCreateInput>(emptyForm);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initial) {
      setForm({
        auth_user_id: initial.auth_user_id ?? null,
        username: initial.username ?? "",
        email: initial.email ?? "",
        name: initial.name ?? "",
        lastname: initial.lastname ?? "",
        phone: initial.phone ?? null,
        location: initial.location ?? "",
        hobby: initial.hobby ?? "",
        is_active: initial.is_active ?? true,
      });
    } else {
      setForm(emptyForm);
    }
    setLocalError("");
  }, [mode, initial, open]);

  const title = useMemo(
    () => (mode === "create" ? "Create profile" : "Edit profile"),
    [mode]
  );

  if (!open) return null;

  const update = (key: keyof UserProfileCreateInput, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!form.username.trim() || !form.email.trim()) {
      setLocalError("Username and email are required.");
      return;
    }

    if (form.phone !== null && Number.isNaN(Number(form.phone))) {
      setLocalError("Phone must be a valid number.");
      return;
    }

    await onSubmit({
      ...form,
      username: form.username.trim(),
      email: form.email.trim(),
      name: form.name.trim(),
      lastname: form.lastname.trim(),
      location: form.location.trim(),
      hobby: form.hobby.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 mb-5">
          {mode === "create"
            ? "Create a business profile not linked to Auth."
            : "Update profile data used across your app."}
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-300 mb-1">Username *</label>
            <input
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-1 outline-white/10"
              placeholder="gameking"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-300 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-1 outline-white/10"
              placeholder="user@email.com"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-1 outline-white/10"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Lastname</label>
            <input
              value={form.lastname}
              onChange={(e) => update("lastname", e.target.value)}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-1 outline-white/10"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Phone</label>
            <input
              value={form.phone ?? ""}
              onChange={(e) =>
                update(
                  "phone",
                  e.target.value.trim() === "" ? null : Number(e.target.value)
                )
              }
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-1 outline-white/10"
              placeholder="3001234567"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-1 outline-white/10"
              placeholder="Barcelona"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-300 mb-1">Hobby</label>
            <input
              value={form.hobby}
              onChange={(e) => update("hobby", e.target.value)}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-1 outline-white/10"
              placeholder="Gaming, gym..."
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 mt-1">
            <input
              id="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => update("is_active", e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="is_active" className="text-xs text-gray-300">
              Active profile
            </label>
          </div>

          {localError && (
            <div className="sm:col-span-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {localError}
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-2 text-sm rounded-md bg-white/10 text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 text-sm rounded-md bg-indigo-500 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}