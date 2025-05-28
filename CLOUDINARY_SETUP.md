# Cloudinary Setup Guide

## Installation

First, install the required Cloudinary package:

```bash
npm install cloudinary --legacy-peer-deps
```

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Getting Cloudinary Credentials

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy the following values:
   - Cloud Name
   - API Key
   - API Secret

## Features

The image upload system includes:

- **Drag & Drop Upload**: Users can drag and drop images or click to select files
- **Multiple Image Upload**: Support for uploading multiple images at once
- **Image Preview**: Shows uploaded images with the ability to remove them
- **Automatic Optimization**: Images are automatically optimized for web (quality: auto, format: auto)
- **Size Limits**: Images are resized to a maximum of 1200x800 pixels
- **Organized Storage**: Images are stored in the `jamadi-camp/properties` folder in Cloudinary

## Usage

The `ImageUpload` component is now integrated into both:
- New Property Page (`/cms/properties/new`)
- Edit Property Page (`/cms/properties/[id]/edit`)

The component replaces the previous text input for image URLs and provides a much better user experience for managing property images.

## Security

- Only authenticated admin/manager users can upload images
- File type validation ensures only images are uploaded
- Images are stored securely in Cloudinary with automatic optimization 