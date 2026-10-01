import React, { useState, useEffect } from 'react';
import { FiTruck, FiCalendar, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import BookingCard from '../../components/customer/BookingCard';
import BookingDrawer from '../../components/customer/BookingDrawer';

// Mock bookings – replace with real API later
const MOCK_BOOKINGS = [
  {
    id: 1,
    equipment: {
      name: 'Caterpillar 320 Excavator',
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c4618c?q=80&w=1200&auto=format&fit=crop',
    },
    owner: 'BuildPro Equipments',
    location: 'Mumbai, Maharashtra',
    price: '15,000',
    startDate: '2024-09-10',
    endDate: '2024-09-15',
    status: 'Active', // Upcoming | Active | Completed | Cancelled
    paymentStatus: 'Pending', // Pending | Complete
  },
  {
    id: 2,
    equipment: {
      name: 'JCB 3DX Backhoe Loader',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop',
    },
    owner: 'Alpha Rentals',
    location: 'Pune, Maharashtra',
    price: '8,500',
    startDate: '2024-10-01',
    endDate: '2024-10-07',
    status: 'Upcoming',
    paymentStatus: 'Complete',
  },
  {
    id: 3,
    equipment: {
      name: 'Bobcat S450 Skid Steer',
      image: 'https://images.unsplash.com/photo-1621905251918-4841ccf8108d?q=80&w=600&auto=format&fit=crop',
    },
    owner: 'Metro Machinery',
    location: 'Thane, Maharashtra',
    price: '4,500',
    startDate: '2024-07-15',
    endDate: '2024-07-20',
    status: 'Completed',
    paymentStatus: 'Complete',
  },
  {
    id: 4,
    equipment: {
      name: 'Escorts Hydra Crane 15T',
      image: 'https://images.unsplash.com/photo-1522026880097-df0fb060d4b9?q=80&w=800&auto=format&fit=crop',
    },
    owner: 'Crane Masters',
    location: 'Nashik, Maharashtra',
    price: '6,000',
    startDate: '2024-08-20',
    endDate: '2024-08-25',
    status: 'Cancelled',
    paymentStatus: 'Pending',
  },
];

const TABS = ['All', 'Upcoming', 'Active', 'Completed', 'Cancelled'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'rentalDate', label: 'Rental Date' },
  { value: 'priceLow', label: 'Price Low → High' },
  { value: 'priceHigh', label: 'Price High → Low' },
];

const ITEMS_PER_PAGE = 5;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Load mock data – replace with API call later
  useEffect(() => {
    setBookings(MOCK_BOOKINGS);
  }, []);

  // Filter by tab
  const filteredByTab = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.status === activeTab;
  });

  // Filter by search term (equipment name or owner)
  const filteredBySearch = filteredByTab.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.equipment.name.toLowerCase().includes(term) ||
      b.owner.toLowerCase().includes(term)
    );
  });

  // Sorting
  const sorted = [...filteredBySearch].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow':
        return Number(a.price.replace(/[^0-9]/g, '')) - Number(b.price.replace(/[^0-9]/g, ''));
      case 'priceHigh':
        return Number(b.price.replace(/[^0-9]/g, '')) - Number(a.price.replace(/[^0-9]/g, ''));
      case 'oldest':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'rentalDate':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'newest':
      default:
        return new Date(b.startDate) - new Date(a.startDate);
    }
  });

  const total = sorted.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginated = sorted.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Summary counts
  const counts = {
    Active: bookings.filter((b) => b.status === 'Active').length,
    Upcoming: bookings.filter((b) => b.status === 'Upcoming').length,
    Completed: bookings.filter((b) => b.status === 'Completed').length,
    Cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="pb-32 bg-[#FAFBFC] min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-8 max-w-6xl mx-auto px-4 flex flex-col items-center mb-12">
        <Card className="w-full max-w-4xl p-10 text-center bg-white rounded-2xl dash-shadow-hover">
          <h1 className="text-5xl font-jakarta font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">
            Track all your equipment rentals in one place. Manage upcoming, active and completed bookings easily.
          </p>
          <Button variant="primary" onClick={() => (window.location.href = '/browse')}>Browse Equipment</Button>
        </Card>
      </section>

      {/* Booking Summary Cards */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="flex items-center p-6 dash-shadow-hover transition-transform hover:scale-105">
          <FiTruck className="text-brand-primary text-3xl mr-4" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{counts.Active}</p>
            <p className="text-sm text-gray-500">Active Rentals</p>
          </div>
        </Card>
        <Card className="flex items-center p-6 dash-shadow-hover transition-transform hover:scale-105">
          <FiCalendar className="text-purple-600 text-3xl mr-4" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{counts.Upcoming}</p>
            <p className="text-sm text-gray-500">Upcoming Bookings</p>
          </div>
        </Card>
        <Card className="flex items-center p-6 dash-shadow-hover transition-transform hover:scale-105">
          <FiCheckCircle className="text-green-600 text-3xl mr-4" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{counts.Completed}</p>
            <p className="text-sm text-gray-500">Completed Rentals</p>
          </div>
        </Card>
        <Card className="flex items-center p-6 dash-shadow-hover transition-transform hover:scale-105">
          <FiXCircle className="text-red-600 text-3xl mr-4" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{counts.Cancelled}</p>
            <p className="text-sm text-gray-500">Cancelled Bookings</p>
          </div>
        </Card>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 mb-6 flex space-x-4">
        {TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'outline'}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
          >
            {tab}
          </Button>
        ))}
      </section>

      {/* Search & Sort Toolbar */}
      <section className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search bookings"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary w-64"
        />
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Booking List */}
      {paginated.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 mb-8 space-y-6">
          {paginated.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={() => setSelectedBooking(booking)}
            />
          ))}
        </section>
      ) : (
        // Empty State
        <section className="max-w-7xl mx-auto px-4 flex flex-col items-center py-20">
          <div className="w-48 h-48 bg-gray-200 rounded-full mb-6" />
          <h2 className="text-2xl font-jakarta font-bold text-gray-800 mb-2">No bookings yet.</h2>
          <p className="text-gray-500 mb-4">Browse equipment to start a rental.</p>
          <Button variant="primary" onClick={() => (window.location.href = '/browse')}>Browse Equipment</Button>
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-2 mb-12">
          <Button variant="outline" disabled={page === 1} onClick={() => goToPage(page - 1)}>
            Previous
          </Button>
          {[...Array(totalPages)].map((_, idx) => {
            const p = idx + 1;
            const isCurrent = p === page;
            return (
              <Button key={p} variant={isCurrent ? 'primary' : 'outline'} onClick={() => goToPage(p)}>
                {p}
              </Button>
            );
          })}
          <Button variant="outline" disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
            Next
          </Button>
        </section>
      )}

      {/* Help Card */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <Card className="flex flex-col md:flex-row items-center justify-between p-8 bg-brand-primary text-white rounded-3xl shadow-xl">
          <div>
            <h2 className="text-2xl font-jakarta font-bold mb-2">Need help with your bookings?</h2>
            <p className="text-white/80">Our support team is here to assist you 24/7.</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="outline" className="bg-white text-brand-primary border-white">
              Contact Support
            </Button>
            <Button variant="ghost">View FAQs</Button>
          </div>
        </Card>
      </section>

      {/* Drawer */}
      {selectedBooking && (
        <BookingDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
};

export default MyBookings;
