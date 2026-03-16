import { useEffect, useState } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import "./App.css";

function App() {

  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {

    axios.get("http://localhost:8080/api/incidents")
      .then(res => setIncidents(res.data))
      .catch(err => console.error(err));

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000
    });

    client.onConnect = () => {

      client.subscribe("/topic/incidents", (message) => {

        const incident = JSON.parse(message.body);

        setIncidents(prev => [incident, ...prev]);

      });

    };

    client.activate();

    return () => client.deactivate();

  }, []);

  const createIncident = async () => {

    if (!title || !category || !priority) return;

    await axios.post("http://localhost:8080/api/incidents", {
      title,
      category,
      priority
    });

    setTitle("");
    setCategory("");
    setPriority("");

  };

  const resolveIncident = async (id) => {

    await axios.put(`http://localhost:8080/api/incidents/${id}/resolve`);

    setIncidents(prev =>
      prev.map(i =>
        i.id === id ? { ...i, status: "RESOLVED" } : i
      )
    );

  };

  const getPriorityClass = (priority) => {

    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    if (priority === "Low") return "priority-low";

    return "";

  };

  const getStatusClass = (status) => {

    if (status === "OPEN") return "status-open";
    if (status === "IN_PROGRESS") return "status-progress";
    if (status === "RESOLVED") return "status-resolved";

    return "";

  };

  const activeIncidents = incidents.filter(i => i.status !== "RESOLVED");
  const resolvedIncidents = incidents.filter(i => i.status === "RESOLVED");

  return (

    <div className="container">

      <h1 className="title">Incident Monitoring Dashboard</h1>

      <div className="form">

        <input
          placeholder="Incident title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e)=>setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button onClick={createIncident}>
          Report Incident
        </button>

      </div>

      <h2 className="section-title">Active Incidents</h2>

      <div className="incident-grid">

        {activeIncidents.map((i)=>(
          <div key={i.id} className="incident-card">

            <h3>{i.title}</h3>

            <p className="category">
              {i.category}
            </p>

            <p className={`priority ${getPriorityClass(i.priority)}`}>
              {i.priority}
            </p>

            <p className={`status ${getStatusClass(i.status)}`}>
              {i.status}
            </p>

            <button
              className="resolve-btn"
              onClick={()=>resolveIncident(i.id)}
            >
              Resolve
            </button>

          </div>
        ))}

      </div>

      <h2 className="section-title">Resolved Incidents</h2>

      <div className="incident-grid">

        {resolvedIncidents.map((i)=>(
          <div key={i.id} className="incident-card resolved">

            <h3>{i.title}</h3>

            <p>{i.category}</p>

            <p className={`priority ${getPriorityClass(i.priority)}`}>
              {i.priority}
            </p>

            <p className="status status-resolved">
              RESOLVED
            </p>

          </div>
        ))}

      </div>

    </div>

  );
}

export default App;