import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3000';

export default function ReviewsSection({ restaurantId, user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    fetch(`${API_BASE}/restaurants/${restaurantId}/reviews`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load reviews');
        return res.json();
      })
      .then(data => setReviews(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    loadReviews(); 
    // Reset form and editing state when restaurant changes
    setEditingId(null);
    setFormState({ rating: 5, comment: '' });
  }, [restaurantId]);

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_BASE}/restaurants/${restaurantId}/reviews/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete review');
      
      // Remove from local state for immediate UI update
      setReviews(prevReviews => prevReviews.filter(review => review._id !== id));
      
      // Refresh from server to ensure sync
      loadReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const beginEdit = review => {
    setEditingId(review._id);
    setFormState({ rating: review.rating, comment: review.comment });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormState({ rating: 5, comment: '' });
  };

  const submitEdit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `${API_BASE}/restaurants/${restaurantId}/reviews/${editingId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        }
      );
      
      if (!response.ok) throw new Error('Failed to update review');
      
      setEditingId(null);
      loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitNew = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `${API_BASE}/restaurants/${restaurantId}/reviews`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user._id, 
            rating: formState.rating, 
            comment: formState.comment 
          }),
        }
      );
      
      if (!response.ok) throw new Error('Failed to submit review');
      
      setFormState({ rating: 5, comment: '' });
      loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <svg 
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-blue-800 font-medium">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">Error: {error}</p>
              <p className="text-sm text-red-600 mt-1">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
          </svg>
          <p className="mt-2 text-gray-600">No reviews yet.</p>
          {user && (
            <p className="mt-2 text-gray-600">Be the first to share your experience!</p>
          )}
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
              {editingId === review._id ? (
                <form onSubmit={submitEdit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Edit Your Review</h3>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormState(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none"
                        >
                          <svg 
                            className={`h-8 w-8 ${formState.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-comment" className="block mb-2 text-sm font-medium text-gray-700">
                      Your Review
                    </label>
                    <textarea
                      id="edit-comment"
                      value={formState.comment}
                      onChange={e => setFormState(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-lg mr-3">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{review.user.name}</h3>
                        <time className="text-sm text-gray-500">{formatDate(review.createdAt)}</time>
                      </div>
                    </div>
                    <div>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <div className="my-3">
                    <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
                  </div>
                  
                  {user && user._id === review.user._id && (
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => beginEdit(review)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-md transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 rounded-md transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Review Form */}
      {user && editingId === null && (
        <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>
          
          <form onSubmit={submitNew} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Your Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <svg 
                      className={`h-8 w-8 ${formState.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 self-center text-gray-700">
                  {formState.rating}/5
                </span>
              </div>
            </div>
            
            <div>
              <label htmlFor="new-comment" className="block mb-2 text-sm font-medium text-gray-700">
                Your Review
              </label>
              <textarea
                id="new-comment"
                value={formState.comment}
                onChange={e => setFormState(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your experience at this restaurant..."
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}