import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, Filter, MessageSquare, Calendar, User, Package, ChevronRight, CheckCircle, Clock, ChevronLeft, ChevronDown } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL } from '../../api/config';

interface Review {
  id: number;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  booking_id: number;
  booking_reference: string;
  event_type: string;
  first_name: string;
  last_name: string;
  email: string;
}

const AdminReviews = () => {
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 12;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    // Reset page and close dropdowns when filters change
    useEffect(() => {
        setCurrentPage(1);
        setIsFilterOpen(false);
    }, [ratingFilter]);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            setReviews(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    const toggleSidebar = () => setIsCollapsed(prev => !prev);

    // Filter logic
    const filteredReviews = reviews.filter(review => {
        if (ratingFilter === 'all') return true;
        return review.rating === ratingFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentReviews = filteredReviews.slice(startIndex, endIndex);
    const startCount = filteredReviews.length === 0 ? 0 : startIndex + 1;
    const endCount = Math.min(endIndex, filteredReviews.length);

    // Get visible page numbers (max 5 pages)
    const getVisiblePages = () => {
        const maxVisible = 5;
        const pages = [];
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, currentPage + 2);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        return pages;
    };

    const renderStars = (rating: number) => {
        return (
            <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={14} 
                        className={i < rating ? "star-filled" : "star-empty"} 
                        fill={i < rating ? "var(--admin-accent)" : "transparent"}
                    />
                ))}
            </div>
        );
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getRandomColor = (name: string) => {
        const colors = ['#c49a2c', '#1e293b', '#64748b', '#0f172a', '#d4af37'];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    return (
        <div className="admin-layout">
            <AdminSidebar 
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
            />

            <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
                <header className="bookings-header">
                    <div className="bookings-header-title">
                        <h1>Customer Reviews</h1>
                        <p>Monitor customer feedback and manage public testimonials.</p>
                    </div>
                    
                    <div className="bookings-header-actions">
                        {/* Search bar removed as per request */}
                    </div>
                </header>

                <div className="bookings-toolbar">
                    <div className="filters-group" style={{ position: 'relative' }}>
                        <button 
                            className={`filter-dropdown ${ratingFilter !== 'all' ? 'active' : ''}`}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter size={16} className="text-accent" />
                            Rating: {ratingFilter === 'all' ? 'All' : `${ratingFilter} Stars`}
                            <ChevronDown size={14} className="text-sub" />
                        </button>
                        
                        {isFilterOpen && (
                            <div className="admin-dropdown-menu" style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: '8px',
                                zIndex: 100,
                                minWidth: '180px'
                            }}>
                                <button 
                                    className={`dropdown-item ${ratingFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setRatingFilter('all')}
                                >
                                    All Ratings
                                </button>
                                {[5, 4, 3, 2, 1].map(num => (
                                    <button 
                                        key={num} 
                                        className={`dropdown-item ${ratingFilter === num ? 'active' : ''}`}
                                        onClick={() => setRatingFilter(num)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ display: 'flex' }}>
                                                {[...Array(num)].map((_, i) => (
                                                    <Star key={i} size={10} fill="currentColor" />
                                                ))}
                                            </div>
                                            {num} Stars
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading reviews...</div>
                ) : (
                    <>
                        <div className="reviews-grid">
                            {currentReviews.map((review) => (
                                <div key={review.id} className="admin-card review-card">
                                    <div className="review-card-header">
                                        <div className="customer-info-wrapper">
                                            <div 
                                                className="customer-avatar"
                                                style={{ backgroundColor: getRandomColor(review.first_name) }}
                                            >
                                                {getInitials(review.first_name, review.last_name)}
                                            </div>
                                            <div className="customer-details">
                                                <h4>{review.first_name} {review.last_name}</h4>
                                                <span>{review.email}</span>
                                            </div>
                                        </div>
                                        <div className="review-date">
                                            <Clock size={12} />
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="review-card-body">
                                        <div className="rating-row">
                                            {renderStars(review.rating)}
                                            <span className="rating-number">{review.rating}.0</span>
                                        </div>
                                        <p className="review-comment">"{review.comment}"</p>
                                    </div>

                                    <div className="review-card-footer">
                                        <div className="booking-info-snippet">
                                            <Package size={14} className="text-accent" />
                                            <div className="info-text">
                                                <span className="ref">{review.booking_reference}</span>
                                                <span className="type">{review.event_type}</span>
                                            </div>
                                        </div>
                                        <button 
                                            className="review-action-btn"
                                            onClick={() => navigate(`/admin/bookings?ref=${review.booking_reference}`)}
                                        >
                                            View Booking <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <div className="pagination-info">
                                    Showing {startCount} to {endCount} of {filteredReviews.length} reviews
                                </div>

                                <div className="pagination-right">
                                    <button
                                        className="pagination-arrow"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <div className="pagination-numbers">
                                        {getVisiblePages().map((page) => (
                                            <button
                                                key={page}
                                                className={`page-number ${currentPage === page ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="pagination-arrow"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <style>{`
                .reviews-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 24px;
                }
                .review-card {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .review-card-header {
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 1px solid var(--admin-border);
                }
                .customer-info-wrapper {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                .customer-avatar {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    border: 2px solid var(--admin-white);
                }
                .customer-details h4 {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--admin-text-main);
                    margin: 0;
                }
                .customer-details span {
                    font-size: 12px;
                    color: var(--admin-text-sub);
                }
                .review-date {
                    font-size: 11px;
                    color: var(--admin-text-sub);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .review-card-body {
                    padding: 20px;
                    flex: 1;
                }
                .rating-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                .star-rating {
                    display: flex;
                    gap: 2px;
                }
                .star-filled {
                    color: var(--admin-accent);
                }
                .star-empty {
                    color: var(--admin-border);
                }
                .rating-number {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--admin-text-main);
                }
                .review-comment {
                    font-size: 14px;
                    line-height: 1.6;
                    color: var(--admin-text-main);
                    font-style: italic;
                }
                .review-card-footer {
                    padding: 16px 20px;
                    background-color: var(--admin-hover);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid var(--admin-border);
                }
                .booking-info-snippet {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                .booking-info-snippet .info-text {
                    display: flex;
                    flex-direction: column;
                }
                .booking-info-snippet .ref {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--admin-text-main);
                }
                .booking-info-snippet .type {
                    font-size: 11px;
                    color: var(--admin-text-sub);
                }
                .review-action-btn {
                    background: none;
                    border: none;
                    color: var(--admin-accent);
                    font-size: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    cursor: pointer;
                }
                .review-action-btn:hover {
                    text-decoration: underline;
                }

                .pagination-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px;
                    border-top: 1px solid var(--admin-border);
                    background-color: var(--admin-bg-secondary);
                    margin-top: 24px;
                    border-radius: 8px;
                }

                .pagination-info {
                    font-size: 13px;
                    color: var(--admin-text-sub);
                    font-weight: 500;
                }

                .pagination-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .pagination-arrow {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    background-color: var(--admin-white);
                    border: 1px solid var(--admin-border);
                    border-radius: 4px;
                    color: var(--admin-text-main);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    padding: 0;
                }

                .pagination-arrow:hover:not(:disabled) {
                    background-color: var(--admin-accent);
                    color: var(--admin-white);
                    border-color: var(--admin-accent);
                }

                .pagination-arrow:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination-numbers {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                }

                .page-number {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    color: var(--admin-text-main);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .page-number:hover {
                    background-color: var(--admin-hover);
                    border-color: var(--admin-border);
                }

                .page-number.active {
                    background-color: var(--admin-accent);
                    color: var(--admin-white);
                    border-color: var(--admin-accent);
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default AdminReviews;
