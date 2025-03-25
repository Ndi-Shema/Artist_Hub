"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/app/lib/sanity";

interface Article {
  title: string;
  content: any[]; // Explicit Portable Text blocks type
  image?: { asset: { url: string } };
  externalLink?: string;
  createdAt?: string;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      setLoading(true);
      try {
        const query = `*[_type == "article" && slug.current == $slug][0] {title, content, image{asset->{url}}, externalLink, createdAt}`;
        const data: Article = await client.fetch(query, { slug });
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="prose prose-lg">
        {article.content.map((block, idx) => (
          <p key={idx}>{JSON.stringify(block)}</p>
        ))}
      </div>
    </div>
  );
}
