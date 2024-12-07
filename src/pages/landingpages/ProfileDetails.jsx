import React, { useEffect, useState } from "react";
import styles from './ProfileDetails.module.css';
import Navbar from "./Navbar";
import defaultimage from '../../assets/defaultImage.avif';
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase"; // Ensure db is correctly imported
import { doc, getDoc, setDoc } from "firebase/firestore";

function ProfileDetails({ user }) {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]); // State to store user's bookings

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Reference to the user's bookings document
                const bookingDocRef = doc(db, "bookings", user.uid);
                const bookingSnapshot = await getDoc(bookingDocRef);

                if (bookingSnapshot.exists()) {
                    const userBookings = bookingSnapshot.data();
                    // Check if the user has any bookings
                    if (userBookings) {
                        // Flatten the serviceIds array and set bookings state
                        const allBookings = [];
                        Object.keys(userBookings).forEach(serviceId => {
                            const serviceBookings = userBookings[serviceId];
                            serviceBookings.forEach(booking => {
                                allBookings.push({
                                    serviceId,
                                    ...booking, // Spread booking data
                                });
                            });
                        });
                        setBookings(allBookings); // Update state with all bookings
                    }
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        // Fetch bookings when component mounts
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "pending":
                return styles.pending;
            case "in progress":
                return styles.inProgress;
            case "rejected":
                return styles.rejected;
            default:
                return styles.defaultStatus; // For any unexpected status
        }
    };

    const handleDeleteBooking = async (serviceId) => {
        if (!user) return; // Ensure user is logged in
    
        try {
            // Reference the specific service in the user's bookings document
            const bookingDocRef = doc(db, "bookings", user.uid);
            const bookingSnapshot = await getDoc(bookingDocRef);
    
            if (bookingSnapshot.exists()) {
                const userBookings = bookingSnapshot.data();
                if (userBookings[serviceId]) {
                    // Remove the booking for the given serviceId
                    const updatedBookings = { ...userBookings };
                    delete updatedBookings[serviceId]; // Remove the serviceId key
    
                    // Update Firestore with the new data
                    await setDoc(bookingDocRef, updatedBookings);
                    alert("Booking canceled successfully!");
    
                    // Update local state to reflect changes
                    setBookings((prevBookings) =>
                        prevBookings.filter((booking) => booking.serviceId !== serviceId)
                    );
                } else {
                    alert("No booking found with the given service ID.");
                }
            } else {
                alert("No bookings found for the user.");
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
            alert("Failed to delete booking. Please try again.");
        }
    };
    
    
    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar user={user} />
                <div className={styles.content}>
                    <div className={styles.userCard}>
                        <img src={defaultimage} alt="Profile Image" className={styles.leftBox} />
                        <div className={styles.rightBox}>
                            <span>{user.displayName ? user.displayName : 'Guest'}</span>
                            <span>Email: {user.email}</span>
                        </div>
                    </div>
                    <div className={styles.secondBox}>
                        <div className={styles.bookingHolder}>
                            <span>My Bookings</span>
                            <div className={styles.bookingCard}>
                                {bookings.length > 0 ? (
                                    bookings.map((booking, index) => (
                                        <div key={index} className={styles.booking}>
                                            <div className={styles.text}>{booking.serviceName}</div>
                                            <div className={styles.textservice}>{booking.typesOfCleaning.join(", ")}</div>
                                            <div className={styles.text}>{formatDate(booking.bookingDate)}</div>
                                            <div className={`${styles.status} ${getStatusClass(booking.status || "pending")}`}>
                                                {booking.status || "pending"}
                                            </div>
                                            <i className="fa-solid fa-trash-can" style={{ cursor: "pointer" }} onClick={() => handleDeleteBooking(booking.serviceId)}></i>
                                        </div>
                                    ))
                                ) : (
                                    <div>No bookings found</div>
                                )}
                                <div className={styles.booking} style={{ cursor: "pointer" }} onClick={() => { navigate("/explore"); }}>
                                    <div className={styles.moreBook}>Book Now!</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.historyHolder}>
                            <span>History</span>
                            {/* Here you can map and display historical data similarly if needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileDetails;
