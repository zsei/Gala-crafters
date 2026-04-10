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

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchThread(activeChat.id);
      setShowFullProfile(false); // Reset to history-only view when switching users
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
    <div className="admin-layout">
      <AdminSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main 
        className={`admin-main messages-main ${isCollapsed ? 'collapsed-main' : ''}`}
        style={{ padding: 0, height: '100vh', overflow: 'hidden', marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <div className="messages-layout" style={{ display: 'flex', height: '100%' }}>
          
          {/* Left Panel: Chat List */}
          <section className="chat-list-sidebar" style={{ width: '320px', borderRight: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column' }}>
            <div className="chat-search-header" style={{ padding: '20px' }}>
              <div className="search-input-wrapper chat-search">
                <Search size={16} className="search-icon" />
                <input type="text" placeholder="Search user messages..." />
              </div>
            </div>
            
            <div className="chat-list" style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>No user messages found.</div>
              ) : (
                conversations.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`chat-list-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className="chat-avatar" style={{ backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {getInitials(chat.name)}
                    </div>
                    <div className="chat-preview">
                      <div className="chat-preview-header">
                        <strong>{chat.name}</strong>
                        <span className="chat-time">
                          {chat.last_active ? new Date(chat.last_active).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <div className="chat-preview-message">
                        <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                          {chat.last_message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Middle Panel: Chat Area */}
          <section className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--admin-bg-main)' }}>
            {activeChat ? (
              <>
                <div className="chat-area-header" style={{ padding: '15px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)' }}>
                  <div className="chat-active-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="chat-avatar" style={{ backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', width: '45px', height: '45px', borderRadius: '50%' }}>
                      {getInitials(activeChat.name)}
                    </div>
                    <div className="chat-active-info">
                      <h2 style={{ margin: 0, fontSize: '18px' }}>{activeChat.name}</h2>
                    </div>
                  </div>
                  <div className="chat-header-actions" style={{ position: 'relative' }}>
                    <button className="chat-icon-btn" onClick={() => setShowMenu(!showMenu)}><MoreVertical size={20} /></button>
                    {showMenu && (
                      <div ref={menuRef} className="admin-dropdown-menu" style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        backgroundColor: 'var(--admin-card-bg)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        width: '200px',
                        marginTop: '10px',
                        overflow: 'hidden'
                      }}>
                        <button 
                          style={{
                            width: '100%',
                            padding: '12px 15px',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            color: 'var(--admin-text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '14px'
                          }}
                          onClick={() => {
                            setShowFullProfile(!showFullProfile);
                            setShowMenu(false);
                          }}
                        >
                          {showFullProfile ? <History size={16} /> : <UserCheck size={16} />}
                          {showFullProfile ? 'Show Booking History' : 'View Client Details'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="chat-history" style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                            <div className="chat-avatar-small" style={{ backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '50%', width: '32px', height: '32px', fontSize: '12px', flexShrink: 0 }}>
                              {getInitials(activeChat.name)}
                            </div>
                          )}
                          <div className="chat-message-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%' }}>
                            <div className={`chat-bubble ${msg.type === 'admin' ? 'bg-accent text-white' : 'bg-card text-main'}`} style={{ 
                                padding: '12px 16px', 
                                borderRadius: msg.type === 'admin' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
                                width: 'fit-content',
                                backgroundColor: msg.type === 'admin' ? 'var(--admin-accent)' : 'var(--admin-card-bg)',
                                color: msg.type === 'admin' ? 'white' : 'var(--admin-text-main)',
                                border: msg.type === 'admin' ? 'none' : '1px solid var(--admin-border)'
                              }}>
                              {msg.image_url && (
                                <div style={{ marginBottom: '8px' }}>
                                  <img 
                                    src={msg.image_url} 
                                    alt="attachment" 
                                    style={{ maxWidth: '100%', borderRadius: '8px', cursor: 'zoom-in' }} 
                                    onClick={() => window.open(msg.image_url, '_blank')}
                                  />
                                </div>
                              )}
                              <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</p>
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

          {/* Right Panel: Side Info */}
          <section className="chat-info-sidebar" style={{ width: '350px', borderLeft: '1px solid var(--admin-border)', overflowY: 'auto', padding: '25px', backgroundColor: 'var(--admin-bg-soft)' }}>
            {activeChat ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {/* Header Profile */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto 12px' }}>
                    {getInitials(activeChat.name)}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>{activeChat.name}</h3>
                  <p style={{ margin: '4px 0 0', color: 'var(--admin-text-sub)', fontSize: '13px' }}>{userProfile?.city ? `${userProfile.city}, Philippines` : 'Location not set'}</p>
                </div>

                {showFullProfile ? (
                  <>
                    <button 
                      onClick={() => setShowFullProfile(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--admin-accent)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: 0 }}
                    >
                      <ChevronLeft size={16} /> Back to Booking History
                    </button>

                    {/* Personal Information */}
                    <div>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 15px', fontSize: '13px', color: 'var(--admin-text-sub)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <UserIconSimple size={16} /> Personal Information
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <InfoItem label="First Name" value={userProfile?.first_name || activeChat.name.split(' ')[0]} />
                        <InfoItem label="Last Name" value={userProfile?.last_name || activeChat.name.split(' ')[1] || '---'} />
                        <div style={{ gridColumn: 'span 2' }}>
                          <InfoItem label="Email Address" value={userProfile?.email || activeChat.email} />
                        </div>
                        <InfoItem label="Phone Number" value={userProfile?.phone || activeChat.phone || 'N/A'} />
                        <InfoItem label="Date of Birth" value={userProfile?.date_of_birth || '---'} />
                        <InfoItem label="Age" value={calculateAge(userProfile?.date_of_birth)} />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 15px', fontSize: '13px', color: 'var(--admin-text-sub)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <MapPin size={16} /> Address
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <InfoItem label="City" value={userProfile?.city || '---'} />
                        <InfoItem label="Barangay" value={userProfile?.barangay || '---'} />
                        <InfoItem label="Postal Code" value={userProfile?.postal_code || '---'} />
                        <div style={{ gridColumn: 'span 2' }}>
                          <InfoItem label="Street/Building" value={userProfile?.building_details || '---'} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Booking History Default View */
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 15px', fontSize: '13px', color: 'var(--admin-text-sub)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <History size={16} /> Booking History
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {bookingHistory.length > 0 ? (
                        bookingHistory.map((booking: any) => (
                          <div key={booking.id} style={{ padding: '12px', border: '1px solid var(--admin-border)', borderRadius: '8px', backgroundColor: 'var(--admin-card-bg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <strong style={{ fontSize: '14px' }}>#{booking.reference}</strong>
                              <span style={{ 
                                fontSize: '11px', 
                                padding: '2px 8px', 
                                borderRadius: '10px', 
                                backgroundColor: booking.status === 'Completed' ? '#dcfce7' : booking.status === 'Cancelled' ? '#fee2e2' : '#fef9c3',
                                color: booking.status === 'Completed' ? '#166534' : booking.status === 'Cancelled' ? '#991b1b' : '#854d0e'
                              }}>
                                {booking.status}
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--admin-text-main)', marginBottom: '3px' }}>{booking.package}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--admin-text-sub)' }}>
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                              <strong>₱{booking.total?.toLocaleString()}</strong>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ textAlign: 'center', color: 'var(--admin-text-sub)', fontSize: '13px', margin: '20px 0' }}>No booking history found.</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setShowFullProfile(true)}
                      style={{
                        width: '100%',
                        marginTop: '20px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-accent)',
                        backgroundColor: 'transparent',
                        color: 'var(--admin-accent)',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--admin-accent)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--admin-accent)';
                      }}
                    >
                      View Detailed Profile
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-text-sub)' }}>
                Select a user to view context
              </div>
            )}
          </section>
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
    </div>
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
