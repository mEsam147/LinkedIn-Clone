import React from 'react'
import {motion} from 'framer-motion'

const PostAction = ({ icon, title, click }) => {
  return (
    <div className="flex items-center gap-x-2">
      <motion.span
      
        whileTap={{scale:0.6}}
        className="cursor-pointer" onClick={click}>{icon}</motion.span>
      <span className="text-sm">{title}</span>
    </div>
  );
};

export default PostAction
