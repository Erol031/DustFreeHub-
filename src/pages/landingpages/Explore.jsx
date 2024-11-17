import React, { useState, useEffect } from "react";
import styles from "../landingpages/Explore.module.css";
import Navbar from "./Navbar";
import { db } from "../../firebase/firebase"; 
import { collection, getDocs } from "firebase/firestore";

function Explore() {
    const [services, setServices] = useState([]);

    // Fetch services data from Firestore
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesCollection = collection(db, "services");
                const querySnapshot = await getDocs(servicesCollection);
                const servicesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setServices(servicesData);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar />
                <div className={styles.content}>
                    <span>Featured Providers</span>
                    <div className={styles.headerContent}>
                        <div className={styles.cardGroup}>
                            {services.map((service) => (
                                <div className={styles.card} key={service.id}>
                                    <img src={service.avatar} alt={service.serviceName} />
                                    <div className={styles.serviceHeader}>{service.serviceName}</div>
                                    <div className={styles.serviceBio}>{service.bio}</div>
                                    <div className={styles.serviceRating}>Rating</div>
                                    <div className={styles.serviceButton}>View Profile</div>
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
