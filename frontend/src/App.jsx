import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import InputBar from "./InputBar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import SideBar from "./SideBar.jsx";
import MenuIcon from "@mui/icons-material/Menu"; // New Import
import IconButton from "@mui/material/IconButton";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";

// Swap this with your Render URL after deploying the backend
const API_BASE = "https://sigmagpt-backend-lgjf.onrender.com";

function App() {
  let [messages, setMessages] = useState([]);
  let [allchats, setAllChats] = useState([]);
  let [activechatId, setActiveChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const newChat = () => {
    setMessages([]);
    setActiveChatId(null);
    if (window.innerWidth < 768) setIsCollapsed(true); // Close sidebar on mobile
  };

  const loadChat = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/chats/${id}`);
      setMessages(response.data.history);
      setActiveChatId(id);
      if (window.innerWidth < 768) setIsCollapsed(true); // Close sidebar on mobile
    } catch (err) {
      console.log("Error loading chat", err);
    }
  };

  const addMessage = async (newMessage) => {
    const userMess = { role: "user", content: newMessage };
    setMessages((prev) => [...prev, userMess]);
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE}/chats`, {
        message: newMessage,
        chatId: activechatId,
        userId: userId,
      });

      const fullHistory = response.data.history;
      const lastMessage = fullHistory[fullHistory.length - 1].content;
      setIsTyping(false);
      typeWriterEffect(lastMessage, fullHistory);

      if (!activechatId) {
        setActiveChatId(response.data._id);
        setAllChats((prev) => [
          { _id: response.data._id, title: response.data.title },
          ...prev,
        ]);
      }
    } catch (err) {
      setIsTyping(false);
      console.log("Error adding message", err);
    }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/chats/${id}`);
      setAllChats((prev) => prev.filter((chat) => chat._id !== id));
      if (activechatId === id) newChat();
    } catch (err) {
      console.log("Error deleting chat");
    }
  };

  useEffect(() => {
    const fetchTitles = async () => {
      if (isLoaded && userId) {
        setLoadingHistory(true);
        try {
          const res = await axios.get(`${API_BASE}/chats/titles/${userId}`);
          setAllChats(res.data);
          if (res.data.length > 0 && !activechatId) {
            loadChat(res.data[0]._id);
          }
        } catch (err) {
          console.log("Error fetching titles", err);
        } finally {
          setLoadingHistory(false);
        }
      }
    };
    fetchTitles();
  }, [isLoaded, userId]);

  const typeWriterEffect = (text, fullHistory) => {
    let words = text.split(" ");
    let currentText = "";
    setMessages([
      ...fullHistory.slice(0, -1),
      { role: "assistant", content: "" },
    ]);
    words.forEach((word, index) => {
      setTimeout(() => {
        currentText += word + " ";
        setMessages([
          ...fullHistory.slice(0, -1),
          { role: "assistant", content: currentText.trim() },
        ]);
      }, index * 40);
    });
  };

  if (!isLoaded) return <div className="loader">Initializing SIGMA GPT...</div>;

  return (
    <div className="container">
      <SignedIn>
        {/* MOBILE BACKDROP */}
        {!isCollapsed && window.innerWidth < 768 && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsCollapsed(true)}
          ></div>
        )}

        <SideBar
          newchat={newChat}
          titles={
            loadingHistory
              ? [{ _id: "loading", title: "Loading..." }]
              : allchats
          }
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onSelectChat={loadChat}
          activeId={activechatId}
          onDeleteChat={deleteChat}
        />

        <div className="chatside">
          <header className="main-header">
            {/* Show menu button only on mobile to open the drawer */}
            <div className="mobile-menu-btn">
              <IconButton
                onClick={() => setIsCollapsed(false)}
                sx={{ color: "#ececec" }}
              >
                <MenuIcon />
              </IconButton>
            </div>

            <span className="model-name">SIGMA GPT 5.2</span>
            <div className="user-profile">
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>
          <ChatWindow history={messages} isTyping={isTyping} />
          <InputBar onSent={addMessage} />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="landing-page">
          <div className="login-card">
            <div className="sigma-logo">Σ</div>
            <h2>SIGMA GPT</h2>
            <SignInButton mode="modal">
              <button className="premium-login-btn">Sign In to Continue</button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

export default App;
