import React, { useState } from 'react'
import { MessageCircle, Upload, FileText } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Markdown from 'react-markdown'

const PdfChat = () => {
  const { getToken } = useAuth()
  const [pdfFile, setPdfFile] = useState(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [pdfUploaded, setPdfUploaded] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      setPdfUploaded(true)
      toast.success('PDF uploaded successfully!')
    } else {
      toast.error('Please upload a valid PDF file')
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!pdfFile) {
      toast.error('Please upload a PDF first')
      return
    }
    
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('pdf', pdfFile)
      formData.append('question', question)
      
      const { data } = await axios.post('https://quick-ai-server-nu-ten.vercel.app/api/ai/pdf-chat', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      
      if (data.success) {
        setAnswer(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start gap-4 text-slate-700'>
      {/* Left Column */}
      <div className='flex-1 max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <MessageCircle className='w-6 text-[#FF6B35]'/>
          <h1 className='text-xl font-semibold'>PDF Chat</h1>
        </div>
        
        {/* PDF Upload */}
        <div className='mt-6'>
          <p className='text-sm font-medium mb-2'>Upload PDF Document</p>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className='hidden'
              id='pdf-upload'
            />
            <label htmlFor='pdf-upload' className='cursor-pointer'>
              <FileText className='w-12 h-12 mx-auto text-gray-400 mb-2'/>
              <p className='text-sm text-gray-600'>
                {pdfUploaded ? `✅ ${pdfFile.name}` : 'Click to upload PDF (Max 10MB)'}
              </p>
            </label>
          </div>
        </div>

        {/* Question Input */}
        <form onSubmit={onSubmitHandler}>
          <p className='mt-6 text-sm font-medium'>Ask a Question</p>
          <textarea
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
            rows={4}
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
            placeholder='What is this document about? Summarize the key points...'
            required
          />
          
          <button
            disabled={loading || !pdfUploaded}
            className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50'
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            ) : (
              <MessageCircle className='w-5'/>
            )}
            Ask Question
          </button>
        </form>
      </div>

      {/* Right Column */}
      <div className='flex-1 max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <MessageCircle className='w-5 h-5 text-[#FF6B35]'/>
          <h1 className='text-xl font-semibold'>AI Response</h1>
        </div>
        
        {!answer ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <MessageCircle className='w-9 h-9'/>
              <p>Upload a PDF and ask a question to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
            <div className='reset-tw'>
              <Markdown>{answer}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PdfChat