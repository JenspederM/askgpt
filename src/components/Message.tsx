import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { CodeProps } from 'react-markdown/lib/ast-to-react'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export function Message({
  role,
  content,
  waiting,
}: {
  role?: string
  content?: string
  waiting?: boolean
}) {
  const CodeBox = ({ inline, className, children, ...codeProps }: CodeProps) => {
    const copy = () => {
      navigator.clipboard.writeText(children as string)
    }
    const match = /language-(\w+)/.exec(className || '')
    const _className =
      role === 'user'
        ? 'bg-primary-focus overflow-x-scroll w-fit p-1 font-mono'
        : 'bg-secondary-focus overflow-x-scroll w-fit'
    return !inline && match ? (
      <div className='relative'>
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, '')} // eslint-disable-line
          style={dark}
          language={match[1]}
          PreTag='div'
        />
        <button className='absolute top-2 right-2 text-4xl' onClick={copy}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='fill-current h-6 w-6'
          >
            <path fill='none' d='M0 0h24v24H0z' />
            <path d='M7 4V2h10v2h3.007c.548 0 .993.445.993.993v16.014a.994.994 0 0 1-.993.993H3.993A.994.994 0 0 1 3 21.007V4.993C3 4.445 3.445 4 3.993 4H7zm0 2H5v14h14V6h-2v2H7V6zm2-2v2h6V4H9z' />
          </svg>
        </button>
      </div>
    ) : (
      <code className={_className}>{children}</code>
    )
  }

  return (
    <div className={`chat  ${role !== 'user' ? 'chat-start ' : 'chat-end '}`}>
      <div
        className={`chat-bubble ${
          role === 'user'
            ? 'chat-bubble-primary'
            : role === 'error'
            ? 'chat-bubble-error'
            : 'chat-bubble-secondary'
        }`}
      >
        {waiting ? (
          <div className='flex items-center justify-center'>
            <div className='spinner'></div>
            <div className='ml-2'>Loading...</div>
          </div>
        ) : (
          <ReactMarkdown
            components={{
              code: CodeBox,
            }}
          >
            {content || 'Loading...'}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}
