// Reviews and Ratings Management
import { db, auth } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Submit a review for a product
export async function submitReview(productId, rating, comment) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('Must be logged in to submit reviews');
    }

    // Get user data
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    // Add review
    await addDoc(collection(db, "reviews"), {
        productId: productId,
        buyerId: user.uid,
        buyerName: userData.name || "Anonymous",
        rating: rating,
        comment: comment,
        createdAt: new Date()
    });

    // Update product rating
    await updateProductRating(productId);
}

// Get all reviews for a product
export async function getProductReviews(productId) {
    const q = query(collection(db, "reviews"), where("productId", "==", productId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Update product's average rating
async function updateProductRating(productId) {
    const reviews = await getProductReviews(productId);

    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
        avgRating: avgRating,
        reviewCount: reviews.length
    });
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
