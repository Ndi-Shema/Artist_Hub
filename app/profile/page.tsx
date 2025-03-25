"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // read-only for display
  const [imageUrl, setImageUrl] = useState(""); // local preview
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [message, setMessage] = useState("");

  // Load session data once we have a user
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
      // If you want to load existing user image from server, you can fetch it here:
      // setImageUrl(existingUser.profileImage ? existingUser.profileImage : "")
    }
  }, [session]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session?.user?.email) {
    router.push("/login");
    return null;
  }

  // ---------- Handle user image selection ----------
  function handleFileChange() {
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      setImageUrl(URL.createObjectURL(file));
    }
  }

  // ---------- Save changes to name/profile image ----------
  async function handleSave() {
    try {
      setMessage("");

      // 1) Upload image if selected
      let uploadedImageId = null;
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/user/uploadImage", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || "Failed to upload image");
          return;
        }
        uploadedImageId = data.assetId;
      }

      // 2) Patch user doc with new name + profileImage
      const updateRes = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          profileImageId: uploadedImageId,
        }),
      });
      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        setMessage(updateData.error || "Failed to update profile");
        return;
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  }

  // ---------- Delete the entire user account ----------
  async function handleDelete() {
    try {
      setMessage("");
      const delRes = await fetch("/api/user/profile", {
        method: "DELETE",
      });
      const delData = await delRes.json();

      if (!delRes.ok) {
        setMessage(delData.error || "Failed to delete account");
        return;
      }

      // Optionally signOut or redirect
      setMessage("Account deleted. Goodbye!");
      // signOut() or...
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Error deleting account");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f8f8f8] to-[#eaeaea] relative p-4">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-10"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")',
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Profile</h1>

        {message && <p className="text-center mb-4 text-green-600 font-medium">{message}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Show read-only email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 focus:outline-none bg-gray-100"
              value={email}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src="/default-user.png"
                    alt="Default"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-600"
              />
            </div>
          </div>

          {/* Save & Delete Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handleSave}
              className="bg-primary text-white font-bold px-4 py-2 rounded hover:bg-primary/80"
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
