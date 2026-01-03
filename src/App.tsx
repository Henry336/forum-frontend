import { useState, useEffect } from 'react'

interface Topic {
  Id:          number;
  Title:       string;
  Description: string;
}

function App() {
  const [topics, setTopics] = useState<Topic[]>([])
  useEffect(() => {
    fetch("http://localhost:8080")
      .then(response => response.json())
      .then(data => {
        console.log("Data received:", data)
        setTopics(data)
      })
      .catch(error => console.error("Error fetching data:", error))
  }, [])

  return (
    <div>
      <h1>CVWO Forum</h1>
      {topics.map((topic) => (
        <div key = {topic.Id} style = {{ border: "1px solid #ccc", padding: "10px", margin: "10px"}}>
          <h3>{topic.Title}</h3>
          <p>{topic.Description}</p>
        </div>
      ))}
    </div>
  )

}

export default App
