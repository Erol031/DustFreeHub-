import React from "react";
import styles from "../pages/Signup.module.css";
import logo from "../assets/dustfreehublogo.png";
import homeImage from "../assets/homeImage.jpg";
import { Navigate, useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleLoginRedirect = () => {
        navigate("/"); // Navigate to the home page when clicked
    };
    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <div className={styles.header}>
                    <img src={logo} alt="Dust Free Hub Logo" className={styles.dustLogo} />
                </div>
                <div className={styles.content}>
                    <div className={styles.designCircle}></div>
                    <div className={styles.designCircle2}></div>
                    <div className={styles.leftContent}>
                        <img src={homeImage} alt="Home" className={styles.homeImage} />
                    </div>
                    <div className={styles.rightContent}>
                        <div className={styles.loginHeader}>
                            <span>Create New Account</span>
                        </div>
                        <div className={styles.signinContent}>
                            <input type="text" placeholder="Name" />
                            <input type="text" placeholder="Email"/>
                            <input type="password" placeholder="Password" />
                            <div className={styles.signUpButton}>Signup</div>
                        </div>
                        <div className={styles.loginFooter}>
                            <span onClick={handleLoginRedirect}>Already have an account?</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
