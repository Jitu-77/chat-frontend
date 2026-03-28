import { useParams } from "react-router-dom";
import { useState } from "react";

const dummyMessages = [
  { id: 1, text: "Hello 👋", sender: "other" },
  { id: 2, text: "Hi!", sender: "me" },
  { id: 3, text: "How are you?", sender: "other" },
  { id: 4, text: "I'm good 😄", sender: "me" },
];

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;

    setMessages([
      ...messages,
      { id: Date.now(), text: input, sender: "me" },
    ]);

    setInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <div className="bg-primary text-white p-4">
        <h2 className="font-semibold">Chat ID: {id}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-xl ${
              msg.sender === "me"
                ? "bg-primary text-white self-end"
                : "bg-white text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-primary"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default Chat;