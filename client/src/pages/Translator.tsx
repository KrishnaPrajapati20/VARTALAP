import { useState } from "react";
import axios from "axios";

function Translator() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hi");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const translateText = async () => {
    if (!text.trim()) {
      alert("Please enter text");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/translate", {
        text,
        to: language,
      });

      setResult(res.data.translated);
    } catch (error: any) {
      setResult(error?.response?.data?.message || "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h1>🌐 Vartalap Translator</h1>

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Example: I love you, How are you, Good morning my friend"
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          fontSize: "16px",
        }}
      />

      <br />
      <br />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          marginRight: "10px",
        }}
      >
        <option value="hi">Hindi</option>
        <option value="en">English</option>
        <option value="bn">Bengali</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
        <option value="mr">Marathi</option>
      </select>

      <button
        onClick={translateText}
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        {loading ? "Translating..." : "Translate"}
      </button>

      <h2>Result:</h2>
      <p style={{ fontSize: "22px", background: "#1e293b", padding: "15px", borderRadius: "10px" }}>
        {result}
      </p>
    </div>
  );
}

export default Translator;