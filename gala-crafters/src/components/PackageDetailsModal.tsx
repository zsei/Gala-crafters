import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle, Utensils, Sparkles, Layout, Users, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './PackageDetailsModal.css';
import { API_BASE_URL } from '../api/config';

// Existing assets
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img1a.jpg';
import img3 from '../assets/banner-7.jpg';
import heroBg from '../assets/img2b.jpg';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: 'intimate' | 'utopian' | 'elite' | 'debutIntimate' | 'debutClassy' | 'debutVogue' | 'corporateSetA' | 'corporateSetB' | 'corporateSetC' | 'kiddiePlayful' | 'kiddieAdventure' | 'kiddieCarnival' | 'specialIntimate' | 'specialGrand' | 'specialLegacy';
  onReserve: (data: any) => void;
}

const packageData = {
  intimate: {
    title: "Intimate Wedding Package",
    basePrice: 5999,
    description: "Designed for smaller celebrations with those who matter most. We focus on the personal touches that make a close-knit wedding feel truly special and unforgettable.",
    included: [
      { icon: Utensils, title: "Gourmet Buffet Dining", desc: "Full buffet service featuring Appetizer, Soup, Salad, 4 main courses (Beef, Pork, Chicken, Fish), Pasta, Vegetables, and Dessert." },
      { icon: Sparkles, title: "Silverware & Linens", desc: "Fine Chinaware, Glassware and Silverware with stunning table linens in your choice of colors, plus custom menu and place cards." },
      { icon: Layout, title: "Thematic Setups", desc: "Stylish couch and thematic backdrop, Tiffany chairs for all, specialized tables for cake/gifts, and a full beverage bar setup." },
      { icon: Users, title: "Premium Service Team", desc: "Professional uniformed waiters/pantry with PPE, including VIP setup and seated service for gatherings above 40 guests." }
    ],
    details: "Our packages provide a comprehensive foundation for your big day, ensuring excellence from gourmet dining to professional hospitality."
  },
  utopian: {
    title: "Utopian Wedding Package",
    basePrice: 8999,
    description: "Our signature choice for couples who want a beautiful balance of elegance and detail. We handle the heavy lifting so you can enjoy a polished, stress-free celebration.",
    included: [
      { icon: Utensils, title: "Gourmet Grand Buffet", desc: "Appetizer, Soup Bar, Salad Station, Carving Stations (Beef/Pork), 3 Entrees, Pasta, Veggies, 3-Layer Fondant Cake, and signature Lemon Iced Tea." },
      { icon: Sparkles, title: "Elite VIP Experience", desc: "Stylish couch and backdrop, elegant service for 24 VIP guests, custom menu/place cards, and dedicated wine service for VIP tables." },
      { icon: Layout, title: "Sophisticated Venue Setup", desc: "Round tables with Tiffany chairs, premium linens, centerpieces with tealights, aisle runner, and registration/gift/cake setups." },
      { icon: Users, title: "Dedicated Professional Team", desc: "Uniformed staff with PPE, full bar setup, waiters/pantry service, and a chilled bottle of wine for the couple's toast." }
    ],
    details: "The Utopian package offers an elevated catering experience and refined aesthetic details to make your grand celebration truly remarkable."
  },
  elite: {
    title: "Elite Wedding Package",
    basePrice: 12999,
    description: "Our most comprehensive experience. This is for the couple who wants every detail handled—from premium styling to full-scale coordination—for a truly grand celebration.",
    included: [
      { icon: Utensils, title: "Master Chef Grand Buffet", desc: "Welcome Cocktails, Soup/Salad Bars, Dual Carving Stations (Beef & Pork), 3 Entrees, Pasta, Veggies, Fondant Cake or Sound & Lights, and Brewed Coffee/Tea." },
      { icon: Sparkles, title: "Grand VIP & Production", desc: "Elegant VIP setup for 30 guests, Photowall, Reception Cocktail Tables, custom menu/place cards, and premium wine service for VIP tables." },
      { icon: Layout, title: "Palatial Venue Styling", desc: "Tiffany chairs for all, stunning array of linens, table centerpieces with tealights, aisle runner, and specialized registration/gift/cake setups." },
      { icon: Users, title: "White Glove Service Team", desc: "Uniformed staff with PPE, full bar setup for beverage stations, house blend iced tea, and a chilled bottle of wine for the toast." }
    ],
    details: "The Elite package is our ultimate service offering, providing end-to-end management, high-production value, and luxury catering for a legendary wedding event."
  },
  debutIntimate: {
    title: "Intimate Debut Package",
    basePrice: 6499,
    description: "A cherished celebration for your coming-of-age. Perfect for those who want a beautifully personal debut filled with tradition and elegance.",
    included: [
      { icon: Utensils, title: "Grand 10-Course Buffet", desc: "Appetizer, Soup, Salad, 4 main courses (Beef, Pork, Chicken, Fish), Pasta, Vegetables, and Dessert with full buffet service." },
      { icon: Sparkles, title: "Thematic Debut Styling", desc: "Stylish couch and thematic backdrop, customized menu/place cards, and stunning table linens in your choice of colors." },
      { icon: Layout, title: "Essential Event Setup", desc: "Round tables with Tiffany chairs for all, dedicated tables for Cake, Gifts, and Registration, plus a complete beverage bar setup." },
      { icon: Users, title: "VIP Seated Service", desc: "Uniformed staff with PPE, including VIP setup and seated service for 40+ guests, with purified drinking water and ice." }
    ],
    details: "Our Intimate Debut package focuses on the timeless traditions of your special day, ensuring a seamless and sophisticated celebration for you and your guests."
  },
  debutClassy: {
    title: "Classy Debut Package",
    basePrice: 9499,
    description: "An elegant transition with specialized stations, premium seating, and dedicated service for your VIP guests and cherished traditions.",
    included: [
      { icon: Utensils, title: "Signature Grand Buffet", desc: "Appetizer, Soup Bar, Salad Station, Carving Stations (Beef/Pork), 3 Entrees, Pasta, Veggies, 3-Layer Fondant Cake, and signature Lemon Iced Tea." },
      { icon: Sparkles, title: "Traditions & Ceremony", desc: "Full ceremony setup for 18 Roses and 18 Shots, plus customized menu/place cards, menu labels, and table numbers with holders." },
      { icon: Layout, title: "Elite VIP Experience", desc: "Stylish couch and backdrop, elegant service for 24 VIP guests, centerpieces with tealights, and dedicated wine service for VIP tables." },
      { icon: Users, title: "Premium Logistics & Staff", desc: "Tiffany chairs for all, specialized tables for registration/gifts/cake, full beverage bar setup, and uniformed staff with PPE." }
    ],
    details: "The Classy Debut package offers a perfect balance of grandeur and personal touch, specifically tailored for the 18 Roses and 18 Shots ceremony."
  },
  debutVogue: {
    title: "Vogue Debut Package",
    basePrice: 13999,
    description: "Our most lavish cinematic celebration. A grand encounter featuring signature cocktails, dual carving stations, and full-scale event production for a legendary milestone.",
    included: [
      { icon: Utensils, title: "Master Chef Grand Buffet", desc: "Welcome Cocktails, Soup/Salad Bars, Dual Carving Stations (Beef & Pork), 10-course buffet, and choice of Fondant Cake or Sound & Lights." },
      { icon: Sparkles, title: "Signature Ceremony", desc: "Full ceremony setup for 18 Roses and 18 Shots, plus reception cocktail tables, customized menu/place cards, and premium wine service." },
      { icon: Layout, title: "Grand VIP & Production", desc: "Stylish couch and backdrop, elegant service for 30 VIP guests, centerpieces with tealights, and exhaustive registration/gift setups." },
      { icon: Users, title: "Elite Service Concierge", desc: "Uniformed staff with PPE, full beverage bar station, brewed coffee/tea service, and tiffany chairs for all your guests." }
    ],
    details: "The Vogue Debut package is our ultimate service offering, providing a grand cinematic experience with signature cocktails and high-tier production values."
  },
  corporateSetA: {
    title: "Corporate Set A",
    basePrice: 7500,
    description: "Our premier corporate package designed for professional excellence. Perfect for product launches, annual galas, or executive dinners that demand a touch of sophistication.",
    included: [
      { icon: Utensils, title: "Full Course Buffet", desc: "Appetizer, Soup, Salad, 4 Main Courses (Beef, Pork, Chicken, Fish), Pasta, Vegetables, and Dessert." },
      { icon: Sparkles, title: "Executive Setup", desc: "Professional Buffet Setup with Round Tables, Executive Linens, and Tiffany Chairs for all guests." },
      { icon: Layout, title: "Event Essentials", desc: "Registration Table for guest check-ins and a Basic Beverage Bar Setup." },
      { icon: Users, title: "Professional Service", desc: "Uniformed Service Team providing VIP Seated Service (applicable for 40 pax and above), with Purified Water and Ice included." }
    ],
    details: "Corporate Set A provides a comprehensive foundation for your business events, ensuring professional hospitality and gourmet dining for your esteemed guests."
  },
  corporateSetB: {
    title: "Corporate Set B",
    basePrice: 10500,
    description: "An elegant corporate experience featuring specialized carving stations and premium VIP setup. Perfect for professional milestones, product launches, and gala dinners.",
    included: [
      { icon: Utensils, title: "Gourmet Grand Buffet", desc: "Includes Salad Station, Soup Bar, and Main Entrees featuring Beef or Pork Carving Stations with Menu Labels." },
      { icon: Sparkles, title: "VIP Executive Setup", desc: "Stylish Lounge Couch, Brand-aligned Backdrop, Thematic Centerpieces, and Elegant Set-up with Branded Menu/Place Cards." },
      { icon: Layout, title: "Beverage & Hospitality", desc: "House Blend Lemon Iced Tea, Chilled Sparkling Juice for the Ceremonial Toast, and Dedicated Coffee & Tea Station." },
      { icon: Users, title: "Professional Amenities", desc: "Registration, Gifts & Collateral Tables, and Elegant Set-up & Service for VIPs/Executives (Up to 24 pax)." }
    ],
    details: "Corporate Set B offers a superior catering experience with refined aesthetic details to make your professional gathering truly remarkable."
  },
  corporateSetC: {
    title: "Corporate Set C",
    basePrice: 15500,
    description: "Our most grand and lavish corporate package. A cinematic encounter featuring arrival cocktails, dual carving stations, and full-scale event production for a legendary milestone.",
    included: [
      { icon: Utensils, title: "Gourmet Master Buffet", desc: "Arrival Cocktails & Hors d'oeuvres, Dual Carving Stations (Beef & Pork), and Full Buffet with Soup bar / Salad station." },
      { icon: Sparkles, title: "Elite Branding & Staging", desc: "Custom Photowall, Entry Signage, Premium Lounge Suite, Thematic Stage Backdrop, and Ambient Lighting." },
      { icon: Layout, title: "Executive Wine & Bar", desc: "Dedicated Wine Service for VIP tables, Ceremonial Toasting Wine, Premium Coffee Service, and Networking Cocktail Tables." },
      { icon: Users, title: "Full Logistics & Service", desc: "Full Logistics Team, Extended VIP Service (Up to 30 pax), Sound System, and Premium Table Linens in your corporate colors." }
    ],
    details: "Corporate Set C is our ultimate service offering, providing a grand experience with high-tier production values for your most important corporate milestones."
  },
  kiddiePlayful: {
    title: "The Playful Set",
    basePrice: 8500,
    description: "Our delightful starter package for a fun-filled birthday! Featuring kid-friendly favorites, colorful styling, and our cheerful service team to make every child smile.",
    included: [
      { icon: Utensils, title: "Junior Gourmet Buffet", desc: "1 Appetizer, 1 Soup, 1 Salad, 3 Kid-Friendly Main Courses (Chicken, Spaghetti, Fish Fillet), and Dessert." },
      { icon: Sparkles, title: "Cheerful Event Styling", desc: "Basic Thematic Backdrop with colorful accents, Kiddie Tables & Chairs, Cake & Gift Display Table, and Thematic Centerpieces (Balloons or Character Cutouts)." },
      { icon: Layout, title: "Interactive Stations", desc: "Unlimited Purified Water & Juice Station and a Basic Candy Corner Setup (Curation only)." },
      { icon: Users, title: "Professional Fun Team", desc: "Uniformed Service Team in cheerful uniforms, providing professional yet warm hospitality for your little one." }
    ],
    details: "The Playful Set provides all the essentials for a memorable children's party, focusing on yummy food and a vibrant atmosphere."
  },
  kiddieAdventure: {
    title: "The Adventure Set",
    basePrice: 12500,
    description: "An action-packed celebration featuring customized dining stations and grand thematic styling. Perfect for adventurous explorers and high-energy parties!",
    included: [
      { icon: Utensils, title: "Adventure Buffet & Pasta", desc: "Full Adventure Buffet (4 Main Courses, Soup/Salad) and a Custom Pasta Station for the kids with fun themed food labels." },
      { icon: Sparkles, title: "VIP Character Setup", desc: "Stylish Character Couch, Grand Thematic Backdrop, Thematic Centerpieces (Balloon Art/LED), and Character-themed Linens." },
      { icon: Layout, title: "Refreshments & Sweets", desc: "House Blend Iced Tea, Flavored Coolers, Ceremonial Cake Cutting Setup, and a Full Candy Buffet with a variety of treats." },
      { icon: Users, title: "Adventure Logistics", desc: "Elegant Service for VIPs/Parents (Up to 24 pax), Customized Thematic Menu/Place Cards, and a dedicated Registration & Prize Table." }
    ],
    details: "The Adventure Set takes the celebration to the next level with interactive food stations and a grand cinematic theme for your little explorer."
  },
  kiddieCarnival: {
    title: "The Carnival Set",
    basePrice: 18500,
    description: "The ultimate grand celebration for your little star! A magical encounter featuring arrival snacks, grand entrance arch, multiple mascots, and a full-scale dessert extravaganza.",
    included: [
      { icon: Utensils, title: "Grand Carnival Feast", desc: "Arrival Snacks (Hotdogs, Sliders, Nuggets), Grand Carnival Buffet with Beef Carving Station, and Soup/Salad Bar." },
      { icon: Sparkles, title: "Elite Thematic Setup", desc: "Custom Photowall, Grand Entrance Arch, Premium Lounge Suite, Massive Stage Backdrop, and Party Lighting." },
      { icon: Layout, title: "Dessert & Mocktail Bar", desc: "Multiple dessert options with Chocolate Fountain or Ice Cream Cart, Signature Kiddie Mocktails, and Full Candy Station." },
      { icon: Users, title: "Full Event Logistics", desc: "Registration & Gift Management, Extended VIP Service for Elders/Parents (Up to 30 pax), Reception Cocktail Tables, and Photowall with Props Area." }
    ],
    details: "The Carnival Set is our most grand and theatrical offering, providing a massive production value for your child's most important milestones."
  },
  specialIntimate: {
    title: "The Intimate Set",
    basePrice: 9500,
    description: "A refined and elegant package for your most cherished family milestones. Perfect for vow renewals, anniversaries, or exclusive private gatherings.",
    included: [
      { icon: Utensils, title: "Gourmet Family Buffet", desc: "1 Appetizer, 1 Soup, 1 Salad, 4 Main Courses (Beef, Pork, Chicken, Fish), Pasta, Vegetables, and Dessert." },
      { icon: Sparkles, title: "Sophisticated Styling", desc: "Stylish Lounge Couch, Thematic Backdrop, Round Tables with Tiffany Chairs, and Registration & Memory Table." },
      { icon: Layout, title: "Beverage & Details", desc: "Purified Drinking Water and Ice, Beverage Bar Setup, and Customized Menu & Place Cards for family tables." },
      { icon: Users, title: "Professional Service", desc: "VIP Seated Service (for 40 pax and above) and a Professional Service Team in uniform to ensure a seamless celebration." }
    ],
    details: "The Intimate Set focuses on quality and closeness, providing a high-end dining experience for your closest circle."
  },
  specialGrand: {
    title: "The Grand Set",
    basePrice: 14500,
    description: "An elevated milestone celebration featuring premium carving stations, a dedicated memory lane photowall, and our signature two-layered milestone cake.",
    included: [
      { icon: Utensils, title: "Celebration Buffet & Carving", desc: "Full Celebration Buffet (4 Main Courses, Soup/Salad Bar) and a luxury Beef or Pork Carving Station with menu labels." },
      { icon: Sparkles, title: "VIP Milestone Styling", desc: "Premium Lounge Couch, Stage Backdrop, Thematic Table Linens, Floral/Tealight Centerpieces, and a Memory Lane Photowall." },
      { icon: Layout, title: "Premium Bar & Cake", desc: "Two-Layered Milestone Cake (Fondant/Naked), Bar Set-Up, House Blend Lemon Iced Tea, and Chilled Wine for the toast." },
      { icon: Users, title: "Grand Logistics", desc: "Elegant Seated Service for VIPs and Grandparents (Up to 24 pax), and professional service for all guests to ensure a grand experience." }
    ],
    details: "The Grand Set offers a perfect blend of luxury and personalization, making it ideal for significant family gatherings and major anniversaries."
  },
  specialLegacy: {
    title: "The Legacy Set",
    basePrice: 19500,
    description: "Our most grand and prestigious package for monumental heritage events. A palatial celebration with dual carving stations, premium cocktail hours, and full-scale tribute production.",
    included: [
      { icon: Utensils, title: "Elite Legacy Feast", desc: "Arrival Cocktails & Grazing Platter, Elite Buffet (5 Main Courses, Soup/Salad), and Dual Carving Stations (Beef & Pork)." },
      { icon: Sparkles, title: "Palatial Event Styling", desc: "Grand Entrance Arch, Custom Photowall, Premium Lounge Suite, Full Stage Backdrop, and Commemorative Table Details." },
      { icon: Layout, title: "Premium Bar & Tribute", desc: "VIP Wine Service, Premium Coffee & Tea, Basic Sound System & Ambient Lighting for tribute videos, and Registry & Gift area." },
      { icon: Users, title: "Elite Logistics Team", desc: "Extended VIP Service (up to 30 pax), Reception Cocktail Tables, and a Full Logistics Team for program flow." }
    ],
    details: "The Legacy Set is the ultimate service offering for high-profile milestones, providing an unparalleled cinematic experience to honor your family's history."
  }
};

function toBookingYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({ isOpen, onClose, packageType, onReserve }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoValidating, setPromoValidating] = useState(false);
  const [guestCount, setGuestCount] = useState(20);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 3, 11));
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2026, 3, 11));
  const [blockedBookingDates, setBlockedBookingDates] = useState<Set<string>>(new Set());
  const [bookedEventDates, setBookedEventDates] = useState<Set<string>>(new Set());

  // Review states
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Gallery states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryImages = [img1, img2, img3, heroBg];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Map package types to package IDs
  const packageIdMap: any = {
    intimate: 1,
    utopian: 2,
    elite: 3,
    debutIntimate: 4,
    debutClassy: 5,
    debutVogue: 6,
    corporateSetA: 7,
    corporateSetB: 8,
    corporateSetC: 9,
    kiddiePlayful: 10,
    kiddieAdventure: 11,
    kiddieCarnival: 12,
    specialIntimate: 13,
    specialGrand: 14,
    specialLegacy: 15
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchPackageReviews = async () => {
      try {
        setLoadingReviews(true);
        const packageId = packageIdMap[packageType] || 1;
        const response = await fetch(`${API_BASE_URL}/api/reviews/package/${packageId}`);
        
        if (response.ok) {
          const data = await response.json();
          const reviewsArray = Array.isArray(data) ? data : (data?.reviews || []);
          setReviews(reviewsArray);
          setReviewCount(reviewsArray.length);
          
          // Calculate average rating
          if (reviewsArray.length > 0) {
            const avgRating = reviewsArray.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviewsArray.length;
            setAverageRating(Math.round(avgRating * 10) / 10);
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviewCount(0);
        setAverageRating(0);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (isOpen) {
      fetchPackageReviews();
    }
  }, [isOpen, packageType]);

  useEffect(() => {
    setPromoCode('');
    setIsPromoApplied(false);
    setPromoDiscountAmount(0);
    setPromoError(null);
    setAppliedPromoCode(null);
    setGuestCount(
      packageType === 'intimate' ? 20 : 
      (['utopian', 'elite'].includes(packageType) ? 100 : 
      (packageType.startsWith('corporate') ? 20 : 
      (packageType === 'debutIntimate' ? 20 : 
      (['debutClassy', 'debutVogue'].includes(packageType) ? 100 : 
      (packageType === 'kiddiePlayful' ? 20 : 
      (['kiddieAdventure', 'kiddieCarnival'].includes(packageType) ? 100 : 
      (packageType === 'specialIntimate' ? 20 : 
      (['specialGrand', 'specialLegacy'].includes(packageType) ? 100 : 50))))))))
    );
  }, [isOpen, packageType]);

  useEffect(() => {
    if (!isOpen) return;
    const parseList = (data: unknown): string[] =>
      Array.isArray(data) ? (data as string[]).filter((s) => typeof s === 'string') : [];

    Promise.all([
      fetch(`${API_BASE_URL}/api/blocked-dates`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/booked-dates`).then((r) => r.json()),
    ])
      .then(([blockedRaw, bookedRaw]) => {
        setBlockedBookingDates(new Set(parseList(blockedRaw)));
        setBookedEventDates(new Set(parseList(bookedRaw)));
      })
      .catch(() => {
        setBlockedBookingDates(new Set());
        setBookedEventDates(new Set());
      });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const unavailable = (d: Date) => {
      const ymd = toBookingYMD(d);
      return blockedBookingDates.has(ymd) || bookedEventDates.has(ymd) || d < today;
    };
    if (!unavailable(selectedDate)) return;
    const next = new Date(today);
    for (let i = 0; i < 800; i++) {
      if (!unavailable(next)) {
        setSelectedDate(new Date(next));
        setViewDate(new Date(next.getFullYear(), next.getMonth(), 1));
        break;
      }
      next.setDate(next.getDate() + 1);
    }
  }, [isOpen, blockedBookingDates, bookedEventDates, selectedDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (!isOpen) return null;

  const isIntimateWedding = packageType === 'intimate';
  const isUtopianWedding = packageType === 'utopian';
  const isEliteWedding = packageType === 'elite';
  const isCorporate = packageType.startsWith('corporate');
  const isDebutIntimate = packageType === 'debutIntimate';
  const isDebutClassy = packageType === 'debutClassy';
  const isDebutVogue = packageType === 'debutVogue';
  const isKiddiePlayful = packageType === 'kiddiePlayful';
  const isKiddieAdventure = packageType === 'kiddieAdventure';
  const isKiddieCarnival = packageType === 'kiddieCarnival';
  const isSpecialIntimate = packageType === 'specialIntimate';
  const isSpecialGrand = packageType === 'specialGrand';
  const isSpecialLegacy = packageType === 'specialLegacy';
  
  const intimateMinGuests = 20;
  const weddingMinGuests = 100;
  const corporateMinGuests = 20;
  const debutIntimateMinGuests = 20;
  const debutLargeMinGuests = 100;
  const kiddiePlayfulMinGuests = 20;
  const kiddieLargeMinGuests = 100;
  const specialIntimateMinGuests = 20;
  const specialLargeMinGuests = 100;
  const extraPaxRate = 350;
  
  const minGuests = isIntimateWedding ? intimateMinGuests : 
                    (isUtopianWedding || isEliteWedding ? weddingMinGuests : 
                    (isCorporate ? corporateMinGuests : 
                    (isDebutIntimate ? debutIntimateMinGuests : 
                    (isDebutClassy || isDebutVogue ? debutLargeMinGuests : 
                    (isKiddiePlayful ? kiddiePlayfulMinGuests : 
                    (isKiddieAdventure || isKiddieCarnival ? kiddieLargeMinGuests : 
                    (isSpecialIntimate ? specialIntimateMinGuests : 
                    (isSpecialGrand || isSpecialLegacy ? specialLargeMinGuests : 1))))))));
                    
  const maxGuests = (isIntimateWedding || isUtopianWedding || isEliteWedding || isCorporate || isDebutIntimate || isDebutClassy || isDebutVogue || isKiddiePlayful || isKiddieAdventure || isKiddieCarnival || isSpecialIntimate || isSpecialGrand || isSpecialLegacy) ? Number.POSITIVE_INFINITY : 999;

  const data = packageData[packageType] || packageData.intimate;
  const basePrice = data.basePrice;
  
  const extraGuestBillablePax = (isIntimateWedding || isUtopianWedding || isEliteWedding || isCorporate || isDebutIntimate || isDebutClassy || isDebutVogue || isKiddiePlayful || isKiddieAdventure || isKiddieCarnival || isSpecialIntimate || isSpecialGrand || isSpecialLegacy) ? Math.max(0, guestCount - minGuests) : 0;
  const additionalGuestsFee = (isIntimateWedding || isUtopianWedding || isEliteWedding || isCorporate || isDebutIntimate || isDebutClassy || isDebutVogue || isKiddiePlayful || isKiddieAdventure || isKiddieCarnival || isSpecialIntimate || isSpecialGrand || isSpecialLegacy) ? extraGuestBillablePax * extraPaxRate : 0;
  const packageSubtotal = basePrice + additionalGuestsFee;
  const prePromoTotal = packageSubtotal;
  const totalEstimated = prePromoTotal - promoDiscountAmount;

  const handleApplyPromo = async () => {
    setPromoError(null);
    const trimmed = promoCode.trim();
    if (!trimmed) {
      setPromoError('Enter a promo code');
      return;
    }
    setPromoValidating(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE_URL}/api/promo-codes/validate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code: trimmed }),
      });
      const body = await res.json();
      if (!body.valid) {
        setIsPromoApplied(false);
        setPromoDiscountAmount(0);
        setAppliedPromoCode(null);
        setPromoError(body.message || 'Invalid code');
        return;
      }
      const subtotal = prePromoTotal;
      let discount = 0;
      if (body.discount_percentage != null && body.discount_percentage > 0) {
        discount = Math.min(subtotal, Math.round((subtotal * body.discount_percentage) / 100));
      } else if (body.discount_amount != null && body.discount_amount > 0) {
        discount = Math.min(subtotal, body.discount_amount);
      }
      if (discount <= 0) {
        setIsPromoApplied(false);
        setPromoDiscountAmount(0);
        setAppliedPromoCode(null);
        setPromoError('This code has no discount configured.');
        return;
      }
      setPromoDiscountAmount(discount);
      setIsPromoApplied(true);
      setAppliedPromoCode(body.code);
    } catch {
      setPromoError('Could not verify promo code. Try again.');
      setIsPromoApplied(false);
      setPromoDiscountAmount(0);
      setAppliedPromoCode(null);
    } finally {
      setPromoValidating(false);
    }
  };

  return (
    <div className="package-modal-overlay">
      <div className="package-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="modal-body-wrapper">
          {/* Left Column: Details */}
          <div className="modal-left-col">
            <h1 className="modal-package-title">{data.title}</h1>
            
            <div className="modal-gallery" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <button 
                className="gallery-nav-btn" 
                onClick={handlePrevImage}
                style={{
                  background: 'rgba(196, 154, 44, 0.2)',
                  border: '2px solid #c49a2c',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#c49a2c',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c49a2c';
                  e.currentTarget.style.color = '#0a0f1d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(196, 154, 44, 0.2)';
                  e.currentTarget.style.color = '#c49a2c';
                }}
              >
                &#8249;
              </button>

              <div className="modal-gallery-main" style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
                <img 
                  src={galleryImages[currentImageIndex]} 
                  alt={`Gallery ${currentImageIndex + 1}`}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <button 
                className="gallery-nav-btn" 
                onClick={handleNextImage}
                style={{
                  background: 'rgba(196, 154, 44, 0.2)',
                  border: '2px solid #c49a2c',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#c49a2c',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c49a2c';
                  e.currentTarget.style.color = '#0a0f1d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(196, 154, 44, 0.2)';
                  e.currentTarget.style.color = '#c49a2c';
                }}
              >
                &#8250;
              </button>
              
              <div style={{ textAlign: 'center', position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginTop: '10px' }}>
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

            <div className="modal-actions-row" style={{ marginTop: '40px' }}>
              <div className="modal-tags">
                <div className="modal-stars">
                  {loadingReviews ? (
                    <span className="modal-review-count">Loading reviews...</span>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            color={star <= averageRating ? "#c49a2c" : "rgba(196, 154, 44, 0.3)"}
                            fill={star <= averageRating ? "#c49a2c" : "none"}
                          />
                        ))}
                      </div>
                      <span className="modal-review-count">({reviewCount} Verified {reviewCount === 1 ? 'Review' : 'Reviews'})</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="modal-desc-text">{data.description}</p>

            <div className="modal-section">
              <h2 className="modal-section-title">What's Included</h2>
              <div className="modal-gold-dash"></div>
              <div className="modal-included-grid">
                {data.included.map((item, idx) => (
                  <div key={idx} className="modal-included-card">
                    <item.icon size={32} color="#c49a2c" strokeWidth={1.75} />
                    <div className="modal-included-info">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h2 className="modal-section-title">Service Details</h2>
              <div className="modal-gold-dash"></div>
              <p className="modal-service-text">{data.details}</p>
              <div className="modal-checklist">
                <div className="modal-check-item"><CheckCircle size={16} color="#c49a2c" /> <span>Seamless Setup & Breakdown</span></div>
                <div className="modal-check-item"><CheckCircle size={16} color="#c49a2c" /> <span>Professional Uniformed Team</span></div>
                <div className="modal-check-item"><CheckCircle size={16} color="#c49a2c" /> <span>Full Buffet Management</span></div>
                <div className="modal-check-item"><CheckCircle size={16} color="#c49a2c" /> <span>Complete Thematic Styling</span></div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing/Booking */}
          <div className="modal-right-col">
            <div className="modal-booking-widget">
              <div className="modal-widget-header">
              <div className="modal-price-label">
                  <span>TOTAL PRICE</span>
                  <span className="modal-price-val">₱{Number(totalEstimated.toFixed(1)).toLocaleString()}</span>
                </div>
              </div>

              <div className="modal-form-group">
                <label>SELECT EVENT DATE</label>
                <div className="modal-input-icon-wrapper" onClick={() => setShowCalendar(!showCalendar)}>
                  <input type="text" readOnly value={formatDate(selectedDate)} />
                  <Calendar size={16} className="modal-input-icon" />
                  
                  {showCalendar && (
                    <div className="modal-calendar-popup" onClick={e => e.stopPropagation()}>
                      <div className="calendar-header">
                        <button onClick={handlePrevMonth}><ChevronLeft size={16} /></button>
                        <span>{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                        <button onClick={handleNextMonth}><ChevronRight size={16} /></button>
                      </div>
                      <div className="calendar-weekdays">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
                      </div>
                      <div className="calendar-days">
                        {Array.from({ length: firstDay(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => <span key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                          const day = i + 1;
                          const cell = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                          const ymd = toBookingYMD(cell);
                          const todayStart = new Date();
                          todayStart.setHours(0, 0, 0, 0);
                          const isPast = cell < todayStart;
                          const isDayOff = blockedBookingDates.has(ymd);
                          const isBooked = bookedEventDates.has(ymd);
                          const isUnavailable = isPast || isDayOff || isBooked;
                          const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === viewDate.getMonth() && selectedDate.getFullYear() === viewDate.getFullYear();
                          return (
                            <span
                              key={day}
                              className={[
                                isSelected ? 'selected' : '',
                                isDayOff ? 'calendar-day-off' : '',
                                !isDayOff && isBooked ? 'calendar-day-booked' : '',
                                isPast ? 'calendar-day-past' : '',
                              ].filter(Boolean).join(' ')}
                              aria-label={
                                isDayOff
                                  ? `Day off ${ymd}`
                                  : isBooked
                                    ? `Already booked ${ymd}`
                                    : isPast
                                      ? `Past ${ymd}`
                                      : `Select ${ymd}`
                              }
                              style={isUnavailable ? { cursor: 'not-allowed' } : undefined}
                              onClick={() => {
                                if (isUnavailable) return;
                                setSelectedDate(cell);
                                setShowCalendar(false);
                              }}
                            >
                              {day}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-form-group">
                <label>ESTIMATED GUESTS</label>
                {(isIntimateWedding || isUtopianWedding || isEliteWedding || isCorporate || isDebutIntimate || isDebutClassy || isDebutVogue || isKiddiePlayful || isKiddieAdventure || isKiddieCarnival || isSpecialIntimate || isSpecialGrand || isSpecialLegacy) && (
                  <p style={{ margin: '0 0 8px 0', fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>
                    Minimum {minGuests} guests (included in base). +₱{extraPaxRate.toLocaleString()} for each additional guest.
                  </p>
                )}
                <div className="modal-guest-stepper">
                  <button
                    type="button"
                    className="modal-stepper-btn"
                    disabled={guestCount <= minGuests}
                    onClick={() => setGuestCount((prev) => Math.max(minGuests, prev - 1))}
                  >
                    -
                  </button>
                  <div className="modal-stepper-val">{guestCount} Guests</div>
                  <button
                    type="button"
                    className="modal-stepper-btn"
                    disabled={guestCount >= maxGuests}
                    onClick={() => setGuestCount((prev) => Math.min(maxGuests, prev + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="modal-form-group">
                <label>PROMO CODE</label>
                <div className="modal-promo-row">
                  <input type="text" placeholder="enter promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                  <button type="button" onClick={handleApplyPromo} disabled={promoValidating}>{promoValidating ? '…' : 'APPLY'}</button>
                </div>
                {promoError && <span className="modal-promo-error" style={{ color: '#e85d5d', fontSize: 13, display: 'block', marginTop: 6 }}>{promoError}</span>}
                {isPromoApplied && appliedPromoCode && (
                  <span className="modal-promo-success">Code {appliedPromoCode} applied (₱{promoDiscountAmount.toLocaleString()} off!)</span>
                )}
              </div>

              <div className="modal-breakdown">
                <div className="modal-row"><span>Base Package</span><span>₱{basePrice.toLocaleString()}</span></div>
                {(isIntimateWedding || isUtopianWedding || isEliteWedding || isCorporate || isDebutIntimate || isDebutClassy || isDebutVogue || isKiddiePlayful || isKiddieAdventure || isKiddieCarnival || isSpecialIntimate || isSpecialGrand || isSpecialLegacy) && extraGuestBillablePax > 0 && (
                  <div className="modal-row">
                    <span>Additional guests ({extraGuestBillablePax} × ₱{extraPaxRate.toLocaleString()})</span>
                    <span>₱{additionalGuestsFee.toLocaleString()}</span>
                  </div>
                )}
                {isPromoApplied && promoDiscountAmount > 0 && (
                  <div className="modal-row modal-discount"><span>Promo Discount</span><span>-₱{promoDiscountAmount.toLocaleString()}</span></div>
                )}
                <div className="modal-total-row"><span>Total Estimated</span><span className="modal-total-acc">₱{Number(totalEstimated.toFixed(1)).toLocaleString()}</span></div>
              </div>

              <button 
                className="modal-reserve-btn"
                onClick={() => onReserve({ 
                  packageTitle: data.title,
                  basePrice: basePrice,
                  additionalGuestsFee: (isIntimateWedding || isUtopianWedding || isEliteWedding || isCorporate || isDebutIntimate || isDebutClassy || isDebutVogue || isKiddiePlayful || isKiddieAdventure || isKiddieCarnival || isSpecialIntimate || isSpecialGrand || isSpecialLegacy) ? additionalGuestsFee : 0,
                  promoDiscount: promoDiscountAmount,
                  totalPrice: totalEstimated,
                  guestCount: guestCount,
                  selectedDate: formatDate(selectedDate)
                })}
              >
                BOOK NOW &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsModal;
