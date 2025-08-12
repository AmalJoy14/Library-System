"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BookService from "../../services/bookService"
import styles from "./AddBook.module.css"

function AddBook() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    quantity: 1,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required"
    }

    if (formData.isbn && !isValidISBN(formData.isbn)) {
      newErrors.isbn = "Please enter a valid ISBN format"
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1"
    }

    return newErrors
  }

  const isValidISBN = (isbn) => {
    // Basic ISBN validation (ISBN-10 or ISBN-13 format)
    const cleanISBN = isbn.replace(/[-\s]/g, "")
    return /^(\d{10}|\d{13})$/.test(cleanISBN)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) || 0 : value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Clear submit status when user makes changes
    if (submitStatus) {
      setSubmitStatus(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Using the BookService for consistent API handling
      const result = await BookService.addBook(formData)

      if (result.success) {
        setSubmitStatus("success")

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            title: "",
            author: "",
            isbn: "",
            quantity: 1,
          })
          navigate("/books")
        }, 1500)
      }
    } catch (error) {
      console.error("Error adding book:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add New Book</h1>
        <p className={styles.subtitle}>Add a new book to the library collection</p>
      </div>

      {submitStatus === "success" && (
        <div className={styles.statusMessage + " " + styles.success}>
          ✓ Book added successfully! Redirecting to books list...
        </div>
      )}

      {submitStatus === "error" && (
        <div className={styles.statusMessage + " " + styles.error}>✗ Failed to add book. Please try again.</div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
            placeholder="Enter book title"
            disabled={isSubmitting}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="author" className={styles.label}>
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className={`${styles.input} ${errors.author ? styles.inputError : ""}`}
            placeholder="Enter author name"
            disabled={isSubmitting}
          />
          {errors.author && <span className={styles.errorText}>{errors.author}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="isbn" className={styles.label}>
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className={`${styles.input} ${errors.isbn ? styles.inputError : ""}`}
            placeholder="Enter ISBN (e.g., 978-0-123456-78-9)"
            disabled={isSubmitting}
          />
          {errors.isbn && <span className={styles.errorText}>{errors.isbn}</span>}
          <small className={styles.helpText}>Optional: Enter 10 or 13 digit ISBN</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="quantity" className={styles.label}>
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            max="999"
            className={`${styles.input} ${errors.quantity ? styles.inputError : ""}`}
            placeholder="Enter quantity"
            disabled={isSubmitting}
          />
          {errors.quantity && <span className={styles.errorText}>{errors.quantity}</span>}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate("/books")}
            className={`${styles.button} ${styles.cancelButton}`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className={`${styles.button} ${styles.submitButton}`} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Adding Book...
              </>
            ) : (
              "Add Book"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddBook
