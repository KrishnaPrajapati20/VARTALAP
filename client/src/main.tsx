import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateMeeting from "./pages/CreateMeeting";
import MeetingRoom from "./pages/MeetingRoom";
import ChatRoom from "./pages/ChatRoom";
import Translator from "./pages/Translator";
import History from "./pages/History";
import ScheduleMeeting from "./pages/ScheduleMeeting";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <ScheduleMeeting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-meeting"
          element={
            <ProtectedRoute>
              <CreateMeeting />
            </ProtectedRoute>
          }
        />

       <Route 
       path="/meeting/:roomId" element={
       <MeetingRoom />
       } 
       />
          

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/translator"
          element={
            <ProtectedRoute>
              <Translator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);