import React, { useEffect, useRef, useState } from 'react'
import { GetVideos } from '../services/UserService'
import LikesComponents from './LikesComponents'
import NavigationComponent from './NavigationComponent'


const VideoComponent = () => {

  const [Video, SetVideo] = useState([])
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null)
  const [Like, SetLike] = useState([])
  const [currentIndex, SetCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0);

  const touchStartY = useRef(0);



  const getdata = async () => {
    const result = await GetVideos()
    SetVideo(result.hits)
    const likeResult =
      result.hits.map((item) =>
      ({
        like: item.likes,
        isLiked: false
      }))
    SetLike(likeResult)

    if (videoRef.current) {
      videoRef.current.src = result.hits[currentIndex].videos.large.url
    }
  }


  const handleCurrentVideo = (value) => {
    SetCurrentIndex(currentIndex + value)
    if (videoRef.current) {
      videoRef.current.src = Video[currentIndex + value].videos.large.url
      videoRef.current.play();
    }
    setProgress(0)
    setIsPlaying(true)
  };

  const handleVideoClick = (event) => {
    event.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      }
      else {
        videoRef.current.play()
      }
    }

    setIsPlaying(!isPlaying);
  };

  const handleChangeLike = (index, value, condition) => {
    SetLike((prev) =>
      prev.map((item, i) =>
        i === index ? { like: value, isLiked: condition } : item
      )
    );
  };

  const handleShowButton = () => {
    const controls = document.querySelector('.video-controls');

    controls.classList.add('show');

    setTimeout(() => {
      controls.classList.remove('show');
    }, 3000);
  }

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;

    if (deltaY > 50) {
      handleCurrentVideo(-1)
    }
    else if (deltaY < -50) {
      handleCurrentVideo(1)
    }
  };


  useEffect(() => {
    getdata()
  }, [])

  useEffect(() => {
    const handleVideoEnded = () => {
      setIsPlaying(false);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('ended', handleVideoEnded);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnded);
      }
    };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const video = videoRef.current;
      const percentage = (video.currentTime / video.duration) * 100;
      setProgress(percentage);
    };

    const video = videoRef.current;

    video.addEventListener('timeupdate', updateProgress);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  return (
    <div className='h-screen m-auto flex flex-row py-2'>
      <div className='sm:flex hidden'>
        <NavigationComponent
          handleCurrentVideo={handleCurrentVideo}
          currentIndex={currentIndex}
        />
      </div>
      <div className='h-full bg-gray-700 shadow-lg rounded-xl max-w-[384px] w-auto relative video-container'
        onMouseOver={handleShowButton}
        onClick={handleShowButton}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className='video-controls '
        >
          {isPlaying ? (
            <div className=' m-auto  hover:cursor-pointer' onClick={handleVideoClick}>
              <i className={`fa-solid fa-pause fa-2xl`} ></i>
            </div>
          ) : (
            <div className=' m-auto hover:cursor-pointer'
              onClick={handleVideoClick}>
              <i className='fa-solid fa-play fa-2xl ' ></i>
            </div>
          )}
          <div className='phone-like right-0'>
            <LikesComponents
              index={currentIndex}
              data={Like[currentIndex]}
              handleChangeLike={handleChangeLike}
            />
          </div>
          <div
            className=" w-[97%] rounded-xl relative"
          >
            <div
              style={{ width: `${progress}%` }}
              className='bg-gray-300 h-2 absolute bottom-0 left-0 rounded-xl'
            >
            </div>
          </div>
        </div>
        <video className='h-full w-full cursor-pointer' ref={videoRef}>
        </video>
      </div>
      <div className='sm:flex hidden'>
        <LikesComponents
          index={currentIndex}
          data={Like[currentIndex]}
          handleChangeLike={handleChangeLike}
        />
      </div>
    </div>
  )
}

export default VideoComponent