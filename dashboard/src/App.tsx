import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VideoList } from './pages/VideoList';
import { VideoUpload } from './pages/VideoUpload';
import { VideoEdit } from './pages/VideoEdit';
import { VideoMetrics } from './pages/VideoMetrics';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f8fafc' }}>
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/videos/:id/edit" element={<VideoEdit />} />
          <Route path="/videos/:id/metrics" element={<VideoMetrics />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 