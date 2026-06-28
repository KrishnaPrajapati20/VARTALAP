import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateMeeting() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const createMeeting = async () => {
    try {
      const roomId = "vartalap-" + Date.now();

      await axios.post("https://vartalap-backend-hz3z.onrender.com/api/meetings", {
        roomId,
        createdBy: user.name || "Vartalap User",
        creatorEmail: user.email || "user@vartalap.com",
      });

      navigate(`/meeting/${roomId}`);
    } catch (error) {
      alert("Meeting create nahi ho payi");
      console.log(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "grid",
        placeItems: "center",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      <button
        onClick={createMeeting}
        style={{
          padding: "15px 25px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          background: "#22c55e",
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        🎥 Create Meeting
      </button>
    </div>
  );
}

export default CreateMeeting;