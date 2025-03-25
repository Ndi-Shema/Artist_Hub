import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
// Import the SanityImageSource type
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: "yoauw0qw",
  dataset: "production",
  apiVersion: "2023-03-25",
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlfor(source: SanityImageSource) {
  return builder.image(source);
}
