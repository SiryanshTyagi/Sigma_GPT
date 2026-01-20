// Remove the broken Clerk import line
import AndroidOutlinedIcon from "@mui/icons-material/AndroidOutlined"; // Fixed source
import SensorDoorOutlinedIcon from "@mui/icons-material/SensorDoorOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import "./Sidebar.css";
import { useAuth, UserButton } from "@clerk/clerk-react";

export default function SideBar({
  newchat,
  titles,
  onSelectChat,
  activeId,
  onDeleteChat,
  isCollapsed,
  setIsCollapsed,
}) {
  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {/* MOBILE ONLY: Show close icon to hide drawer */}
        <div className="mobile-only-close">
          <IconButton
            onClick={() => setIsCollapsed(true)}
            sx={{ color: "#ececec" }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        {!isCollapsed && (
          <AndroidOutlinedIcon sx={{ fontSize: 40, color: "#ececec" }} />
        )}

        {/* DESKTOP ONLY: Door toggle */}
        <div className="desktop-only-toggle">
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{
              color: "#ececec",
              margin: isCollapsed ? "0 auto" : "0",
            }}
          >
            <SensorDoorOutlinedIcon />
          </IconButton>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <Button
            onClick={newchat}
            fullWidth
            startIcon={
              <span style={{ fontSize: "20px", marginRight: "8px" }}>+</span>
            }
            sx={{
              color: "#ececec",
              borderColor: "#4d4d4d",
              textTransform: "none",
              justifyContent: "flex-start",
              padding: "10px 16px",
              borderRadius: "8px",
              mb: 2,
              "&:hover": { backgroundColor: "#2f2f2f" },
            }}
          >
            New Chat
          </Button>

          <div className="history">
            <p className="history-label">Recent Chats</p>
            <ul>
              {titles.map((chat) => (
                <li
                  key={chat._id}
                  className={`chat-item ${
                    activeId === chat._id ? "active" : ""
                  }`}
                  onClick={() => onSelectChat(chat._id)}
                >
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <span className="chat-title-text">{chat.title}</span>
                  <IconButton
                    className="delete-btn"
                    onClick={(e) => onDeleteChat(chat._id, e)}
                    sx={{ color: "#676767", padding: "4px", ml: "auto" }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
