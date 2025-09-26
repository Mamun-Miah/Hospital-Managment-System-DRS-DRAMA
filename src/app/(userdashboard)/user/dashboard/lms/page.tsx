

import React from 'react'

const lms = () => {
  return (
    <>
    
    
    <iframe
        src={`${process.env.WP_BASE_URL}/dashboard/`}
        className="w-[100%] h-[150%] border rounded-xl shadow-lg"
        style={{ border: "none" }}
         sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        title="External Page"
      />
    
    </>
  )
}

export default lms;