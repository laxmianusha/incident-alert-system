import { useEffect, useState } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "Low"
  });

  useEffect(() => {
    fetchIncidents();
    connectWebSocket();
  }, []);

  const fetchIncidents = async () => {
    const res = await axios.get("http://localhost:8080/api/incidents");
    setIncidents(res.data.reverse());
  };

  const connectWebSocket = () => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");

      client.subscribe("/topic/incidents", (msg) => {
        const incident = JSON.parse(msg.body);
        setIncidents(prev => [incident, ...prev]);
      });
    };

    client.activate();
  };

  const createIncident = async () => {
    if (!form.title) return;

    await axios.post("http://localhost:8080/api/incidents", form);

    setForm({ title: "", category: "", priority: "Low" });
  };

  const resolveIncident = async (id) => {
    await axios.put(`http://localhost:8080/api/incidents/${id}/resolve`);

    setIncidents(prev =>
      prev.map(i => i.id === id ? { ...i, status: "RESOLVED" } : i)
    );
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") return { background: "#ff6b6b", color: "white" };
    if (priority === "Medium") return { background: "#ffa94d", color: "white" };
    return { background: "#51cf66", color: "white" };
  };

  const active = incidents.filter(i => i.status !== "RESOLVED");
  const resolved = incidents.filter(i => i.status === "RESOLVED");

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <h1 style={styles.title}>🚨 Incident Alert Management System</h1>

      {/* FORM CARD */}
      <div style={styles.formCard}>
        <input
          style={styles.input}
          placeholder="Incident title..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Category..."
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <select
          style={styles.input}
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button style={styles.button} onClick={createIncident}>
          + Create Incident
        </button>
      </div>

      {/* ACTIVE */}
      <h2 style={styles.section}>Active Incidents</h2>

      <div style={styles.grid}>
        {active.map(i => (
          <div key={i.id} style={styles.card}>
            <h3>{i.title}</h3>
            <p style={{ opacity: 0.7 }}>{i.category}</p>

            <span style={{ ...styles.badge, ...getPriorityStyle(i.priority) }}>
              {i.priority}
            </span>

            <p>Status: {i.status}</p>

            <button
              style={styles.resolveBtn}
              onClick={() => resolveIncident(i.id)}
            >
              Resolve
            </button>
          </div>
        ))}
      </div>

      {/* RESOLVED */}
      <h2 style={styles.section}>Resolved</h2>

      <div style={styles.grid}>
        {resolved.map(i => (
          <div key={i.id} style={{ ...styles.card, background: "#f1f3f5" }}>
            <h3>{i.title}</h3>
            <p>{i.category}</p>
            <p style={{ color: "#868e96" }}>RESOLVED</p>
          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(135deg, #3e2c23, #7f5539)",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Poppins, sans-serif"
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "white",
    fontSize: "36px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    textShadow: "0 4px 20px rgba(255,255,255,0.2)",
    },



  formCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "30px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minWidth: "150px"
  },

  button: {
    background: "#4dabf7",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  section: {
    margin: "25px 0 12px",
    color: "#ffd166",   // soft amber
    fontWeight: "600",
    letterSpacing: "0.5px",
    textShadow: "0 2px 10px rgba(255, 209, 102, 0.4)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px"
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    transition: "0.3s"
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    display: "inline-block",
    margin: "8px 0"
  },

  resolveBtn: {
    background: "#2f9e44",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default App;