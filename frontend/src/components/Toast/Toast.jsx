"use client"

import { useState, useEffect } from "react"
import styles from "./Toast.module.css"

function Toast({ message, type = "info", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!message) return null

  return (
    <div className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.content}>
        <span className={styles.icon}>
          {type === "success" && "✓"}
          {type === "error" && "✗"}
          {type === "info" && "ℹ"}
        </span>
        <span className={styles.message}>{message}</span>
      </div>
      <button onClick={() => setIsVisible(false)} className={styles.closeButton}>
        ×
      </button>
    </div>
  )
}

export default Toast
