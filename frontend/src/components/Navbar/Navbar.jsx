"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import styles from "./Navbar.module.css"

function Navbar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isActive = (path) => {
    if (path === "/books") {
      return location.pathname === "/books" || location.pathname === "/"
    }
    return location.pathname === path
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
          <span className={styles.logoIcon}>📚</span>
          <span className={styles.logoText}>Library System</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopLinks}>
          <Link to="/books" className={`${styles.link} ${isActive("/books") ? styles.active : ""}`}>
            <span className={styles.linkIcon}>📖</span>
            Books
          </Link>
          <Link to="/add-book" className={`${styles.link} ${isActive("/add-book") ? styles.active : ""}`}>
            <span className={styles.linkIcon}>➕</span>
            Add Book
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.mobileMenuButtonOpen : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileLinks}>
          <Link
            to="/books"
            className={`${styles.mobileLink} ${isActive("/books") ? styles.activeMobile : ""}`}
            onClick={closeMobileMenu}
          >
            <span className={styles.linkIcon}>📖</span>
            Books
          </Link>
          <Link
            to="/add-book"
            className={`${styles.mobileLink} ${isActive("/add-book") ? styles.activeMobile : ""}`}
            onClick={closeMobileMenu}
          >
            <span className={styles.linkIcon}>➕</span>
            Add Book
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className={styles.mobileOverlay} onClick={closeMobileMenu}></div>}
    </nav>
  )
}

export default Navbar
