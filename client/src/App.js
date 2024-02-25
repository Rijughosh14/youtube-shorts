import './App.css';
import React from 'react'
import VideoComponent from './components/VideoComponent';


const App = () => {
  return (
    <div className='h-screen w-screen flex'>
      <div className='container bg-gradient-to-br from-blue-200 to-blue-100 shadow-lg m-auto h-screen rounded-lg flex '>
        <VideoComponent/>
      </div>
    </div>
  )
}


export default App;
