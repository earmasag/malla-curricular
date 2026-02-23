import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import  MateriaCard from './components/MateriaCard'

function App() {
  const [count, setCount] = useState(0)

  return (
<div className="min-h-screen flex items-center justify-center bg-gray-100">
      <MateriaCard/>
    </div>

  )
}

export default App
