require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");
const Chat = require("./Models/chat.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_ATLAS_URL)
  .then(() => console.log("Connected to MONGO ATLAS successfully"))
  .catch((err) => console.log("DB Connection Error:", err));

// DELETE a specific chat by ID
app.delete("/chats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChat = await Chat.findByIdAndDelete(id);
    if (!deletedChat) return res.status(404).json({ error: "Chat not found" });
    res.json({ message: "Chat deleted successfully", id });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Could not delete the chat" });
  }
});

// Fetch all chat titles for the sidebar filtered by Clerk userId
app.get("/chats/titles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Chat.find({ userId: userId })
      .select("title _id")
      .sort({ updatedAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Fetch Titles Error:", err);
    res.status(500).json({ error: "Could not fetch titles" });
  }
});

// Fetch full history for a specific chat
app.get("/chats/:id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: "Error fetching chat history" });
  }
});

// Main Chat Logic with AI Title Generation
app.post("/chats", async (req, res) => {
  try {
    const { userId, chatId, message } = req.body;
    let currentChat;

    if (chatId) {
      // SCENARIO A: Existing Chat
      currentChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { history: { role: "user", content: message } } },
        { new: true }
      );
    } else {
      // SCENARIO B: New Chat - Generate a smart title using AI
      const titleCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Create a 2-3 word summary title for this user request. Return ONLY the title text. No quotes, no periods.",
          },
          { role: "user", content: message },
        ],
        model: "llama-3.1-8b-instant", // Smaller model for fast title generation
      });

      const smartTitle =
        titleCompletion.choices[0]?.message?.content || "New Chat";

      currentChat = new Chat({
        userId: userId,
        title: smartTitle,
        history: [{ role: "user", content: message }],
      });
      await currentChat.save();
    }

    // Clean history for Groq
    const groqMessages = currentChat.history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get Main AI Completion
    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "";

    // Save AI reply to the same document
    const updatedChat = await Chat.findByIdAndUpdate(
      currentChat._id,
      { $push: { history: { role: "assistant", content: aiResponse } } },
      { new: true }
    );

    res.json(updatedChat);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("Root route is working.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
