'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/admin-schemas';
import { createCategorySchema, updateCategorySchema } from '../schemas/admin-schemas';
import type { CategoryRow } from '@/src/services/admin-category.service';

interface CategoryFormProps {
  category?: CategoryRow;
  onSubmit: (data: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryForm({ category, onSubmit, isLoading = false }: CategoryFormProps) {
  const [imagePreview, setImagePreview] = useState(category?.image || '');

  const schema = category ? updateCategorySchema : createCategorySchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      image_url: category?.image || '',
    },
  });

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageValue = reader.result as string;
        setImagePreview(imageValue);
        form.setValue('image_url', imageValue, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  }, [form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <Input
          {...form.register('name')}
          placeholder="Category name"
          disabled={isLoading}
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
        <Input
          {...form.register('slug')}
          placeholder="category-slug"
          disabled={isLoading}
        />
        {form.formState.errors.slug && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.slug.message}</p>
        )}
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isLoading}
        />
        {imagePreview && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
          </div>
        )}
      </div>

      {/* Errors */}
      {form.formState.errors.root && (
        <div className="p-3 bg-red-50 text-red-700 rounded">
          {form.formState.errors.root.message}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
        {category ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
}
