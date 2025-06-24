'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2, GripVertical } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ImageUpload({ 
  images, 
  onImagesChange
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear dragOverIndex if we're leaving the container, not a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove the dragged item
    newImages.splice(draggedIndex, 1);
    
    // Insert at the new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDragOverIndex(null);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Property Images ({images.length})
          {images.length > 1 && (
            <span className="text-xs text-gray-500 block">
              Drag images to reorder them
            </span>
          )}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Add Images
            </>
          )}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={`relative group cursor-move transition-all duration-200 ${
                draggedIndex === index ? 'scale-105 rotate-1' : ''
              } ${
                dragOverIndex === index && draggedIndex !== index
                  ? 'ring-2 ring-blue-400 ring-offset-2'
                  : ''
              }`}
            >
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                {/* Order indicator */}
                <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium z-10">
                  {index + 1}
                </div>
                
                {/* Drag handle */}
                <div className="absolute top-1 right-8 bg-black bg-opacity-60 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <GripVertical className="h-3 w-3" />
                </div>

                <Image
                  src={url}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                  draggable={false}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Quick reorder buttons for mobile/accessibility */}
              {images.length > 1 && (
                <div className="flex justify-center mt-1 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            No images uploaded yet. Click &quot;Add Images&quot; to get started.
          </p>
        </div>
      )}

      {/* Hidden input to store the image URLs for form submission */}
      <input
        type="hidden"
        name="images"
        value={images.join(',')}
      />
    </div>
  );
} 