"use client"

import { useState, useEffect } from "react"
import BookService from "../../services/bookService"
import { FirebaseService } from "../../services/firebaseService"
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog"
import Toast from "../../components/Toast/Toast"
import styles from "./BookList.module.css"

function BookList() {
  // Restore missing handlers
  const clearSearch = () => {
    setSearchTerm("")
  }

  const showToast = (message, type = "info") => {
    setToast({ message, type, show: true })
  }

  const hideToast = () => {
    setToast({ message: "", type: "", show: false })
  }

  const setBookLoading = (bookId, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [bookId]: isLoading,
    }))
  }

  const handleBorrowClick = (book) => {
    setConfirmDialog({
      isOpen: true,
      type: "borrow",
      bookId: book.id,
      bookTitle: book.title,
    })
  }

  const handleReturnClick = (book) => {
    setConfirmDialog({
      isOpen: true,
      type: "return",
      bookId: book.id,
      bookTitle: book.title,
    })
  }

  const handleConfirmBorrow = async () => {
    const { bookId } = confirmDialog
    setConfirmDialog({ isOpen: false, type: null, bookId: null, bookTitle: "" })
    setBookLoading(bookId, true)
    try {
      const result = await BookService.borrowBook(bookId)
      if (result.success) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId && book.available > 0 ? { ...book, available: book.available - 1 } : book,
          ),
        )
        showToast(result.message, "success")
      }
    } catch (error) {
      showToast(error.message, "error")
    } finally {
      setBookLoading(bookId, false)
    }
  }

  const handleConfirmReturn = async () => {
    const { bookId } = confirmDialog
    setConfirmDialog({ isOpen: false, type: null, bookId: null, bookTitle: "" })
    setBookLoading(bookId, true)
    try {
      const result = await BookService.returnBook(bookId)
      if (result.success) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId && book.available < book.quantity ? { ...book, available: book.available + 1 } : book,
          ),
        )
        showToast(result.message, "success")
      }
    } catch (error) {
      showToast(error.message, "error")
    } finally {
      setBookLoading(bookId, false)
    }
  }

  const handleCancelDialog = () => {
    setConfirmDialog({ isOpen: false, type: null, bookId: null, bookTitle: "" })
  }
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingStates, setLoadingStates] = useState({}) // Track loading state per book
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, bookId: null, bookTitle: "" })
  const [toast, setToast] = useState({ message: "", type: "", show: false })
  const [isLoadingBooks, setIsLoadingBooks] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      setIsLoadingBooks(true)
      try {
        const booksData = await FirebaseService.getAllBooks()
        setBooks(booksData)
      } catch (error) {
        setToast({ message: "Failed to load books.", type: "error", show: true })
      } finally {
        setIsLoadingBooks(false)
      }
    }
    fetchBooks()
  }, [])

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Library Books</h1>
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={clearSearch} className={styles.clearButton} type="button">
                ×
              </button>
            )}
          </div>
          {searchTerm && (
            <div className={styles.searchResults}>
              {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
            </div>
          )}
        </div>
      </div>

      {isLoadingBooks ? (
        <div className={styles.noResults}>Loading books...</div>
      ) : (
        <>
          <div className={styles.desktopView}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id}>
                      <td className={styles.titleCell}>{book.title}</td>
                      <td>{book.author}</td>
                      <td>
                        <span className={`${styles.status} ${book.available > 0 ? styles.available : styles.unavailable}`}>
                          {book.available > 0 ? `${book.available} available` : "Not available"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            onClick={() => handleBorrowClick(book)}
                            disabled={book.available === 0 || loadingStates[book.id]}
                            className={`${styles.button} ${styles.borrowButton}`}
                          >
                            {loadingStates[book.id] ? (
                              <span>
                                <span className={styles.spinner}></span>
                                Borrowing...
                              </span>
                            ) : (
                              "Borrow"
                            )}
                          </button>
                          <button
                            onClick={() => handleReturnClick(book)}
                            disabled={book.available === book.quantity || loadingStates[book.id]}
                            className={`${styles.button} ${styles.returnButton}`}
                          >
                            {loadingStates[book.id] ? (
                              <span>
                                <span className={styles.spinner}></span>
                                Returning...
                              </span>
                            ) : (
                              "Return"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.mobileView}>
            {filteredBooks.map((book) => (
              <div key={book.id} className={styles.bookCard}>
                <div className={styles.bookInfo}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>by {book.author}</p>
                  <div className={styles.bookStatus}>
                    <span className={`${styles.status} ${book.available > 0 ? styles.available : styles.unavailable}`}>
                      {book.available > 0 ? `${book.available} available` : "Not available"}
                    </span>
                  </div>
                </div>
                <div className={styles.bookActions}>
                  <button
                    onClick={() => handleBorrowClick(book)}
                    disabled={book.available === 0 || loadingStates[book.id]}
                    className={`${styles.button} ${styles.borrowButton}`}
                  >
                    {loadingStates[book.id] ? (
                      <>
                        <span className={styles.spinner}></span>
                        Borrowing...
                      </>
                    ) : (
                      "Borrow"
                    )}
                  </button>
                  <button
                    onClick={() => handleReturnClick(book)}
                    disabled={book.available === book.quantity || loadingStates[book.id]}
                    className={`${styles.button} ${styles.returnButton}`}
                  >
                    {loadingStates[book.id] ? (
                      <>
                        <span className={styles.spinner}></span>
                        Returning...
                      </>
                    ) : (
                      "Return"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className={styles.noResults}>
              {searchTerm ? `No books found matching "${searchTerm}"` : "No books available in the library."}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === "borrow" ? "Confirm Borrow" : "Confirm Return"}
        message={
          confirmDialog.type === "borrow"
            ? `Are you sure you want to borrow \"${confirmDialog.bookTitle}\"?`
            : `Are you sure you want to return \"${confirmDialog.bookTitle}\"?`
        }
        onConfirm={confirmDialog.type === "borrow" ? handleConfirmBorrow : handleConfirmReturn}
        onCancel={handleCancelDialog}
        confirmText={confirmDialog.type === "borrow" ? "Borrow" : "Return"}
      />

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

export default BookList
