import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Header from './Components/Header/Header';
import DetailsList from './pages/DetailList/DetailList';
import EnteredDocuments from "./pages/EnteredDocuments/EnteredDocuments";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/list" element={<div><Header /><DetailsList /></div>} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/entered-documents" element={<div><Header /><EnteredDocuments /></div>
  }
/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
