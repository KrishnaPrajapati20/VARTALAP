import { useState } from "react";
import axios from "axios";
import {
  FiArrowLeft,
  FiCopy,
  FiGlobe,
  FiRefreshCw,
  FiSend,
  FiVolume2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Translator.css";

const API_URL = "https://vartalap-backend-hz3z.onrender.com";

function Translator() {
  const navigate = useNavigate();

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

      const res = await axios.post(`${API_URL}/api/translate`, {
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

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    alert("Translation copied!");
  };

  const speakResult = () => {
    if (!result) return;

    const utterance = new SpeechSynthesisUtterance(result);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  const clearAll = () => {
    setText("");
    setResult("");
  };

  return (
    <div className="translator-page">
      <div className="translator-glow one"></div>
      <div className="translator-glow two"></div>

      <header className="translator-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          <FiArrowLeft /> Dashboard
        </button>

        <div>
          <p>Language Utility</p>
          <h1>Vartalap Translator</h1>
        </div>
      </header>

      <section className="translator-hero">
        <div>
          <span>
            <FiGlobe /> Smart Translation Workspace
          </span>
          <h2>Translate conversations into multiple Indian languages.</h2>
          <p>
            Type your message, select a target language and get clean translated text instantly.
          </p>
        </div>

        <div className="translator-mini-card">
          <FiGlobe />
          <strong>Fast Translate</strong>
          <small>Useful for chat, meetings and notes</small>
        </div>
      </section>

      <main className="translator-grid">
        <section className="translate-card">
          <div className="card-head">
            <div>
              <p>Input Text</p>
              <h3>Write Message</h3>
            </div>

            <button onClick={clearAll}>
              <FiRefreshCw /> Clear
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: Good morning my friend, how are you?"
          />

          <div className="translate-controls">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="hi">Hindi</option>
              <option value="en">English</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="mr">Marathi</option>
              <option value="gu">Gujarati</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
              <option value="pa">Punjabi</option>
              <option value="ur">Urdu</option>
            </select>

            <button onClick={translateText} disabled={loading}>
              <FiSend /> {loading ? "Translating..." : "Translate"}
            </button>
          </div>
        </section>

        <section className="translate-card result-card">
          <div className="card-head">
            <div>
              <p>Output</p>
              <h3>Translated Result</h3>
            </div>

            <div className="result-actions">
              <button onClick={copyResult}>
                <FiCopy />
              </button>
              <button onClick={speakResult}>
                <FiVolume2 />
              </button>
            </div>
          </div>

          <div className="result-box">
            {result ? (
              <p>{result}</p>
            ) : (
              <span>Your translated text will appear here.</span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Translator;