import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import styles from "./Reviews.module.css";
import Navbar from "./Navbar";

function Reviews() {
    const [serviceName, setServiceName] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [authEmail, setAuthEmail] = useState(null);
    const [comment, setComment] = useState("");
    const location = useLocation();

    // Extract serviceId from query parameter
    const queryParams = new URLSearchParams(location.search);
    const serviceId = queryParams.get("view");

    const serviceRef = serviceId ? doc(db, "services", serviceId) : null;

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setAuthEmail(user.email);
        }
    }, []);

    // Fetch service and reviews data from Firestore
    useEffect(() => {
        const fetchServiceData = async () => {
            if (serviceId) {
                try {
                    const serviceDoc = doc(db, "services", serviceId);
                    const serviceSnapshot = await getDoc(serviceDoc);

                    if (serviceSnapshot.exists()) {
                        setServiceName(serviceSnapshot.data().serviceName);
                    } else {
                        console.error("No such service found!");
                    }

                    const reviewsDoc = doc(db, "reviews", serviceId);
                    const reviewsSnapshot = await getDoc(reviewsDoc);

                    if (reviewsSnapshot.exists()) {
                        setReviews(reviewsSnapshot.data().reviews || []);
                    } else {
                        console.error("No reviews found for this service!");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchServiceData();
    }, [serviceId]);

    function renderStars(rating, maxStars = 5) {
        const roundedRating = Math.round(rating);
        const filledStars = "★".repeat(roundedRating);
        const emptyStars = "☆".repeat(maxStars - roundedRating);
        return (
            <span style={{ color: "#FFD700", fontSize: "1.2em" }}>
                {filledStars}
                {emptyStars}
            </span>
        );
    }

    const handleReviewSubmit = async () => {
        if (!selectedRating || !comment) {
            return;
        }
    
        try {
            if (!serviceId) {
                console.error("Service ID is missing.");
                return;
            }
    
            // Create a reference to the reviews collection where we will store this service's reviews
            const reviewsDocRef = doc(db, "reviews", serviceId);  // Using serviceId to identify the reviews document
    
            // Fetch the current reviews data to get existing reviews
            const reviewsSnapshot = await getDoc(reviewsDocRef);
    
            let updatedReviews = [];
            let newTotalReviews = 1;
            let newTotalRating = selectedRating;
    
            if (reviewsSnapshot.exists()) {
                const existingReviews = reviewsSnapshot.data().reviews || [];
                updatedReviews = [...existingReviews, { email: authEmail, rating: selectedRating, comment }];
                newTotalReviews = existingReviews.length + 1;  // Increment the total review count
                newTotalRating = existingReviews.reduce((acc, review) => acc + review.rating, 0) + selectedRating;  // Sum up the ratings
            } else {
                // No existing reviews document, start with the new review
                updatedReviews = [{ email: authEmail, rating: selectedRating, comment }];
            }
    
            // Update or create the reviews document for this service
            await updateDoc(reviewsDocRef, {
                reviews: updatedReviews,
                totalReviews: newTotalReviews,
                totalRating: newTotalRating
            });
    
            setShowModal(false);
            setComment("");
            setSelectedRating(0);
    
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };
    

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.pageContent}>
                    <Navbar />
                    <div className={styles.content}>
                        <div className={styles.contentHeader}>What our customers think about</div>
                        <div className={styles.placeHolder}>
                            <div className={styles.serviceName}>
                                {serviceName || "Loading..."}
                            </div>
                            <div
                                className={styles.dropReviewButton}
                                onClick={() => setShowModal(true)}
                            >
                                Drop a Review
                            </div>
                        </div>
                        <div className={styles.reviewHolder}>
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div className={styles.cardReview} key={index}>
                                        <div className={styles.email}>{review.email}</div>
                                        <div className={styles.rating}>
                                            {renderStars(Number(review.rating))}
                                        </div>
                                        <div className={styles.comment}>{review.comment}</div>
                                    </div>
                                ))
                            ) : (
                                <div>No reviews yet.</div>
                            )}
                        </div>
                    </div>

                    {showModal && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalContainer}>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setShowModal(false)}
                                >
                                    &times;
                                </button>
                                <div className={styles.modalHeader}>Drop a Review</div>
                                <div className={styles.modalContent}>
                                    <div className={styles.signedInAs}>
                                        Signed in as: <span>{authEmail || "Loading..."}</span>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="rating">Rating</label>
                                        <div className={styles.starWrap}>
                                            {[5, 4, 3, 2, 1].map((ratingValue) => (
                                                <React.Fragment key={ratingValue}>
                                                    <input
                                                        type="radio"
                                                        id={`st-${ratingValue}`}
                                                        value={ratingValue}
                                                        name="star-radio"
                                                        checked={selectedRating === ratingValue}
                                                        onChange={() => setSelectedRating(ratingValue)}
                                                    />
                                                    <label htmlFor={`st-${ratingValue}`}>★</label>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="comment">Comment</label>
                                        <textarea
                                            id="comment"
                                            rows="4"
                                            className={styles.textareaField}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <button
                                            className={styles.submitButton}
                                            onClick={handleReviewSubmit}
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Reviews;
