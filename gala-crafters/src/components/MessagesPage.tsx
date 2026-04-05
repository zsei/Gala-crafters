import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Mail, 
  FileText, 
  History, 
  ChevronLeft 
} from 'lucide-react';
import { authService } from '../api/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import './MessagesPage.css';

const MessagesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="messages-page-wrapper">
        <div className="messages-container">
          <div className="inbox-header">
            <div>
              <button 
                onClick={() => navigate(-1)} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#c49a2c', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  cursor: 'pointer',
                  marginBottom: '10px',
                  fontWeight: '600'
                }}
              >
                <ChevronLeft size={18} /> Back
              </button>
              <h1 className="messages-header-title">Deep Planning Inbox</h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '16px' }}>
                Discuss quotes, share files, and plan your next grand occasion.
              </p>
            </div>
            <button className="new-message-btn">
              <Plus size={18} /> New Message
            </button>
          </div>

          <div className="inbox-container-dedicated">
            {/* Conversation List */}
            <div className="conversation-sidebar">
              <div className="inbox-search">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search conversations..." />
              </div>
              
              <div className="conversation-list">
                <div className="conversation-item active">
                  <div className="conv-avatar">G</div>
                  <div className="conv-info">
                    <div className="conv-header">
                      <span className="conv-name">Gala Planner - Sarah</span>
                      <span className="conv-time">10:45 AM</span>
                    </div>
                    <div className="conv-preview">I've attached the latest quote for the Elite package...</div>
                  </div>
                </div>
                
                <div className="conversation-item">
                  <div className="conv-avatar gold">V</div>
                  <div className="conv-info">
                    <div className="conv-header">
                      <span className="conv-name">Venue: Grand Ballroom</span>
                      <span className="conv-time">Yesterday</span>
                    </div>
                    <div className="conv-preview">The floor plan for your wedding reception is ready for review.</div>
                  </div>
                </div>

                <div className="conversation-item">
                  <div className="conv-avatar dark">A</div>
                  <div className="conv-info">
                    <div className="conv-header">
                      <span className="conv-name">Account Support</span>
                      <span className="conv-time">2 days ago</span>
                    </div>
                    <div className="conv-preview">Your account verification is complete. Welcome to GALA!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat View Placeholder */}
            <div className="chat-view-dedicated">
              <div className="chat-empty-state">
                <div className="empty-chat-icon">
                  <Mail size={48} />
                </div>
                <h3>Select a conversation</h3>
                <p>Choose a message from the list to start deep planning your event.</p>
                
                <div className="quick-actions-inbox">
                  <button className="inbox-action-card">
                    <FileText size={24} />
                    <span>Review Quotes</span>
                  </button>
                  <button className="inbox-action-card">
                    <History size={24} />
                    <span>Event Timeline</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MessagesPage;
