import React, { useEffect, useRef, useState } from 'react';
import { GetVideos } from '../services/UserService';
import LikesComponents from './LikesComponents';
import NavigationComponent from './NavigationComponent';

const VideoComponent = () => {
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const touchStartY = useRef(0);
  const playbackPromiseRef = useRef(null);

  const getdata = async () => {
    try {
      setIsLoading(true);
      const result = await GetVideos();
      setVideos(result.hits);
      const likeResult = result.hits.map((item) => ({
        like: item.likes,
        isLiked: false
      }));
      setLikes(likeResult);

      if (videoRef.current) {
        videoRef.current.src = result.hits[currentIndex].videos.large.url;
        // Automatically play the first video after setting the source
        safePlayVideo();
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const safePlayVideo = async () => {
    if (videoRef.current) {
      try {
        setIsLoading(true);
        playbackPromiseRef.current = videoRef.current.play();
        await playbackPromiseRef.current;
        setIsPlaying(true);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const safePauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCurrentVideo = async (value) => {
    setCurrentIndex(prev => {
      const newIndex = prev + value;
      if (newIndex >= 0 && newIndex < videos.length) {
        if (videoRef.current) {
          safePauseVideo();
          videoRef.current.src = videos[newIndex].videos.large.url;
          safePlayVideo();
        }
        setProgress(0);
        return newIndex;
      }
      return prev;
    });
  };

  const handleVideoClick = async (event) => {
    event.stopPropagation();
    if (isLoading) return;

    if (isPlaying) {
      safePauseVideo();
    } else {
      safePlayVideo();
    }
  };

  const handleChangeLike = (index, value, condition) => {
    setLikes(prev =>
      prev.map((item, i) =>
        i === index ? { like: value, isLiked: condition } : item
      )
    );
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isLoading) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;

    if (deltaY > 50 && currentIndex > 0) {
      handleCurrentVideo(-1);
    } else if (deltaY < -50 && currentIndex < videos.length - 1) {
      handleCurrentVideo(1);
    }
  };

  useEffect(() => {
    getdata();
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    const handleVideoEnded = () => {
      setIsPlaying(false);
      // Optionally, you can auto-play the next video when current one ends
      if (currentIndex < videos.length - 1) {
        handleCurrentVideo(1);
      }
    };

    const handleVideoError = (error) => {
      console.error('Video error:', error);
      setIsPlaying(false);
      setIsLoading(false);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handleVideoEnded);
      video.addEventListener('error', handleVideoError);
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnded);
        video.removeEventListener('error', handleVideoError);
      }
    };
  }, [currentIndex, videos.length]); // Added dependencies for handleVideoEnded

  useEffect(() => {
    const updateProgress = () => {
      const video = videoRef.current;
      if (video) {
        const percentage = (video.currentTime / video.duration) * 100;
        setProgress(percentage);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', updateProgress);
      return () => {
        video.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-4">
      {/* Navigation Component - Now outside on larger screens */}
      <div className="hidden md:flex items-center justify-center">
        <NavigationComponent
          handleCurrentVideo={handleCurrentVideo}
          currentIndex={currentIndex}
        />
      </div>

      {/* Video Container */}
      <div className="relative flex flex-col items-center justify-center w-full sm:w-[384px] bg-black rounded-xl overflow-hidden">
        <div
          className="relative w-full aspect-[9/16]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            muted // Added muted attribute to ensure autoplay works on most browsers
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="relative w-full h-1 bg-gray-600 rounded-full">
              <div 
                className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Likes Component */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
          <LikesComponents
            index={currentIndex}
            data={likes[currentIndex]}
            handleChangeLike={handleChangeLike}
          />
        </div>

        {/* Mobile Navigation - Only visible on small screens */}
        <div className="md:hidden absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
          <NavigationComponent
            handleCurrentVideo={handleCurrentVideo}
            currentIndex={currentIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;