import { unstable_noStore as noStore } from "next/cache";
import connectDB from "@/lib/db";
import PagePhoto from "@/lib/models/PagePhoto";

export type PhotoSlots = {
  hero?: string;
  feature?: string;
  gallery_1?: string;
  gallery_2?: string;
  gallery_3?: string;
  gallery_4?: string;
  cabin_1?: string;
  cabin_2?: string;
  cabin_3?: string;
  cabin_4?: string;
  cabin_5?: string;
  cabin_6?: string;
  cabin_7?: string;
  cabin_8?: string;
};

export async function getPagePhotos(pageSlug: string): Promise<PhotoSlots> {
  noStore();
  try {
    await connectDB();
    const photos = await PagePhoto.find({ pageSlug }).lean();
    const result: PhotoSlots = {};
    for (const photo of photos) {
      result[photo.slot as keyof PhotoSlots] = photo.url;
    }
    return result;
  } catch {
    return {};
  }
}
