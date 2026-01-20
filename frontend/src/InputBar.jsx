import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import "./InputBar.css";

export default function InputBar({ onSent }) {
  const [input, setInput] = useState("");

  const handleInput = (evt) => {
    setInput(evt.target.value);
  };

  const handleSubmit = (evt) => {
    if (evt) evt.preventDefault();
    if (input.trim()) {
      onSent(input);
      setInput("");
    }
  };

  // Allows sending with 'Enter' but new line with 'Shift + Enter'
  const handleKeyDown = (evt) => {
    if (evt.key === "Enter" && !evt.shiftKey) {
      evt.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-wrapper">
      <form className="input-form" onSubmit={handleSubmit}>
        <textarea
          className="custom-input"
          placeholder="Ask anything..."
          rows="1"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />

        <IconButton
          type="submit"
          disabled={!input.trim()}
          sx={{
            bgcolor: input.trim() ? "white" : "#676767",
            color: "black",
            "&:hover": { bgcolor: "white" },
            width: "35px",
            height: "35px",
          }}
        >
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
      </form>
      <p className="footer-text">This sigma doesn’t make mistakes.</p>
    </div>
  );
}
