'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreateProductInput, UpdateProductInput } from '../schemas/admin-schemas';
import { createProductSchema, updateProductSchema } from '../schemas/admin-schemas';
import type { ProductRow } from '@/src/services/admin-product.service';

interface ProductFormProps {
  product?: ProductRow;
  categories: Array<{ id: string; name: string }>;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ product, categories, onSubmit, isLoading = false }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState(product?.thumbnail || '');

  const schema = product ? updateProductSchema : createProductSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: product?.title || '',
      slug: product?.slug || '',
      category_id: product?.category_id || '',
      description: product?.description || '',
      price: product?.price || 0,
      compare_price: product?.compare_price || 0,
      stock: product?.stock || 0,
      featured: product?.featured || false,
      active: product?.active ?? true,
      image_url: product?.thumbnail || '',
    },
  });

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <Input
          {...form.register('title')}
          placeholder="Product title"
          disabled={isLoading}
        />
        {form.formState.errors.title && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
        <Input
          {...form.register('slug')}
          placeholder="product-slug"
          disabled={isLoading}
        />
        {form.formState.errors.slug && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.slug.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          {...form.register('category_id')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isLoading}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {form.formState.errors.category_id && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.category_id.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          {...form.register('description')}
          placeholder="Product description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isLoading}
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <Input
            {...form.register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            disabled={isLoading}
          />
          {form.formState.errors.price && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label>
          <Input
            {...form.register('compare_price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
        <Input
          {...form.register('stock', { valueAsNumber: true })}
          type="number"
          min="0"
          placeholder="0"
          disabled={isLoading}
        />
        {form.formState.errors.stock && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.stock.message}</p>
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

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...form.register('featured')}
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...form.register('active')}
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
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
        {product ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
}
