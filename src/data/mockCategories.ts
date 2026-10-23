export interface CategoryItem {
  id: string;
  nameEn: string;
  nameHi: string;
  iconName: string;
  jobCount: number;
  workerCount: number;
  avgWage: string;
}

export const mockCategories: CategoryItem[] = [
  {
    id: 'driver',
    nameEn: 'Driver',
    nameHi: 'ड्राइवर',
    iconName: 'Car',
    jobCount: 142,
    workerCount: 380,
    avgWage: '₹700 - ₹900 / दिन'
  },
  {
    id: 'construction',
    nameEn: 'Construction Worker',
    nameHi: 'निर्माण मजदूर / राजमिस्त्री',
    iconName: 'Hammer',
    jobCount: 285,
    workerCount: 920,
    avgWage: '₹600 - ₹850 / दिन'
  },
  {
    id: 'electrician',
    nameEn: 'Electrician',
    nameHi: 'इलेक्ट्रीशियन',
    iconName: 'Zap',
    jobCount: 98,
    workerCount: 240,
    avgWage: '₹750 - ₹1,200 / दिन'
  },
  {
    id: 'plumber',
    nameEn: 'Plumber',
    nameHi: 'प्लंबर',
    iconName: 'Wrench',
    jobCount: 76,
    workerCount: 195,
    avgWage: '₹700 - ₹1,100 / दिन'
  },
  {
    id: 'jcb',
    nameEn: 'JCB Operator',
    nameHi: 'जेसीबी ऑपरेटर',
    iconName: 'Truck',
    jobCount: 45,
    workerCount: 110,
    avgWage: '₹1,000 - ₹1,500 / दिन'
  },
  {
    id: 'helper',
    nameEn: 'Helper',
    nameHi: 'हेल्पर / सहायक',
    iconName: 'Users',
    jobCount: 310,
    workerCount: 1450,
    avgWage: '₹450 - ₹600 / दिन'
  },
  {
    id: 'painter',
    nameEn: 'Painter',
    nameHi: 'पेंटर',
    iconName: 'Paintbrush',
    jobCount: 88,
    workerCount: 260,
    avgWage: '₹650 - ₹900 / दिन'
  },
  {
    id: 'delivery',
    nameEn: 'Delivery Worker',
    nameHi: 'डिलीवरी वर्कर',
    iconName: 'PackageCheck',
    jobCount: 190,
    workerCount: 540,
    avgWage: '₹16,000 - ₹22,000 / माह'
  }
];
