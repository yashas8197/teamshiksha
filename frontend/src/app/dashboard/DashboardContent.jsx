"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  logout,
  getCurrentUser,
  updateCurrentUser,
} from "@@@/store/slices/authSlice";

export default function DashboardContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, status, error } = useSelector((state) => state.auth);

  const [draft, setDraft] = useState({
    first_name: "",
    last_name: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Tailwind styles
  const inputClasses =
    "w-full p-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500 text-green-900 transition-colors";
  const labelClasses = "block text-sm font-semibold mb-1 text-green-800";
  const buttonBase =
    "px-4 py-2 rounded-lg font-bold transition duration-150 ease-in-out shadow-md hover:shadow-lg";

  // Always fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await dispatch(getCurrentUser()).unwrap();
        setDraft({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
        });
      } catch (_) {
        dispatch(logout());
        router.push("/auth/signin");
      }
    };

    fetchUser();
  }, [dispatch, router]);

  // Handlers
  const handleChange = (e) =>
    setDraft({ ...draft, [e.target.name]: e.target.value });

  const handleCancel = () => {
    if (user) {
      setDraft({ first_name: user.first_name, last_name: user.last_name });
    }
    setIsEditing(false);
    setSuccessMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");

    try {
      await dispatch(updateCurrentUser(draft)).unwrap();
      setSuccessMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/signin");
  };

  if (status === "loading" || !user) {
    return (
      <div className="min-h-screen p-6 bg-green-50">
        <div className="max-w-xl mx-auto p-6 bg-white border rounded-lg shadow">
          Loading profile…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-green-50 text-green-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-3 border-b-2 border-green-300">
        <h1 className="text-3xl font-extrabold">🌿 User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border border-green-200">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          My Profile
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {JSON.stringify(error)}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>First Name</label>
              <input
                name="first_name"
                value={draft.first_name}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Last Name</label>
              <input
                name="last_name"
                value={draft.last_name}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Email</label>
              <input
                value={user.email}
                disabled
                className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
              />
              <p className="text-xs text-green-700 mt-1">
                Email cannot be changed.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`${buttonBase} bg-green-600 text-white hover:bg-green-700`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                className={`${buttonBase} bg-gray-200 text-gray-700 hover:bg-gray-300`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-green-50 rounded border">
              <p className="mb-2">
                <strong>Name:</strong>{" "}
                {user.first_name || user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.username}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className={`${buttonBase} bg-green-500 text-white hover:bg-green-600`}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
