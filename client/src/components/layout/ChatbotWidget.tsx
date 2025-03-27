import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

type Message = {
  type: "user" | "bot";
  text: string;
};

type ChatbotQa = {
  id: number;
  language: string;
  keywords: string[];
  question: string;
  answer: string;
};

const ChatbotWidget = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: t("chatbot.greeting") },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentLanguage = i18n.language || "fr";

  // Fetch chatbot QA pairs based on the current language
  const { data: qaItems } = useQuery<ChatbotQa[]>({
    queryKey: ['/api/chatbot/qa', currentLanguage],
    queryFn: async () => {
      const response = await fetch(`/api/chatbot/qa?lang=${currentLanguage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chatbot responses');
      }
      return response.json();
    },
    enabled: isOpen, // Only fetch when the chatbot is open
  });

  // Effect to update the greeting when language changes
  useEffect(() => {
    setMessages([{ type: "bot", text: t("chatbot.greeting") }]);
  }, [currentLanguage, t]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { type: "user" as const, text: message };
    setMessages((prev) => [...prev, userMessage]);
    const userMessageLower = message.toLowerCase();
    setMessage("");

    setTimeout(() => {
      // Default response
      let responseText = t("chatbot.default");
      
      // If we have QA data, try to match keywords with the message
      if (qaItems && qaItems.length > 0) {
        // Find QA pair where at least one keyword is in the user message
        const matchingQa = qaItems.find(qa => 
          qa.keywords.some(keyword => userMessageLower.includes(keyword.toLowerCase()))
        );
        
        if (matchingQa) {
          responseText = matchingQa.answer;
        }
      }
      
      const botMessage = { type: "bot" as const, text: responseText };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-white rounded-lg shadow-lg w-80 md:w-96 overflow-hidden transition-all duration-300 transform ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-robot"></i>
            </div>
            <span className="font-medium">{t("chatbot.title")}</span>
          </div>
          <Button
            variant="ghost"
            className="text-white p-0 h-auto"
            onClick={toggleChat}
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>

        <div className="p-4 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                msg.type === "user" ? "justify-end" : ""
              }`}
            >
              {msg.type === "bot" && (
                <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <i className="fas fa-robot text-primary text-sm"></i>
                </div>
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  msg.type === "bot"
                    ? "bg-gray-100"
                    : "bg-primary text-white"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <form className="flex" onSubmit={handleSubmit}>
            <Input
              className="flex-grow rounded-r-none focus-visible:ring-1 focus-visible:ring-primary"
              placeholder={t("chatbot.inputPlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-l-none"
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </form>
        </div>
      </div>

      <Button
        className={`bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center p-0`}
        onClick={toggleChat}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-comments"} text-xl`}></i>
      </Button>
    </div>
  );
};

export default ChatbotWidget;