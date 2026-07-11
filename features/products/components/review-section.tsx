'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, ThumbsUp } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { useReviews } from '@/features/products/hooks/use-reviews';
import type { ReviewRow } from '@/src/services/review.service';

interface ReviewFormProps {
  initial?: ReviewRow | null;
  onSubmit: (data: { rating: number; title: string; body: string }) => Promise<void>;
  onCancel?: () => void;
}

function ReviewForm({ initial, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError('Please select a rating'); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ rating, title, body });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-slate-900">{initial ? 'Edit Review' : 'Write a Review'}</h3>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Rating *</label>
        <StarRating rating={rating} interactive onChange={setRating} size="lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Summarise your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Review</label>
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Share your experience with this product"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting} size="sm">
          {submitting ? 'Submitting...' : initial ? 'Update Review' : 'Submit Review'}
        </Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}

function RatingDistribution({ distribution, total }: { distribution: Record<number, number>; total: number }) {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-4 text-slate-600">{star}</span>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 text-right text-slate-500">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

interface ReviewCardProps {
  review: ReviewRow;
  isOwn: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function ReviewCard({ review, isOwn, onEdit, onDelete }: ReviewCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this review?')) return;
    setDeleting(true);
    try { await onDelete(); } finally { setDeleting(false); }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <StarRating rating={review.rating} size="sm" />
          {review.title && <p className="font-semibold text-slate-900 text-sm">{review.title}</p>}
        </div>
        {isOwn && (
          <div className="flex gap-1 shrink-0">
            <button onClick={onEdit} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" aria-label="Edit review">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={handleDelete} disabled={deleting} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors" aria-label="Delete review">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      {review.body && <p className="text-sm text-slate-600 leading-relaxed">{review.body}</p>}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{new Date(review.created_at).toLocaleDateString()}</span>
        <button className="flex items-center gap-1 hover:text-slate-600 transition-colors" aria-label="Mark as helpful">
          <ThumbsUp className="h-3 w-3" />
          <span>Helpful ({review.helpful_votes})</span>
        </button>
      </div>
    </div>
  );
}

export function ReviewSection({ productId }: { productId: string }) {
  const {
    reviews, total, summary, userReview, canReview, loading, page,
    fetchReviews, submitReview, editReview, removeReview, changePage, changeSort,
  } = useReviews(productId);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewRow | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const totalPages = Math.ceil(total / 10);

  const handleSubmit = async (data: { rating: number; title: string; body: string }) => {
    await submitReview(data);
    setShowForm(false);
  };

  const handleEdit = async (id: string, data: { rating: number; title: string; body: string }) => {
    await editReview(id, data);
    setEditingReview(null);
  };

  return (
    <section className="space-y-8" aria-label="Product reviews">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Reviews</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Customer Reviews</h2>
        </div>
        {canReview && !userReview && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>Write a Review</Button>
        )}
      </div>

      {/* Summary */}
      {summary.count > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col items-center justify-center gap-1 shrink-0">
            <span className="text-5xl font-bold text-slate-900">{summary.average}</span>
            <StarRating rating={Math.round(summary.average)} size="md" />
            <span className="text-sm text-slate-500">{summary.count} reviews</span>
          </div>
          <div className="flex-1 min-w-0">
            <RatingDistribution distribution={summary.distribution} total={summary.count} />
          </div>
        </div>
      )}

      {/* Write Review Form */}
      {showForm && (
        <ReviewForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      )}

      {/* User's existing review */}
      {userReview && !editingReview && (
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">Your Review</p>
          <ReviewCard
            review={userReview}
            isOwn
            onEdit={() => setEditingReview(userReview)}
            onDelete={() => removeReview(userReview.id)}
          />
        </div>
      )}
      {editingReview && (
        <ReviewForm
          initial={editingReview}
          onSubmit={(data) => handleEdit(editingReview.id, data)}
          onCancel={() => setEditingReview(null)}
        />
      )}

      {/* Sort */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort by:</span>
          {(['newest', 'highest', 'lowest'] as const).map((s) => (
            <button
              key={s}
              onClick={() => changeSort(s)}
              className="text-sm px-3 py-1 rounded-full border transition-colors data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:border-blue-600 border-slate-200 hover:border-blue-400 text-slate-600"
              data-active={s === 'newest' ? 'true' : undefined}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center text-slate-500 rounded-xl border border-slate-200">
          <p className="font-medium">No reviews yet</p>
          {canReview && <p className="text-sm mt-1">Be the first to share your experience</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.filter((r) => r.id !== userReview?.id).map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwn={false}
              onEdit={() => setEditingReview(review)}
              onDelete={() => removeReview(review.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => changePage(page - 1)}>Previous</Button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>Next</Button>
        </div>
      )}
    </section>
  );
}
