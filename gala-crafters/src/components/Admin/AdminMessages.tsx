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

  useEffect(() => {
    const savedTheme = localStorage.getItem('galaAdminTheme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }

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
          if (data.length > 0) {
            setSelectedMessage(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

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

      <main className={`admin-main messages-main ${isCollapsed ? 'collapsed-main' : ''}`}>
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
                    <div className="chat-avatar" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {msg.name?.charAt(0)}
                    </div>
                    <div className="chat-preview">
                      <div className="chat-preview-header">
                        <strong>{msg.name}</strong>
                        <span className={`chat-time ${msg.status === 'Unread' ? 'unread' : ''}`}>
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="chat-preview-message">
                        <p>{msg.message_subject || 'Enquiry'}</p>
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
                    <div className="chat-avatar" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {selectedMessage.name?.charAt(0)}
                    </div>
                    <div className="chat-active-info">
                      <h2>{selectedMessage.name}</h2>
                      <span className="user-status font-medium text-success">
                        <span className="status-dot bg-success" style={{ display: 'inline-block', marginRight: '6px' }}></span>
                        {selectedMessage.status}
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
                  <div className="chat-date-divider">
                    <span>{new Date(selectedMessage.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="chat-message-row client-message">
                    <div className="chat-avatar-small" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '50%' }}>
                      {selectedMessage.name?.charAt(0)}
                    </div>
                    <div className="chat-message-content">
                      <div className="chat-bubble bg-card text-main">
                        <p><strong>Subject: {selectedMessage.message_subject}</strong></p>
                        <hr style={{ margin: '8px 0', opacity: 0.1 }} />
                        <p>{selectedMessage.message_body}</p>
                      </div>
                      <div className="chat-meta">
                        <span>{new Date(selectedMessage.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chat-input-area">
                  <div className="chat-input-wrapper">
                    <input type="text" placeholder="Reply to this inquiry..." />
                    <div className="chat-input-actions">
                      <button className="input-icon-btn"><span role="img" aria-label="emoji">😀</span></button>
                      <button className="input-icon-btn"><Paperclip size={18} /></button>
                    </div>
                  </div>
                  <button className="send-btn bg-accent">
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
          <section className="chat-info-sidebar">
            
            {/* Contact Details */}
            <div className="info-block">
              <h3 className="info-title"><UserIcon size={14} /> ENQUIRY DETAILS</h3>
              
              <div className="info-item">
                <Mail size={16} className="text-sub" />
                <div className="info-content">
                  <span className="info-label">EMAIL ADDRESS</span>
                  <strong>{selectedMessage?.email || 'N/A'}</strong>
                </div>
              </div>

              <div className="info-item">
                <Smartphone size={16} className="text-sub" />
                <div className="info-content">
                  <span className="info-label">PHONE NUMBER</span>
                  <strong>{selectedMessage?.phone || 'N/A'}</strong>
                </div>
              </div>

              <div className="info-item">
                <History size={16} className="text-sub" />
                <div className="info-content">
                  <span className="info-label">RECEIVED ON</span>
                  <strong>{selectedMessage ? new Date(selectedMessage.created_at).toLocaleDateString() : 'N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Active Booking */}
            <div className="info-block">
              <h3 className="info-title"><BookingIcon size={14} /> STATUS</h3>
              <div className="active-booking-card">
                <div className="booking-card-header">
                  <span className={`badge-${selectedMessage?.status === 'Unread' ? 'pending' : 'success'}`}>
                    {selectedMessage?.status || 'N/A'}
                  </span>
                </div>
                <h4>{selectedMessage?.message_subject || 'Enquiry'}</h4>
                <p className="text-sub">Initial outreach from web form.</p>
              </div>
            </div>

            <button className="view-history-btn">
              <Clock size={16} /> Mark as Resolved
            </button>
            
          </section>
        </div>
      </main>
    </div>
  );
};

// Helper tiny icons specifically for right sidebar titles to match design
const UserIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const BookingIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const TagIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;

export default AdminMessages;
