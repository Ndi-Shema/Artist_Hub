"use client";

import { useState } from "react";

export default function SubmissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const submission = new FormData();
    submission.append("name", formData.name);
    submission.append("email", formData.email);
    submission.append("phone", formData.phone);
    submission.append("product", formData.product);
    if (image) submission.append("image", image);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: submission,
      });

      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", product: "" });
      setImage(null);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-4 border rounded-md shadow bg-white">
      <h2 className="text-2xl font-bold text-center">Submit Your Work</h2>

      <input type="text" name="name" placeholder="Your Name" required onChange={handleChange} value={formData.name} className="w-full border rounded px-3 py-2" />
      <input type="email" name="email" placeholder="Your Email" required onChange={handleChange} value={formData.email} className="w-full border rounded px-3 py-2" />
      <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} value={formData.phone} className="w-full border rounded px-3 py-2" />
      <textarea name="product" placeholder="Describe your product" required onChange={handleChange} value={formData.product} className="w-full border rounded px-3 py-2" rows={4}></textarea>
      <input type="file" name="image" accept="image/*" required onChange={handleImageChange} className="w-full" />

      <button type="submit" disabled={status === "loading"} className="w-full bg-primary text-white font-semibold py-2 rounded">
        {status === "loading" ? "Submitting..." : "Submit"}
      </button>

      {status === "success" && <p className="text-green-600 text-center">✅ Submitted successfully!</p>}
      {status === "error" && <p className="text-red-600 text-center">❌ Submission failed. Try again.</p>}
    </form>
  );
}
