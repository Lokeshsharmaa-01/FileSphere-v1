import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'

function App() {
 
  const [diritems,setDiritems] = useState([])
  async function getdiritems() {
    const response = await fetch('http://192.168.0.198:4000/')
    const data = await response.json();
    console.log(data);
    
    setDiritems(data);
    
  }
  useEffect(()=>{
    getdiritems()
  },[])
  return (
    <>
    <h1> My Files</h1>
      {
        diritems.map((item)=>(
         
          <div>{item} <a href={`http:/192.168.0.198:4000/${item}?action=open`}>Open</a> <a href={`http:/192.168.0.198:4000/${item}?action=download`}>Download</a> <br/></div>
        ))
      }
    </>
  )
}

export default App
