import React, { useState, useRef } from 'react';
import { MessageCircle, X, Send, User, Paperclip, Check } from 'lucide-react';
import './FloatingChat.css';
import { API_BASE_URL } from '../api/config';
import { authService } from '../api/auth';

const FloatingChat = () => {
  const CHAT_STORAGE_KEY = 'gala_assistant_history';
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Hello! Welcome to Gala Crafters. How can I help you plan your dream event today?", sender: "received" }
    ];
  });

  // Sync with localStorage
  React.useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  React.useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open_gala_chat', handleOpenChat);
    return () => window.removeEventListener('open_gala_chat', handleOpenChat);
  }, []);

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const sendMessage = async (text: string, imageUrl?: string) => {
    // Get user info if logged in
    const user = authService.getStoredUser();
    const userName = user ? `${user.first_name} ${user.last_name || ''}` : "Guest User";
    const userEmail = user?.email || "guest@galacrafters.com";

    // Add user message to UI immediately for better UX
    const newUserMsg = { 
      id: Date.now(), 
      text: text || (!imageUrl && selectedFile ? `Attached: ${selectedFile.name}` : ""), 
      imageUrl,
      sender: "sent" 
    };
    
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    
    // Clear state
    setMessage('');
    setSelectedFile(null);

    // PERSIST TO DATABASE
    try {
      await fetch(`${API_BASE_URL}/api/chat/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_body: text || (selectedFile ? `[Attachment: ${selectedFile.name}]` : ""),
          name: userName,
          email: userEmail,
          subject: "Inquiry via Gala Assistant",
          user_id: user?.id
        })
      });
    } catch (err) {
      console.error('Failed to sync message with server:', err);
      // We don't block the UI if the server call fails, but we log it
    }

    // Add mock response after a delay
    setTimeout(() => {
      const response = { 
        id: Date.now() + 1, 
        text: "Thanks for reaching out! One of our planners will get back to you shortly. In the meantime, feel free to check our premium services.", 
        sender: "received" 
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        sendMessage(message, event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      sendMessage(message);
    }
  };

  return (
    <div className="floating-chat-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-status">
              <span className="status-dot"></span>
              <h3>Gala Assistant</h3>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="Uploaded attachment" 
                    className="message-image" 
                    onClick={() => setZoomedImage(msg.imageUrl)}
                    style={{ cursor: 'zoom-in' }}
                  />
                )}
                {msg.text && <span>{msg.text}</span>}
              </div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              accept="image/*, .pdf, .doc, .docx"
            />
            <button type="button" className="attachment-btn" onClick={handlePaperclipClick}>
              <Paperclip size={18} />
            </button>

            <div className="input-wrapper">
              {selectedFile && (
                <div className="file-preview-tag">
                  <span>{selectedFile.name}</span>
                  <X size={12} onClick={() => setSelectedFile(null)} />
                </div>
              )}
              <input 
                type="text" 
                placeholder="Type your question..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" className="chat-send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {zoomedImage && (
        <div className="chat-image-zoom-overlay" onClick={() => setZoomedImage(null)}>
          <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
            <img src={zoomedImage} alt="Zoomed view" className="zoomed-image-full" />
            <button className="zoom-close-btn" onClick={() => setZoomedImage(null)}>
              <X size={32} />
            </button>
          </div>
        </div>
      )}

      <button 
        className={`chat-bubble ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default FloatingChat;
