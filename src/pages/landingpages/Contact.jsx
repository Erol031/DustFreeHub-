import React from "react";
import styles from "../landingpages/Contact.module.css";
import contactImage from "../../assets/contactImage.webp"
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


function Contact({user}) {


    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar user={user}/>
                <div className={styles.content}>
                    <div className={styles.parentCard}>
                        <img src={contactImage} alt="ShakeHands Image" />
                        <div className={styles.childCard1}>
                            <div className={styles.childHeader}>Partnership</div>
                            <div className={styles.childContent}>Partner with us to showcase your cleaning services on DustFreeHub!</div>
                        </div>
                        <div className={styles.childCard2}>
                            <div className={styles.detailsHolder}>
                                <div className={styles.contact}>
                                    <i class="fa-solid fa-phone" style={{fontSize:"2rem", color:"#8ab934"}}></i>
                                    <span style={{fontSize:"1rem", fontWeight:"bold"}}>Phone Number</span>
                                    <span style={{fontSize:"1rem"}}>09196812788</span>
                                </div>
                                <div className={styles.social}>
                                    <i class="fa-solid fa-link" style={{fontSize:"2rem", color:"#8ab934"}}></i>
                                    <span style={{fontSize:"1rem", fontWeight:"bold"}}>Social Media</span>
                                    <span style={{fontSize:"1rem"}}>dustfreehub@gmail.com</span>
                                </div>
                                <div className={styles.location}>
                                <i class="fa-solid fa-location-dot" style={{fontSize:"2rem", color:"#8ab934"}}></i>
                                    <span style={{fontSize:"1rem", fontWeight:"bold"}}>Address</span>
                                    <span style={{fontSize:"1rem"}}>San Fernando, Pampanga</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.contentHeader}>Contact Us for Assistance</div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
