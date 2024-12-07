import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import styles from "./Navbar.module.css"; 
import logo from "../../assets/dustfreehublogo.png";
import { auth, db } from "../../firebase/firebase";

function Navbar({ user }) {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisibleProfile, setIsDropdownVisibleProfile] = useState(false);
  const [categories, setCategories] = useState([]);

  console.log(user);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,  // Firestore document ID
        name: doc.data().name,  // Assuming 'name' is the field
      }));
      setCategories(categoriesList);  // Set the categories to the state
    };

    fetchCategories();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleMouseEnter = () => {
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownVisible(false);
  };

  const handleMouseEnterProfile = () => {
    setIsDropdownVisibleProfile(true);
  };

  const handleMouseLeaveProfile = () => {
    setIsDropdownVisibleProfile(false);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/");
    }).catch((error) => {
      console.error("Logout Error:", error.message);
    });
  }

  return (
    <div className={styles.header}>
      <img src={logo} alt="Dust Free Hub Logo" className={styles.dustLogo} onClick={() => handleNavigation("/home")} />
      <div className={styles.navbar}>
        <span onClick={() => handleNavigation("/")}>Home</span>

        <span
          className={styles.navItemWithDropdown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Explore
          {isDropdownVisible && (
            <div className={styles.dropdown}>
              {/* Add "All" option to show all categories */}
              <span onClick={() => handleNavigation("/explore")}>All Cleaning</span>

              {/* Dynamically generate dropdown options with docuID */}
              {categories.map((category) => (
                <span
                  key={category.id}
                  onClick={() => handleNavigation(`/explore?category=${category.id}`)}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </span>

        <span onClick={() => handleNavigation("/about")}>About</span>
        <span onClick={() => handleNavigation("/contact")}>Contact</span>
      </div>
      <div className={styles.userDetailsHolder}>
        {user ? (
          <div
            className={styles.navItemWithDropdown}
            onMouseEnter={handleMouseEnterProfile}
            onMouseLeave={handleMouseLeaveProfile}
          >
            <i className="fa-solid fa-user" style={{fontSize:"1.5rem", color:"white", textShadow: "0 0 3px black", cursor:"pointer"}}></i>
            {isDropdownVisibleProfile && (
              <div className={styles.dropdownProfile}>
                <span onClick={() => handleNavigation("/profiledetails")}>Profile</span>
                <span onClick={handleLogout}>Logout</span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.loginButton} onClick={() => handleNavigation("/login")}>Login</div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

