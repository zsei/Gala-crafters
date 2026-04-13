import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Video, Phone, Paperclip, Send, Clock, Mail, Smartphone, History, Check } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const AdminInquiries = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to get initials (e.g., "Angeline Chua" -> "AC")
  const getBadgeType = (status: string) => {
    return status === 'Unread' ? 'pending' : 'success';
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch all messages (Inquiries from contact form)
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

  const handleMarkRead = async (messageId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/messages/${messageId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        // Update local state instead of full refetch
        setMessages((prev: any) => prev.map((m: any) => 
          m.id === messageId ? { ...m, status: 'Read' } : m
        ));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage((prev: any) => ({ ...prev, status: 'Read' }));
        }
        
        // Notify sidebar to refresh unread counts
        window.dispatchEvent(new CustomEvent('refresh_unread_counts'));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const filteredMessages = messages.filter((msg: any) => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.message_body || '').toLowerCase().includes(searchTerm.toLowerCase())
  );



  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  return (
    <div className="admin-layout">
      <AdminSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main 
        className={`admin-main messages-main ${isCollapsed ? 'collapsed-main' : ''}`}
        style={{ padding: 0, height: '100vh', overflow: 'hidden', marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <header className="admin-header" style={{ padding: '16px 32px', backgroundColor: 'var(--admin-card-bg)', borderBottom: '1px solid var(--admin-border)', marginBottom: 0 }}>
          <div className="admin-header-text">
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--admin-text-main)', margin: 0 }}>Guest Inquiries</h1>
            <p style={{ color: 'var(--admin-text-sub)', fontSize: '13px', margin: '4px 0 0 0' }}>Manage and track all guest outreaches from the contact form</p>
          </div>
        </header>
        <div className="messages-layout" style={{ marginTop: 0 }}>
          
          {/* Left Panel: Chat List (Using Messages from Database) */}
          <section className="chat-list-sidebar">
            <div className="chat-search-header">
              <div className="search-input-wrapper chat-search">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search inquiries..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="chat-list">
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : filteredMessages.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>No inquiries found.</div>
              ) : (
                filteredMessages.map((msg: any) => (
                  <div 
                    key={msg.id} 
                    className={`chat-list-item ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'Unread') handleMarkRead(msg.id);
                    }}
                  >
                    <div className="chat-avatar" style={{ backgroundColor: 'var(--admin-hover)', color: 'var(--admin-accent)', border: '1px solid var(--admin-border)' }}>
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
                <div className="chat-header" style={{ backgroundColor: 'var(--admin-accent)', color: 'white', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-start' }}>
                  <div className="chat-avatar" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', width: '40px', height: '40px', borderRadius: '50%' }}>
                    {getInitials(selectedMessage.name)}
                  </div>
                  <div className="chat-user-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'white' }}>{selectedMessage.name}</h3>
                    <span style={{ fontSize: '12px', opacity: 0.9, color: 'white' }}>{selectedMessage.email}</span>
                  </div>
                </div>

                <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                  <div style={{ 
                    backgroundColor: 'var(--admin-card-bg)', 
                    borderRadius: '8px', 
                    padding: '24px', 
                    marginBottom: '20px',
                    border: '1px solid var(--admin-border)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px', color: 'var(--admin-text-main)' }}>{selectedMessage.name}</strong>
                        <span style={{ fontSize: '13px', color: 'var(--admin-text-sub)' }}>{selectedMessage.email}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--admin-text-sub)' }}>
                        {new Date(selectedMessage.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    {selectedMessage.message_subject && (
                      <h4 style={{ marginBottom: '12px', color: 'var(--admin-text-main)' }}>{selectedMessage.message_subject}</h4>
                    )}
                    <div style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6', 
                      color: 'var(--admin-text-main)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedMessage.message_body}
                    </div>
                  </div>
                </div>

                {/* Hiding reply area for read-only inquiries as per requirements */}
                <div className="chat-read-only-notice" style={{ 
                  padding: '20px', 
                  backgroundColor: 'var(--admin-hover)', 
                  borderTop: '1px solid var(--admin-border)',
                  textAlign: 'center',
                  color: 'var(--admin-text-sub)',
                  fontSize: '14px',
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  <p>Inquiries are read-only. Please contact the guest via email or phone provided in the details.</p>
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
                  <Clock size={16} className="text-sub" />
                  <div className="info-content">
                    <span className="info-label">EVENT TYPE</span>
                    <strong>{selectedMessage.event_type || 'General Inquiry'}</strong>
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

              <button 
                className="view-history-btn"
                style={{ 
                  backgroundColor: selectedMessage.status === 'Unread' ? 'var(--admin-accent)' : 'var(--admin-hover)',
                  color: selectedMessage.status === 'Unread' ? 'white' : 'var(--admin-text-main)',
                  border: selectedMessage.status === 'Unread' ? 'none' : '1px solid var(--admin-border)',
                  cursor: selectedMessage.status === 'Unread' ? 'pointer' : 'default'
                }}
                disabled={selectedMessage.status !== 'Unread'}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_BASE_URL}/api/admin/messages/${selectedMessage.id}/read`, {
                      method: 'PUT',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) fetchMessages();
                  } catch (err) {
                    console.error('Error marking as read:', err);
                  }
                }}
              >
                <Check size={16} /> Mark as Reviewed
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

export default AdminInquiries;
