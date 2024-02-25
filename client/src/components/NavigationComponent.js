import React from 'react'

const NavigationComponent = ({handleCurrentVideo,currentIndex}) => {
  return (
    <div className='my-auto flex flex-col gap-6 pr-1'>
        {currentIndex!==0&&<div className='rounded-full p-1 bg-gray-100'>
        <i className="fa-solid fa-angle-up fa-2xl hover:cursor-pointer"
        onClick={()=>handleCurrentVideo(-1)}
        >
        </i>
        </div>}
        <div className='rounded-full p-1 bg-gray-100'>
        <i className="fa-solid fa-angle-down fa-2xl hover:cursor-pointer"
        onClick={()=>handleCurrentVideo(1)}
        ></i>
        </div>
    </div>
  )
}

export default NavigationComponent