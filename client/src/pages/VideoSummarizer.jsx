import React, { useState } from 'react'
import { Video, Play, FileText, Copy, ExternalLink } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Markdown from 'react-markdown'

const VideoSummarizer = () => {
  const { getToken } = useAuth()
  const [manualText, setManualText] = useState('')
  const [summaryType, setSummaryType] = useState('detailed')
  const [summary, setSummary] = useState('')
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  const summaryTypes = [
    { value: 'brief', label: 'Brief Summary', desc: '2-3 sentences' },
    { value: 'detailed', label: 'Detailed Summary', desc: 'Key points & insights' },
    { value: 'bullets', label: 'Bullet Points', desc: 'Main topics listed' }
  ]

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    if (!manualText.trim()) {
      toast.error('Please enter text to summarize')
      return
    }
    
    try {
      setLoading(true)
      setSummary('')
      setTranscript('')
      
      const { data } = await axios.post('https://quick-ai-server-nu-ten.vercel.app/api/ai/summarize-text', {
        text: manualText,
        summaryType
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      
      if (data.success) {
        setSummary(data.summary)
        setTranscript(data.transcript)
        toast.success('Text summarized successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to summarize text')
    }
    setLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }



  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start gap-4 text-slate-700'>
      {/* Left Column - Input */}
      <div className='flex-1 max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Video className='w-6 text-[#FF4444]'/>
          <h1 className='text-xl font-semibold'>Text Summarizer</h1>
        </div>
        
        <form onSubmit={onSubmitHandler}>
          {/* Text Input */}
          <div className='mt-6'>
            <p className='text-sm font-medium mb-2'>Text to Summarize</p>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-red-500 h-32 resize-none'
              placeholder='Paste any text content here (articles, documents, transcripts, etc.)'
              required
            />
            <div className='flex justify-between items-center mt-1'>
              <p className='text-xs text-gray-500'>
                Paste articles, documents, transcripts, or any text you want summarized
              </p>
              <span className={`text-xs ${
                manualText.length < 50 ? 'text-red-500' : 
                manualText.length > 5000 ? 'text-orange-500' : 'text-green-500'
              }`}>
                {manualText.length} characters
              </span>
            </div>
          </div>

          {/* Summary Type */}
          <div className='mt-6'>
            <p className='text-sm font-medium mb-3'>Summary Type</p>
            <div className='grid grid-cols-1 gap-2'>
              {summaryTypes.map((type) => (
                <label key={type.value} className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                  summaryType === type.value 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className='flex items-center gap-3'>
                    <input
                      type="radio"
                      name="summaryType"
                      value={type.value}
                      checked={summaryType === type.value}
                      onChange={(e) => setSummaryType(e.target.value)}
                      className='text-red-500'
                    />
                    <div>
                      <span className='text-sm font-medium'>{type.label}</span>
                      <p className='text-xs text-gray-500'>{type.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <button
            disabled={loading || manualText.length < 50}
            className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#FF4444] to-[#FF6B6B] text-white px-4 py-3 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]'
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            ) : (
              <Video className='w-5'/>
            )}
            {loading ? 'Processing...' : manualText.length < 50 ? 'Enter at least 50 characters' : 'Summarize Text'}
          </button>
        </form>
      </div>

      {/* Right Column - Results */}
      <div className='flex-1 max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <FileText className='w-5 h-5 text-[#FF4444]'/>
            <h1 className='text-xl font-semibold'>AI Summary</h1>
          </div>
          {summary && (
            <button
              onClick={() => copyToClipboard(summary)}
              className='flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700'
            >
              <Copy className='w-4 h-4' />
              Copy
            </button>
          )}
        </div>
        
        {!summary ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-center max-w-sm'>
              <div className='w-16 h-16 bg-gradient-to-r from-[#FF4444] to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='w-8 h-8 text-white'/>
              </div>
              <h3 className='text-lg font-semibold text-gray-700 mb-2'>Ready to Summarize</h3>
              <p className='text-sm text-gray-500 mb-4'>Paste any text content to get an AI-powered summary</p>
              
              <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg text-left'>
                <p className='font-medium text-sm text-gray-700 mb-2'>✨ Perfect for:</p>
                <div className='space-y-1 text-xs text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                    <span>Articles & blog posts</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-purple-500 rounded-full'></div>
                    <span>Research papers & documents</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full'></div>
                    <span>Meeting notes & transcripts</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-red-500 rounded-full'></div>
                    <span>Long emails & reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='mt-4 flex-1'>
            <div className='bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4 border border-gray-200'>
              <div className='flex justify-between items-center mb-3 pb-2 border-b border-gray-200'>
                <span className='text-xs font-medium text-gray-600'>AI Summary</span>
                <div className='flex gap-3 text-xs text-gray-500'>
                  <span>{summary.split(' ').length} words</span>
                  <span>~{Math.ceil(summary.split(' ').length / 200)} min read</span>
                </div>
              </div>
              <div className='text-sm text-slate-600'>
                <Markdown>{summary}</Markdown>
              </div>
            </div>
            
            {transcript && (
              <div>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-2'
                >
                  <ExternalLink className='w-4 h-4' />
                  {showTranscript ? 'Hide' : 'Show'} Full Transcript
                </button>
                
                {showTranscript && (
                  <div className='bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto'>
                    <p className='text-xs text-gray-600 leading-relaxed'>{transcript}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoSummarizer