import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../landingpages/Explore.module.css";
import Navbar from "./Navbar";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";

function Explore() {
    const [services, setServices] = useState([]);
    const [categoryName, setCategoryName] = useState(""); // State for category name
    const location = useLocation();
    
    // Extract category from query string
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get("category");

    // Fetch the selected category name based on categoryId
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
    }, [categoryId]); // Re-run when categoryId changes

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar />
                <div className={styles.content}>
                    <span>Featured Providers:<span style={{ color: "#8ab934" }}>{categoryName}</span></span> 
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
