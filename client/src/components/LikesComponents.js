import React from 'react'

const LikesComponents = ({index,data,handleChangeLike}) => {

    const handleLike=()=>{
        if(data&&data.isLiked){
            handleChangeLike(index,data.like-1,false)
        }
        else{
            handleChangeLike(index,data.like+1,true)
        }
    }
    return (
        <div className='my-auto pl-1 flex flex-col items-center gap-2'>
            <div className='rounded-full bg-gray-100 p-3'>
            <i className="fa-regular fa-thumbs-up fa-2xl hover:cursor-pointer" 
            style={{"color":(data&&data.isLiked)?"blue":""}} 
            onClick={handleLike}>
            </i>
            </div>
            <p className='text-lg font-semibold'>
                {data&&data.like}
            </p>
        </div>
    )
}

export default LikesComponents