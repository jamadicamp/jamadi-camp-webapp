import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPagePhoto extends Document {
  pageSlug: string;
  slot: "hero" | "feature" | "gallery_1" | "gallery_2" | "gallery_3";
  url: string;
  publicId: string;
}

const PagePhotoSchema = new Schema<IPagePhoto>(
  {
    pageSlug: { type: String, required: true },
    slot: {
      type: String,
      required: true,
      enum: ["hero", "feature", "gallery_1", "gallery_2", "gallery_3"],
    },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure each (pageSlug, slot) pair is unique
PagePhotoSchema.index({ pageSlug: 1, slot: 1 }, { unique: true });

const PagePhoto: Model<IPagePhoto> =
  mongoose.models.PagePhoto ||
  mongoose.model<IPagePhoto>("PagePhoto", PagePhotoSchema);

export default PagePhoto;
