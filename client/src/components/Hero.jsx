import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
    const navigate=useNavigate();
  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'>
      <div className='text-center mb-6'>
        <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>Create amazing content <br/> with <span className='text-[#5044E5]'>AI tools</span></h1>
        <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>QuickAI is a comprehensive AI platform with 8 powerful tools. Generate articles, create images, chat with AI, summarize content, and much more - all in one place.</p>
        
        {/* Feature Pills */}
        <div className='flex flex-wrap justify-center gap-2 mt-6 max-w-2xl mx-auto'>
          <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium'>AI Chat</span>
          <span className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium'>Image Generation</span>
          <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium'>Text Summarizer</span>
          <span className='bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium'>Resume Review</span>
          <span className='bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium'>Content Creation</span>
        </div>
      </div>
      <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
        <button onClick={()=>navigate('/ai')} className='bg-[#5044E5] text-white px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition'>Start creating now</button>
        <button className='bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition'>Watch demo</button>
      </div>
      {/* Stats */}
      <div className='flex flex-wrap justify-center gap-8 mt-8 text-center'>
        <div className='text-gray-600'>
          <div className='text-2xl font-bold text-[#5044E5]'>8</div>
          <div className='text-sm'>AI Tools</div>
        </div>
        <div className='text-gray-600'>
          <div className='text-2xl font-bold text-[#5044E5]'>10k+</div>
          <div className='text-sm'>Users</div>
        </div>
        <div className='text-gray-600'>
          <div className='text-2xl font-bold text-[#5044E5]'>50k+</div>
          <div className='text-sm'>Creations</div>
        </div>
        <div className='text-gray-600'>
          <div className='text-2xl font-bold text-[#5044E5]'>99%</div>
          <div className='text-sm'>Satisfaction</div>
        </div>
      </div>
    </div>
  )
}

export default Hero
