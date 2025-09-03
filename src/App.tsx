import './App.css'
import Home from './pages/Home/Home';
import ChatPage from './pages/Chat/ChatPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat/:moduleName" element={<ChatPage />} />
    </Routes>
  </Router>
  </>
  )
}

export default App
