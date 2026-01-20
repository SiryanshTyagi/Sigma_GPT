const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: {
      type: String,
      default: "new chat",
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system"], // assistant is the standard for AI replies
          required: true,
        },
        content: {
          type: String,
          required: true, // Using a simple string for the message body
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Chat", chatSchema);
