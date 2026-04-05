import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="terms-modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(10, 15, 29, 0.95)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="terms-modal-content"
                        style={{
                            backgroundColor: '#ffffff',
                            width: '100%',
                            maxWidth: '700px',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            position: 'relative',
                            padding: '60px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <button 
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '25px',
                                right: '25px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#333'
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '36px', color: '#c49a2c', marginBottom: '20px', textAlign: 'center' }}>Terms and Conditions</h1>
                        <div className="gold-line" style={{ width: '40px', height: '1px', backgroundColor: '#c49a2c', margin: '0 auto 40px auto' }}></div>
                        
                        <div className="terms-text" style={{ color: '#555', lineHeight: '1.8', fontSize: '15px' }}>
                            <p style={{ marginBottom: '20px' }}>
                                Welcome to Gala Crafters. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions:
                            </p>

                            <h3 style={{ color: '#c49a2c', margin: '30px 0 10px 0', fontSize: '18px' }}>1. SERVICE AGREEMENT</h3>
                            <p>Gala Crafters provides professional catering and event styling services. All bookings are subject to availability and formal confirmation via our reservation system.</p>

                            <h3 style={{ color: '#c49a2c', margin: '30px 0 10px 0', fontSize: '18px' }}>2. BOOKING & PAYMENTS</h3>
                            <p>A deposit is required to secure your event date. Full payment must be settled according to the payment schedule outlined in your specific package agreement.</p>

                            <h3 style={{ color: '#c49a2c', margin: '30px 0 10px 0', fontSize: '18px' }}>3. CANCELLATIONS</h3>
                            <p>Cancellations must be made in writing. Refund eligibility depends on the timeframe of the cancellation relative to the event date.</p>

                            <h3 style={{ color: '#c49a2c', margin: '30px 0 10px 0', fontSize: '18px' }}>4. EVENT LOGISTICS</h3>
                            <p>Clients are responsible for ensuring the venue allows catering and has necessary permits. Gala Crafters will coordinate logistics as specified in the chosen package.</p>

                            <h3 style={{ color: '#c49a2c', margin: '30px 0 10px 0', fontSize: '18px' }}>5. LIABILITY</h3>
                            <p>Gala Crafters is not liable for failures due to circumstances beyond our reasonable control, including natural disasters or government restrictions.</p>

                            <p style={{ marginTop: '50px', fontStyle: 'italic', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                                Last Updated: April 2026
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TermsModal;
