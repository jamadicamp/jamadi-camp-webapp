
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
import Image from 'next/image';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      try {
        const response = await fetch(`/api/cms/properties/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la propiedad');
        }

        window.location.reload();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error al eliminar la propiedad');
      }
    }
  };

  console.log(properties) 

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <div
          key={property._id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="relative h-48">
            <Image
              src={property.images[0]?.url || ''}
              objectFit="cover"
              alt={property.name}
              fill
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
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(property?._id?.toString() || '')}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
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
              {property.address}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${property?.currencies[0]?.euro_forex}
                </p>
                <p className="text-xs text-gray-500">
                  por noche
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = `/cms/properties/${property._id}/availability`}
              >
                Administrar Disponibilidad
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 