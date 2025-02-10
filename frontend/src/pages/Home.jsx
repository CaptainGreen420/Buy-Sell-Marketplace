import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Home = () => {
  const [rotate, setRotate] = useState(false);

  const handleImageClick = () => {
    setRotate(!rotate);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">

        <div className="md:w-1/2">
          <img 
            src={assets.buysell} 
            alt="Buy & Sell Marketplace" 
            className={`w-full h-64 md:h-full object-cover transform transition-transform duration-500 ${rotate ? 'rotate-180' : ''}`}
            onClick={handleImageClick}
          />
        </div>

        <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-black leading-tight">
            Buy & Sell
            <br /><br />
            Marketplace
          </h1>
        </div>
        
      </div>
    </div>
  )
}

export default Home