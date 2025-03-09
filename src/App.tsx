import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StoryList from "./components/StoryList/StoryList";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <h2 style={{ textAlign: "center" }}>Instagram</h2>
      <StoryList />
    </div>
    </>
  )
}

export default App
