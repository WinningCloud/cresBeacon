import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Load API key from .env
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

export default function Chatbot() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let history = "";
      let tokenCount = 0;
      const maxTokens = 2000;

      for (let i = newMessages.length - 1; i >= 0; i--) {
        const msg = newMessages[i];
        const line = `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}\n`;
        const lineTokens = Math.ceil(line.length / 4);

        if (tokenCount + lineTokens > maxTokens) break;

        history = line + history;
        tokenCount += lineTokens;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const systemPrompt = `
You are a friendly and approachable AI chatbot for a college anti-ragging app. 
Help students report incidents anonymously, provide emotional support, and guide them on staying safe. 
Keep replies short, clear, and empathetic—avoid long paragraphs. 
Ask only one question at a time if needed. 
Use a calm, warm, and supportive tone in all responses. 
Focus on the student's concern, give actionable advice, and maintain confidentiality. 
Keep recent conversation context in mind.
`;



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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.chatWrapper}>
        {messages.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              🚨 Report anonymously and stay safe! Start chatting to share your concerns.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.chatContainer}
            contentContainerStyle={{ paddingVertical: 20 }}
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.message,
                  msg.sender === "user" ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={[styles.messageText, msg.sender === "user" ? styles.userText : styles.botText]}>
                  {msg.text}
                </Text>
              </View>
            ))}
            {loading && <Text style={styles.loading}>Bot is typing...</Text>}
          </ScrollView>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f6fb" },
  chatWrapper: { flex: 1, paddingHorizontal: 15 },

  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 18,
    color: "#777",
    fontStyle: "italic",
  },

  chatContainer: { flex: 1 },

  message: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  botMessage: {
    backgroundColor: "#e1e8ee",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  messageText: { fontSize: 16 },
  userText: { color: "#fff" },
  botText: { color: "#000" },

  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  loading: {
    fontStyle: "italic",
    color: "#555",
    marginVertical: 5,
    alignSelf: "center",
  },
});
