// ══════════════════════════════════════════════════════
// RENTRA — Owner Module Mock Data
// ══════════════════════════════════════════════════════

export const ownerProfile = {
  name: 'Alicia Reyes',
  role: 'Business Owner',
  email: 'owner@rentra.com',
  phone: '+1 (555) 812-4490',
  address: '48 Industrial Blvd, Suite 3B, Houston, TX 77002',
  city: 'Houston',
  state: 'Texas',
  joinedDate: '14 Mar 2024',
  avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=300',
  bio: 'Business owner operating premium heavy machinery rentals across the Texas Gulf Coast region. Specializing in construction, industrial, and energy sector equipment.',
  businessName: 'Titan Heavy Rentals Inc.',
  gstNumber: 'GST-TX-9938210',
  website: 'www.titanheavyrentals.com',
  stats: {
    totalEquipment: 12,
    activeBookings: 5,
    completedBookings: 48,
    totalEarnings: '$127,400'
  },
  recentActivity: [
    { id: 1, action: 'Accepted booking from James Wilson for Excavator', date: 'Today, 10:30 AM' },
    { id: 2, action: 'Added new equipment: Genie S-85 Boom Lift', date: 'Yesterday, 3:15 PM' },
    { id: 3, action: 'Rejected booking from Mike Chen (dates conflict)', date: '04 Aug 2026, 11:00 AM' },
    { id: 4, action: 'Updated equipment price: John Deere 8R Tractor', date: '02 Aug 2026, 9:00 AM' },
    { id: 5, action: 'Withdrew earnings payout of $8,450', date: '01 Aug 2026, 2:00 PM' }
  ]
};

export const ownerStats = {
  totalEquipment: 12,
  activeBookings: 5,
  pendingRequests: 3,
  monthlyEarnings: '$18,750',
  totalEarnings: '$127,400',
  completedBookings: 48,
  pendingPayments: '$4,200',
  avgRating: 4.8
};

export const ownerNotifications = [
  {
    id: 1,
    title: 'New Booking Request',
    message: 'James Wilson requested Caterpillar 320 Excavator for 5 days (Aug 12–17).',
    time: '8m ago',
    read: false,
    type: 'booking',
    link: '/owner/bookings'
  },
  {
    id: 2,
    title: 'Equipment Approved ✓',
    message: 'Your listing "Genie S-85 XC Telescopic Boom Lift" has been approved by Admin.',
    time: '1h ago',
    read: false,
    type: 'equipment',
    link: '/owner/equipment'
  },
  {
    id: 3,
    title: 'Business Verification Approved',
    message: 'Titan Heavy Rentals Inc. has been verified and is now live on Rentra.',
    time: '2h ago',
    read: false,
    type: 'business',
    link: '/owner/business-status'
  },
  {
    id: 4,
    title: 'New Customer Booking Confirmed',
    message: 'Sophia Martinez confirmed booking #RNT-9081 for John Deere Tractor — 6 days.',
    time: '5h ago',
    read: true,
    type: 'booking',
    link: '/owner/bookings'
  },
  {
    id: 5,
    title: 'Payout Processed',
    message: 'Your earnings payout of $8,450 has been transferred to your bank account.',
    time: '1d ago',
    read: true,
    type: 'payment',
    link: '/owner/earnings'
  }
];

export const ownerEquipment = [
  {
    id: 'EQP-001',
    name: 'Caterpillar 320 Hydraulic Excavator',
    category: 'Construction',
    description: 'Heavy-duty hydraulic excavator ideal for large-scale excavation, trenching, and demolition. GPS-enabled with full operator cab.',
    location: 'Houston, TX',
    pricePerDay: 450,
    availability: 'Available',
    status: 'Approved',
    images: ['https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&q=80&w=600'],
    createdAt: '15 Jun 2026',
    specifications: {
      operatingWeight: '22,500 kg',
      enginePower: '121 kW / 162 hp',
      maxDigDepth: '6.72 m',
      fuelCapacity: '345 L'
    }
  },
  {
    id: 'EQP-002',
    name: 'John Deere 8R 410 Tractor',
    category: 'Agriculture',
    description: 'High-performance agricultural tractor with integrated GPS AutoTrac system, ideal for large-scale farming and land prep.',
    location: 'Dallas, TX',
    pricePerDay: 380,
    availability: 'Rented',
    status: 'Approved',
    images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600'],
    createdAt: '02 Jul 2026',
    specifications: {
      enginePower: '410 hp',
      transmission: 'e18 PowerShift',
      hitchCapacity: '9,000 kg',
      gpsNavigation: 'Integrated AutoTrac'
    }
  },
  {
    id: 'EQP-003',
    name: 'Genie S-85 XC Telescopic Boom Lift',
    category: 'Industrial',
    description: 'Extended capacity boom lift with 27.9m working height. Perfect for construction, maintenance, and industrial tasks at height.',
    location: 'Houston, TX',
    pricePerDay: 520,
    availability: 'Available',
    status: 'Approved',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600'],
    createdAt: '10 Jul 2026',
    specifications: {
      workingHeight: '27.9 m',
      horizontalReach: '22.7 m',
      liftCapacity: '454 kg',
      gradeability: '45%'
    }
  },
  {
    id: 'EQP-004',
    name: 'Komatsu PC490LC-11 Excavator',
    category: 'Construction',
    description: 'Large-class hydraulic excavator for heavy-duty mining and large construction projects. KOMTRAX telematics included.',
    location: 'Austin, TX',
    pricePerDay: 680,
    availability: 'Available',
    status: 'Pending',
    images: ['https://images.unsplash.com/photo-1581094487112-a64360f9c195?auto=format&fit=crop&q=80&w=600'],
    createdAt: '28 Jul 2026',
    specifications: {
      operatingWeight: '50,200 kg',
      enginePower: '270 kW',
      bucketCapacity: '2.9 m³',
      maxDigDepth: '7.87 m'
    }
  },
  {
    id: 'EQP-005',
    name: 'Atlas Copco XAS 1800 Air Compressor',
    category: 'Industrial',
    description: 'Portable industrial air compressor delivering 1800 CFM at 350 psi. Suitable for drilling and industrial pneumatic tools.',
    location: 'San Antonio, TX',
    pricePerDay: 220,
    availability: 'Available',
    status: 'Approved',
    images: ['https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600'],
    createdAt: '01 Jul 2026',
    specifications: {
      airFlow: '1800 CFM',
      maxPressure: '350 psi',
      engineType: 'Diesel Tier 4F',
      weight: '5,200 kg'
    }
  },
  {
    id: 'EQP-006',
    name: 'Manitowoc 4100W Series Lattice Crane',
    category: 'Construction',
    description: 'Top-tier crawler crane with 907 metric ton lift capacity. Comes with certified operator. Ideal for bridge and high-rise construction.',
    location: 'Houston, TX',
    pricePerDay: 1200,
    availability: 'Rented',
    status: 'Approved',
    images: ['https://images.unsplash.com/photo-1534093607318-f025413f49cb?auto=format&fit=crop&q=80&w=600'],
    createdAt: '20 Jun 2026',
    specifications: {
      liftCapacity: '907 tonnes',
      maxRadius: '152 m',
      boomLength: '73 m',
      counterweightCapacity: '270 tonnes'
    }
  }
];

export const ownerBookings = [
  {
    id: 'RNT-9081',
    customerName: 'Sophia Martinez',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    customerEmail: 'sophia.m@buildcorp.org',
    equipmentName: 'Caterpillar 320 Hydraulic Excavator',
    equipmentId: 'EQP-001',
    bookingDate: '01 Aug 2026',
    startDate: '01 Aug 2026',
    endDate: '07 Aug 2026',
    rentalPeriod: '6 Days',
    amount: 2700,
    status: 'Active',
    notes: 'Needs operator manual on delivery.'
  },
  {
    id: 'RNT-9082',
    customerName: 'James Wilson',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    customerEmail: 'james.w@wilsonconst.com',
    equipmentName: 'Genie S-85 XC Telescopic Boom Lift',
    equipmentId: 'EQP-003',
    bookingDate: '03 Aug 2026',
    startDate: '12 Aug 2026',
    endDate: '17 Aug 2026',
    rentalPeriod: '5 Days',
    amount: 2600,
    status: 'Pending',
    notes: 'Site access from 7AM daily.'
  },
  {
    id: 'RNT-9083',
    customerName: 'Emily Watson',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    customerEmail: 'emily.watson@agrifarm.co',
    equipmentName: 'John Deere 8R 410 Tractor',
    equipmentId: 'EQP-002',
    bookingDate: '04 Aug 2026',
    startDate: '04 Aug 2026',
    endDate: '10 Aug 2026',
    rentalPeriod: '6 Days',
    amount: 2280,
    status: 'Pending',
    notes: 'Requesting early delivery at 6AM.'
  },
  {
    id: 'RNT-9084',
    customerName: 'Marcus Vance',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    customerEmail: 'marcus.v@titanfleet.com',
    equipmentName: 'Atlas Copco XAS 1800 Air Compressor',
    equipmentId: 'EQP-005',
    bookingDate: '25 Jul 2026',
    startDate: '28 Jul 2026',
    endDate: '31 Jul 2026',
    rentalPeriod: '3 Days',
    amount: 660,
    status: 'Completed',
    notes: ''
  },
  {
    id: 'RNT-9085',
    customerName: 'Liam O\'Connor',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    customerEmail: 'liam@logistix.io',
    equipmentName: 'Manitowoc 4100W Series Lattice Crane',
    equipmentId: 'EQP-006',
    bookingDate: '20 Jul 2026',
    startDate: '20 Jul 2026',
    endDate: '25 Jul 2026',
    rentalPeriod: '5 Days',
    amount: 6000,
    status: 'Completed',
    notes: 'Certified operator was included.'
  },
  {
    id: 'RNT-9086',
    customerName: 'Rachel Kim',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
    customerEmail: 'rachel.kim@buildnow.co',
    equipmentName: 'Caterpillar 320 Hydraulic Excavator',
    equipmentId: 'EQP-001',
    bookingDate: '15 Jul 2026',
    startDate: '18 Jul 2026',
    endDate: '20 Jul 2026',
    rentalPeriod: '2 Days',
    amount: 900,
    status: 'Rejected',
    notes: 'Dates conflict with existing booking.'
  }
];

export const ownerEarnings = {
  totalEarnings: 127400,
  monthlyEarnings: 18750,
  completedBookings: 48,
  pendingPayments: 4200,
  monthlyData: [
    { month: 'Jan', earnings: 6200 },
    { month: 'Feb', earnings: 7800 },
    { month: 'Mar', earnings: 9400 },
    { month: 'Apr', earnings: 8100 },
    { month: 'May', earnings: 11200 },
    { month: 'Jun', earnings: 13500 },
    { month: 'Jul', earnings: 15800 },
    { month: 'Aug', earnings: 18750 }
  ],
  recentTransactions: [
    {
      id: 'TXN-4401',
      bookingId: 'RNT-9085',
      customer: 'Liam O\'Connor',
      equipment: 'Manitowoc Lattice Crane',
      date: '25 Jul 2026',
      amount: 6000,
      status: 'Paid'
    },
    {
      id: 'TXN-4402',
      bookingId: 'RNT-9084',
      customer: 'Marcus Vance',
      equipment: 'Atlas Copco Air Compressor',
      date: '31 Jul 2026',
      amount: 660,
      status: 'Paid'
    },
    {
      id: 'TXN-4403',
      bookingId: 'RNT-9081',
      customer: 'Sophia Martinez',
      equipment: 'Caterpillar 320 Excavator',
      date: '07 Aug 2026',
      amount: 2700,
      status: 'Pending'
    },
    {
      id: 'TXN-4404',
      bookingId: 'RNT-9082',
      customer: 'James Wilson',
      equipment: 'Genie S-85 Boom Lift',
      date: '17 Aug 2026',
      amount: 2600,
      status: 'Pending'
    },
    {
      id: 'TXN-4405',
      bookingId: 'RNT-9083',
      customer: 'Emily Watson',
      equipment: 'John Deere 8R Tractor',
      date: '10 Aug 2026',
      amount: 2280,
      status: 'Pending'
    }
  ]
};

export const businessStatus = {
  businessName: 'Titan Heavy Rentals Inc.',
  businessType: 'Construction & Heavy Rigging',
  ownerName: 'Alicia Reyes',
  email: 'contact@titanheavy.com',
  phone: '+1 (555) 812-4490',
  address: '48 Industrial Blvd, Suite 3B',
  city: 'Houston',
  state: 'Texas',
  gstNumber: 'GST-TX-9938210',
  registrationNumber: 'REG-TX-9948271',
  applicationDate: '25 Jul 2026',
  reviewDate: '28 Jul 2026',
  status: 'Approved',
  remarks: 'Business verification documents have been reviewed and validated. All documents are in order. Your business is now live on the Rentra marketplace.',
  documents: [
    { name: 'Business License.pdf', size: '2.4 MB', status: 'Verified' },
    { name: 'Tax Registration Certificate.pdf', size: '1.1 MB', status: 'Verified' },
    { name: 'Equipment Fleet Ownership Proof.pdf', size: '4.8 MB', status: 'Verified' }
  ],
  timeline: [
    { step: 'Application Submitted', date: '25 Jul 2026, 10:30 AM', done: true },
    { step: 'Documents Under Review', date: '26 Jul 2026, 09:00 AM', done: true },
    { step: 'Identity Verification', date: '27 Jul 2026, 02:15 PM', done: true },
    { step: 'Admin Final Approval', date: '28 Jul 2026, 11:45 AM', done: true },
    { step: 'Business Live on Rentra', date: '28 Jul 2026, 12:00 PM', done: true }
  ]
};
