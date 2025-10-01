import React from 'react'
import {AiToolsData} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react';

const AiTools = () => {
    const navigate = useNavigate();
    const {user}=useUser();

  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24'>
      <div className='text-center mb-4'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>8 Powerful AI Tools</h2>
        <p className='text-gray-500 max-w-2xl mx-auto'>Everything you need to create, enhance, and optimize your content with cutting-edge AI technology. From content creation to image processing - all in one platform.</p>
        <div className='mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium'>
          <span className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></span>
          All tools powered by advanced AI
        </div>
      </div>
      <div className='flex flex-wrap  mt-10 justify-center'>
        {AiToolsData.map((tool,index)=>(
            <div key={index} className='group p-8 m-4 max-w-xs rounded-xl bg-white shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden' onClick={()=> user && navigate(tool.path)}>
                <div className='absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300' style={{background:`linear-gradient(to bottom right,${tool.bg.from},${tool.bg.to})`}}></div>
                <div className='relative z-10'>
                  <tool.Icon className='w-14 h-14 p-3 text-white rounded-xl group-hover:scale-110 transition-transform duration-300' style={{background:`linear-gradient(to bottom,${tool.bg.from},${tool.bg.to})`}}/>
                  <h3 className='mt-6 mb-3 text-lg font-semibold group-hover:text-gray-800 transition-colors'>{tool.title}</h3>
                  <p className='text-gray-500 text-sm leading-relaxed'>{tool.description}</p>
                  <div className='mt-4 text-xs text-gray-400 group-hover:text-gray-500 transition-colors'>Click to try →</div>
                </div>
            </div>    
        
        ))}

      </div>
    </div>
  )
}

export default AiTools
