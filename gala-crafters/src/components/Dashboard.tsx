import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = authService.getStoredUser();
        setUser(storedUser);
      } catch (err: any) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.first_name}! 👋</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#c49a2c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Your Profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong>Email:</strong>
            <p>{user?.email}</p>
          </div>
          <div>
            <strong>Name:</strong>
            <p>{user?.first_name} {user?.last_name}</p>
          </div>
          <div>
            <strong>Status:</strong>
            <p>{user?.status}</p>
          </div>
          <div>
            <strong>Role:</strong>
            <p>{user?.role}</p>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#e8f4f8', 
        padding: '15px', 
        borderRadius: '8px',
        borderLeft: '4px solid #0288d1'
      }}>
        <p><strong>✅ Backend Connection Works!</strong></p>
        <p>You successfully logged in using the FastAPI backend. Your token is securely stored in localStorage.</p>
      </div>
    </div>
  );
}
