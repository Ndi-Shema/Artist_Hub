"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/app/lib/sanity";

interface Article {
  title: string;
  slug: { current: string };
  summary: string;
  category: string;
  image?: { asset: { url: string } };
  externalLink?: string;
  createdAt?: string;
}

export default function EducationPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const query = `*[_type == "article"] {
          title,
          slug,
          summary,
          category,
          image{asset->{url}},  // ✅ Fetch image URL properly
          externalLink,
          createdAt
        }`;
        const data = await client.fetch(query);
        console.log("Fetched articles:", data);
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
      setLoading(false);
    }
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? article.category?.toLowerCase() === selectedCategory.toLowerCase() : true)
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl text-primary hover:text-primary/80  font-extrabold mb-6 text-center">📜 Artist Legal Guide - Rwanda</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="🔍 Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-full mb-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 w-full mb-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">📂 All Categories</option>
        <option value="copyright">📝 Copyright</option>
        <option value="licensing">🔖 Licensing</option>
        <option value="registrations">📑 Registrations</option>
      </select>

      {loading ? (
        <p className="text-gray-500 text-center">Loading articles...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.slug.current} className="border rounded-lg shadow-md overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">

                {/* Article Image */}
                {article.image?.asset?.url && (
                  <Image
                    src={article.image.asset.url}
                    alt={article.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  <p className="text-gray-500 text-sm mb-2">
                    📅 {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-gray-600 mb-3">{article.summary}</p>

                  {/* Read More Link */}
                  <Link href={`/education/${article.slug.current}`} className="block mt-2 text-primary hover:text-primary/80 hover:underline font-medium">
                    ➡️ Read More
                  </Link>

                  {/* External Link that users can navigate for more info */}
                  {article.externalLink && (
                    <a
                      href={article.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-green-600 hover:text-green-600/80 hover:underline font-medium"
                    >
                      🌍 More Information
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">No articles found.</p>
          )}
        </div>
      )}
    </div>
  );
}
