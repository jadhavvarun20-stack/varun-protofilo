import '../styles/globals.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }){
  // basic accessibility: remove focus outline on mouse users
  useEffect(()=>{
    const handleMouse = ()=>document.body.classList.add('using-mouse')
    const handleKey = ()=>document.body.classList.remove('using-mouse')
    window.addEventListener('mousedown', handleMouse)
    window.addEventListener('keydown', handleKey)
    return ()=>{window.removeEventListener('mousedown', handleMouse);window.removeEventListener('keydown', handleKey)}
  },[])
  return <Component {...pageProps} />
}
