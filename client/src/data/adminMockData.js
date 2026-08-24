// Dummy Data for Rentra Admin Marketplace

export const mockStats = {
  totalUsers: 1248,
  totalBusinesses: 186,
  totalEquipment: 542,
  totalBookings: 894,
  pendingVerifications: 14,
  pendingEquipmentApprovals: 23,
  monthlyRevenue: "$148,250",
  activeRentals: 67
};

export const mockActivities = [
  {
    id: 1,
    type: "business_request",
    title: "Apex Heavy Machinery Ltd.",
    description: "Submitted business verification documents for approval.",
    time: "10 minutes ago",
    badgeColor: "warning"
  },
  {
    id: 2,
    type: "equipment_submission",
    title: "Caterpillar 320 Excavator",
    description: "New heavy equipment listing submitted by Construction Hub Inc.",
    time: "25 minutes ago",
    badgeColor: "info"
  },
  {
    id: 3,
    type: "user_registration",
    title: "David Miller",
    description: "Registered as a new equipment customer.",
    time: "1 hour ago",
    badgeColor: "success"
  },
  {
    id: 4,
    type: "booking",
    title: "Booking #RNT-8924",
    description: "Johnathan Crane booked Scania R500 Hauler Truck for 5 days.",
    time: "2 hours ago",
    badgeColor: "success"
  },
  {
    id: 5,
    type: "business_approved",
    title: "Volta Power Systems",
    description: "Business account verified by Admin.",
    time: "4 hours ago",
    badgeColor: "success"
  }
];

export const mockUsers = [
  {
    id: "USR-101",
    name: "Alexander Wright",
    email: "alexander.w@apexconst.com",
    role: "Business Owner",
    phone: "+1 (555) 234-5678",
    status: "Active",
    joinedDate: "15 Jan 2024",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "USR-102",
    name: "Sophia Martinez",
    email: "sophia.m@buildcorp.org",
    role: "Customer",
    phone: "+1 (555) 876-5432",
    status: "Active",
    joinedDate: "20 Feb 2024",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "USR-103",
    name: "Marcus Vance",
    email: "marcus.v@titanfleet.com",
    role: "Business Owner",
    phone: "+1 (555) 345-6789",
    status: "Blocked",
    joinedDate: "03 Mar 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "USR-104",
    name: "Emily Watson",
    email: "emily.watson@agrifarm.co",
    role: "Customer",
    phone: "+1 (555) 901-2345",
    status: "Active",
    joinedDate: "12 Apr 2024",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "USR-105",
    name: "Liam O'Connor",
    email: "liam.oconnor@logistix.io",
    role: "Business Owner",
    phone: "+1 (555) 456-7890",
    status: "Active",
    joinedDate: "18 May 2024",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "USR-106",
    name: "Olivia Chen",
    email: "olivia.c@cinegear.net",
    role: "Customer",
    phone: "+1 (555) 678-9012",
    status: "Active",
    joinedDate: "02 Jun 2024",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "USR-107",
    name: "Robert Sterling",
    email: "robert@sterlingrigs.com",
    role: "Business Owner",
    phone: "+1 (555) 789-0123",
    status: "Blocked",
    joinedDate: "14 Jul 2024",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  }
];

export const mockBusinesses = [
  {
    id: "BUS-301",
    businessName: "Titan Heavy Rentals Inc.",
    ownerName: "Alexander Wright",
    email: "contact@titanheavy.com",
    phone: "+1 (555) 234-5678",
    businessType: "Construction & Heavy Rigging",
    registrationNumber: "REG-9948271",
    gstNumber: "GST-US-9938210",
    submittedDate: "28 Jul 2026",
    status: "Pending",
    documents: [
      { name: "Business License.pdf", size: "2.4 MB" },
      { name: "Tax Registration Certificate.pdf", size: "1.1 MB" },
      { name: "Equipment Fleet Ownership Proof.pdf", size: "4.8 MB" }
    ]
  },
  {
    id: "BUS-302",
    businessName: "AgriPower Tractors & Harvesters",
    ownerName: "Liam O'Connor",
    email: "info@agripower.org",
    phone: "+1 (555) 456-7890",
    businessType: "Agriculture Machinery",
    registrationNumber: "REG-8837192",
    gstNumber: "GST-US-7728192",
    submittedDate: "26 Jul 2026",
    status: "Pending",
    documents: [
      { name: "State Farm Business Incorporation.pdf", size: "3.1 MB" },
      { name: "Identity & Address Verification.pdf", size: "1.5 MB" }
    ]
  },
  {
    id: "BUS-303",
    businessName: "CineFlex Media Production Gear",
    ownerName: "Olivia Chen",
    email: "support@cineflexgear.com",
    phone: "+1 (555) 678-9012",
    businessType: "Media & Studio Production",
    registrationNumber: "REG-6625143",
    gstNumber: "GST-US-5514231",
    submittedDate: "22 Jul 2026",
    status: "Approved",
    documents: [
      { name: "Media Equipment Insurance Certificate.pdf", size: "2.8 MB" }
    ]
  },
  {
    id: "BUS-304",
    businessName: "LogiTrans Forklifts & Freight",
    ownerName: "Robert Sterling",
    email: "sales@logitrans.io",
    phone: "+1 (555) 789-0123",
    businessType: "Logistics & Warehousing",
    registrationNumber: "REG-4412983",
    gstNumber: "GST-US-3301928",
    submittedDate: "15 Jul 2026",
    status: "Rejected",
    rejectionReason: "Incomplete GST document upload and unverified business address proof.",
    documents: [
      { name: "Business Incorporation Draft.pdf", size: "1.2 MB" }
    ]
  }
];

export const mockEquipment = [
  {
    id: "EQP-501",
    name: "Caterpillar 320 Hydraulic Excavator",
    owner: "Titan Heavy Rentals Inc.",
    category: "Construction",
    pricePerDay: "$450",
    status: "Pending",
    submittedDate: "30 Jul 2026",
    image: "https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&q=80&w=400",
    specifications: {
      operatingWeight: "22,500 kg",
      enginePower: "121 kW (162 hp)",
      maxDigDepth: "6.72 m",
      fuelCapacity: "345 L"
    }
  },
  {
    id: "EQP-502",
    name: "John Deere 8R 410 Tractor",
    owner: "AgriPower Tractors",
    category: "Agriculture",
    pricePerDay: "$380",
    status: "Pending",
    submittedDate: "29 Jul 2026",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400",
    specifications: {
      enginePower: "410 hp",
      transmission: "e18 PowerShift",
      hitchCapacity: "9,000 kg",
      gpsNavigation: "Integrated AutoTrac"
    }
  },
  {
    id: "EQP-503",
    name: "Komatsu FG25T-16 Electric Forklift",
    owner: "LogiTrans Freight",
    category: "Logistics",
    pricePerDay: "$120",
    status: "Approved",
    submittedDate: "20 Jul 2026",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400",
    specifications: {
      liftCapacity: "2,500 kg",
      maxLiftHeight: "4.7 m",
      powerType: "Electric 48V Battery",
      tireType: "Solid Pneumatic"
    }
  },
  {
    id: "EQP-504",
    name: "RED V-RAPPER 8K Cinema Camera Rig",
    owner: "CineFlex Media",
    category: "Media Production",
    pricePerDay: "$650",
    status: "Approved",
    submittedDate: "18 Jul 2026",
    image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=400",
    specifications: {
      sensor: "V-RAPTOR 35.4 MP CMOS",
      resolution: "8K 120fps RAW",
      lensMount: "RF Mount with PL Adapter",
      wirelessVideo: "Built-in 4K Monitor Link"
    }
  },
  {
    id: "EQP-505",
    name: "Genie S-85 XC Telescopic Boom Lift",
    owner: "Titan Heavy Rentals Inc.",
    category: "Industrial",
    pricePerDay: "$520",
    status: "Rejected",
    rejectionReason: "Safety inspection certification expired. Updated certificate required.",
    submittedDate: "10 Jul 2026",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400",
    specifications: {
      workingHeight: "27.9 m",
      horizontalReach: "22.7 m",
      liftCapacity: "454 kg",
      gradeability: "45%"
    }
  }
];

export const mockCategories = [
  {
    id: "CAT-1",
    name: "Construction",
    description: "Excavators, bulldozers, cranes, concrete mixers, and heavy earthmovers.",
    equipmentCount: 184,
    icon: "FaHardHat"
  },
  {
    id: "CAT-2",
    name: "Agriculture",
    description: "Tractors, combine harvesters, seeders, balers, and irrigation pumps.",
    equipmentCount: 92,
    icon: "FaTractor"
  },
  {
    id: "CAT-3",
    name: "Industrial",
    description: "Generators, compressors, boom lifts, scaffolding, and industrial pumps.",
    equipmentCount: 115,
    icon: "FaIndustry"
  },
  {
    id: "CAT-4",
    name: "Logistics",
    description: "Forklifts, pallet jacks, reach trucks, and cargo trailers.",
    equipmentCount: 78,
    icon: "FaTruckLoading"
  },
  {
    id: "CAT-5",
    name: "Events",
    description: "Outdoor staging, event generators, LED screens, and temporary structures.",
    equipmentCount: 45,
    icon: "FaCampground"
  },
  {
    id: "CAT-6",
    name: "Media Production",
    description: "Cinema cameras, lighting rigs, audio gear, broadcast vans, and cranes.",
    equipmentCount: 28,
    icon: "FaVideo"
  }
];

export const mockBookings = [
  {
    id: "RNT-9081",
    customer: "Sophia Martinez",
    equipment: "Caterpillar 320 Excavator",
    owner: "Titan Heavy Rentals Inc.",
    bookingDate: "01 Aug 2026 - 07 Aug 2026",
    duration: "6 Days",
    amount: "$2,700",
    status: "Active"
  },
  {
    id: "RNT-9082",
    customer: "Emily Watson",
    equipment: "John Deere 8R 410 Tractor",
    owner: "AgriPower Tractors",
    bookingDate: "04 Aug 2026 - 10 Aug 2026",
    duration: "6 Days",
    amount: "$2,280",
    status: "Pending"
  },
  {
    id: "RNT-9083",
    customer: "Olivia Chen",
    equipment: "RED V-RAPPER 8K Cinema Camera Rig",
    owner: "CineFlex Media",
    bookingDate: "25 Jul 2026 - 28 Jul 2026",
    duration: "3 Days",
    amount: "$1,950",
    status: "Completed"
  },
  {
    id: "RNT-9084",
    customer: "Marcus Vance",
    equipment: "Komatsu FG25T-16 Electric Forklift",
    owner: "LogiTrans Freight",
    bookingDate: "15 Jul 2026 - 18 Jul 2026",
    duration: "3 Days",
    amount: "$360",
    status: "Cancelled"
  }
];

export const mockAdminProfile = {
  name: "Victoria Vance",
  role: "Chief Platform Administrator",
  email: "admin.victoria@rentra.com",
  phone: "+1 (800) 555-7368",
  joinedDate: "12 Oct 2023",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
  bio: "Senior Infrastructure & Marketplace Controller overseeing verified business listings, equipment quality assurances, and platform dispute resolution.",
  stats: {
    businessesApproved: 186,
    equipmentApproved: 542,
    categoriesCreated: 14,
    totalActionsPerformed: 2490
  },
  recentActions: [
    { id: 1, action: "Approved Business: CineFlex Media Gear", date: "Today, 02:15 PM" },
    { id: 2, action: "Approved Equipment: Komatsu FG25T Forklift", date: "Yesterday, 11:30 AM" },
    { id: 3, action: "Added Category: Media Production", date: "28 Jul 2026, 04:00 PM" },
    { id: 4, action: "Blocked User: Marcus Vance (Unverified Documents)", date: "24 Jul 2026, 09:45 AM" }
  ]
};

