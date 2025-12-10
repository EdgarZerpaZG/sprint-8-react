import { useMemo, useState } from "react";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { useAdminProfiles } from "../hooks/useAdminProfiles";
import ProfileModal from "../components/admin/ProfileModal";
import type {
  UserProfile,
  UserProfileCreateInput,
} from "../types/usersTypes";

export default function AdminUsers() {
  const { isAdmin, loadingAdmin } = useIsAdmin();
  const {
    profiles,
    loading,
    errorMsg,
    stats,
    createProfile,
    updateProfile,
    deleteProfile,
    toggleActive,
  } = useAdminProfiles(isAdmin);

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [localMsg, setLocalMsg] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;

    return profiles.filter((p) =>
      [
        p.username,
        p.email,
        p.name,
        p.lastname,
        p.location,
        p.hobby,
      ]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [profiles, query]);

  const openCreate = () => {
    setLocalMsg("");
    setModalMode("create");
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: UserProfile) => {
    setLocalMsg("");
    setModalMode("edit");
    setEditing(row);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSubmitModal = async (payload: UserProfileCreateInput) => {
    setSaving(true);
    setLocalMsg("");

    try {
      if (modalMode === "create") {
        await createProfile(payload);
        setLocalMsg("Profile created successfully.");
      } else if (editing) {
        await updateProfile(editing.id, payload);
        setLocalMsg("Profile updated successfully.");
      }
      setModalOpen(false);
    } catch (e: any) {
      setLocalMsg(e?.message ?? "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: UserProfile) => {
    const ok = confirm(`Delete profile for ${row.email}?`);
    if (!ok) return;

    setLocalMsg("");

    try {
      await deleteProfile(row.id);
      setLocalMsg("Profile deleted.");
    } catch {}
  };

  if (loadingAdmin) {
    return (
      <main className="flex justify-center items-center h-full">
        <p className="text-gray-400">Checking admin status...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex justify-center items-center h-full">
        <p className="text-gray-400">
          You do not have permission to view this page.
        </p>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center h-full">
      <section className="w-full max-w-6xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin, User Profiles</h1>
            <p className="text-sm text-gray-400">
              Total: {stats.total} , Active: {stats.active} , Inactive: {stats.inactive}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by username, email, location..."
              className="w-full sm:w-72 rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-1 outline-white/10"
            />
            <button
              onClick={openCreate}
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
            >
              New profile
            </button>
          </div>
        </div>

        {(errorMsg || localMsg) && (
          <div className="mb-4 text-sm text-gray-300">
            {errorMsg || localMsg}
          </div>
        )}

        <div className="rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full text-sm text-white">
            <thead className="bg-white/5">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Active</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td className="p-3" colSpan={6}>
                    Loading profiles...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={6}>
                    No profiles found.
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((p) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="p-3">{p.username}</td>
                    <td className="p-3">
                      {(p.name || "") + " " + (p.lastname || "")}
                    </td>
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">{p.location}</td>
                    <td className="p-3">
                      <span className={p.is_active ? "text-green-300" : "text-gray-400"}>
                        {p.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="px-2 py-1 rounded bg-indigo-500 text-white text-xs"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => toggleActive(p)}
                          className="px-2 py-1 rounded bg-white/10 text-white text-xs"
                        >
                          {p.is_active ? "Disable" : "Enable"}
                        </button>

                        <button
                          onClick={() => handleDelete(p)}
                          className="px-2 py-1 rounded bg-red-500 text-white text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <ProfileModal
          open={modalOpen}
          mode={modalMode}
          initial={editing}
          onClose={closeModal}
          onSubmit={handleSubmitModal}
          loading={saving}
        />
      </section>
    </main>
  );
}