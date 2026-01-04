import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <Router>
      <Routes>
        {/* Route 1: The Home Page (List of Posts) */}
        <Route path="/" element={<Home />} />
        
        {/* Route 2: The Detail Page (Specific Post) */}
        {/* NTS: The ":id" part tells React this is a variable (like 1, 5, 99) */}
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  )
}

export default App