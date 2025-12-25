import React from 'react'
import './Loading.css'

const Loading = () => {
  return (
    <div className="loading-screen">
      <div className="open-book">
        <div className="left-page"></div>
        <div className="right-page"></div>
        <div className="turning-page"></div>
      </div>
      <h2 className="loading-text">kitabi…</h2>
      <p className="loading-sub">Please wait...</p>
    </div>





  )
}

export default Loading
