import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Profile.module.css";
import Navbar from "./Navbar";

function Profile() {
    const [serviceDetails, setServiceDetails] = useState(null); // State to store service details
    const location = useLocation();

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

    return (
        <>
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
                                                <div className={styles.reviewsButton}>Reviews</div>
                                                <div className={styles.rating}>Rating</div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div>Loading service details...</div>
                                )}
                            </div>
                            <div className={styles.bookingButton}>
                                Book now!
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
        </>
    );
}

export default Profile;
