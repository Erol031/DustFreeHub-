import React from "react";
import styles from "../pages/HomePage.module.css";
import logo from "../assets/dustfreehublogo.png";
import homeImage from "../assets/homeImage.jpg";
import google from "../assets/google.webp";
import facebook from "../assets/facebook.png";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase"; 

function HomePage() {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await setDoc(
                doc(db, "users", user.uid), 
                {
                    id: user.uid,
                    email: user.email,
                },
                { merge: true }
            );

            console.log("Google Sign-In Success:", user);
            navigate(-1);
        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
        }
    };

    const handleFacebookSignIn = async () => {
        const provider = new FacebookAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
    
          // Store user details in Firestore
          await setDoc(
            doc(db, "users", user.uid),
            {
              id: user.uid,
              email: user.email,
            },
            { merge: true }
          );
    
          console.log("Facebook Sign-In Success:", user);
          navigate(-1);
        } catch (error) {
          console.error("Facebook Sign-In Error:", error.message);
        }      
    };

    const handleSignup = () => {
        navigate("/signup");
    }

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
                            <span>Login</span>
                            <div className={styles.continueToSignup}>Sign in to continue</div>
                        </div>
                        <div className={styles.loginContent}>
                            <div className={styles.signInGoogle} onClick={handleGoogleSignIn}>
                                <img src={google} alt="Google" />
                                <div className={styles.textHolder}>
                                    <span>Continue with Google</span>
                                </div>
                            </div>
                            {/* <div className={styles.signInFacebook} onClick={handleFacebookSignIn}>
                                <img src={facebook} alt="Facebook" />
                                <div className={styles.textHolder}>
                                    <span>Continue with Facebook</span>
                                </div>
                            </div> */}
                        </div>
                        {/* <div className={styles.loginFooter}>
                            <span onClick={handleSignup}>Sign up</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
