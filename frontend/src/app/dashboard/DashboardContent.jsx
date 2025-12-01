"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@@@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function DashboardContent() {
  // -------- User Info State ----------
  const [userInfo, setUserInfo] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    bio: "Software developer and tech enthusiast.",
  });

  // -------- UI State ----------
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(userInfo);

  const dispatch = useDispatch();
  const router = useRouter();

  // -------- Error State ----------
  const [errors, setErrors] = useState({});

  // -------- Helpers ----------
  const validate = () => {
    const newErrors = {};

    if (!draft.name.trim()) newErrors.name = "Name is required";
    if (!draft.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(draft.email)) {
      newErrors.email = "Invalid email format";
    }
    if (draft.bio.length > 200)
      newErrors.bio = "Bio cannot be more than 200 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return; // stop save if errors exist

    setUserInfo(draft);
    setIsEditing(false);
    console.log("Saved!", draft);
  };

  const handleCancel = () => {
    setDraft(userInfo);
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setDraft({
      ...draft,
      [e.target.name]: e.target.value,
    });
  };

  // -------- Styling Constants ----------
  const inputClasses =
    "w-full p-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-600 transition-colors";
  const labelClasses = "block text-sm font-semibold mb-1 text-green-800";
  const buttonBase =
    "px-4 py-2 rounded-lg font-bold transition duration-150 ease-in-out shadow-md hover:shadow-lg";

  return (
    <div className="min-h-screen p-6 bg-green-50 text-green-900 font-sans">
      <div className="flex justify-between items-center mb-8 pb-3 border-b-2 border-green-300">
        <h1 className="text-3xl font-extrabold">🌿 User Dashboard</h1>

        <button
          onClick={() => {
            dispatch(logout());
            router.push("/auth/signin");
          }}
          className="
      px-4 py-2 
      bg-red-500 text-white 
      rounded-lg 
      font-bold 
      shadow-md 
      hover:bg-red-600 
      transition
    "
        >
          Logout
        </button>
      </div>

      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-green-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-700">
          My Profile
        </h2>

        {isEditing ? (
          // ==================== EDIT MODE ====================
          <div className="space-y-4">
            {/* NAME */}
            <div>
              <label className={labelClasses} htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={draft.name}
                onChange={handleChange}
                className={`${inputClasses} ${
                  errors.name ? "border-red-400" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className={labelClasses} htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={draft.email}
                onChange={handleChange}
                className={`${inputClasses} ${
                  errors.email ? "border-red-400" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* BIO */}
            <div>
              <label className={labelClasses} htmlFor="bio">
                Bio
              </label>
              <textarea
                name="bio"
                rows="3"
                value={draft.bio}
                onChange={handleChange}
                className={`${inputClasses} resize-none ${
                  errors.bio ? "border-red-400" : ""
                }`}
              />

              <div className="flex justify-between mt-1">
                {errors.bio ? (
                  <p className="text-red-600 text-sm">{errors.bio}</p>
                ) : (
                  <span className="text-xs text-green-700">
                    {draft.bio.length}/200
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className={`${buttonBase} bg-green-600 text-white hover:bg-green-700 mr-3`}
              >
                Save Changes
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
          // ==================== DISPLAY MODE ====================
          <div>
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="mb-2">
                <strong className="text-green-800">Name:</strong>{" "}
                {userInfo.name}
              </p>
              <p className="mb-2">
                <strong className="text-green-800">Email:</strong>{" "}
                {userInfo.email}
              </p>
              <p>
                <strong className="text-green-800">Bio:</strong> {userInfo.bio}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className={`${buttonBase} bg-green-500 text-white hover:bg-green-600`}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
