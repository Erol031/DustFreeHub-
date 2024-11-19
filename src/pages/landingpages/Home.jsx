import React from "react";
import styles from "../landingpages/Home.module.css";
import logo from "../../assets/dustfreehublogo.png";
import home from "../../assets/home.webp";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function HomePage() {

    const navigate = useNavigate();

    const handleExplore = () => {
        navigate("/reviews");
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar/>
                <div className={styles.content}>
                    <div className={styles.designCircle}></div>
                    <div className={styles.designCircle2}></div>
                    <div className={styles.leftContent}>
                        <img src={home} alt="Home" className={styles.homeImage} />
                    </div>
                    <div className={styles.rightContent}>
                        <div className={styles.rcHeader}>Sparking Clean Starts Here</div>
                        <div className={styles.rcContent}>Find Trusted Cleaners in Pampanga on DustFreeHub!</div>
                        <div className={styles.exploreButton} onClick={handleExplore}>Explore now</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
