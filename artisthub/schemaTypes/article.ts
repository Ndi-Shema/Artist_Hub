import { defineType, defineField } from "sanity";

export default defineType({
  name: "article",
  type: "document",
  title: "Educational Articles",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      title: "Summary",
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      options: {
        list: [
          { title: "Copyright", value: "copyright" },
          { title: "Licensing", value: "licensing" },
          { title: "Registrations", value: "registrations" },
        ],
      },
    }),
    defineField({
      name: "image",
      type: "image", //
      title: "Article Image",
      options: { hotspot: true },
    }),
    defineField({
      name: "externalLink",
      type: "url",
      title: "External Link",
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Published Date",
    }),
  ],
});
