import React from 'react';
import { Heart } from 'lucide-react';

const LikesComponents = ({index, data, handleChangeLike}) => {
    const handleLike = () => {
        if(data && data.isLiked) {
            handleChangeLike(index, data.like-1, false);
        } else {
            handleChangeLike(index, data.like+1, true);
        }
    }
    
    return (
        <div className='my-auto pl-1 flex flex-col items-center gap-2'>
            <button
                className="p-2 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-colors"
                onClick={handleLike}
            >
                <Heart 
                    className={`h-6 w-6 ${data?.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                />
            </button>
            <span className="text-white text-sm font-medium">
                {data?.like || 0}
            </span>
        </div>
    );
}

export default LikesComponents;