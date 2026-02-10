import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);

  async function getDirectoryItems() {
    const response = await fetch("http://192.168.0.197/");
  
    const data = await response.json();
    setDirectoryItems(data);
  }
  useEffect(() => {
    getDirectoryItems();
  }, []);

  async function handleChange(e) {
    const file = e.target.files[0];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://192.168.0.198/", true);
    xhr.setRequestHeader("filename", file.name);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);
    });

    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(totalProgress.toFixed(2));
    });
    xhr.send(file);
  }
  async function handleDelete(filename) {
    console.log(filename);
    
    const response = await fetch('http://192.168.0.197/delete',{
      method : "DELETE",
      body : filename
    })
    const data = await response.text();
    console.log(data);
    
  }
  return (
    <>
      <h1>My Files</h1>
      <input type="file" onChange={handleChange} />
      <p>Progress: {progress}%</p>
      {directoryItems.map((item, i) => (
        <div key={i}>
          {item} <a href={`http://192.168.0.197/${item}?action=open`}>Open</a>{" "}
          <a href={`http://192.168.0.197/${item}?action=download`}>Download</a>
          <button>Rename</button>
          <button onClick={handleDelete(item)}>Delete</button>

          <br />
        </div>
      ))}
    </>
  );
}

export default App;
