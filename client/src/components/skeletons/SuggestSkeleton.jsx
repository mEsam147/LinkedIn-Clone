import React from 'react'

const SuggestSkeleton = () => {
  return (
    <div className=" my-4 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="skeleton size-8 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="skeleton h-4 w-16"></div>
            <div className="skeleton h-3 w-20"></div>
          </div>
        </div>
      </div>
      <div className="skeleton w-28 h-7"></div>
    </div>
  );
}

export default SuggestSkeleton
