import { useState } from 'react'
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
