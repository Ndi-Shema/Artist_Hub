"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
    }
  }, [session]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session?.user?.email) {
    router.push("/login");
    return null;
  }

  function handleFileChange() {
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      setImageUrl(URL.createObjectURL(file));
    }
  }

  async function handleSave() {
    try {
      setMessage("");

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

      setMessage("Account deleted. Goodbye!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Error deleting account");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#f0f0f0,#ccc)] opacity-30" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">👤 My Profile</h1>

        {message && <p className="text-center mb-4 text-green-600 font-medium">{message}</p>}

        <div className="space-y-4 text-gray-800">
          <div>
            <label className="block text-sm font-semibold mb-1">Display Name</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 bg-gray-100"
              value={email}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden relative">
                <Image
                  src={imageUrl || "/default-user.png"}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
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
