import { useEffect, useRef, useState } from 'react'

const daisyThemes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
].sort((a, b) => a.localeCompare(b))

export function SettingsMenu() {
  const [hideMenu, setHideMenu] = useState(true)
  const [theme, setTheme] = useState('dark')
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setHideMenu(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme) {
      applyTheme(theme)
    } else {
      applyTheme('dark')
    }
  }, [])

  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    setTheme(theme)
    setHideMenu(true)
  }

  return (
    <div ref={menuRef} className='flex flex-col absolute top-4 right-0 z-10'>
      <button className='self-end mb-6' onClick={() => setHideMenu(!hideMenu)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          className='fill-current h-6 w-6'
        >
          <path fill='none' d='M0 0h24v24H0z' />
          <path d='M8.686 4l2.607-2.607a1 1 0 0 1 1.414 0L15.314 4H19a1 1 0 0 1 1 1v3.686l2.607 2.607a1 1 0 0 1 0 1.414L20 15.314V19a1 1 0 0 1-1 1h-3.686l-2.607 2.607a1 1 0 0 1-1.414 0L8.686 20H5a1 1 0 0 1-1-1v-3.686l-2.607-2.607a1 1 0 0 1 0-1.414L4 8.686V5a1 1 0 0 1 1-1h3.686zM6 6v3.515L3.515 12 6 14.485V18h3.515L12 20.485 14.485 18H18v-3.515L20.485 12 18 9.515V6h-3.515L12 3.515 9.515 6H6zm6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' />
        </svg>
      </button>
      <div hidden={hideMenu} className='text-xs bg-base-300 p-2 rounded-lg '>
        <div className='space-y-1'>
          <div>Theme</div>
          <select
            value={theme}
            onChange={(e) => applyTheme(e.target.value)}
            className='select select-xs'
          >
            {daisyThemes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
