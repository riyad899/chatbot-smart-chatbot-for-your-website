import { Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import ChatInterface from './components/ChatInterface'
import NotFound from './components/NotFound'
import './App.css'

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
