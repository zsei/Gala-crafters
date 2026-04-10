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
            fontSize: '14px',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#a38023')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#c49a2c')}
        >
          Logout
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid #eee'
      }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f9f9f9', paddingBottom: '10px' }}>Your Profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          <div>
            <strong style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>Email Address</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{user?.email}</p>
          </div>
          <div>
            <strong style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>Full Name</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{user?.first_name} {user?.last_name}</p>
          </div>
          <div>
            <strong style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>Account Status</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>
              <span style={{ 
                padding: '4px 10px', 
                backgroundColor: '#e6f4ea', 
                color: '#1e7e34', 
                borderRadius: '20px', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>{user?.status}</span>
            </p>
          </div>
          <div>
            <strong style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>User Role</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{user?.role}</p>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f8fbff', 
        padding: '20px', 
        borderRadius: '8px',
        borderLeft: '5px solid #0288d1'
      }}>
        <p><strong>✅ Backend Connection Works!</strong></p>
        <p style={{ margin: '5px 0 0 0' }}>You successfully logged in using the FastAPI backend. Your session is active.</p>
      </div>
    </div>
  );
}
