
"use client"
import { Property } from '@/app/types/models';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await fetch(`/api/cms/properties/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete property');
        }

        window.location.reload();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <div
          key={property._id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="relative h-48">
            <img
              src={property.images[0]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => window.location.href = `/cms/properties/${property._id}/edit`}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(property._id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">
              {property.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {property.location.address}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${property.pricing.usd.perNight}
                </p>
                <p className="text-xs text-gray-500">
                  per night
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = `/cms/properties/${property._id}/availability`}
              >
                Manage Availability
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 