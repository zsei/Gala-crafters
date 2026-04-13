import React, { useState, useRef } from 'react';
import { MessageCircle, X, Send, User, Paperclip, Check } from 'lucide-react';
import './FloatingChat.css';
import { API_BASE_URL } from '../api/config';
import { authService } from '../api/auth';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Get dynamic storage key based on user ID
  const getStorageKey = () => {
    const user = authService.getStoredUser();
    return user ? `gala_chat_history_${user.id}` : 'gala_assistant_history_guest';
  };

  const fetchHistory = async () => {
    const user = authService.getStoredUser();
    if (user && user.id) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setMessages(data);
            return true; // We have server data
          }
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    }
    
    // Fallback to localStorage if guest or fetch failed/empty
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else if (messages.length === 0) {
      setMessages([
        { id: 1, text: "Hello! Welcome to Gala Crafters. How can I help you plan your dream event today?", sender: "received" }
      ]);
    }
    return false;
  };

  // Load messages when user changes or component mounts
  React.useEffect(() => {
    fetchHistory();

    // Poll for new messages (admin replies) every 10 seconds if logged in
    let interval: any;
    const user = authService.getStoredUser();
    if (user && user.id) {
      interval = setInterval(fetchHistory, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoggedIn]); // Reload if login state changes

  // Sync with localStorage whenever messages change
  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(messages));
    }
  }, [messages]);

  React.useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    const handleAuthChange = () => setIsLoggedIn(authService.isLoggedIn());
    
    window.addEventListener('open_gala_chat', handleOpenChat);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('open_gala_chat', handleOpenChat);
      window.removeEventListener('storage', handleAuthChange);
    };
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
    
    setMessages(prev => [...prev, newUserMsg]);
    
    // Clear state
    setMessage('');
    setSelectedFile(null);

    // PERSIST TO DATABASE
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_body: text || (selectedFile ? `[Attachment: ${selectedFile.name}]` : ""),
          name: userName,
          email: userEmail,
          subject: "Inquiry via Gala Assistant",
          user_id: user?.id,
          image_url: imageUrl
        })
      });

      if (response.ok && user && user.id) {
        // For registered users, the backend creates an automatic reply.
        // Show typing indicator for a second then fetch.
        setIsTyping(true);
        setTimeout(async () => {
          await fetchHistory();
          setIsTyping(false);
        }, 1500);
      } else if (response.ok && !user) {
        // For guests, add a local mock response since it's not in the DB
        setTimeout(() => {
          const response = { 
            id: Date.now() + 1, 
            text: "Thanks for reaching out! One of our planners will get back to you shortly. In the meantime, feel free to check our premium services.", 
            sender: "received" 
          };
          setMessages(prev => [...prev, response]);
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to sync message with server:', err);
    }
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
            {messages.map((msg) => {
              const currentImageUrl = msg.imageUrl || msg.image_url;
              return (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  {currentImageUrl && (
                    <img 
                      src={currentImageUrl} 
                      alt="Uploaded attachment" 
                      className="message-image" 
                      onClick={() => setZoomedImage(currentImageUrl)}
                      style={{ cursor: 'zoom-in' }}
                    />
                  )}
                  {msg.text && <span>{msg.text}</span>}
                </div>
              );
            })}
            {isTyping && (
              <div className="message received typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
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
