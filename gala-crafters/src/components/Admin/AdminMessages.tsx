import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Send, Mail, Smartphone, Check, X, Calendar, MapPin, User as UserIconSimple, History, UserCheck, ChevronLeft } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL } from '../../api/config';

const AdminMessages = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  
  // User Profile & History
  const [userProfile, setUserProfile] = useState<any>(null);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [replyText, setReplyText] = useState('');
  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversations, 10000);

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchThread(activeChat.id);
      setShowFullProfile(false); // Reset to history-only view when switching users
      
      // Poll for thread updates every 5 seconds when a chat is active
      const threadInterval = setInterval(() => fetchThread(activeChat.id), 5000);
      return () => clearInterval(threadInterval);
    }
  }, [activeChat]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        if (data.length > 0 && !activeChat) {
          setActiveChat(data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (convId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/conversations/${convId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Backend now returns { messages, user_profile, booking_history }
        setMessages(data.messages || []);
        setUserProfile(data.user_profile);
        setBookingHistory(data.booking_history || []);

        // Clear unread count locally for this conversation
        setConversations(prev => prev.map(c => 
          c.id === convId ? { ...c, unread_count: 0 } : c
        ));
        
        // Notify sidebar to refresh unread counts
        window.dispatchEvent(new CustomEvent('refresh_unread_counts'));
      }
    } catch (err) {
      console.error('Error fetching thread:', err);
    }
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const cancelImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() && !selectedFile) return;
    if (!activeChat) return;

    setIsUploading(true);
    try {
      let uploadedUrl = null;

      // Handle file upload if present
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedUrl = uploadData.url;
        }
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/conversations/${activeChat.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message_body: replyText || "Sent an image",
          sender_name: 'Admin',
          image_url: uploadedUrl
        })
      });

      if (response.ok) {
        setReplyText('');
        cancelImage();
        fetchThread(activeChat.id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsUploading(false);
    }
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

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  return (
    <>
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
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--admin-text-main)', margin: 0 }}>Client Messages</h1>
              <p style={{ color: 'var(--admin-text-sub)', fontSize: '13px', margin: '4px 0 0 0' }}>Manage conversations and support for registered clients</p>
            </div>
          </header>

          <div className="messages-layout" style={{ display: 'flex', height: 'calc(100% - 73px)', marginTop: 0 }}>
            
            {/* Left Panel: Chat List */}
            <section className="chat-list-sidebar" style={{ width: '320px', borderRight: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
              <div className="chat-search-header" style={{ padding: '16px' }}>
                <div className="search-input-wrapper chat-search">
                  <Search size={16} className="search-icon" />
                  <input type="text" placeholder="Search client messages..." />
                </div>
              </div>
              
              <div className="chat-list" style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>No client messages found.</div>
                ) : (
                  conversations.map(chat => (
                    <div 
                      key={chat.id} 
                      className={`chat-list-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                      onClick={() => setActiveChat(chat)}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--admin-border)',
                        backgroundColor: activeChat?.id === chat.id ? 'var(--admin-hover)' : 'transparent',
                        borderLeft: activeChat?.id === chat.id ? '4px solid var(--admin-accent)' : '4px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div className="chat-avatar" style={{ 
                        backgroundColor: 'var(--admin-hover)', 
                        color: 'var(--admin-accent)', 
                        border: '1px solid var(--admin-border)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 'bold',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        flexShrink: 0
                      }}>
                        {getInitials(chat.name)}
                      </div>
                      <div className="chat-preview" style={{ flex: 1, minWidth: 0 }}>
                        <div className="chat-preview-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <strong style={{ fontSize: '14px', color: 'var(--admin-text-main)' }}>{chat.name}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--admin-text-sub)' }}>
                            {chat.last_active ? new Date(chat.last_active).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="chat-preview-message">
                          <p style={{ 
                            margin: 0, 
                            fontSize: '12px', 
                            color: chat.unread_count > 0 ? 'var(--admin-text-main)' : 'var(--admin-text-sub)', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            fontWeight: chat.unread_count > 0 ? '600' : '400'
                          }}>
                            {chat.last_message}
                          </p>
                          {chat.unread_count > 0 && (
                            <span style={{ 
                              display: 'inline-block', 
                              backgroundColor: 'var(--admin-accent)', 
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              marginLeft: '8px',
                              minWidth: '18px',
                              textAlign: 'center'
                            }}>
                              {chat.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Middle Panel: Chat Area */}
            <section className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>
              {activeChat ? (
                <>
                  <div className="chat-header" style={{ backgroundColor: 'var(--admin-accent)', color: 'white', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-start' }}>
                    <div className="chat-avatar" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', width: '40px', height: '40px', borderRadius: '50%' }}>
                      {getInitials(activeChat.name)}
                    </div>
                    <div className="chat-user-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'white' }}>{activeChat.name}</h3>
                      <span style={{ fontSize: '12px', opacity: 0.9, color: 'white' }}>{activeChat.email}</span>
                    </div>
                  </div>

                  <div className="chat-history" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map((msg, idx) => {
                      const isFirstOfDay = idx === 0 || new Date(messages[idx-1].date).toLocaleDateString() !== new Date(msg.date).toLocaleDateString();
                      
                      return (
                        <React.Fragment key={msg.id}>
                          {isFirstOfDay && (
                            <div className="chat-date-divider" style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
                              <span style={{ backgroundColor: 'var(--admin-bg-main)', padding: '0 15px', fontSize: '12px', color: 'var(--admin-text-sub)', position: 'relative', zIndex: 1 }}>
                                {new Date(msg.date).toLocaleDateString()}
                              </span>
                              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderBottom: '1px solid var(--admin-border)', zIndex: 0 }}></div>
                            </div>
                          )}
                          
                          <div className={`chat-message-row ${msg.type === 'admin' ? 'admin-message' : 'client-message'}`} style={{
                            display: 'flex',
                            justifyContent: msg.type === 'admin' ? 'flex-end' : 'flex-start',
                            gap: '12px'
                          }}>
                            {msg.type === 'client' && (
                              <div className="chat-avatar-small" style={{ backgroundColor: 'var(--admin-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '50%', width: '32px', height: '32px', fontSize: '12px', flexShrink: 0 }}>
                                {getInitials(activeChat.name)}
                              </div>
                            )}
                            <div className="chat-message-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%' }}>
                              <div className={`chat-bubble ${msg.type === 'admin' ? 'bg-accent text-white' : 'bg-card text-main'}`} style={{ 
                                padding: msg.image_url ? '8px' : '12px 16px', 
                                borderRadius: msg.type === 'admin' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
                                width: 'fit-content',
                                minWidth: msg.image_url ? '200px' : 'auto',
                                maxWidth: '300px',
                                backgroundColor: msg.type === 'admin' ? 'var(--admin-accent)' : 'var(--admin-card-bg)',
                                color: msg.type === 'admin' ? 'white' : 'var(--admin-text-main)',
                                border: msg.type === 'admin' ? 'none' : '1px solid var(--admin-border)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                              }}>
                              {msg.image_url && (
                                <div style={{ width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                                  <img 
                                    src={msg.image_url} 
                                    alt="attachment" 
                                    style={{ 
                                      width: '100%', 
                                      height: 'auto',
                                      maxHeight: '400px', 
                                      borderRadius: '8px', 
                                      cursor: 'zoom-in',
                                      display: 'block',
                                      objectFit: 'cover'
                                    }} 
                                    onClick={() => setZoomedImage(msg.image_url)}
                                  />
                                </div>
                              )}
                                <p style={{ 
                                  margin: 0, 
                                  whiteSpace: 'pre-wrap', 
                                  wordBreak: 'break-word',
                                  display: (msg.image_url && msg.text === 'Sent an image') ? 'none' : 'block'
                                }}>
                                  {msg.text}
                                </p>
                              </div>
                              <div className="chat-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', alignSelf: msg.type === 'admin' ? 'flex-end' : 'flex-start' }}>
                                <span style={{ fontSize: '11px', color: 'var(--admin-text-sub)' }}>{msg.date ? new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                {msg.type === 'admin' && <Check size={14} style={{ color: 'var(--admin-accent)' }} />}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="chat-input-area" style={{ padding: '20px', borderTop: '1px solid var(--admin-border)', position: 'relative' }}>
                    {imagePreview && (
                      <div className="image-preview-badge" style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '20px',
                        backgroundColor: 'var(--admin-card-bg)',
                        padding: '10px',
                        borderRadius: '12px 12px 0 0',
                        border: '1px solid var(--admin-border)',
                        borderBottom: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ position: 'relative' }}>
                          <img src={imagePreview} alt="Preview" style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          <button 
                            onClick={cancelImage}
                            style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--admin-text-sub)' }}>{selectedFile?.name}</span>
                      </div>
                    )}

                    <div className="chat-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          style={{ display: 'none' }} 
                          accept="image/*"
                        />
                        <input 
                          type="text" 
                          placeholder="Type a message..." 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          disabled={isUploading}
                          style={{
                            width: '100%',
                            padding: '12px 45px 12px 15px',
                            borderRadius: '25px',
                            border: '1px solid var(--admin-border)',
                            backgroundColor: 'var(--admin-bg-soft)',
                            color: 'var(--admin-text-main)'
                          }}
                        />
                        <button 
                          className={`input-icon-btn ${selectedFile ? 'text-accent' : ''}`}
                          onClick={handleFileClick}
                          disabled={isUploading}
                          style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-sub)' }}
                        >
                          <Paperclip size={18} />
                        </button>
                      </div>
                      <button 
                        className="send-btn" 
                        onClick={handleSendMessage}
                        disabled={isUploading || (!replyText.trim() && !selectedFile)}
                        style={{
                          backgroundColor: 'var(--admin-accent)',
                          color: 'white',
                          border: 'none',
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-text-sub)' }}>
                  Select a user to start messaging
                </div>
              )}
            </section>

            {/* Right Panel: Client Info Sidebar */}
            <section className="chat-info-sidebar" style={{ width: '320px', borderLeft: '1px solid var(--admin-border)', overflowY: 'auto', padding: '24px', backgroundColor: 'white' }}>
              {activeChat ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client Details</h3>
                  
                  {/* Personal Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="detail-item">
                      <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-sub)', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                        <UserIconSimple size={14} />
                        <span>FULL NAME</span>
                      </div>
                      <div className="detail-value" style={{ fontSize: '14px', color: 'var(--admin-text-main)', fontWeight: '500' }}>{userProfile?.first_name} {userProfile?.last_name}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-sub)', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                        <Mail size={14} />
                        <span>EMAIL ADDRESS</span>
                      </div>
                      <div className="detail-value" style={{ fontSize: '14px', color: 'var(--admin-text-main)', fontWeight: '500' }}>{userProfile?.email}</div>
                    </div>
                    
                    <div className="detail-item">
                      <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-sub)', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                        <Smartphone size={14} />
                        <span>PHONE NUMBER</span>
                      </div>
                      <div className="detail-value" style={{ fontSize: '14px', color: 'var(--admin-text-main)', fontWeight: '500' }}>{userProfile?.phone || 'N/A'}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-sub)', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                        <UserCheck size={14} />
                        <span>VERIFICATION STATUS</span>
                      </div>
                      <div className="detail-value">
                        <span style={{ 
                          display: 'inline-block', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          fontSize: '11px', 
                          fontWeight: '600',
                          backgroundColor: userProfile?.status === 'Verified' ? 'var(--admin-success-bg)' : 'var(--admin-danger-bg)',
                          color: userProfile?.status === 'Verified' ? 'var(--admin-success-text)' : 'var(--admin-danger-text)'
                        }}>
                          {userProfile?.status || 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--admin-border)', margin: 0 }} />

                  {/* Booking History */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-sub)', fontSize: '11px', fontWeight: '600' }}>
                      <History size={14} />
                      <span>BOOKING HISTORY</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {bookingHistory.length > 0 ? (
                        bookingHistory.slice(0, 3).map((booking: any) => (
                          <div key={booking.id} style={{ padding: '12px', backgroundColor: 'var(--admin-bg-soft)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-main)' }}>{booking.booking_reference}</span>
                              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--admin-accent)' }}>{booking.status.toUpperCase()}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--admin-text-sub)' }}>{new Date(booking.event_date).toLocaleDateString()}</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-sub)', fontStyle: 'italic' }}>No booking history found.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--admin-text-sub)', marginTop: '40px', fontSize: '13px' }}>
                  Select a client to view their information
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {zoomedImage && (
        <div 
          className="admin-image-zoom-overlay" 
          onClick={() => setZoomedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            cursor: 'zoom-out'
          }}
        >
          <img 
            src={zoomedImage} 
            alt="Zoomed" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              borderRadius: '8px', 
              boxShadow: '0 0 40px rgba(0,0,0,0.5)',
              objectFit: 'contain'
            }} 
          />
          <button 
            onClick={() => setZoomedImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            <X size={32} />
          </button>
        </div>
      )}

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
          padding: 15px 20px;
          border-bottom: 1px solid var(--admin-border);
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chat-list-item:hover {
          background-color: var(--admin-bg-soft);
        }
        .chat-list-item.active {
          background-color: var(--admin-hover);
          border-left: 3px solid var(--admin-accent);
        }
        .chat-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .chat-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }
        .chat-time {
          font-size: 11px;
          color: var(--admin-text-sub);
        }
        .chat-preview-message p {
          margin: 0;
          font-size: 13px;
          color: var(--admin-text-sub);
        }
        .admin-dropdown-menu button:hover {
          background-color: var(--admin-hover) !important;
        }
        .image-preview-badge {
          animation: slideUp 0.2s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

// Internal components
const InfoItem = ({ label, value }: { label: string, value: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{ fontSize: '11px', color: 'var(--admin-text-sub)', fontWeight: 500 }}>{label}</span>
    <strong style={{ fontSize: '14px', color: 'var(--admin-text-main)' }}>{value || '---'}</strong>
  </div>
);

// Helper tiny icons
const UserIcon = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

export default AdminMessages;
