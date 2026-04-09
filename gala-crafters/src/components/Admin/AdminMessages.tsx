import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Video, Phone, Paperclip, Send, Clock, Mail, Smartphone, History, Check } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';

// Dummy static conversations for the User Messages page
const USER_CONVERSATIONS = [
  {
    id: 1,
    name: 'Robert Williams',
    email: 'robert.w@example.com',
    phone: '+63 917 111 2222',
    status: 'Online',
    last_active: new Date().toISOString(),
    messages: [
      { id: 101, type: 'client', text: 'Hi, I would like to inquire about the timeline for the wedding preparation.', date: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 102, type: 'admin', text: 'Hello Robert! We usually start preparing the venue 2 days before the event. Do you have any specific scheduling concerns?', date: new Date(Date.now() - 3600000 * 1.5).toISOString() },
      { id: 103, type: 'client', text: 'That sounds perfect. I just wanted to make sure the flowers arrive on time.', date: new Date(Date.now() - 3600000 * 1).toISOString() }
    ]
  },
  {
    id: 2,
    name: 'Lisa Martinez',
    email: 'lisa.martinez@corp.com',
    phone: '+63 918 333 4444',
    status: 'Offline',
    last_active: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      { id: 201, type: 'client', text: 'Are the corporate packages customizable?', date: new Date(Date.now() - 86400000).toISOString() },
      { id: 202, type: 'admin', text: 'Hi Lisa, yes they are! We can tailor the catering and seating arrangements to your exact needs. What head count are you expecting?', date: new Date(Date.now() - 86000000).toISOString() }
    ]
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    phone: '+63 919 555 6666',
    status: 'Online',
    last_active: new Date(Date.now() - 10000).toISOString(),
    messages: [
      { id: 301, type: 'client', text: 'I am interested in the Debut Package. Do you provide gowns?', date: new Date(Date.now() - 600000).toISOString() }
    ]
  }
];

const AdminMessages = () => {
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conversations, setConversations] = useState(USER_CONVERSATIONS);
  const [activeChat, setActiveChat] = useState(USER_CONVERSATIONS[0]);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('galaAdminTheme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('galaAdminTheme', newTheme ? 'dark' : 'light');
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'admin',
      text: replyText,
      date: new Date().toISOString()
    };

    const updatedChats = conversations.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });

    setConversations(updatedChats);
    const updatedActive = updatedChats.find(c => c.id === activeChat.id);
    if (updatedActive) setActiveChat(updatedActive);
    
    setReplyText('');
  };

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  return (
    <div className={`admin-layout ${isDark ? 'admin-dark-theme' : ''}`}>
      <AdminSidebar
        isDark={isDark}
        toggleTheme={toggleTheme}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main 
        className={`admin-main messages-main ${isCollapsed ? 'collapsed-main' : ''}`}
        style={{ padding: 0, height: '100vh', overflow: 'hidden', marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <div className="messages-layout">
          
          {/* Left Panel: Chat List */}
          <section className="chat-list-sidebar">
            <div className="chat-search-header">
              <div className="search-input-wrapper chat-search">
                <Search size={16} className="search-icon" />
                <input type="text" placeholder="Search user messages..." />
              </div>
            </div>
            
            <div className="chat-list">
              {conversations.map(chat => {
                const unreadCount = chat.messages.filter(m => m.type === 'client').length === chat.messages.length ? 1 : 0;
                const lastMessage = chat.messages[chat.messages.length - 1];

                return (
                  <div 
                    key={chat.id} 
                    className={`chat-list-item ${activeChat.id === chat.id ? 'active' : ''}`}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className="chat-avatar" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {getInitials(chat.name)}
                    </div>
                    <div className="chat-preview">
                      <div className="chat-preview-header">
                        <strong>{chat.name}</strong>
                        <span className={`chat-time ${unreadCount > 0 ? 'unread' : ''}`}>
                          {new Date(lastMessage.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="chat-preview-message">
                        <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                          {lastMessage.text}
                        </p>
                        {unreadCount > 0 && <span className="unread-dot"></span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Middle Panel: Chat Area */}
          <section className="chat-area">
            {activeChat ? (
              <>
                <div className="chat-area-header">
                  <div className="chat-active-user">
                    <div className="chat-avatar" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {getInitials(activeChat.name)}
                    </div>
                    <div className="chat-active-info">
                      <h2>{activeChat.name}</h2>
                      <span className={`user-status font-medium ${activeChat.status === 'Online' ? 'text-success' : 'text-sub'}`}>
                        <span className={`status-dot ${activeChat.status === 'Online' ? 'bg-success' : 'bg-gray'}`} style={{ display: 'inline-block', marginRight: '6px' }}></span>
                        {activeChat.status}
                      </span>
                    </div>
                  </div>
                  <div className="chat-header-actions">
                    <button className="chat-icon-btn"><Video size={20} /></button>
                    <button className="chat-icon-btn"><Phone size={20} /></button>
                    <button className="chat-icon-btn"><MoreVertical size={20} /></button>
                  </div>
                </div>

                <div className="chat-history">
                  {activeChat.messages.map((msg, idx) => {
                    const isFirstOfDay = idx === 0 || new Date(activeChat.messages[idx-1].date).toLocaleDateString() !== new Date(msg.date).toLocaleDateString();
                    
                    return (
                      <React.Fragment key={msg.id}>
                        {isFirstOfDay && (
                          <div className="chat-date-divider">
                            <span>{new Date(msg.date).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <div className={`chat-message-row ${msg.type === 'admin' ? 'admin-message' : 'client-message'}`}>
                          {msg.type === 'client' && (
                            <div className="chat-avatar-small" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '50%', color: 'var(--admin-text-main)' }}>
                              {getInitials(activeChat.name)}
                            </div>
                          )}
                          <div className="chat-message-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div className={`chat-bubble ${msg.type === 'admin' ? 'bg-accent text-white' : 'bg-card text-main'}`} style={{ 
                                padding: '12px 16px', 
                                borderRadius: '12px', 
                                maxWidth: '100%', 
                                width: 'fit-content',
                                minWidth: '60px'
                              }}>
                              <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</p>
                            </div>
                            <div className="chat-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', alignSelf: msg.type === 'admin' ? 'flex-end' : 'flex-start' }}>
                              <span style={{ fontSize: '11px', color: 'var(--admin-text-sub)' }}>{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {msg.type === 'admin' && <Check size={14} className="text-accent" />}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="chat-input-area">
                  <div className="chat-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <div className="chat-input-actions">
                      <button className="input-icon-btn"><span role="img" aria-label="emoji">😀</span></button>
                      <button className="input-icon-btn"><Paperclip size={18} /></button>
                    </div>
                  </div>
                  <button className="send-btn bg-accent" onClick={handleSendMessage}>
                    <Send size={18} color="#fff" />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-text-sub)' }}>
                Select a user to start messaging
              </div>
            )}
          </section>

          {/* Right Panel: Side Info */}
          {activeChat && (
            <section className="chat-info-sidebar">
              <div className="info-block">
                <h3 className="info-title"><UserIcon size={14} /> USER RECORD</h3>
                
                <div className="info-item">
                  <Mail size={16} className="text-sub" />
                  <div className="info-content">
                    <span className="info-label">EMAIL ADDRESS</span>
                    <strong>{activeChat.email}</strong>
                  </div>
                </div>

                <div className="info-item">
                  <Smartphone size={16} className="text-sub" />
                  <div className="info-content">
                    <span className="info-label">PHONE NUMBER</span>
                    <strong>{activeChat.phone}</strong>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <style>{`
        .messages-main {
          display: flex;
          flex-direction: column;
        }
        .messages-layout {
          display: flex;
          height: 100%;
          width: 100%;
        }
        .chat-list-item {
          cursor: pointer;
        }
        .chat-list-item.active {
          background-color: var(--admin-hover);
          border-left: 3px solid var(--admin-accent);
        }
      `}</style>
    </div>
  );
};

// Helper tiny icons
const UserIcon = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

export default AdminMessages;
