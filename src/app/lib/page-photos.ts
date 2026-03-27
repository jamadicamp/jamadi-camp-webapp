import connectDB from "@/lib/db";
import PagePhoto from "@/lib/models/PagePhoto";

export type PhotoSlots = {
  hero?: string;
  feature?: string;
  gallery_1?: string;
  gallery_2?: string;
  gallery_3?: string;
};

export async function getPagePhotos(pageSlug: string): Promise<PhotoSlots> {
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
