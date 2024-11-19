import React from 'react';
import VideoComponent from './components/VideoComponent';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-pink-200">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-black mb-2 md:mb-0">Video Shorts</h1>
          <div className="flex gap-4">
            <div className="text-black opacity-75 text-sm md:hidden">
              Swipe up/down on mobile
            </div>
            <div className="hidden md:block text-black opacity-75 text-sm">
              Use arrow keys or buttons to navigate
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex justify-center items-center p-4 md:p-8">
          <VideoComponent />
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 bg-black/20 backdrop-blur-sm">
          <div className="max-w-[600px] mx-auto text-black/75 text-sm text-center">
            Click video to play/pause • {' '}
            <span className="hidden md:inline">Use navigation buttons to browse videos</span>
            <span className="md:hidden">Swipe to browse videos</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;