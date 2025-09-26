

import React from 'react'

const myaccount = () => {
  return (
    <>
    
    
    <iframe
        src={`${process.env.WP_BASE_URL}/drsderma-wp/account/`}
        className="w-[100%] h-[150%] border rounded-xl shadow-lg"
        style={{ border: "none" }}
         sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        title="External Page"
      />
    
    </>
  )
}

export default myaccount;