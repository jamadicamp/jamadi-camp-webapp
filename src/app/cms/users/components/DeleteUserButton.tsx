'use client';

import { Button } from '@/components/ui/button';

interface DeleteUserButtonProps {
  userId: string;
  username: string;
  deleteAction: (formData: FormData) => void;
}

export default function DeleteUserButton({ userId, username, deleteAction }: DeleteUserButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteAction} className="inline">
      <input type="hidden" name="userId" value={userId} />
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-900 border-red-300 hover:border-red-500"
        onClick={handleClick}
      >
        Delete
      </Button>
    </form>
  );
} 