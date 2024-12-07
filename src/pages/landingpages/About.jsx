import React from "react";
import styles from "../landingpages/About.module.css";
import logo from "../../assets/dustfreehublogo.png";
import about from "../../assets/about.webp"
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


function About({user}) {

    
    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <Navbar user={user}/>
                <div className={styles.content}>
                    <div className={styles.designCircle}></div>
                    <div className={styles.designCircle2}></div>
                    <div className={styles.leftContent}>
                        <img src={about} alt="Home" className={styles.homeImage} />
                    </div>
                    <div className={styles.rightContent}>
                        <div className={styles.contentHeader}>What does Dust Free <span>Hub</span> Provides?</div>
                        <div className={styles.context}>
                            <div className={styles.text}>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>Trusted providers with verified ratings</span>
                            </div>
                            <div className={styles.text}>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>Real reviews from real people</span>
                            </div>
                            <div className={styles.text}>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>Wide selection of cleaning services</span>
                            </div>
                            <div className={styles.text}>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>Support local cleaning businesses</span>
                            </div>
                            <div className={styles.text}>
                                <i class="fa-solid fa-circle-check"></i>
                                <span>Marketing and visibility</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
