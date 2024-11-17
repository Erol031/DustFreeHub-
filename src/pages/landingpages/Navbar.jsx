import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"; 
import logo from "../../assets/dustfreehublogo.png";

function Navbar() {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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

        {/* Explore with dropdown */}
        <span
          className={styles.navItemWithDropdown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Explore
          {isDropdownVisible && (
            <div className={styles.dropdown}>
              <span onClick={() => handleNavigation("/explore?category=window-cleaning")}>
                Window Cleaning
              </span>
              <span onClick={() => handleNavigation("/explore?category=car-interior-cleaning")}>
                Car Interior Cleaning
              </span>
              <span onClick={() => handleNavigation("/explore?category=aircon-cleaning")}>
                Aircon Cleaning
              </span>
              <span onClick={() => handleNavigation("/explore?category=carpet-cleaning")}>
                Carpet Cleaning
              </span>
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
