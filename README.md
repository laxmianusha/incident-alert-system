# 🚨 Incident Alert System

A full-stack real-time incident monitoring system where users can report issues and admins can track and resolve them instantly.

---

## 📌 Overview

This project helps organizations manage technical issues (like server downtime, network failures, etc.) efficiently.  
It provides real-time updates using WebSockets, so incidents appear instantly without refreshing the page.

---

## ⚙️ Tech Stack

### Frontend
- React (Vite)
- Axios
- STOMP + SockJS (WebSockets)

### Backend
- Spring Boot
- Spring WebSocket
- REST APIs

### Database
- MySQL

---

## 🚀 Features

- 📝 Report new incidents
- ⚡ Real-time updates (no page refresh)
- 📊 Active incidents dashboard
- ✅ Resolve incidents
- 📂 Resolved incidents history
- 🔴 Priority levels (High / Medium / Low)
- 🔄 WebSocket-based live updates

---

## 🧠 How It Works

1. User reports an incident from the dashboard
2. Backend saves it in MySQL
3. WebSocket publishes the event
4. Frontend receives it instantly
5. Incident appears live on dashboard

---

## 📂 Project Structure
