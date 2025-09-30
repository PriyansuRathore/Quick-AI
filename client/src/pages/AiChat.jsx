import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, Plus, User, Bot } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Markdown from 'react-markdown'

const AiChat = () => {
  const { getToken } = useAuth()
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const { data } = await axios.get('https://quick-ai-server-nu-ten.vercel.app/api/ai/conversations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setConversations(data.conversations)
        if (data.conversations.length > 0 && !currentConversation) {
          setCurrentConversation(data.conversations[0])
          loadMessages(data.conversations[0].id)
        }
      }
    } catch (error) {
      toast.error('Failed to load conversations')
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      const { data } = await axios.get(`https://quick-ai-server-nu-ten.vercel.app/api/ai/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      toast.error('Failed to load messages')
    }
  }

  const createNewConversation = async () => {
    try {
      const { data } = await axios.post('https://quick-ai-server-nu-ten.vercel.app/api/ai/create-conversation', 
        { title: 'New Chat' },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      if (data.success) {
        setConversations([data.conversation, ...conversations])
        setCurrentConversation(data.conversation)
        setMessages([])
      }
    } catch (error) {
      toast.error('Failed to create conversation')
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentConversation) return

    const userMessage = newMessage
    setNewMessage('')
    setLoading(true)

    // Add user message to UI immediately
    const tempUserMessage = {
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const { data } = await axios.post('https://quick-ai-server-nu-ten.vercel.app/api/ai/send-message',
        { conversationId: currentConversation.id, message: userMessage },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      
      if (data.success) {
        setMessages(prev => [...prev, data.message])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to send message')
    }
    setLoading(false)
  }

  return (
    <div className='h-full flex text-slate-700'>
      {/* Sidebar - Conversations */}
      <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
        <div className='p-4 border-b border-gray-200'>
          <button
            onClick={createNewConversation}
            className='w-full flex items-center gap-2 bg-gradient-to-r from-[#4A7AFF] to-[#9234EA] text-white px-4 py-2 rounded-lg hover:opacity-90'
          >
            <Plus className='w-4 h-4' />
            New Chat
          </button>
        </div>
        
        <div className='flex-1 overflow-y-auto p-2'>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setCurrentConversation(conv)
                loadMessages(conv.id)
              }}
              className={`p-3 rounded-lg cursor-pointer mb-2 ${
                currentConversation?.id === conv.id 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <h3 className='font-medium text-sm truncate'>{conv.title}</h3>
              <p className='text-xs text-gray-500 truncate mt-1'>
                {conv.last_message || 'No messages yet'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className='flex-1 flex flex-col'>
        {currentConversation ? (
          <>
            {/* Header */}
            <div className='p-4 border-b border-gray-200 bg-white'>
              <div className='flex items-center gap-3'>
                <MessageCircle className='w-6 h-6 text-[#4A7AFF]' />
                <h1 className='text-xl font-semibold'>{currentConversation.title}</h1>
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <div className='flex items-center gap-2 mb-1'>
                      {message.role === 'user' ? (
                        <User className='w-4 h-4' />
                      ) : (
                        <Bot className='w-4 h-4 text-[#4A7AFF]' />
                      )}
                      <span className='text-xs opacity-75'>
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                    </div>
                    <div className='text-sm'>
                      {message.role === 'assistant' ? (
                        <Markdown>{message.content}</Markdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className='flex justify-start mb-4'>
                  <div className='bg-white border border-gray-200 rounded-lg p-3'>
                    <div className='flex items-center gap-2'>
                      <Bot className='w-4 h-4 text-[#4A7AFF]' />
                      <span className='text-xs text-gray-500'>AI is typing...</span>
                    </div>
                    <div className='flex gap-1 mt-2'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className='p-4 bg-white border-t border-gray-200'>
              <div className='flex gap-2'>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className='flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className='px-4 py-3 bg-gradient-to-r from-[#4A7AFF] to-[#9234EA] text-white rounded-lg hover:opacity-90 disabled:opacity-50'
                >
                  <Send className='w-5 h-5' />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center bg-gray-50'>
            <div className='text-center'>
              <MessageCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h2 className='text-xl font-semibold text-gray-600 mb-2'>Welcome to AI Chat</h2>
              <p className='text-gray-500'>Start a new conversation to begin chatting with AI</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiChat