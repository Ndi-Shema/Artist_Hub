"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    image: null as File | null,
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("product", formData.product);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Submission failed");

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        product: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="relative isolate bg-white py-16 px-6 sm:py-20 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[url('/art-bg.png')] bg-no-repeat bg-cover opacity-5" />
      <div className="mx-auto max-w-2xl rounded-lg bg-white/80 backdrop-blur-md p-8 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-primary mb-4">Sell Your Artwork</h1>
        <p className="text-center text-gray-600 mb-8">Share your amazing creation with the ArtistHub community and reach a wider audience.</p>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea name="product" placeholder="Describe your product..." value={formData.product} onChange={handleChange} rows={4} required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-gray-600" />

          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/80 transition duration-200" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Submit Your Work"}
          </button>

          {status === "success" && <p className="text-green-600 text-center">Submitted successfully! 🎉</p>}
          {status === "error" && <p className="text-red-600 text-center">Something went wrong. Please try again.</p>}
        </form>
      </div>
    </div>
  );
}
