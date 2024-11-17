import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import styles from "./Navbar.module.css"; 
import logo from "../../assets/dustfreehublogo.png";
import { db } from "../../firebase/firebase";

function Navbar() {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [categories, setCategories] = useState([]);

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

  return (
    <div className={styles.header}>
      <img src={logo} alt="Dust Free Hub Logo" className={styles.dustLogo} />
      <div className={styles.navbar}>
        <span onClick={() => handleNavigation("/home")}>Home</span>

        <span
          className={styles.navItemWithDropdown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Explore
          {isDropdownVisible && (
            <div className={styles.dropdown}>
              {/* Add "All" option to show all categories */}
              <span
                onClick={() => handleNavigation("/explore")}
              >
                General Cleaning
              </span>

              {/* Dynamically generate dropdown options with docuID */}
              {categories.map((category) => (
                <span
                  key={category.id}
                  onClick={() =>
                    handleNavigation(`/explore?category=${category.id}`)
                  }
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
    </div>
  );
}

export default Navbar;
