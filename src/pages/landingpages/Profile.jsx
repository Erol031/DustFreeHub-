import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Profile({user}) {
    const [serviceDetails, setServiceDetails] = useState(null); // State to store service details
    const [averageRating, setAverageRating] = useState(null); // State to store the average rating
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [checked, setChecked] = useState(false);
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

    const handleBookingSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        if (!user) {
            setShowLoginModal(true);
            return;
        }
    
        const formData = new FormData(e.target);
        const bookingData = {
            email: user.email,
            address: formData.get("address"),
            bookingDate: formData.get("bookingDate"),
            bookingTime: formData.get("bookingTime"),
            contactNumber: formData.get("contactNumber"),
            comment: formData.get("comment") || "",
            createdAt: new Date().toISOString(),
            serviceName: serviceDetails.serviceName || "",
            status: "pending",
        };
    
        // Collect all selected types of cleaning
        const typesOfCleaning = [];
        ["windowCleaning", "carCleaning", "airconCleaning", "carpetCleaning"].forEach((type) => {
            if (formData.get(type)) {
                typesOfCleaning.push(formData.get(type));
            }
        });
    
        // Add typesOfCleaning to bookingData if any selections exist
        if (typesOfCleaning.length) {
            bookingData.typesOfCleaning = typesOfCleaning;
        }
    
        try {
            const bookingDocRef = doc(db, "bookings", user.uid); // Document ID is the user ID
    
            // Check if the user's bookings document already exists
            const bookingSnapshot = await getDoc(bookingDocRef);
            if (bookingSnapshot.exists()) {
                // If the document exists, update the array for the given serviceId
                await updateDoc(bookingDocRef, {
                    [`${serviceId}`]: arrayUnion({
                        ...bookingData, // Directly add booking data as individual fields at index 0
                    }),
                });
            } else {
                // If the document does not exist, create it with the initial serviceId array and booking data
                await setDoc(bookingDocRef, {
                    [serviceId]: [
                        {
                            ...bookingData, // Directly add booking data as individual fields at index 0
                        },
                    ],
                });
            }
    
            alert("Booking submitted successfully!");
            setIsBookingModalOpen(false);
        } catch (error) {
            console.error("Error saving booking data:", error);
            alert("An error occurred while submitting the booking. Please try again.");
        }
    };    

    const handleBookingButtonClick = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
    
        try {
            // Reference to the user's bookings document
            const bookingDocRef = doc(db, "bookings", user.uid);
            const bookingSnapshot = await getDoc(bookingDocRef);
    
            if (bookingSnapshot.exists()) {
                // Get the current bookings for the user
                const userBookings = bookingSnapshot.data();
                
                // Check if the serviceId exists in the user's bookings
                if (userBookings[serviceId] && userBookings[serviceId].length > 0) {
                    alert("You already have a booking for this service. Please update or cancel your current booking.");
                } else {
                    // No existing booking for this service, open the booking modal
                    setIsBookingModalOpen(true);
                }
            } else {
                // No bookings document found for the user, open the booking modal
                setIsBookingModalOpen(true);
            }
        } catch (error) {
            console.error("Error checking booking:", error);
            alert("An error occurred while checking your booking. Please try again.");
        }
    };
    

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar user={user} />
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
                        <div className={styles.bookingButton} onClick={handleBookingButtonClick}>
                            Book Now!
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
            { isBookingModalOpen && (
                <>
                    <div className={styles.modal}>
                        <div className={styles.modalCard}>
                            <i className="fa-solid fa-xmark" onClick={() => setIsBookingModalOpen(false)}></i>
                            <div className={styles.headerModal}>Fill this up for Booking!</div>
                            <div className={styles.userDetailModal}>Signed in as: {!user ? "" : user.email}</div>
                            <div className={styles.modalForm}>
                                {/* Form fields */}
                                <span>Service:</span>
                                <div className={styles.serviceBox}>{serviceDetails.serviceName}</div>
                                <form onSubmit={handleBookingSubmit}>
                                    <span>Type of Cleaning</span>
                                    <div className={styles.checkboxModal}>
                                        <label>
                                            <input type="checkbox" name="windowCleaning" value="Window Cleaning" /> Window Cleaning ₱1,000
                                        </label>
                                        <label>
                                            <input type="checkbox" name="carCleaning" value="Car Interior Cleaning" /> Car Interior Cleaning ₱1,000
                                        </label>
                                        <label>
                                            <input type="checkbox" name="airconCleaning" value="Aircon Cleaning" /> Aircon Cleaning ₱1,000
                                        </label>
                                        <label>
                                            <input type="checkbox" name="carpetCleaning" value="Carpet Cleaning" /> Carpet Cleaning ₱1,000
                                        </label>
                                    </div>

                                    <div className={styles.detailsForm}>
                                        <div className={styles.dateSection}>
                                            <span>Booking Date</span>
                                            <input
                                                type="date"
                                                name="bookingDate"
                                                className={styles.dateBox}
                                                min={new Date().toISOString().split("T")[0]}
                                                required
                                            />
                                        </div>
                                        <div className={styles.dateSection}>
                                            <span>Time</span>
                                            <input
                                                type="time"
                                                name="bookingTime"
                                                className={styles.dateBox}
                                                required
                                            />
                                        </div>
                                        <div className={styles.dateSection}>
                                            <span>Address</span>
                                            <input
                                                type="text"
                                                name="address"
                                                className={styles.dateBox}
                                                required
                                            />
                                        </div>
                                        <div className={styles.dateSection}>
                                            <span>Contact Number</span>
                                            <input
                                                type="tel"
                                                name="contactNumber"
                                                className={styles.dateBox}
                                                pattern="\d{11}"
                                                title="Please enter an 11-digit phone number"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <span>Comment:</span>
                                    <input
                                        type="text"
                                        name="comment"
                                        className={styles.commentBox}
                                    />

                                    <span style={{color:"grey"}}>Note: Payment will be made at the time of service</span>

                                    <div className={styles.buttonHolder}>
                                        <input
                                            type="submit"
                                            className={styles.submitButton}
                                            value="Submit"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {showLoginModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowLoginModal(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.modalHeader}>Sign in to Dust Free Hub!</div>
                        <div className={styles.modalContent}>
                            <div className={styles.inputGroup}>
                                <button
                                    className={styles.submitButton2}
                                    onClick={() => {navigate("/login")}}
                                >
                                    Cotinue to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
