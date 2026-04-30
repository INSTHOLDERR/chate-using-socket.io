import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result;
      setPreview(base64);
      await updateProfile({ profilePic: base64 });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 sm:p-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* IMAGE */}
          <div className="relative">
            <img
              src={preview || authUser?.profilePic || "/avatar.png"}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border"
            />

            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:scale-105 transition">
              📷
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          {/* USER INFO */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {authUser?.fullName}
            </h2>
            <p className="text-gray-500 text-sm">
              {authUser?.email}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click on the camera icon to change profile picture"}
            </p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium mt-1">{authUser?.fullName}</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium mt-1">{authUser?.email}</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium mt-1">
              {authUser?.createdAt?.split("T")[0]}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium text-green-500 mt-1">Active</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;