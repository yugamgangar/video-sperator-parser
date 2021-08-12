import React from 'react';
import './styles/app.scss'
import VideoSegmentor from './components/VideoSegmentor'
import VideoCombiner from './components/VideoCombiner'

function App() {
  return (
    <div className="App">
      <VideoSegmentor />
      <br />
      <VideoCombiner />
    </div>
  );
}

export default App;
