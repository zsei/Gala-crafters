import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Video, Phone, Paperclip, Send, Clock, Mail, Smartphone, History, Check } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';

const chatList = [
  {
    id: 1,
    name: 'James Wilson',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    message: "I'd like to update my wedding pack...",
    time: '2M AGO',
    unread: true,
    active: true
  },
  {
    id: 2,
    name: 'Elena Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    message: "The promo code isn't working for my c...",
    time: '1H AGO',
    unread: false,
    active: false
  },
  {
    id: 3,
    name: 'Marcus Chen',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026708c',
    message: "Can we add more catering options to t...",
    time: '3H AGO',
    unread: false,
    active: false
  }
];

const messageHistory = [
  {
    id: 1,
    sender: 'system',
    date: 'MAY 24, 2024'
  },
  {
    id: 2,
    sender: 'client',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    text: "Hello! I'm looking at the Grand Wedding Package (ID: #GP-2024). Is it possible to swap the floral arrangements for a more minimalist style?",
    time: '10:42 AM'
  },
  {
    id: 3,
    sender: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    text: "Hi James! Yes, absolutely. We can customize the decor style. Would you like to see our minimalist portfolio for inspiration?",
    time: '10:45 AM',
    read: true
  },
  {
    id: 4,
    sender: 'client',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    text: "Yes please! That would be great. Also, I have a promo code \"GALA10\" but it says it's expired.",
    time: '10:48 AM'
  }
];

const AdminMessages = () => {
  const [isDark, setIsDark] = useState(false);

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

  return (
    <div className={`admin-layout ${isDark ? 'admin-dark-theme' : ''}`}>
      <AdminSidebar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="admin-main messages-main">
        <div className="messages-layout">
          
          {/* Left Panel: Chat List */}
          <section className="chat-list-sidebar">
            <div className="chat-search-header">
              <div className="search-input-wrapper chat-search">
                <Search size={16} className="search-icon" />
                <input type="text" placeholder="Search chats..." />
              </div>
            </div>
            
            <div className="chat-list">
              {chatList.map((chat) => (
                <div key={chat.id} className={`chat-list-item ${chat.active ? 'active' : ''}`}>
                   <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                   <div className="chat-preview">
                     <div className="chat-preview-header">
                       <strong>{chat.name}</strong>
                       <span className={`chat-time ${chat.unread ? 'unread' : ''}`}>{chat.time}</span>
                     </div>
                     <div className="chat-preview-message">
                       <p>{chat.message}</p>
                       {chat.unread && <span className="unread-dot"></span>}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Middle Panel: Chat Area */}
          <section className="chat-area">
            {/* Chat Header */}
            <div className="chat-area-header">
              <div className="chat-active-user">
                <img src={chatList[0].avatar} alt="James Wilson" className="chat-avatar" />
                <div className="chat-active-info">
                  <h2>James Wilson</h2>
                  <span className="user-status font-medium text-success">
                    <span className="status-dot bg-success" style={{ display: 'inline-block', marginRight: '6px' }}></span>
                    Active Now
                  </span>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="chat-icon-btn"><Video size={20} /></button>
                <button className="chat-icon-btn"><Phone size={20} /></button>
                <button className="chat-icon-btn"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Chat History */}
            <div className="chat-history">
              {messageHistory.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="chat-date-divider">
                      <span>{msg.date}</span>
                    </div>
                  );
                }

                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={msg.id} className={`chat-message-row ${isAdmin ? 'admin-message' : 'client-message'}`}>
                    {!isAdmin && <img src={msg.avatar} alt="Client" className="chat-avatar-small" />}
                    <div className="chat-message-content">
                      <div className={`chat-bubble ${isAdmin ? 'bg-accent text-white' : 'bg-card text-main'}`}>
                        <p>{msg.text}</p>
                      </div>
                      <div className="chat-meta">
                        <span>{msg.time}</span>
                        {isAdmin && msg.read && <Check size={14} className="text-accent" />}
                      </div>
                    </div>
                    {isAdmin && <img src={msg.avatar} alt="Admin" className="chat-avatar-small" />}
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="chat-input-area">
               <div className="chat-input-wrapper">
                 <input type="text" placeholder="Type a message..." />
                 <div className="chat-input-actions">
                   <button className="input-icon-btn"><span role="img" aria-label="emoji">😀</span></button>
                   <button className="input-icon-btn"><Paperclip size={18} /></button>
                 </div>
               </div>
               <button className="send-btn bg-accent">
                 <Send size={18} color="#fff" />
               </button>
            </div>
          </section>

          {/* Right Panel: Side Info */}
          <section className="chat-info-sidebar">
            
            {/* Contact Details */}
            <div className="info-block">
              <h3 className="info-title"><UserIcon size={14} /> CUSTOMER DETAILS</h3>
              
              <div className="info-item">
                <Mail size={16} className="text-sub" />
                <div className="info-content">
                  <span className="info-label">EMAIL ADDRESS</span>
                  <strong>j.wilson@example.com</strong>
                </div>
              </div>

              <div className="info-item">
                <Smartphone size={16} className="text-sub" />
                <div className="info-content">
                  <span className="info-label">PHONE NUMBER</span>
                  <strong>+1 (555) 0123-456</strong>
                </div>
              </div>

              <div className="info-item">
                <History size={16} className="text-sub" />
                <div className="info-content">
                  <span className="info-label">CUSTOMER SINCE</span>
                  <strong>Jan 12, 2024</strong>
                </div>
              </div>
            </div>

            {/* Active Booking */}
            <div className="info-block">
              <h3 className="info-title"><BookingIcon size={14} /> ACTIVE BOOKING</h3>
              <div className="active-booking-card">
                <div className="booking-card-header">
                  <span className="badge-pending">PENDING</span>
                  <span className="text-sub font-medium" style={{ fontSize: '11px' }}>#BK-8821</span>
                </div>
                <h4>Grand Wedding Package</h4>
                <p className="text-sub">Sept 28, 2024 • 150 Guests</p>
                <div className="booking-card-footer">
                  <span className="text-sub font-medium" style={{ fontSize: '11px' }}>TOTAL PRICE</span>
                  <strong className="text-accent">$4,500.00</strong>
                </div>
              </div>
            </div>

            {/* Promos */}
            <div className="info-block">
              <h3 className="info-title"><TagIcon size={14} /> APPLIED PROMO CODES</h3>
              <div className="promo-badge expired">
                 <span className="promo-code"><span className="error-dot"></span> GALA10</span>
                 <span className="promo-status">EXPIRED</span>
              </div>
            </div>

            <button className="view-history-btn">
              <Clock size={16} /> View Past Bookings
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
