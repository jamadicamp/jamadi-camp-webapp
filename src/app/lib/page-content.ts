import { unstable_noStore as noStore } from "next/cache";
import connectDB from "@/lib/db";
import PageContent, { IPageContent } from "@/lib/models/PageContent";

export type PageContentData = {
  title: string;
  subtitle: string;
  description: string;
};

export async function getPageContent(pageSlug: string): Promise<PageContentData> {
  noStore();
  try {
    await connectDB();
    const doc = await PageContent.findOne({ pageSlug }).lean() as IPageContent | null;
    return {
      title: doc?.title || "",
      subtitle: doc?.subtitle || "",
      description: doc?.description || "",
    };
  } catch {
    return { title: "", subtitle: "", description: "" };
  }
}
