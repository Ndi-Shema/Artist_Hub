import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "yoauw0qw",
  dataset: "production",
  apiVersion: "2023-03-25",
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlfor(source: unknown) {
  return builder.image(source);
}
