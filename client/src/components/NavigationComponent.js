import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const NavigationComponent = ({handleCurrentVideo, currentIndex}) => {
    return (
        <div className='my-auto flex flex-col gap-6 pr-1'>
            {currentIndex !== 0 && (
                <button
                    className="p-2 rounded-full hover:bg-gray-600/10 transition-colors"
                    onClick={() => handleCurrentVideo(-1)}
                >
                    <ChevronUp className="h-6 w-6 text-gray-800" />
                </button>
            )}
            <button
                className="p-2 rounded-full hover:bg-gray-600/10 transition-colors"
                onClick={() => handleCurrentVideo(1)}
            >
                <ChevronDown className="h-6 w-6 text-gray-800" />
            </button>
        </div>
    );
}

export default NavigationComponent;