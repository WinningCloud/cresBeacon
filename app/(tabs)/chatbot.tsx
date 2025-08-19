import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Load API key from .env
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

export default function Chatbot() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Send message to Gemini
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Token-aware history
      let history = "";
      let tokenCount = 0;
      const maxTokens = 2000; // adjust this for more/less history

      for (let i = newMessages.length - 1; i >= 0; i--) {
        const msg = newMessages[i];
        const line = `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}\n`;
        const lineTokens = Math.ceil(line.length / 4); // rough estimate

        if (tokenCount + lineTokens > maxTokens) break;

        history = line + history;
        tokenCount += lineTokens;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const systemPrompt = `You are an AI chatbot for a college anti-ragging app. Your role is to help students report incidents anonymously, provide emotional support, and give guidance related to anti-ragging. Always respond concisely, clearly, and empathetically. Focus on the student's question and avoid unnecessary extra information. Keep recent conversation context in mind.`;



      const result = await model.generateContent(`${systemPrompt}\n\n${history}\nBot:`);

      const text = result.response.text();

      setMessages((prev) => [...prev, { sender: "bot", text }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I couldn’t process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Chat Window */}
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.sender === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={{ color: msg.sender === "user" ? "#fff" : "#000" }}>{msg.text}</Text>
          </View>
        ))}
        {loading && <Text style={styles.loading}>Bot is typing...</Text>}
      </ScrollView>

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#f4f4f4" ,  paddingTop:35,},
  chatContainer: { flex: 1, padding: 10 },

  message: {
    padding: 10,
   
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  loading: {
    fontStyle: "italic",
    color: "#555",
    marginVertical: 5,
  },
});
