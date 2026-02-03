// Reviews and Ratings Management (Supabase)

// Submit a review for a product
export async function submitReview(productId, rating, comment) {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
        throw new Error('Must be logged in to submit reviews');
    }

    // Get user data from profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

    // Add review
    const { error: reviewError } = await supabase
        .from('reviews')
        .insert([
            {
                product_id: productId,
                buyer_id: user.id,
                buyer_name: profile?.full_name || "Anonymous",
                rating: rating,
                comment: comment
            }
        ]);

    if (reviewError) throw reviewError;

    // Update product rating
    await updateProductRating(productId);
}

// Get all reviews for a product
export async function getProductReviews(productId) {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Update product's average rating
async function updateProductRating(productId) {
    const reviews = await getProductReviews(productId);

    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const { error } = await supabase
        .from('products')
        .update({
            avg_rating: avgRating,
            review_count: reviews.length
        })
        .eq('id', productId);

    if (error) throw error;
}

// Render star rating
export function renderStars(rating, size = "1rem") {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let html = '';
    for (let i = 0; i < fullStars; i++) {
        html += `<span style="color: #fbbf24; font-size: ${size};">★</span>`;
    }
    if (hasHalfStar) {
        html += `<span style="color: #fbbf24; font-size: ${size};">⯨</span>`;
    }
    for (let i = 0; i < emptyStars; i++) {
        html += `<span style="color: #e5e7eb; font-size: ${size};">★</span>`;
    }
    return html;
}
