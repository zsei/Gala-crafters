import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Bell, 
  CreditCard, 
  Download, 
  Trash2, 
  Check, 
  ChevronRight,
  Edit2,
  X,
  Lock,
  History,
  MessageSquare,
  Gift,
  HelpCircle,
  LogOut,
  Mail,
  Search,
  Plus,
  Send,
  FileText,
  Calendar,
  Star,
  AlertTriangle
} from 'lucide-react';
import { authService } from '../api/auth';
import { API_BASE_URL } from '../api/config';
import { 
  auth as firebaseAuth, 
  onAuthStateChanged
} from '../firebase';
import { sendVerificationEmail } from '../utils/emailjs';
import bgImage from '../assets/img3.jpg';
import './SettingsPage.css';
import './AccountPage.css'; // Reusing existing card styles

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', title: string, message: string}>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [transactionFilter, setTransactionFilter] = useState('All');
  const [transactionSearch, setTransactionSearch] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Define loadAllBookings outside useEffect so it can be called after review submission
  const loadAllBookings = React.useCallback(async () => {
    // 1. Get local bookings and cleanup 'Payment Pending'
    let localBookings = JSON.parse(localStorage.getItem('gala_crafters_bookings') || '[]');
    const originalCount = localBookings.length;
    localBookings = localBookings.filter((b: any) => b.status !== 'Payment Pending');
    
    if (localBookings.length !== originalCount) {
      localStorage.setItem('gala_crafters_bookings', JSON.stringify(localBookings));
    }
    
    // 2. Try to get backend bookings if logged in
    let backendBookings = [];
    let backendFetchSuccess = false;
    try {
      if (authService.isLoggedIn()) {
        const [fetchedBookings, fetchedReviews] = await Promise.all([
          authService.getUserBookings(),
          authService.getUserReviews()
        ]);
        
        setUserReviews(fetchedReviews);
        backendFetchSuccess = true;
        
        // Map backend format to frontend format if they differ
        backendBookings = fetchedBookings.map((b: any) => ({
          id: b.booking_reference || `BK-${b.id}`,
          packageTitle: b.package_name || (b.event_type + " Package"), 
          totalPrice: b.total_price || 0,
          selectedDate: b.event_date || 'TBD',
          guestCount: b.guest_count || 0,
          status: b.status || 'Pending',
          createdAt: b.created_at,
          isBackend: true,
          dbId: b.id,
          formData: {
            firstName: user?.first_name,
            lastName: user?.last_name,
            email: user?.email,
            phone: user?.phone?.replace('+63 9', ''),
            venueAddress: b.venue_proposed,
            notes: b.notes,
            eventLocation: 'Metro Manila' // Default
          }
        }));
      }
    } catch (err) {
      console.error("Failed to fetch backend bookings:", err);
    }

    // 3. Merge and deduplicate (using ID as key)
    // If backend fetch was successful, we should clear local storage to avoid "stale" or "ghost" bookings
    if (backendFetchSuccess && localBookings.length > 0) {
      console.log("Syncing: Clearing local bookings as backend is now the source of truth.", localBookings);
      localStorage.removeItem('gala_crafters_bookings');
      localBookings = [];
    }

    const merged = [...backendBookings];
    localBookings.forEach((lb: any) => {
      // Only add local booking if it's not already in the backend list by ID
      if (!merged.find(mb => mb.id === lb.id)) {
        merged.push(lb);
      }
    });

    // Sort by createdAt descending (newest first)
    setBookings(merged.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      // Tie-breaker: ID descending
      return (b.id || '').localeCompare(a.id || '');
    }));
  }, [user]);

  // Handle tab switching and payment success banner
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryTab = queryParams.get('tab');
    const paymentSuccess = queryParams.get('payment_success') === 'true';
    
    // 1. Handle Tab Switching
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (queryTab) {
      setActiveTab(queryTab);
      // We keep the tab set, but we might want to clear parameters later
    }

    // 2. Handle Payment Success Banner
    if (paymentSuccess) {
      setShowSuccessBanner(true);
      // Ensure bookings are refreshed and filter is set to All to show the new booking
      loadAllBookings();
      setTransactionFilter('All');
      
      // Clean up the URL (Luxury/Professional feel)
      // This removes ?payment_success=true while staying on the same tab
      const cleanUrl = location.pathname + (queryTab ? `?tab=${queryTab}` : '');
      navigate(cleanUrl, { replace: true });
    }
  }, [location.state, location.search, navigate, location.pathname, loadAllBookings]);

  // Auto-hide success banner after 10 seconds
  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner]);

  // Profile Specific States (from AccountPage)
  const [isEditPersonalOpen, setIsEditPersonalOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: ''
  });
  const [addressData, setAddressData] = useState({
    city: '',
    barangay: '',
    postal_code: '',
    building_details: ''
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Review States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Email Verification States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'success' | 'error'>('idle');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);
  const [newEmailValue, setNewEmailValue] = useState('');
  const [isRefreshingEmail, setIsRefreshingEmail] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [generatedEmailCode, setGeneratedEmailCode] = useState('');
  const [emailVerificationError, setEmailVerificationError] = useState('');

  // Phone Verification States
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
  const [phoneVerificationStatus, setPhoneVerificationStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'success'>('idle');
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [phoneVerificationError, setPhoneVerificationError] = useState('');

  const [notificationSettings, setNotificationSettings] = useState({
    promotions: true,
    bookingUpdates: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingLogout, setPendingLogout] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    const userData = authService.getStoredUser();
    if (userData) {
      setUser(userData);
      // Initialize form data
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone?.replace('+63 9', '') || '',
        dateOfBirth: userData.date_of_birth || '',
        age: calculateAge(userData.date_of_birth) || ''
      });
      setAddressData({
        city: userData.city || '',
        barangay: userData.barangay || '',
        postal_code: userData.postal_code || '',
        building_details: userData.building_details || ''
      });

      // Also fetch fresh user profile from backend to ensure data is synced
      authService.getProfile().then(freshData => {
        if (freshData) {
          setUser(freshData);
          localStorage.setItem('user', JSON.stringify(freshData));
          setFormData({
            firstName: freshData.first_name || '',
            lastName: freshData.last_name || '',
            email: freshData.email || '',
            phone: freshData.phone?.replace('+63 9', '') || '',
            dateOfBirth: freshData.date_of_birth || '',
            age: calculateAge(freshData.date_of_birth) || ''
          });
          setAddressData({
            city: freshData.city || '',
            barangay: freshData.barangay || '',
            postal_code: freshData.postal_code || '',
            building_details: freshData.building_details || ''
          });
        }
      }).catch(err => console.error("Failed to sync profile:", err));
    }

    // Load notification settings
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
    
    setLoading(false);
  }, [navigate]);

  const handleNotificationChange = (field: string, value: boolean) => {
    const updated = { ...notificationSettings, [field]: value };
    setNotificationSettings(updated);
    localStorage.setItem('notificationSettings', JSON.stringify(updated));
    
    // Dispatch a custom event for Navbar to pick up
    window.dispatchEvent(new CustomEvent('notification_settings_updated', { detail: updated }));
    
    showNotification('success', 'Updated', 'Notification settings updated');
  };

  useEffect(() => {
    // Check both location.state and query parameters for tab switching
    const queryParams = new URLSearchParams(location.search);
    const queryTab = queryParams.get('tab');
    
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (queryTab) {
      setActiveTab(queryTab);
      // We don't necessarily clear query params here so that payment_success stays for render
    }
  }, [location.state, location.search, navigate]);

  // Detect unsaved changes in profile/address forms
  useEffect(() => {
    if (!user) return;
    
    const hasChanges = 
      formData.firstName !== (user.first_name || '') ||
      formData.lastName !== (user.last_name || '') ||
      formData.email !== (user.email || '') ||
      formData.phone !== (user.phone?.replace('+63 9', '') || '') ||
      formData.dateOfBirth !== (user.date_of_birth || '') ||
      addressData.city !== (user.city || '') ||
      addressData.barangay !== (user.barangay || '') ||
      addressData.postal_code !== (user.postal_code || '') ||
      addressData.building_details !== (user.building_details || '');
    
    setHasUnsavedChanges(hasChanges);
  }, [formData, addressData, user]);

  // Warn user about unsaved changes before page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (activeTab === 'transactions' || activeTab === 'reviews') {
      loadAllBookings();
    }
  }, [activeTab, loadAllBookings]);

  // Profile Helper Functions
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age.toString() : '';
  };

  const validateName = (name: string) => /^[a-zA-Z\s]*$/.test(name);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => phone.replace(/[^\d]/g, '').length === 9;

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'dateOfBirth') updated.age = calculateAge(value);
      return updated;
    });
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: any = {};
    if (!validateName(formData.firstName)) errors.firstName = 'First name can only contain letters and spaces';
    if (!validateName(formData.lastName)) errors.lastName = 'Last name can only contain letters and spaces';
    if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address';
    if (!validatePhone(formData.phone)) errors.phone = 'Phone must have exactly 9 digits after +63 9';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePersonalInfo = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const emailChanged = formData.email.toLowerCase() !== user.email.toLowerCase();
        
        const updateData: any = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: '+63 9' + formData.phone.replace(/\D/g, '').replace(/^639/, '').slice(0, 9),
          date_of_birth: formData.dateOfBirth
        };
        
        if (emailChanged) {
          updateData.is_email_verified = false;
        }

        const result = await authService.updateProfile(updateData);
        const updatedUser = { ...user, ...(result.user || updateData) };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditPersonalOpen(false);
        showNotification('success', 'Success', 'Your changes are saved successfully');
        
        if (emailChanged) {
          setEmailSentStatus('idle'); // Reset verification UI
        }
      } catch (err: any) {
        setFormErrors({ submit: err.message || 'Failed to update profile' });
        showNotification('error', 'Error', err.message || 'Error has occurred while saving changes.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveAddress = async () => {
    try {
      setLoading(true);
      const result = await authService.updateProfile(addressData);
      const updatedUser = { ...user, ...(result.user || addressData) };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditAddressOpen(false);
      showNotification('success', 'Success', 'Your changes are saved successfully');
    } catch (err: any) {
      showNotification('error', 'Error', err.message || 'Error has occurred while saving changes.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
      setPendingLogout(true);
    } else {
      setShowLogoutModal(true);
    }
  };

  const handleSaveAndLogout = async () => {
    try {
      const emailChanged = formData.email.toLowerCase() !== user.email.toLowerCase();
      
      // Save all pending changes
      const updateData: any = {
        ...formData,
        ...addressData,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: `+63 9${formData.phone.replace(/\D/g, '').replace(/^639/, '').slice(0, 9)}`,
        date_of_birth: formData.dateOfBirth
      };
      
      if (emailChanged) {
        updateData.is_email_verified = false;
      }
      
      await authService.updateProfile(updateData);
      showNotification('success', 'Changes Saved', 'Your profile has been updated.');
      setHasUnsavedChanges(false);
      setShowUnsavedWarning(false);
      setPendingLogout(false);
      // Now proceed to logout
      setShowLogoutModal(true);
    } catch (err: any) {
      showNotification('error', 'Save Failed', err.message || 'Failed to save changes.');
    }
  };

  const handleDiscardAndLogout = () => {
    setShowUnsavedWarning(false);
    setPendingLogout(false);
    setHasUnsavedChanges(false);
    setShowLogoutModal(true);
  };

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open_gala_chat'));
  };

  const handleOpenComplaint = () => {
    setComplaintForm({
      bookingId: '',
      category: 'Service Quality',
      subject: '',
      details: ''
    });
    setComplaintErrors({});
    setComplaintStatus('idle');
    setShowComplaintModal(true);
  };

  const handleRateBooking = (booking: any) => {
    setSelectedBookingForReview(booking);
    setShowReviewModal(true);
    setRating(0);
    setReviewComment('');
  };

  const submitReview = async () => {
    if (rating === 0) {
      showNotification('error', 'Rating Required', 'Please select at least 1 star.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const token = localStorage.getItem('token');
      // For backend bookings, use dbId, otherwise it might be a local booking (id)
      const bookingId = selectedBookingForReview.dbId || selectedBookingForReview.id;
      
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_id: bookingId,
          rating: rating,
          comment: reviewComment
        })
      });

      if (response.ok) {
        showNotification('success', 'Review Submitted', 'Thank you for your feedback!');
        setShowReviewModal(false);
        // Re-fetch data to update the UI (Rate -> Rated)
        loadAllBookings();
      } else {
        const data = await response.json();
        showNotification('error', 'Submission Failed', data.detail || 'Failed to submit review.');
      }
    } catch (err: any) {
      console.error("Review submission error:", err);
      showNotification('error', 'Error', err.message || 'An error occurred while submitting your review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSubmitComplaint = async () => {
    // Basic validation
    const errors: any = {};
    if (!complaintForm.bookingId) errors.bookingId = 'Please select an event';
    if (!complaintForm.subject.trim()) errors.subject = 'Please enter a subject';
    if (!complaintForm.details.trim()) errors.details = 'Please provide report details';

    if (Object.keys(errors).length > 0) {
      setComplaintErrors(errors);
      return;
    }

    setComplaintStatus('submitting');
    
    try {
      // Find the selected booking details
      const selectedBooking = bookings.find(b => b.id === complaintForm.bookingId);
      
      // Format the message with report details
      const reportMessage = `EVENT REPORT SUBMISSION

Report Category: ${complaintForm.category}
Subject: ${complaintForm.subject}

Event Details:
Package: ${selectedBooking?.packageTitle || 'N/A'}
Date: ${selectedBooking?.selectedDate || 'N/A'}
Booking ID: ${selectedBooking?.id || complaintForm.bookingId}

Detailed Report:
${complaintForm.details}`;

      // Prepare the payload - ensure all fields are correct types
      const payload: any = {
        message_body: reportMessage,
        name: user?.first_name ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`.trim() : (user?.email || 'User'),
        email: user?.email || 'user@galacrafters.com',
        subject: `Event Report: ${complaintForm.subject}`
      };

      // Only include user_id if it exists and is valid
      if (user?.id) {
        payload.user_id = parseInt(user.id);
      }

      // Only include image_url if it exists
      if (user?.profile_picture_url) {
        payload.image_url = user.profile_picture_url;
      }

      console.log('Submitting report with payload:', payload);

      // Send the report to admin via chat API
      const response = await fetch(`${API_BASE_URL}/api/chat/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        const errorMsg = responseData.detail || responseData.message || 'Failed to submit report';
        throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }

      setComplaintStatus('success');
      // Hide success message after 3 seconds and close modal
      setTimeout(() => {
        setShowComplaintModal(false);
        setComplaintStatus('idle');
        // Reset form
        setComplaintForm({
          bookingId: '',
          category: 'Service Quality',
          subject: '',
          details: ''
        });
        setComplaintErrors({});
      }, 3000);
      
      showNotification('success', 'Report Submitted', 'Your report has been sent to our team and will be reviewed shortly.');
    } catch (err: any) {
      console.error('Error submitting report:', err);
      setComplaintStatus('idle');
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit your report. Please try again.';
      showNotification('error', 'Submission Failed', errorMessage);
    }
  };

  const confirmLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleOpenEmailModal = () => {
    setNewEmailValue(user.email);
    setEmailSentStatus('idle');
    setIsEmailModalOpen(true);
  };

  const handleUpdateEmail = async () => {
    if (!validateEmail(newEmailValue)) {
      showNotification('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    
    if (newEmailValue === user.email) {
      setIsEmailModalOpen(false);
      return;
    }

    try {
      setEmailUpdateLoading(true);
      const result = await authService.updateProfile({ 
        email: newEmailValue,
        is_email_verified: false // Reset verification status on email change
      });
      
      setUser({ ...user, email: newEmailValue, is_email_verified: false });
      showNotification('success', 'Email Updated', 'Your email address has been updated. Please verify it.');
      setEmailSentStatus('idle'); // Reset verification status for new email
    } catch (err: any) {
      showNotification('error', 'Update Failed', err.message || 'Failed to update email address.');
    } finally {
      setEmailUpdateLoading(false);
    }
  };

  const handleSendVerification = async () => {
    try {
      setEmailSentStatus('sending');
      setEmailVerificationError('');
      
      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedEmailCode(code);

      // Send via EmailJS
      await sendVerificationEmail(user.email, user.first_name, code);
      
      setEmailSentStatus('sent');
      showNotification('success', 'Code Sent', 'A verification code has been sent to your email.');
    } catch (err: any) {
      console.error("Verification error:", err);
      setEmailSentStatus('error');
      setEmailVerificationError(err.message || 'Failed to send verification email.');
      showNotification('error', 'Verification Failed', err.message || 'Failed to send verification email.');
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!emailVerificationCode.trim()) {
      setEmailVerificationError('Please enter the verification code');
      return;
    }

    if (emailVerificationCode !== generatedEmailCode) {
      setEmailVerificationError('Invalid verification code. Please check your inbox.');
      return;
    }

    try {
      setEmailSentStatus('verifying');
      
      // Update database using authService
      await authService.updateProfile({ is_email_verified: true });
      
      setEmailSentStatus('success');
      setUser({ ...user, is_email_verified: true });
      localStorage.setItem('user', JSON.stringify({ ...user, is_email_verified: true }));
      
      showNotification('success', 'Email Verified', 'Your email address has been verified successfully!');
      
      // Close modal after success
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setEmailSentStatus('idle');
        setEmailVerificationCode('');
        setGeneratedEmailCode('');
      }, 1500);
    } catch (err: any) {
      console.error('Email verification update error:', err);
      setEmailSentStatus('sent');
      setEmailVerificationError(err.message || 'Failed to update verification status');
    }
  };

  const refreshEmailStatus = async () => {
    try {
      setIsRefreshingEmail(true);
      const freshData = await authService.getProfile();
      if (freshData) {
        setUser(freshData);
        localStorage.setItem('user', JSON.stringify(freshData));
        showNotification('success', 'Status Updated', 'Email verification status has been refreshed!');
      }
    } catch (err: any) {
      showNotification('error', 'Refresh Failed', err.message || 'Failed to refresh email status.');
    } finally {
      setIsRefreshingEmail(false);
    }
  };

  const handleOpenPhoneModal = () => {
    setEditedPhoneNumber(user.phone || '');
    setPhoneVerificationStatus('idle');
    setPhoneVerificationCode('');
    setPhoneVerificationError('');
    setIsPhoneModalOpen(true);
  };

  const handleSendPhoneVerification = async () => {
    try {
      setPhoneVerificationStatus('sending');
      setPhoneVerificationError('');
      
      // Update user phone number if it was changed
      if (editedPhoneNumber !== user.phone) {
        setUser({ ...user, phone: editedPhoneNumber });
        localStorage.setItem('user', JSON.stringify({ ...user, phone: editedPhoneNumber }));
      }
      
      // Call backend to send SMS code
      const result = await authService.sendPhoneVerificationCode(editedPhoneNumber);
      
      setPhoneVerificationStatus('sent');
      showNotification('success', 'Code Sent', 'Verification code sent to your phone!');
    } catch (err: any) {
      console.error('Phone verification error:', err);
      setPhoneVerificationStatus('idle');
      setPhoneVerificationError(err.message || 'Failed to send verification code');
      showNotification('error', 'Failed', err.message || 'Failed to send verification code');
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (!phoneVerificationCode.trim()) {
      setPhoneVerificationError('Please enter the verification code');
      return;
    }

    try {
      setPhoneVerificationStatus('verifying');
      setPhoneVerificationError('');

      // Verify code with backend
      const result = await authService.verifyPhoneNumber(editedPhoneNumber, phoneVerificationCode);
      
      setPhoneVerificationStatus('success');
      setUser({ ...user, is_phone_verified: true, phone: editedPhoneNumber });
      localStorage.setItem('user', JSON.stringify({ ...user, is_phone_verified: true, phone: editedPhoneNumber }));
      showNotification('success', 'Phone Verified', 'Your phone number has been verified successfully!');
      
      setTimeout(() => {
        setIsPhoneModalOpen(false);
        setPhoneVerificationStatus('idle');
        setPhoneVerificationCode('');
      }, 1000);
    } catch (err: any) {
      console.error('Verification error:', err);
      setPhoneVerificationStatus('sent');
      setPhoneVerificationError(err.message || 'Invalid or expired code');
      showNotification('error', 'Verification Failed', err.message || 'Failed to verify phone');
    }
  };

  if (loading || !user) {
    return <div className="settings-page-loader">Loading...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'security':
        return (
          <div className="settings-tab-section security-tab-content">
            {/* Email Address */}
            <div className="settings-group">
              <div className="settings-group-info">
                <div className="settings-group-title" style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Email address</div>
                <div className="settings-group-desc" style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '10px' }}>The email address associated with your account.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', color: '#ffffff', fontWeight: '500' }}>{user.email}</span>
                  {user.is_email_verified ? (
                    <span className="badge-verified" style={{ 
                      backgroundColor: 'rgba(52, 199, 89, 0.1)', 
                      color: '#34c759', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      VERIFIED
                    </span>
                  ) : (
                    <span className="badge-unverified" style={{ 
                      backgroundColor: 'rgba(255, 59, 48, 0.1)', 
                      color: '#ff3b30', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>UNVERIFIED</span>
                  )}
                </div>
              </div>
              <button 
                className="edit-btn-mini" 
                onClick={handleOpenEmailModal}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '6px 14px', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Edit <Edit2 size={14} />
              </button>
            </div>

            {/* Phone Number */}
            <div className="settings-group" style={{ paddingTop: '0px', marginTop: '0px' }}>
              <div className="settings-group-info">
                <div className="settings-group-title" style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Phone number</div>
                <div className="settings-group-desc" style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '10px' }}>The phone number associated with your account.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', color: '#ffffff', fontWeight: '500' }}>{user.phone || 'Not set'}</span>
                  {user.is_phone_verified ? (
                    <span className="badge-verified" style={{ 
                      backgroundColor: 'rgba(52, 199, 89, 0.1)', 
                      color: '#34c759', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      VERIFIED
                    </span>
                  ) : (
                    <span className="badge-unverified" style={{ 
                      backgroundColor: 'rgba(255, 59, 48, 0.1)', 
                      color: '#ff3b30', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>UNVERIFIED</span>
                  )}
                </div>
              </div>
              <button 
                className="edit-btn-mini"
                onClick={handleOpenPhoneModal}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '6px 14px', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Edit <Edit2 size={14} />
              </button>
            </div>

            {/* Password */}
            <div className="settings-group">
              <div className="settings-group-info">
                <div className="settings-group-title">Password</div>
                <div className="settings-group-desc">Set a unique password to protect your account.</div>
              </div>
              <button className="action-btn" onClick={() => setShowPasswordModal(true)}>Change Password</button>
            </div>

            {/* Delete Account */}
            <div className="settings-group">
              <div className="settings-group-info">
                <div className="settings-group-title">Delete Account</div>
                <div className="settings-group-desc">This will delete your account. Your account will be permanently deleted from Gala Crafters.</div>
              </div>
              <button className="action-link danger" onClick={() => setShowDeleteModal(true)}>Delete</button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="settings-tab-section profile-tab-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {/* Profile Header Card */}
              <div className="profile-card profile-header-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' }}>
                <div className="avatar-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                  <div className="avatar-wrapper">
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt="Avatar" className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">{user.first_name?.charAt(0)}{user.last_name?.charAt(0)}</div>
                    )}
                  </div>
                  <div className="avatar-info">
                    <h2 className="user-name">{user.first_name} {user.last_name}</h2>
                    <div className="user-role-label">{user.role}</div>
                    
                    {/* Verification Status Badge */}
                    {(() => {
                      const isEmailVerified = user.is_email_verified;
                      const isPhoneVerified = user.is_phone_verified;
                      
                      let statusText = '';
                      let statusColor = '';
                      let statusDescription = '';
                      
                      if (isEmailVerified && isPhoneVerified) {
                        statusText = 'FULLY VERIFIED MEMBER';
                        statusColor = '#4CAF50';
                        statusDescription = 'Your account is fully verified with email and phone number confirmation. You have access to all platform features.';
                      } else if (isEmailVerified || isPhoneVerified) {
                        statusText = 'VERIFIED MEMBER';
                        statusColor = '#2196F3';
                        statusDescription = `${isEmailVerified ? 'Email verified' : 'Phone verified'}. Please verify your ${isEmailVerified ? 'phone number' : 'email address'} to become a fully verified member.`;
                      } else {
                        statusText = 'UNVERIFIED MEMBER';
                        statusColor = '#FF9800';
                        statusDescription = 'Please verify your email address and phone number to fully experience all platform features and services.';
                      }
                      
                      return (
                        <div 
                          style={{
                            marginTop: '8px',
                            padding: '6px 12px',
                            backgroundColor: `${statusColor}20`,
                            border: `1px solid ${statusColor}`,
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: statusColor,
                            cursor: 'help',
                            position: 'relative',
                            display: 'inline-block',
                            letterSpacing: '0.5px'
                          }}
                          title={statusDescription}
                          onMouseEnter={(e) => {
                            const tooltip = document.createElement('div');
                            tooltip.id = 'verification-tooltip';
                            tooltip.style.cssText = `
                              position: absolute;
                              bottom: 110%;
                              left: 0;
                              backgroundColor: #333;
                              color: #fff;
                              padding: 8px 12px;
                              borderRadius: 4px;
                              fontSize: 12px;
                              whiteSpace: nowrap;
                              zIndex: 1000;
                              pointerEvents: none;
                              boxShadow: 0 2px 8px rgba(0,0,0,0.2);
                            `;
                            tooltip.innerText = statusDescription;
                            e.currentTarget.appendChild(tooltip);
                          }}
                          onMouseLeave={(e) => {
                            const tooltip = e.currentTarget.querySelector('#verification-tooltip');
                            if (tooltip) tooltip.remove();
                          }}
                        >
                          {statusText}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Personal Info Card */}
              <div className="profile-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' }}>
                <div className="card-header" style={{ marginBottom: '5px', borderBottom: 'none', paddingBottom: '0' }}>
                  <h2 className="card-title" style={{ fontSize: '18px', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '800' }}>Personal Information</h2>
                </div>
                <div className="info-grid personal-grid" style={{ rowGap: '15px' }}>
                  <div className="info-item">
                    <div className="info-label">First Name</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.first_name}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Last Name</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.last_name}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Email Address</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.email}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Phone Number</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.phone}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Date of Birth</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.date_of_birth || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Age</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{calculateAge(user.date_of_birth) || 'N/A'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button className="edit-btn-primary" onClick={() => setIsEditPersonalOpen(true)} style={{ backgroundColor: '#c49a2c' }}>
                    Edit <Edit2 size={14} className="edit-icon" />
                  </button>
                </div>
              </div>

              {/* Address Card */}
              <div className="profile-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0', marginTop: '5px' }}>
                <div className="card-header" style={{ marginBottom: '5px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', paddingBottom: '0', borderBottom: 'none' }}>
                  <h2 className="card-title" style={{ fontSize: '18px', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '800' }}>Address</h2>
                </div>
                <div className="info-grid address-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', rowGap: '15px' }}>
                  <div className="info-item">
                    <div className="info-label">City</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.city || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Barangay</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.barangay || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Postal Code</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.postal_code || 'Not set'}</div>
                  </div>
                  <div className="info-item" style={{ gridColumn: 'span 3' }}>
                    <div className="info-label">Street Name, Building, etc. (Optional)</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.building_details || 'Not set'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                  <button className="edit-btn-secondary" onClick={() => setIsEditAddressOpen(true)} style={{ color: '#c49a2c', border: '1px solid rgba(196,154,44,0.4)', background: 'transparent' }}>
                    Edit <Edit2 size={14} className="edit-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'transactions':
        const filteredBookings = bookings.filter(booking => {
          // Robust status matching (case-insensitive and trimmed)
          const bStatus = (booking.status || '').trim().toLowerCase();
          const tFilter = (transactionFilter || 'All').trim().toLowerCase();
          
          const matchesFilter = tFilter === 'all' || bStatus === tFilter || 
                               (tFilter === 'completed' && bStatus === 'completed event');
          
          // Robust search matching
          const searchLower = (transactionSearch || '').toLowerCase();
          const bId = String(booking.id || '').toLowerCase();
          const bTitle = String(booking.packageTitle || '').toLowerCase();
          
          const matchesSearch = searchLower === '' || 
                               bId.includes(searchLower) || 
                               bTitle.includes(searchLower);
          
          return matchesFilter && matchesSearch;
        });

        return (
          <div className="settings-tab-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <h2 className="settings-header-title" style={{ margin: 0 }}>Transaction History</h2>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input 
                    type="text" 
                    placeholder="Search by ID or Package..." 
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    style={{ 
                      background: 'rgba(10, 15, 29, 0.6)', 
                      border: '1px solid rgba(196, 154, 44, 0.3)', 
                      borderRadius: '8px', 
                      padding: '8px 12px 8px 35px', 
                      color: 'white',
                      fontSize: '14px',
                      width: '220px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <select 
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value)}
                  style={{ 
                    background: 'rgba(10, 15, 29, 0.6)', 
                    border: '1px solid rgba(196, 154, 44, 0.3)', 
                    borderRadius: '8px', 
                    padding: '8px 12px', 
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All" style={{ background: '#0a0f1d', color: 'white' }}>All Status</option>
                  <option value="Pending" style={{ background: '#0a0f1d', color: 'white' }}>Pending</option>
                  <option value="Confirmed" style={{ background: '#0a0f1d', color: 'white' }}>Confirmed</option>
                  <option value="Completed" style={{ background: '#0a0f1d', color: 'white' }}>Completed</option>
                  <option value="Cancelled" style={{ background: '#0a0f1d', color: 'white' }}>Cancelled</option>
                </select>
              </div>
            </div>
            
            {/* Success Banner */}
            {showSuccessBanner && (
              <div style={{ 
                backgroundColor: 'rgba(196, 154, 44, 0.1)', 
                border: '1px solid rgba(196, 154, 44, 0.4)', 
                color: '#c49a2c', 
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                animation: 'slideIn 0.5s ease-out'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', color: '#c49a2c', fontSize: '18px' }}>Payment Successful!</h3>
                  <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                    Your booking is received. Waiting for the Gala Crafter confirmation.
                  </p>
                </div>
              </div>
            )}

            {filteredBookings.length > 0 ? (
              <div className="transaction-list">
                {filteredBookings.map((booking) => {
                  const hasBeenRated = userReviews.some(r => r.booking_id === booking.dbId || r.booking?.booking_reference === booking.id);
                  
                  return (
                    <div key={booking.id} className="transaction-card">
                      <div className="transaction-icon">
                        <History size={24} color="#c49a2c" />
                      </div>
                      <div className="transaction-details">
                        <div className="transaction-main">
                          <span className="transaction-id">{booking.id}</span>
                          <h3 className="transaction-title">{booking.packageTitle}</h3>
                        </div>
                        <div className="transaction-meta">
                          <div style={{ display: 'flex', gap: '15px' }}>
                            <span>Event Date: {booking.selectedDate}</span>
                            {booking.createdAt && (
                              <span style={{ color: '#c49a2c', fontWeight: '600' }}>
                                Booked on: {new Date(booking.createdAt).toLocaleString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                          {booking.createdAt && (
                            <span style={{ opacity: 0.5, fontSize: '11px' }}>
                              Time: {new Date(booking.createdAt).toLocaleString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          )}
                          <span>{booking.guestCount} Guests</span>
                        </div>
                      </div>
                      <div className="transaction-amount-status">
                        <div className="transaction-amount">
                          {booking.totalPrice > 0 ? `₱${booking.totalPrice.toLocaleString()}` : "Price Pending"}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {(booking.status === 'Completed' || booking.status === 'Completed Event') && (
                            <button 
                              className={`rate-btn ${hasBeenRated ? 'rated-mode' : ''}`}
                              onClick={() => !hasBeenRated && handleRateBooking(booking)}
                              disabled={hasBeenRated}
                            >
                              <Star size={14} fill={hasBeenRated ? "#c49a2c" : "none"} /> {hasBeenRated ? 'Rated' : 'Rate'}
                            </button>
                          )}
                          <button 
                            className="details-btn" 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowTransactionDetails(true);
                            }}
                          >
                            View Details
                          </button>
                          <div className={`transaction-status status-${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state-card">
                <History size={48} className="empty-icon" />
                <p>
                  {bookings.length === 0 
                    ? "You have no recent transactions yet." 
                    : "No transactions match your current filters."}
                </p>
                {bookings.length === 0 ? (
                  <button className="action-btn" onClick={() => navigate('/services')}>Explore Services</button>
                ) : (
                  <button className="action-btn" onClick={() => {
                    setTransactionFilter('All');
                    setTransactionSearch('');
                  }}>Clear Filters</button>
                )}
              </div>
            )}
          </div>
        );
      case 'reviews':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">My Reviews</h2>
            
            {userReviews.length > 0 ? (
              <div className="reviews-list">
                {userReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-card-header">
                      <div className="review-booking-info">
                        <h3>{review.booking?.package_name || review.booking?.event_type + ' Package'}</h3>
                        <span className="review-ref">Order Reference: {review.booking?.booking_reference}</span>
                      </div>
                      <div className="review-rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            fill={star <= review.rating ? "#c49a2c" : "none"} 
                            color={star <= review.rating ? "#c49a2c" : "rgba(255,255,255,0.2)"} 
                          />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <div className="review-comment">
                        "{review.comment}"
                      </div>
                    )}

                    <div className="review-order-details">
                      <div className="order-detail-item">
                        <span className="detail-label">Event Date</span>
                        <span className="detail-value">
                          {review.booking?.event_date ? new Date(review.booking.event_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'Not set'}
                        </span>
                      </div>
                      <div className="order-detail-item">
                        <span className="detail-label">Total Amount</span>
                        <span className="detail-value">₱{review.booking?.total_price?.toLocaleString()}</span>
                      </div>
                      <div className="order-detail-item">
                        <span className="detail-label">Status</span>
                        <span className="detail-value" style={{ color: '#c49a2c' }}>Completed</span>
                      </div>
                      <div className="order-detail-item">
                        <span className="detail-label">Review Date</span>
                        <span className="detail-value">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-card">
                <MessageSquare size={48} className="empty-icon" />
                <p>You haven't left any reviews yet.</p>
                <button className="action-btn" onClick={() => setActiveTab('transactions')}>View My Bookings</button>
              </div>
            )}
          </div>
        );
      case 'bonuses':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">Discount and Bonuses</h2>
            <div className="bonus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="bonus-card" style={{ background: 'rgba(196, 154, 44, 0.1)', border: '1px dashed #c49a2c', padding: '25px', borderRadius: '15px', position: 'relative', overflow: 'hidden' }}>
                <Gift style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, transform: 'rotate(-15deg)' }} size={100} />
                <h3 style={{ color: '#c49a2c', fontSize: '20px', fontWeight: '800', marginBottom: '5px' }}>WELCOME GALA</h3>
                <p style={{ color: '#ffffff', fontSize: '14px', marginBottom: '15px' }}>15% off on your first grand wedding booking.</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status: Available</span>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">Notifications</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '5px' }}>Manage how you receive updates and promotional offers.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {/* Promotions & Discounts */}
              <div className="settings-group" style={{ paddingTop: '10px' }}>
                <div className="settings-group-info">
                  <div className="settings-group-title">Promotions & Discounts</div>
                  <div className="settings-group-desc">Get the latest gala deals, seasonal discounts, and early access to packages.</div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.promotions}
                    onChange={(e) => handleNotificationChange('promotions', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Booking Updates */}
              <div className="settings-group" style={{ paddingTop: '10px', borderBottom: 'none' }}>
                <div className="settings-group-info">
                  <div className="settings-group-title">Booking Updates</div>
                  <div className="settings-group-desc">Real-time alerts regarding your ongoing bookings and event schedules.</div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.bookingUpdates}
                    onChange={(e) => handleNotificationChange('bookingUpdates', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="contact-page-wrapper contact-hero-dark" style={{ padding: 0, margin: 0, minHeight: '100vh' }}>
      <section
        className="enhanced-vm-section enhanced-vision"
        style={{
          '--bg-img': `url(${bgImage})`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '80px 0'
        } as React.CSSProperties}
      >
        <div className="settings-container">
          {/* Sidebar */}
          <aside className="settings-sidebar">
            <ul className="sidebar-menu">
              {/* Personal Section */}
              <li className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabChange('profile')} style={{ position: 'relative' }}>
                <User size={18} /> My Profile
                {hasUnsavedChanges && (
                  <span style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    width: '8px', 
                    height: '8px', 
                    background: '#ff3b30', 
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}></span>
                )}
              </li>
              <li className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => handleTabChange('security')}><ShieldCheck size={18} /> Security</li>
              <li className={`sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => handleTabChange('notifications')}><Bell size={18} /> Notifications</li>
              
              <li className="sidebar-divider"></li>

              {/* Activity Section */}
              <li className={`sidebar-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => handleTabChange('transactions')}><History size={18} /> Transaction History</li>
              <li className={`sidebar-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabChange('reviews')}><MessageSquare size={18} /> My Reviews</li>
              <li className={`sidebar-item ${activeTab === 'bonuses' ? 'active' : ''}`} onClick={() => handleTabChange('bonuses')}><Gift size={18} /> Discount and Bonuses</li>
              
              <li className="sidebar-divider"></li>

              {/* Action Section */}
              <li className="sidebar-item logout-item" onClick={handleLogout}><LogOut size={18} /> Log Out</li>
              <li className={`sidebar-item delete-item ${showDeleteModal ? 'active' : ''}`} onClick={() => setShowDeleteModal(true)}><Trash2 size={18} /> Delete Account</li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="settings-content">
            {renderContent()}
          </main>
        </div>
      </section>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-container password-modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Change Password</h2>
              <button 
                className="modal-close-btn" 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }} 
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="modal-form-field full-width">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwordFormData.currentPassword}
                    onChange={(e) => setPasswordFormData({...passwordFormData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="modal-form-field full-width">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwordFormData.newPassword}
                    onChange={(e) => setPasswordFormData({...passwordFormData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="modal-form-field full-width">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordFormData.confirmPassword}
                    onChange={(e) => setPasswordFormData({...passwordFormData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ 
                  color: '#c49a2c', 
                  fontSize: '14px', 
                  textDecoration: 'none',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>Forgot password?</a>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-save-btn" 
                onClick={() => {
                  // Non-functional as requested
                  setShowPasswordModal(false);
                  setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }} 
                style={{ backgroundColor: '#c49a2c' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Personal Info Modal */}
      {isEditPersonalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Edit Personal Information</h2>
              <button className="modal-close-btn" onClick={() => setIsEditPersonalOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form-grid">
                <div className="modal-form-field">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      if (value.length <= 30) handleFormChange('firstName', value);
                    }}
                    placeholder="Enter first name"
                    maxLength={30}
                  />
                  {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                </div>
                <div className="modal-form-field">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      if (value.length <= 30) handleFormChange('lastName', value);
                    }}
                    placeholder="Enter last name"
                    maxLength={30}
                  />
                  {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
                </div>
                <div className="modal-form-field full-width">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    placeholder="example@gmail.com"
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>
                <div className="modal-form-field full-width">
                  <label>Phone Number</label>
                  <div className="phone-input-wrapper-settings" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(196, 154, 44, 0.3)',
                    borderRadius: '8px',
                    padding: '0 16px',
                    height: '45px'
                  }}>
                    <span className="phone-prefix" style={{ color: '#c49a2c', fontWeight: 'bold', marginRight: '8px', whiteSpace: 'nowrap' }}>+63 9</span>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 9) handleFormChange('phone', value);
                      }}
                      placeholder="XXXXXXXXX"
                      style={{ border: 'none', background: 'transparent', padding: '0', color: '#ffffff', outline: 'none', width: '100%', fontSize: '15px' }}
                    />
                  </div>
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>
                <div className="modal-form-field">
                  <label>Date of Birth</label>
                  <input type="date" value={formData.dateOfBirth} onChange={(e) => handleFormChange('dateOfBirth', e.target.value)} />
                </div>
                <div className="modal-form-field">
                  <label>Age</label>
                  <input type="text" value={formData.age} readOnly />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-save-btn" onClick={handleSavePersonalInfo} style={{ backgroundColor: '#c49a2c' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isEditAddressOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Edit Address</h2>
              <button className="modal-close-btn" onClick={() => setIsEditAddressOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form-grid">
                <div className="modal-form-field full-width">
                  <label>City</label>
                  <input type="text" value={addressData.city} onChange={(e) => handleAddressChange('city', e.target.value)} placeholder="Enter city" />
                </div>
                <div className="modal-form-field">
                  <label>Postal Code</label>
                  <input type="text" value={addressData.postal_code} onChange={(e) => handleAddressChange('postal_code', e.target.value)} placeholder="Enter postal code" />
                </div>
                <div className="modal-form-field">
                  <label>Barangay</label>
                  <input type="text" value={addressData.barangay} onChange={(e) => handleAddressChange('barangay', e.target.value)} placeholder="Enter barangay" />
                </div>
                <div className="modal-form-field full-width">
                  <label>Street Name, Building, etc. (Optional)</label>
                  <input type="text" value={addressData.building_details} onChange={(e) => handleAddressChange('building_details', e.target.value)} placeholder="e.g. Street name, Building Name, Floor" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-save-btn" onClick={handleSaveAddress} style={{ backgroundColor: '#c49a2c' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="modal-overlay">
          <div className="modal-container logout-modal-container">
            <div className="logout-modal-content">
              <h2 className="logout-modal-title">You have unsaved changes</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', textAlign: 'center' }}>
                Do you want to save your changes before logging out?
              </p>
              
              <div className="logout-modal-actions">
                <button 
                  className="logout-modal-btn cancel" 
                  onClick={() => setShowUnsavedWarning(false)}
                >
                  Keep Editing
                </button>
                <button 
                  className="logout-modal-btn cancel" 
                  onClick={handleDiscardAndLogout}
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  Discard Changes
                </button>
                <button 
                  className="logout-modal-btn confirm" 
                  onClick={handleSaveAndLogout}
                  style={{ background: '#c49a2c' }}
                >
                  Save & Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container logout-modal-container">
            <div className="logout-modal-content">
              <h2 className="logout-modal-title">Are you sure you want to sign out?</h2>
              
              <div className="logout-modal-actions">
                <button 
                  className="logout-modal-btn cancel" 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="logout-modal-btn confirm" 
                  onClick={confirmLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal-container">
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowDeleteModal(false)}
                style={{ position: 'absolute', right: '20px', top: '20px' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body delete-modal-body" style={{ textAlign: 'center', padding: '0 40px 40px 40px' }}>
              <div className="delete-modal-icon-wrapper" style={{ 
                width: '80px', 
                height: '80px', 
                background: 'rgba(255, 77, 77, 0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 25px auto',
                border: '1px solid rgba(255, 77, 77, 0.3)'
              }}>
                <Trash2 size={40} style={{ color: '#ff4d4d' }} />
              </div>
              
              <h2 className="delete-modal-header" style={{ 
                fontFamily: 'Playfair Display, serif', 
                fontSize: '28px', 
                fontWeight: '900', 
                color: '#ffffff', 
                marginBottom: '15px' 
              }}>Wait, are you sure?</h2>
              
              <p className="delete-modal-desc" style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '16px', 
                lineHeight: '1.6', 
                marginBottom: '30px' 
              }}>
                Deleting your account will permanently remove all your bookings, personal records, and gala data. This action is irreversible.
              </p>
              
              <div className="delete-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button 
                  className="confirm-delete-btn active" 
                  style={{ 
                    width: '100%', 
                    background: '#ff4d4d', 
                    color: '#ffffff', 
                    padding: '15px', 
                    borderRadius: '12px', 
                    fontWeight: '800', 
                    fontSize: '16px', 
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(255, 77, 77, 0.2)',
                    border: 'none'
                  }}
                >
                  Yes, Delete My Account
                </button>
                <button 
                  className="cancel-delete-btn" 
                  onClick={() => setShowDeleteModal(false)}
                  style={{ 
                    width: '100%', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    color: '#ffffff', 
                    padding: '15px', 
                    borderRadius: '12px', 
                    fontWeight: '600', 
                    fontSize: '15px', 
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  No, Keep My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review/Rating Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-container review-modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Rate Your Experience</h2>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowReviewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="review-event-info" style={{ marginBottom: '25px', textAlign: 'center' }}>
                <div style={{ color: '#c49a2c', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>
                  {selectedBookingForReview?.id}
                </div>
                <h3 style={{ fontSize: '20px', color: '#ffffff', margin: 0 }}>
                  {selectedBookingForReview?.packageTitle}
                </h3>
              </div>

              <div className="rating-stars" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star 
                      size={32} 
                      color={star <= rating ? "#c49a2c" : "rgba(255,255,255,0.2)"} 
                      fill={star <= rating ? "#c49a2c" : "none"} 
                      style={{ transition: 'all 0.2s' }}
                    />
                  </button>
                ))}
              </div>

              <div className="modal-form-field full-width">
                <label>Share your feedback (Optional)</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was your experience with Gala Crafters?"
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(196, 154, 44, 0.2)',
                    borderRadius: '8px',
                    padding: '15px',
                    color: '#ffffff',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center', paddingTop: '10px' }}>
              <button 
                className="modal-save-btn" 
                onClick={submitReview}
                disabled={isSubmittingReview || rating === 0}
                style={{ 
                  backgroundColor: rating > 0 ? '#c49a2c' : 'rgba(196, 154, 44, 0.3)',
                  padding: '12px 40px',
                  borderRadius: '30px',
                  width: 'auto'
                }}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-container transaction-details-modal">
            <div className="modal-header">
              <div className="details-header-info">
                <span className="details-id">{selectedBooking.id}</span>
                <h2 className="modal-title">{selectedBooking.packageTitle}</h2>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowTransactionDetails(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body details-modal-scroll">
              {/* Event Overview Section */}
              <div className="details-section">
                <div className="details-section-header">
                  <Calendar size={18} /> 
                  <h3>Event Overview</h3>
                </div>
                <div className="details-grid">
                  <div className="details-item">
                    <label>Event Date</label>
                    <span>{selectedBooking.selectedDate || 'N/A'}</span>
                  </div>
                  <div className="details-item">
                    <label>Guest Count</label>
                    <span>{selectedBooking.guestCount || '0'} Expected</span>
                  </div>
                  <div className="details-item">
                    <label>Total Price</label>
                    <span className="gold-text">₱{selectedBooking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="details-item">
                    <label>Booking Status</label>
                    <span className="status-text">{selectedBooking.status}</span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="details-section">
                <div className="details-section-header">
                  <User size={18} /> 
                  <h3>Personal Information</h3>
                </div>
                <div className="details-grid">
                  <div className="details-item">
                    <label>Client Name</label>
                    <span>
                      {selectedBooking.formData?.firstName || user.first_name || 'Valued'} {' '}
                      {selectedBooking.formData?.lastName || user.last_name || 'Client'}
                    </span>
                  </div>
                  <div className="details-item">
                    <label>Email Address</label>
                    <span>{selectedBooking.formData?.email || user.email}</span>
                  </div>
                  <div className="details-item">
                    <label>Phone Number</label>
                    <span>
                      {selectedBooking.formData?.phone 
                        ? `+63 9${selectedBooking.formData.phone}` 
                        : user.phone || 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Customization */}
              <div className="details-section">
                <div className="details-section-header">
                  <Edit2 size={18} /> 
                  <h3>Event Customization</h3>
                </div>
                <div className="details-grid">
                  <div className="details-item">
                    <label>Event Theme</label>
                    <span>{selectedBooking.formData?.eventTheme || 'Not Specified'}</span>
                  </div>
                  <div className="details-item">
                    <label>Color Palette</label>
                    <span>{selectedBooking.formData?.colorPalette || 'Not Specified'}</span>
                  </div>
                  <div className="details-item full-width">
                    <label>Venue Address ({selectedBooking.formData?.eventLocation})</label>
                    <span>{selectedBooking.formData?.venueAddress || 'Address Not Provided'}</span>
                  </div>
                  {selectedBooking.formData?.notes && (
                    <div className="details-item full-width">
                      <label>Special Requests / Notes</label>
                      <p className="details-notes">{selectedBooking.formData?.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contract Section */}
              <div className="details-section contract-section">
                <div className="contract-box">
                  <div className="contract-info">
                    <FileText size={24} />
                    <div>
                      <h4>Virtual Service Agreement</h4>
                      <p>View your signed contract and terms of service.</p>
                    </div>
                  </div>
                  <a href="/Virtual_Contract.pdf" download className="details-download-btn">
                    <Download size={18} /> Download PDF
                  </a>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-save-btn" 
                onClick={() => setShowTransactionDetails(false)}
                style={{ backgroundColor: '#c49a2c', width: '100%' }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className={`toast-accent ${toast.type}`} />
          <div className="toast-icon-wrapper">
            {toast.type === 'success' ? (
              <div className="toast-icon success">
                <Check size={20} />
              </div>
            ) : (
              <div className="toast-icon error">
                <X size={20} />
              </div>
            )}
          </div>
          <div className="toast-content">
            <h4 className="toast-title">{toast.title}</h4>
            <p className="toast-message">{toast.message}</p>
          </div>
          <button className="toast-close" onClick={() => setToast(prev => ({ ...prev, show: false }))}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Global Animation Style */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Email Verification/Edit Modal */}
      {isEmailModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container email-modal-container" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Email Settings</h2>
              <button className="modal-close-btn" onClick={() => setIsEmailModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Email Input */}
                <div className="modal-form-field full-width">
                  <label>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="email" 
                      value={newEmailValue}
                      onChange={(e) => setNewEmailValue(e.target.value)}
                      placeholder="example@gmail.com"
                      style={{ paddingRight: '100px' }}
                    />
                    <button 
                      onClick={handleUpdateEmail}
                      disabled={emailUpdateLoading || newEmailValue === user.email}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: newEmailValue === user.email ? 'transparent' : '#c49a2c',
                        border: 'none',
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: newEmailValue === user.email ? 'default' : 'pointer',
                        opacity: newEmailValue === user.email ? 0.5 : 1
                      }}
                    >
                      {emailUpdateLoading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
                    Changing your email will require re-verification.
                  </p>
                </div>

                {/* Verification Section */}
                <div className="verification-status-box" style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Mail size={18} color="#c49a2c" />
                      <span style={{ fontWeight: '600', fontSize: '15px', color: '#ffffff' }}>Verification Status</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {!user.is_email_verified && (
                        <button
                          onClick={refreshEmailStatus}
                          disabled={isRefreshingEmail}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(196, 154, 44, 0.3)',
                            color: '#c49a2c',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: isRefreshingEmail ? 'not-allowed' : 'pointer',
                            opacity: isRefreshingEmail ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isRefreshingEmail ? '...' : '↻ Refresh'}
                        </button>
                      )}
                      {user.is_email_verified ? (
                        <span style={{ color: '#34c759', fontSize: '13px', fontWeight: '700' }}>VERIFIED</span>
                      ) : (
                        <span style={{ color: '#ff3b30', fontSize: '13px', fontWeight: '700' }}>UNVERIFIED</span>
                      )}
                    </div>
                  </div>

                  {!user.is_email_verified && (
                    <div className="verification-actions">
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', marginBottom: '16px' }}>
                        {emailSentStatus === 'sent' || emailSentStatus === 'verifying' 
                          ? 'Enter the 6-digit code sent to your email.' 
                          : 'Verify your email to secure your account and receive event updates.'}
                      </p>
                      
                      {emailSentStatus === 'sent' || emailSentStatus === 'verifying' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <input 
                            type="text" 
                            maxLength={6}
                            value={emailVerificationCode}
                            onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            style={{ 
                              textAlign: 'center', 
                              fontSize: '24px', 
                              letterSpacing: '8px', 
                              fontWeight: 'bold',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(196, 154, 44, 0.3)',
                              padding: '12px'
                            }}
                          />
                          {emailVerificationError && (
                            <p style={{ color: '#ff3b30', fontSize: '12px', textAlign: 'center' }}>{emailVerificationError}</p>
                          )}
                          <button 
                            className="modal-save-btn" 
                            onClick={handleVerifyEmailCode}
                            disabled={emailSentStatus === 'verifying' || emailVerificationCode.length < 6}
                            style={{ 
                              backgroundColor: '#c49a2c',
                              width: '100%',
                              height: '45px'
                            }}
                          >
                            {emailSentStatus === 'verifying' ? 'Verifying...' : 'Verify Code'}
                          </button>
                          <button 
                            onClick={handleSendVerification}
                            style={{ background: 'transparent', border: 'none', color: '#c49a2c', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Resend Code
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="modal-save-btn" 
                          onClick={handleSendVerification}
                          disabled={emailSentStatus === 'sending'}
                          style={{ 
                            backgroundColor: '#c49a2c',
                            width: '100%',
                            height: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          {emailSentStatus === 'sending' ? (
                            <>
                              <div className="spinner-mini" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                              Sending Code...
                            </>
                          ) : 'Send Verification Code'}
                        </button>
                      )}
                    </div>
                  )}

                  {user.is_email_verified && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(52, 199, 89, 0.05)', borderRadius: '8px' }}>
                      <Check size={16} color="#34c759" />
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Your email is already verified.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-save-btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setIsEmailModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Verification Modal */}
      {isPhoneModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container email-modal-container" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Verify Phone Number</h2>
              <button className="modal-close-btn" onClick={() => setIsPhoneModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {phoneVerificationStatus === 'idle' || phoneVerificationStatus === 'sending' ? (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
                        Enter your phone number and we'll send a verification code.
                      </p>
                    </div>
                    <input
                      type="text"
                      value={editedPhoneNumber}
                      onChange={(e) => setEditedPhoneNumber(e.target.value)}
                      placeholder="+63 9XXXXXXXXX"
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    />
                    <button 
                      className="modal-save-btn" 
                      onClick={handleSendPhoneVerification}
                      disabled={phoneVerificationStatus === 'sending' || !editedPhoneNumber.trim()}
                      style={{ 
                        backgroundColor: phoneVerificationStatus === 'sending' || !editedPhoneNumber.trim() ? 'rgba(196,154,44,0.5)' : '#c49a2c',
                        width: '100%',
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {phoneVerificationStatus === 'sending' ? (
                        <>
                          <div className="spinner-mini" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          Sending Code...
                        </>
                      ) : 'Send Verification Code'}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
                        Enter the 6-digit code sent to {editedPhoneNumber}
                      </p>
                    </div>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={phoneVerificationCode}
                      onChange={(e) => {
                        setPhoneVerificationCode(e.target.value.replace(/[^\d]/g, ''));
                        setPhoneVerificationError('');
                      }}
                      placeholder="000000"
                      style={{
                        fontSize: '20px',
                        letterSpacing: '8px',
                        textAlign: 'center',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: phoneVerificationError ? '1px solid #ff3b30' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    {phoneVerificationError && (
                      <p style={{ color: '#ff3b30', fontSize: '12px', margin: '0' }}>
                        {phoneVerificationError}
                      </p>
                    )}
                    <button 
                      className="modal-save-btn" 
                      onClick={handleVerifyPhoneCode}
                      disabled={phoneVerificationStatus === 'verifying' || phoneVerificationCode.length !== 6}
                      style={{ 
                        backgroundColor: phoneVerificationStatus === 'verifying' ? 'rgba(196,154,44,0.5)' : '#c49a2c',
                        width: '100%',
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {phoneVerificationStatus === 'verifying' ? (
                        <>
                          <div className="spinner-mini" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Check size={18} /> Verify Code
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleSendPhoneVerification}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#c49a2c',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Resend Code
                    </button>
                  </>
                )}
              </div>
            </div>

            {phoneVerificationStatus !== 'success' && (
              <div className="modal-footer">
                <button className="modal-save-btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setIsPhoneModalOpen(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
