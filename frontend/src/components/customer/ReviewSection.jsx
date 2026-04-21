import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User as UserIcon } from 'lucide-react';
import { restaurantService } from '../../services/restaurant.service';
import { useAuth } from '../../features/auth/AuthContext';
import toast from 'react-hot-toast';

const ReviewSection = ({ restaurantId, onRatingUpdate }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await restaurantService.getReviews(restaurantId);
                if (res.success) {
                    setReviews(res.data);
                }
            } catch (error) {
                console.error("Failed to load reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchReviews();
        }
    }, [restaurantId]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!rating) {
            toast.error("Please select a valid rating!");
            return;
        }

        try {
            setSubmitting(true);
            const res = await restaurantService.addReview(restaurantId, { rating, comment });
            
            if (res.success) {
                toast.success(res.message || "Review submitted successfully!");
                
                // Add new review to list (or update if already existed)
                setReviews((prev) => {
                    const newRev = res.data;
                    const existingIndex = prev.findIndex(r => r.id === newRev.id);
                    
                    // Ensure populated user data on the optimistic update
                    if (!newRev.user) {
                        newRev.user = { id: user?.id, fullName: user?.fullName || "You", avatar: user?.avatar };
                    }
                    if (existingIndex > -1) {
                        const updated = [...prev];
                        updated[existingIndex] = newRev;
                        return updated;
                    } else {
                        return [newRev, ...prev];
                    }
                });
                
                setComment(''); // clear after success
                
                // Trigger parent update so the top-level stats reflect this new rating instantly
                if (onRatingUpdate && res.restaurantStats) {
                    onRatingUpdate(res.restaurantStats.rating, res.restaurantStats.reviewCount);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (count, size = "w-4 h-4") => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${
                            star <= count ? "text-yellow-400 fill-yellow-400" : "text-neutral-200 fill-neutral-200"
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-100">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                    <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Customer Ratings</h2>
                    <p className="text-sm text-neutral-500 mt-1">See what others are saying or leave your own review.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                {/* Left Side: Submit Form */}
                <div className="md:col-span-1 space-y-6">
                    {isAuthenticated ? (
                        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 relative overflow-hidden group transition-all duration-300 hover:shadow-md">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all duration-500 group-hover:bg-indigo-200/50"></div>
                            
                            <h3 className="font-bold text-lg text-neutral-900 mb-4 flex items-center gap-2 relative z-10">
                                Rate your Experience
                            </h3>
                            
                            <form onSubmit={submitReview} className="relative z-10 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-8 h-8 transition-colors duration-200 ${
                                                        star <= (hoverRating || rating)
                                                            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                                            : "text-neutral-200 fill-neutral-200 hover:text-yellow-300"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs text-neutral-500 mt-2 block w-full text-right h-4">
                                        {(hoverRating || rating) === 1 ? 'Poor' : 
                                         (hoverRating || rating) === 2 ? 'Fair' : 
                                         (hoverRating || rating) === 3 ? 'Good' : 
                                         (hoverRating || rating) === 4 ? 'Very Good' : 
                                         (hoverRating || rating) === 5 ? 'Excellent!' : ''}
                                    </span>
                                </div>

                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Your Review (optional)
                                    </label>
                                    <textarea
                                        id="comment"
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="What did you love? What could be better?"
                                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center h-full min-h-[280px]">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-neutral-200 text-neutral-400">
                                <UserIcon className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-neutral-900 mb-2">Join the Community</h3>
                            <p className="text-sm text-neutral-500 mb-6">Log in to leave a review and share your experience with others.</p>
                            <button
                                onClick={() => window.dispatchEvent(new Event('open-login'))}
                                className="bg-neutral-200/50 hover:bg-neutral-200 text-neutral-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Log in to review
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Side: List of Reviews */}
                <div className="md:col-span-2">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-16 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 h-full flex flex-col items-center justify-center">
                            <Star className="w-12 h-12 text-neutral-300 mb-3" />
                            <h3 className="text-lg font-bold text-neutral-800">No Reviews Yet</h3>
                            <p className="text-neutral-500 mt-2 max-w-sm mx-auto text-sm">Be the first to share your experience with this restaurant!</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                            {reviews.map((rev) => (
                                <div key={rev.id} className="bg-white border text-sm border-neutral-100 rounded-xl p-5 hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            {rev.user?.avatar ? (
                                                <img 
                                                    src={rev.user.avatar} 
                                                    alt={rev.user.fullName || "User"} 
                                                    className="w-10 h-10 rounded-full object-cover border border-neutral-200" 
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border border-indigo-200/50 text-indigo-700 font-bold shadow-sm">
                                                    {(rev.user?.fullName || "A")[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-neutral-900 group-hover:text-indigo-700 transition-colors">
                                                    {rev.user?.fullName || "Anonymous"}
                                                </h4>
                                                <span className="text-xs text-neutral-400">
                                                    {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">
                                            {renderStars(rev.rating)}
                                        </div>
                                    </div>
                                    {rev.comment ? (
                                        <p className="text-neutral-700 leading-relaxed pl-[3.25rem] relative">
                                            <span className="absolute left-4 top-0 text-3xl text-neutral-200 font-serif opacity-50">"</span>
                                            {rev.comment}
                                        </p>
                                    ) : (
                                        <span className="text-neutral-400 italic text-xs pl-[3.25rem]">No comment provided.</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
