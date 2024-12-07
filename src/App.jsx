import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase/firebase'
import './App.css';
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Home from './pages/landingpages/Home';
import Explore from './pages/landingpages/Explore';
import About from './pages/landingpages/About';
import Contact from './pages/landingpages/Contact';
import Navbar from './pages/landingpages/Navbar';
import Profile from './pages/landingpages/Profile';
import Reviews from './pages/landingpages/Reviews';
import ProfileDetails from './pages/landingpages/ProfileDetails';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/login" element={<HomePage user={user}/>} />
          <Route path="/signup" element={<Signup user={user}/>} />
          <Route path="/" element={<Home user={user}/>} />
          <Route path="/explore" element={<Explore user={user}/>} />
          <Route path="/about" element={<About user={user}/>} />
          <Route path="/contact" element={<Contact user={user}/>} />
          <Route path="/profile" element={<Profile user={user}/>} />
          <Route path="/reviews" element={<Reviews user={user}/>} />
          <Route path="/profiledetails" element={<ProfileDetails user={user}/>} />
          <Route element={<Navbar user={user}/>} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default function AnimatedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
