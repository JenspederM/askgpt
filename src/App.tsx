import React, { useEffect, useRef, useState } from 'react'
import { SafeArea } from 'capacitor-plugin-safe-area'
import { SettingsMenu } from './components/SettingsMenu'
import { Message } from './components/Message'
import { SendIcon } from './components/SendIcon'
import ReloadPrompt from './components/ReloadPrompt'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [waiting, setWaiting] = useState(false)
  const messageViewRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    SafeArea.getSafeAreaInsets().then((res) => {
      const insets = res.insets
      document.documentElement.style.setProperty('--sat', `${insets.top}px`)
      document.documentElement.style.setProperty('--sab', `${insets.bottom}px`)
      document.documentElement.style.setProperty('--sal', `${Math.max(insets.left, 16)}px`)
      document.documentElement.style.setProperty('--sar', `${Math.max(insets.right, 16)}px`)
    })

    document.addEventListener('beforeInstallprompt', (event) => {
      console.log('beforeInstallprompt')
      event.preventDefault()
    })
  }, [])

  useEffect(() => {
    if (waiting && inputRef.current) {
      inputRef.current.disabled = true
    } else if (inputRef.current) {
      inputRef.current.disabled = false
      inputRef.current.focus()
    }
  }, [waiting])

  useEffect(() => {
    if (messageViewRef.current) {
      messageViewRef.current.scrollTop = messageViewRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (message === '') return
    const userMessage = { role: 'user', content: message }
    setWaiting(true)
    setMessages((prev) => [...prev, userMessage])

    const assistantMessage = await fetch('http://localhost:3000/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userMessage),
    }).then((res) => {
      return res.json()
    })

    setMessages((prev) => [...prev, assistantMessage])
    setMessage('')
    setWaiting(false)
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className='absolute inset-0 flex flex-col items-center pt-[var(--sat)] pb-[var(--sab)] pr-[var(--sar)] pl-[var(--sal)]'>
      <div className='flex flex-col w-full h-full max-w-4xl lg:py-4'>
        <div className='relative flex items-center justify-center bg-primary-500 text-4xl py-2 my-2 border-b-2 border-base-300 font-bold'>
          <div>AskGPT</div>
          <SettingsMenu />
        </div>
        <div
          ref={messageViewRef}
          className='flex flex-col w-full flex-grow overflow-y-auto space-y-2'
        >
          {messages.map((m, index) => (
            <Message key={index} role={m.role} content={m.content} />
          ))}
          {waiting && <progress className='progress progress-primary w-1/2' />}
        </div>
        <ReloadPrompt />
        <div className='flex mt-2'>
          <textarea
            autoFocus
            className='textarea textarea-bordered w-full rounded-r-none'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => handleEnter(e)}
            placeholder='Type here to start a conversation...'
            disabled={waiting}
            ref={inputRef}
          />
          <button
            className={`btn btn-primary rounded-l-none h-full ${waiting && 'btn-loading'}`}
            onClick={() => {
              sendMessage()
            }}
            disabled={waiting}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
