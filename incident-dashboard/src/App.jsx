import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {

    axios.get("http://localhost:8080/api/incidents")
      .then(res => setIncidents(res.data))
      .catch(err => console.error(err));

  }, []);

  const createIncident = async () => {

    await axios.post("http://localhost:8080/api/incidents", {
      title,
      category,
      priority
    });

    setTitle("");
    setCategory("");
    setPriority("");

    // reload incidents
    axios.get("http://localhost:8080/api/incidents")
      .then(res => setIncidents(res.data));

  };

  return (

    <div style={{padding:"40px", fontFamily:"Arial"}}>

      <h1>Incident Monitoring Dashboard</h1>

      <h2>Create Incident</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <input
        placeholder="Category"
        value={category}
        onChange={(e)=>setCategory(e.target.value)}
      />

      <input
        placeholder="Priority"
        value={priority}
        onChange={(e)=>setPriority(e.target.value)}
      />

      <button onClick={createIncident}>Submit</button>

      <hr/>

      <h2>Incidents</h2>

      {incidents.map((i)=>(
        <div key={i.id} style={{border:"1px solid gray", padding:"10px", margin:"10px"}}>
          <h3>{i.title}</h3>
          <p>Category: {i.category}</p>
          <p>Priority: {i.priority}</p>
        </div>
      ))}

    </div>

  );
}

export default App;