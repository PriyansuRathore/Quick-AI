import { useEffect } from 'react'
import React,{useState} from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
  const [creations , setCreations]=useState([])
  const [loading , setLoading]=useState(true)
  const { getToken } = useAuth()
  const getDashboardData=async()=>{
    try{
      const{data}=await axios.get('https://quick-ai-server-nu-ten.vercel.app/api/user/get-user-creations',{
        headers:{Authorization:`Bearer ${await getToken()}`}
      })
      if(data.success){
        setCreations(data.creations)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
    setLoading(false)
  }
  useEffect(()=>{
    getDashboardData()
  },[])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Dashboard</h1>
        <p className='text-gray-600'>Track your AI creations and usage</p>
      </div>
      
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/*Total Creations Card*/}
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-blue-600 text-sm font-medium'>Total Creations</p>
              <h2 className='text-3xl font-bold text-blue-800 mt-1'>{creations.length}</h2>
              <p className='text-blue-500 text-xs mt-1'>All time</p>
            </div>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
              <Sparkles className='w-6 text-white'/>
            </div>
          </div>
        </div>
        
        {/*Active Plan Card*/}
        <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-purple-600 text-sm font-medium'>Active Plan</p>
              <h2 className='text-2xl font-bold text-purple-800 mt-1'>
                <Protect plan='premium' fallback='Free'>Premium</Protect>
              </h2>
              <p className='text-purple-500 text-xs mt-1'>Current subscription</p>
            </div>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
              <Gem className='w-6 text-white'/>
            </div>
          </div>
        </div>
        
        {/* This Week Card */}
        <div className='bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-green-600 text-sm font-medium'>This Week</p>
              <h2 className='text-3xl font-bold text-green-800 mt-1'>{Math.min(creations.length, 12)}</h2>
              <p className='text-green-500 text-xs mt-1'>New creations</p>
            </div>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white flex justify-center items-center'>
              <Sparkles className='w-6 text-white'/>
            </div>
          </div>
        </div>
        
        {/* Features Used Card */}
        <div className='bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-200'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-orange-600 text-sm font-medium'>Features Used</p>
              <h2 className='text-3xl font-bold text-orange-800 mt-1'>8</h2>
              <p className='text-orange-500 text-xs mt-1'>AI tools available</p>
            </div>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white flex justify-center items-center'>
              <Gem className='w-6 text-white'/>
            </div>
          </div>
        </div>
      </div>
      {
       loading ?  
      (
        <div className='flex justify-center items-center h-3/4'>
          <div className='animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent'></div>
        </div>  
      )
      :
      (
        <div className='space-y-3'>
          <p className='mt-6 mb-4'>Recent Creations</p>
          {
            creations.map((item)=><CreationItem key={item.id} item={item}/>)
          }
        </div>
      )
      }
    </div>
  ) 
}

export default Dashboard


