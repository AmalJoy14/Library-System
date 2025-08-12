import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import BookList from "./pages/BookList/BookList"
import AddBook from "./pages/AddBook/AddBook"
import styles from "./App.module.css"

function App() {
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/add-book" element={<AddBook />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
