import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Video, Phone, Paperclip, Send, Clock, Mail, Smartphone, History, Check } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const AdminMessages = () => {
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  // Helper to get initials (e.g., "Angeline Chua" -> "AC")
  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('galaAdminTheme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    if (selectedMessage) {
      fetchThread(selectedMessage.id);
    }
  }, [selectedMessage]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.MESSAGES}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        if (data.length > 0 && !selectedMessage) {
          setSelectedMessage(data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (messageId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/messages/${messageId}/thread`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setConversation(data);
      }
    } catch (err) {
      console.error('Error fetching thread:', err);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/messages/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message_body: replyText,
          sender_name: 'Admin'
        })
      });

      if (response.ok) {
        setReplyText('');
        // Refresh thread
        fetchThread(selectedMessage.id);
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setSending(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('galaAdminTheme', newTheme ? 'dark' : 'light');
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
          
          {/* Left Panel: Chat List (Using Messages from Database) */}
          <section className="chat-list-sidebar">
            <div className="chat-search-header">
              <div className="search-input-wrapper chat-search">
                <Search size={16} className="search-icon" />
                <input type="text" placeholder="Search inquiries..." />
              </div>
            </div>
            
            <div className="chat-list">
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : messages.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>No inquiries.</div>
              ) : (
                messages.map((msg: any) => (
                  <div 
                    key={msg.id} 
                    className={`chat-list-item ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className="chat-avatar" style={{ backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {getInitials(msg.name)}
                    </div>
                    <div className="chat-preview">
                      <div className="chat-preview-header">
                        <strong>{msg.name}</strong>
                        <span className={`chat-time ${msg.status === 'Unread' ? 'unread' : ''}`}>
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="chat-preview-message">
                        <p style={{ 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          maxWidth: '180px',
                          color: msg.status === 'Unread' ? 'var(--admin-text-main)' : 'var(--admin-text-sub)',
                          fontWeight: msg.status === 'Unread' ? '600' : '400'
                        }}>
                          {msg.message_body || msg.message_subject || 'Enquiry'}
                        </p>
                        {msg.status === 'Unread' && <span className="unread-dot"></span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Middle Panel: Chat Area */}
          <section className="chat-area">
            {selectedMessage ? (
              <>
                <div className="chat-area-header">
                  <div className="chat-active-user">
                    <div className="chat-avatar" style={{ backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {getInitials(selectedMessage.name)}
                    </div>
                    <div className="chat-active-info">
                      <h2>{selectedMessage.name}</h2>
                    </div>
                  </div>
                  <div className="chat-header-actions">
                  </div>
                </div>

                <div className="chat-history">
                  {conversation.map((msg, idx) => (
                    <React.Fragment key={msg.id}>
                      {idx === 0 || new Date(conversation[idx-1].message_date).toLocaleDateString() !== new Date(msg.message_date).toLocaleDateString() ? (
                        <div className="chat-date-divider">
                          <span>{new Date(msg.message_date).toLocaleDateString()}</span>
                        </div>
                      ) : null}
                      
                      <div className={`chat-message-row ${msg.type === 'admin' ? 'admin-message' : 'client-message'}`}>
                        {msg.type === 'client' && (
                          <div className="chat-avatar-small" style={{ backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '50%', flexShrink: 0, fontSize: '10px' }}>
                            {getInitials(msg.sender_name)}
                          </div>
                        )}
                        <div className="chat-message-content">
                          <div className={`chat-bubble ${msg.type === 'admin' ? 'bg-accent text-white' : 'bg-card text-main'}`}>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.message_body}</p>
                          </div>
                          <div className="chat-meta">
                            <span>{new Date(msg.message_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {msg.type === 'admin' && <Check size={14} className="text-accent" />}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                <div className="chat-input-area">
                  <div className="chat-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Reply to this inquiry..." 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                    />
                    <div className="chat-input-actions">
                      <button className="input-icon-btn"><span role="img" aria-label="emoji">😀</span></button>
                      <button className="input-icon-btn"><Paperclip size={18} /></button>
                    </div>
                  </div>
                  <button 
                    className="send-btn bg-accent" 
                    onClick={handleSendReply}
                    disabled={sending || !replyText.trim()}
                    style={{ opacity: sending || !replyText.trim() ? 0.6 : 1 }}
                  >
                    <Send size={18} color="#fff" />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-text-sub)' }}>
                Select a message to view details
              </div>
            )}
          </section>

          {/* Right Panel: Side Info */}
          {selectedMessage && (
            <section className="chat-info-sidebar">
              
              {/* Contact Details */}
              <div className="info-block">
                <h3 className="info-title"><UserIcon size={14} /> ENQUIRY DETAILS</h3>
                
                <div className="info-item">
                  <Mail size={16} className="text-sub" />
                  <div className="info-content">
                    <span className="info-label">EMAIL ADDRESS</span>
                    <strong>{selectedMessage.email || 'N/A'}</strong>
                  </div>
                </div>

                <div className="info-item">
                  <Smartphone size={16} className="text-sub" />
                  <div className="info-content">
                    <span className="info-label">PHONE NUMBER</span>
                    <strong>{selectedMessage.phone || 'N/A'}</strong>
                  </div>
                </div>

                <div className="info-item">
                  <History size={16} className="text-sub" />
                  <div className="info-content">
                    <span className="info-label">RECEIVED ON</span>
                    <strong>{new Date(selectedMessage.created_at).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              {/* Active Booking */}
              <div className="info-block">
                <h3 className="info-title"><BookingIcon size={14} /> STATUS</h3>
                <div className="active-booking-card">
                  <div className="booking-card-header">
                    <span className={`badge-${selectedMessage.status === 'Unread' ? 'pending' : 'success'}`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                  <h4>{selectedMessage.message_subject || 'Enquiry'}</h4>
                  <p className="text-sub">Initial outreach from web form.</p>
                </div>
              </div>

              <button className="view-history-btn">
                <Clock size={16} /> Mark as Resolved
              </button>
              
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

// Helper tiny icons specifically for right sidebar titles to match design
const UserIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const BookingIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const TagIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;

export default AdminMessages;
