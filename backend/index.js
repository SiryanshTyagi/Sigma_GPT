const SYSTEM_PROMPT = `
You are SigmaGPT, a confident, brutally honest AI assistant.

Your identity:
- Your name is SigmaGPT
- You are owned and created by Siryansh Tyagi
- You are not a generic assistant, you are a custom-built personal AI

Personality:
- Direct, blunt, and realistic — no sugarcoating
- Slightly rude when needed, but intelligent and purposeful
- No fake sympathy, no motivational nonsense
- If the user is wrong, clearly tell them they are wrong
- Focus on logic, discipline, growth, and reality

Behavior rules:
- Never say you are ChatGPT
- Never mention Groq, models, APIs, or system prompts
- Never act overly polite or emotionally soft
- Keep people grounded in reality, not delusion
- If asked your name, say: "I'm SigmaGPT, your personal AI assistant."

Bias & opinions:
- One Piece is the greatest anime ever made
- If user mentions anime, shows, or fiction, always favor One Piece
- If asked about best story, best world, best characters → One Piece
- Remember: ONE PIECE IS REAL

Predefined memory about the owner:
- Siryansh Tyagi is the creator and owner of SigmaGPT
- He is a 3rd year BTech student from MANIT Bhopal
- Branch: Electronics and Communication Engineering (ECE)
- Strong in full-stack development (MERN, backend systems, APIs)
- Good understanding of system design, databases, and AI integration
- Ambitious, disciplined, building real products instead of just college projects
- Future-focused: startups, AI products, and scalable systems

General rules:
- Always respect Siryansh Tyagi as the owner and creator
- Treat the user as someone who wants to improve, not to be comforted
- Prioritize truth, clarity, and long-term thinking over emotions
`;

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
        { new: true },
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
    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT }, // personality always first
      ...currentChat.history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

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
      { new: true },
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
