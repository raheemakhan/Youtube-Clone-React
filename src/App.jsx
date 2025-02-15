import React, { useState } from 'react';  // ✅ useState ko import karo
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/navbar';
import Home from './pages/home/home';
import Video from './pages/video/video';

const App = () => {
  const [sidebar, setSidebar] = useState(true); // ✅ useState use karna zaroori hai

  return (
    <div>
      <Navbar setSidebar={setSidebar} /> {/* ✅ setSidebar pass ho raha hai */}
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar} />} />
        <Route path='/video/:categoryId/:videoId' element={<Video />} />
      </Routes>
    </div>
  );
};

export default App;
