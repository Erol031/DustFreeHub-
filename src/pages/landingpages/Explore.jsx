import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../landingpages/Explore.module.css";
import Navbar from "./Navbar";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";

function Explore() {
    const [services, setServices] = useState([]); // Store services data
    const [categoryName, setCategoryName] = useState(""); // Store category name
    const [ratings, setRatings] = useState({}); // Store ratings for each service
    const location = useLocation();
    const navigate = useNavigate(); // To navigate to the profile page

    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get("category");

    useEffect(() => {
        const fetchCategoryName = async () => {
            if (categoryId) {
                try {
                    const categoryDoc = doc(db, "categories", categoryId); // Get category doc by ID
                    const categorySnapshot = await getDoc(categoryDoc);
                    if (categorySnapshot.exists()) {
                        setCategoryName(categorySnapshot.data().name); // Set the category name
                    }
                } catch (error) {
                    console.error("Error fetching category name:", error);
                }
            }
        };

        fetchCategoryName();
    }, [categoryId]); // Re-run when categoryId changes

    // Fetch services data based on the categoryId or all services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                if (categoryId) {
                    // If categoryId is present, fetch services for that category
                    const categoryDoc = doc(db, "categories", categoryId);
                    const categorySnapshot = await getDoc(categoryDoc);
                    const servicesIdArray = categorySnapshot.data().servicesId || [];

                    const servicesQuery = query(
                        collection(db, "services"),
                        where("serviceId", "in", servicesIdArray)
                    );
                    const querySnapshot = await getDocs(servicesQuery);
                    const servicesData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setServices(servicesData);
                } else {
                    // If no category is selected, fetch all services
                    const servicesCollection = collection(db, "services");
                    const querySnapshot = await getDocs(servicesCollection);
                    const servicesData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setServices(servicesData);
                    setCategoryName(""); // Set default name for "All" category
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, [categoryId]);

    // Fetch and calculate the total rating for each service
    const fetchRatingData = async (serviceId) => {
        try {
            const reviewsDoc = doc(db, "reviews", serviceId); // Referencing the reviews doc by serviceId
            const reviewsSnapshot = await getDoc(reviewsDoc);

            if (reviewsSnapshot.exists()) {
                const reviewsData = reviewsSnapshot.data();
                const totalReviews = reviewsData.totalReviews || 0;
                const totalRating = reviewsData.totalRating || 0;

                if (totalReviews > 0) {
                    // Calculate the average rating and round it
                    return Math.round(totalRating / totalReviews);
                }
            }
        } catch (error) {
            console.error("Error fetching review data:", error);
        }
        return 0; // Default rating if no reviews found
    };

    // Load ratings when services change
    useEffect(() => {
        const loadRatings = async () => {
            const ratingsData = {};
            for (const service of services) {
                const rating = await fetchRatingData(service.serviceId);
                ratingsData[service.id] = rating;
            }
            setRatings(ratingsData); // Set ratings state for each service
        };

        if (services.length > 0) {
            loadRatings();
        }
    }, [services]);

    // Function to render star ratings
    const renderStars = (rating) => {
        const totalStars = 5;
        let filledStars = Math.round(rating);
        let emptyStars = totalStars - filledStars;

        const filled = "★";
        const empty = "☆";

        return (
            <>
                {Array(filledStars).fill(filled)}
                {Array(emptyStars).fill(empty)}
            </>
        );
    };

    const handleViewProfile = (serviceId) => {
        console.log(`Service ID: ${serviceId}`); // Debug: Log the service ID
        navigate(`/profile?view=${serviceId}`);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar />
                <div className={styles.content}>
                    <span>Featured Providers: <span style={{ color: "#8ab934" }}>{categoryName}</span></span>
                    <div className={styles.headerContent}>
                        <div className={styles.cardGroup}>
                            {services.map((service) => (
                                <div className={styles.card} key={service.id}>
                                    <img src={service.avatar} alt={service.serviceName} />
                                    <div className={styles.serviceHeader}>{service.serviceName}</div>
                                    <div className={styles.serviceBio}>{service.bio}</div>
                                    <div className={styles.serviceRating}>
                                        {ratings[service.id] !== undefined ? (
                                            <div>{renderStars(ratings[service.id])}</div>
                                        ) : (
                                            <div>Loading rating...</div>
                                        )}
                                    </div>
                                    <div
                                        className={styles.serviceButton}
                                        onClick={() => handleViewProfile(service.serviceId)}
                                    >
                                        View Profile
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Explore;
