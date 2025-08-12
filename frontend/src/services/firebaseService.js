// Firebase service layer for Firestore operations
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../config/firebase.js"

const BOOKS_COLLECTION = "books"
const TRANSACTIONS_COLLECTION = "transactions"

export class FirebaseService {
  // Get all books
  static async getAllBooks() {
    try {
      const booksRef = collection(db, BOOKS_COLLECTION)
      const q = query(booksRef, orderBy("title"))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error("Error fetching books:", error)
      throw new Error("Failed to fetch books")
    }
  }

  // Add a new book
  static async addBook(bookData) {
    try {
      const booksRef = collection(db, BOOKS_COLLECTION)
      const docRef = await addDoc(booksRef, {
        ...bookData,
        available: bookData.quantity, // Initially all copies are available
        createdAt: serverTimestamp(),
      })

      return docRef.id
    } catch (error) {
      console.error("Error adding book:", error)
      throw new Error("Failed to add book")
    }
  }

  // Update book availability (for borrow/return)
  static async updateBookAvailability(bookId, newAvailableCount) {
    try {
      const bookRef = doc(db, BOOKS_COLLECTION, bookId)
      await updateDoc(bookRef, {
        available: newAvailableCount,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating book availability:", error)
      throw new Error("Failed to update book availability")
    }
  }

  // Delete a book
  static async deleteBook(bookId) {
    try {
      const bookRef = doc(db, BOOKS_COLLECTION, bookId)
      await deleteDoc(bookRef)
    } catch (error) {
      console.error("Error deleting book:", error)
      throw new Error("Failed to delete book")
    }
  }

  // Log transaction (borrow/return)
  static async logTransaction(bookId, action) {
    try {
      const transactionsRef = collection(db, TRANSACTIONS_COLLECTION)
      await addDoc(transactionsRef, {
        bookId,
        action, // 'borrow' or 'return'
        timestamp: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error logging transaction:", error)
      // Don't throw error for transaction logging to avoid blocking main operations
    }
  }

  // Get transaction history for a book
  static async getBookTransactions(bookId) {
    try {
      const transactionsRef = collection(db, TRANSACTIONS_COLLECTION)
      const q = query(transactionsRef, orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((transaction) => transaction.bookId === bookId)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw new Error("Failed to fetch transaction history")
    }
  }
}
