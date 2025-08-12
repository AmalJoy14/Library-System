// Service layer for book operations using Firebase
import { FirebaseService } from "./firebaseService"

class BookService {
  static async borrowBook(bookId) {
    try {
      // Get current book data
      const books = await FirebaseService.getAllBooks()
      const book = books.find((b) => b.id === bookId)
      if (!book || book.available === 0) {
        throw new Error("Book is not available to borrow.")
      }
      await FirebaseService.updateBookAvailability(bookId, book.available - 1)
      await FirebaseService.logTransaction(bookId, "borrow")
      return { success: true, message: "Book borrowed successfully!" }
    } catch (error) {
      throw new Error(error.message || "Failed to borrow book. Please try again.")
    }
  }

  static async returnBook(bookId) {
    try {
      // Get current book data
      const books = await FirebaseService.getAllBooks()
      const book = books.find((b) => b.id === bookId)
      if (!book || book.available >= book.quantity) {
        throw new Error("All copies are already returned.")
      }
      await FirebaseService.updateBookAvailability(bookId, book.available + 1)
      await FirebaseService.logTransaction(bookId, "return")
      return { success: true, message: "Book returned successfully!" }
    } catch (error) {
      throw new Error(error.message || "Failed to return book. Please try again.")
    }
  }

  static async addBook(bookData) {
    try {
      const id = await FirebaseService.addBook(bookData)
      return { success: true, book: { id, ...bookData }, message: "Book added successfully!" }
    } catch (error) {
      throw new Error(error.message || "Failed to add book. Please try again.")
    }
  }
}

export default BookService
