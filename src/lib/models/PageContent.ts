import mongoose from 'mongoose';

export interface IPageContent {
  pageSlug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const pageContentSchema = new mongoose.Schema<IPageContent>({
  pageSlug: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
}, {
  timestamps: true,
});

export default mongoose.models.PageContent || mongoose.model<IPageContent>('PageContent', pageContentSchema);
