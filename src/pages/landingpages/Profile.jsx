import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Profile() {
    const [serviceDetails, setServiceDetails] = useState(null); // State to store service details
    const [averageRating, setAverageRating] = useState(null); // State to store the average rating
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate

    // Extract serviceId from query parameter
    const queryParams = new URLSearchParams(location.search);
    const serviceId = queryParams.get("view");

    // Fetch service details from Firestore based on serviceId
    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (serviceId) {
                try {
                    const serviceDoc = doc(db, "services", serviceId);
                    const serviceSnapshot = await getDoc(serviceDoc);

                    if (serviceSnapshot.exists()) {
                        setServiceDetails(serviceSnapshot.data()); // Store service data in state
                    } else {
                        console.error("No such service found!");
                    }
                } catch (error) {
                    console.error("Error fetching service details:", error);
                }
            }
        };

        fetchServiceDetails();
    }, [serviceId]);

    // Fetch rating data (totalReviews and totalRating) from the reviews collection
    useEffect(() => {
        const fetchRatingData = async () => {
            if (serviceId) {
                try {
                    const reviewsDoc = doc(db, "reviews", serviceId); // Referencing the reviews doc by serviceId
                    const reviewsSnapshot = await getDoc(reviewsDoc);

                    if (reviewsSnapshot.exists()) {
                        const reviewsData = reviewsSnapshot.data();
                        const totalReviews = reviewsData.totalReviews || 0;
                        const totalRating = reviewsData.totalRating || 0;

                        if (totalReviews > 0) {
                            // Calculate the average rating and round it
                            const average = Math.round(totalRating / totalReviews);
                            setAverageRating(average);
                        } else {
                            setAverageRating(0); // No reviews yet, set rating to 0
                        }
                    } else {
                        console.error("No reviews found for this service!");
                    }
                } catch (error) {
                    console.error("Error fetching review data:", error);
                }
            }
        };

        fetchRatingData();
    }, [serviceId]);

    // Function to render stars based on the average rating
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

    // Navigate to the reviews page with serviceId as a query parameter
    const handleNavigateToReviews = () => {
        if (serviceId) {
            navigate(`/reviews?view=${serviceId}`);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar />
                <div className={styles.content}>
                    <div className={styles.designCircle}></div>
                    <div className={styles.designCircle2}></div>
                    <div className={styles.firstContainer}>
                        <div className={styles.profileHolder}>
                            {serviceDetails ? (
                                <>
                                    <img
                                        src={serviceDetails.avatar || ""}
                                        alt={serviceDetails.serviceName || "Service Image"}
                                        className={styles.serviceImg}
                                    />
                                    <div className={styles.serviceDetails}>
                                        <div className={styles.serviceHeader}>
                                            {serviceDetails.serviceName}
                                        </div>
                                        <div className={styles.serviceDescription}>
                                            {serviceDetails.bio}
                                        </div>
                                        <div className={styles.revratingHolder}>
                                            <div
                                                className={styles.reviewsButton}
                                                onClick={handleNavigateToReviews} // Pass serviceId for navigation
                                            >
                                                Reviews
                                            </div>
                                            <div className={styles.rating}>
                                                {averageRating !== null
                                                    ? renderStars(averageRating)
                                                    : "Loading rating..."}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>Loading service details...</div>
                            )}
                        </div>
                        <div className={styles.bookingButton}>
                            {serviceDetails && serviceDetails.booking ? (
                                <a 
                                    href={serviceDetails.booking} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={styles.bookingLink} // Optional: Add styles for the link
                                >
                                    Book now!
                                </a>
                            ) : (
                                "Book now!"
                            )}
                        </div>
                    </div>
                    <div className={styles.subCategoryContainer}>
                        {serviceDetails && serviceDetails['sub-category']?.map((sub, index) => (
                            <div className={styles.card} key={index}>
                                <div className={styles.title}>{sub.title}</div>
                                <div className={styles.details}>{sub.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
