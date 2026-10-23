import { Worker } from '../types';

export const mockWorkers: Worker[] = [
  {
    id: 'w-1',
    name: 'रमेश कुमार (Ramesh Kumar)',
    mobile: '98765-XXXX1',
    category: 'Driver',
    categoryHi: 'ड्राइवर',
    skills: ['Heavy Vehicle Licence', 'Night Driving', 'GPS Navigation', 'Bolero/Scorpio Specialist'],
    experienceYears: 6,
    preferredSalary: 850,
    salaryPeriod: 'per_day',
    location: 'सेक्टर 62, नोएडा (Noida)',
    distanceKm: 3.2,
    preferredDistanceKm: 15,
    availabilityStatus: 'available_now',
    rating: 4.8,
    reviewsCount: 34,
    completedJobsCount: 42,
    verified: true,
    languages: ['Hindi', 'Basic English'],
    about: '6 साल का निजी और कमर्शियल गाड़ी चलाने का अनुभव। दिल्ली-एनसीआर के सभी रास्तों की अच्छी समझ। समय का पाबंद और स्वच्छ रिकॉर्ड।',
    workHistory: [
      {
        id: 'wh-101',
        jobTitle: 'Commercial Delivery Driver',
        employerName: 'Sharma Logistics & Transport',
        dateRange: 'Jan 2024 - Sep 2024 (9 Months)',
        attendanceRate: 98,
        rating: 5,
        reviewComment: 'बहुत ही भरोसेमंद ड्राइवर। गाड़ी का पूरा ध्यान रखते हैं और कभी लेट नहीं हुए।',
        isSampleData: true
      },
      {
        id: 'wh-102',
        jobTitle: 'Private Fleet Chauffeur',
        employerName: 'Vikas Builders Site Team',
        dateRange: 'Jun 2023 - Dec 2023 (6 Months)',
        attendanceRate: 96,
        rating: 4.5,
        reviewComment: 'Excellent driving skills and polite demeanor.',
        isSampleData: true
      }
    ]
  },
  {
    id: 'w-2',
    name: 'रामू यादव (Ramu Yadav)',
    mobile: '98765-XXXX2',
    category: 'Construction Worker',
    categoryHi: 'निर्माण मजदूर / राजमिस्त्री',
    skills: ['ईंट चिनाई (Brickwork)', 'प्लास्टर (Plastering)', 'टाइल्स फिटिंग', 'कंक्रीट ढलाई'],
    experienceYears: 9,
    preferredSalary: 750,
    salaryPeriod: 'per_day',
    location: 'गोमती नगर, लखनऊ (Lucknow)',
    distanceKm: 4.5,
    preferredDistanceKm: 12,
    availabilityStatus: 'available_now',
    rating: 4.9,
    reviewsCount: 52,
    completedJobsCount: 78,
    verified: true,
    languages: ['Hindi', 'Bhojpuri'],
    about: 'मकान और दुकान निर्माण में 9 साल का राजमिस्त्री अनुभव। 5 हेल्परों की अपनी समर्पित टीम भी उपलब्ध करा सकता हूँ।',
    workHistory: [
      {
        id: 'wh-201',
        jobTitle: 'Head Mason (राजमिस्त्री)',
        employerName: 'अवध इन्फ्रा कंस्ट्रक्शन',
        dateRange: 'Feb 2024 - Jul 2024 (6 Months)',
        attendanceRate: 99,
        rating: 5,
        reviewComment: 'चिनाई और प्लास्टर का काम बहुत साफ किया। समय से पहले साइट पूरी की।',
        isSampleData: true
      },
      {
        id: 'wh-202',
        jobTitle: 'Residential Plaster Specialist',
        employerName: 'गर्ग बिल्डर्स',
        dateRange: 'Aug 2023 - Jan 2024',
        attendanceRate: 95,
        rating: 4.8,
        reviewComment: 'Hardworking and very skilled in finish plastering.',
        isSampleData: true
      }
    ]
  },
  {
    id: 'w-3',
    name: 'सुनील शर्मा (Sunil Sharma)',
    mobile: '98765-XXXX3',
    category: 'Electrician',
    categoryHi: 'इलेक्ट्रीशियन',
    skills: ['हाउस वायरिंग (House Wiring)', 'MCB & DB Box', 'सबमर्सिबल पंप कनेक्शन', 'इन्वर्टर इंस्टॉलेशन', 'फॉल्ट रिपेयरिंग'],
    experienceYears: 5,
    preferredSalary: 900,
    salaryPeriod: 'per_day',
    location: 'इंदिरा नगर, लखनऊ (Lucknow)',
    distanceKm: 2.1,
    preferredDistanceKm: 10,
    availabilityStatus: 'available_now',
    rating: 4.7,
    reviewsCount: 29,
    completedJobsCount: 39,
    verified: true,
    languages: ['Hindi'],
    about: 'ITI प्रमाणित इलेक्ट्रीशियन। नए मकानों की वायरिंग और घरेलू इलेक्ट्रिकल खराबी सुधारने में विशेषज्ञता। अपने टूल्स खुद साथ रखता हूँ।',
    workHistory: [
      {
        id: 'wh-301',
        jobTitle: 'Site Electrician',
        employerName: 'राजधानी इलेक्ट्रिकल्स & कांट्रेक्टर',
        dateRange: 'Mar 2024 - Oct 2024',
        attendanceRate: 97,
        rating: 4.8,
        reviewComment: 'वायरिंग का नक्शा देखकर तेजी से काम पूरा किया। बेहतरीन सुरक्षा मानक।',
        isSampleData: true
      }
    ]
  },
  {
    id: 'w-4',
    name: 'राजेश वर्मा (Rajesh Verma)',
    mobile: '98765-XXXX4',
    category: 'Plumber',
    categoryHi: 'प्लंबर',
    skills: ['CPVC / GI पाइप फिटिंग', 'बाथरूम सैनिटरी इंस्टॉलेशन', 'लीकेज टेस्टिंग', 'वॉटर टैंक इंस्टॉलेशन'],
    experienceYears: 7,
    preferredSalary: 800,
    salaryPeriod: 'per_day',
    location: 'अमीनाबाद, लखनऊ (Lucknow)',
    distanceKm: 6.0,
    preferredDistanceKm: 15,
    availabilityStatus: 'available_part_time',
    rating: 4.6,
    reviewsCount: 21,
    completedJobsCount: 31,
    verified: true,
    languages: ['Hindi'],
    about: '7 वर्षों से आवासीय और व्यावसायिक प्लंबिंग का कार्य। त्वरित लीकेज मरम्मत और नई पाइपलाइन फिटिंग।',
    workHistory: [
      {
        id: 'wh-401',
        jobTitle: 'Sanitary & Piping Lead',
        employerName: 'सिटी प्लंबिंग सॉल्यूशंस',
        dateRange: 'Nov 2023 - Jun 2024',
        attendanceRate: 94,
        rating: 4.6,
        reviewComment: 'Clean plumbing job with no water pressure issues.',
        isSampleData: true
      }
    ]
  },
  {
    id: 'w-5',
    name: 'मुकेश सिंह (Mukesh Singh)',
    mobile: '98765-XXXX5',
    category: 'JCB Operator',
    categoryHi: 'जेसीबी ऑपरेटर',
    skills: ['JCB 3DX Operation', 'Trenching & Foundation Digging', 'Land Leveling', 'Road Cutting', 'Machine Maintenance'],
    experienceYears: 8,
    preferredSalary: 1200,
    salaryPeriod: 'per_day',
    location: 'ट्रांस हिंडन, गाजियाबाद (Ghaziabad)',
    distanceKm: 8.4,
    preferredDistanceKm: 25,
    availabilityStatus: 'available_now',
    rating: 4.9,
    reviewsCount: 46,
    completedJobsCount: 65,
    verified: true,
    languages: ['Hindi'],
    about: 'अनुभवी जेसीबी और पोकलेन ऑपरेटर। कठिन ढलानों और नींव की खुदाई में सटीक नियंत्रण। ऑपरेटर लाइसेंस मौजूद।',
    workHistory: [
      {
        id: 'wh-501',
        jobTitle: 'Heavy Machinery Lead Operator',
        employerName: 'नेशनल हाईवे सब-कॉन्ट्रैक्टर',
        dateRange: 'Jan 2023 - Dec 2023',
        attendanceRate: 100,
        rating: 5,
        reviewComment: 'सटीक खुदाई और मशीन की कोई टूट-फूट नहीं। बहुत जिम्मेदार इंसान।',
        isSampleData: true
      }
    ]
  },
  {
    id: 'w-6',
    name: 'बबलू पासवान (Bablu Paswan)',
    mobile: '98765-XXXX6',
    category: 'Helper',
    categoryHi: 'हेल्पर / सहायक',
    skills: ['सामान लोडिंग / अनलोडिंग', 'साइट सफाई (Site Cleaning)', 'सीमेंट मसाला मिलाना', 'दुकान सहायक'],
    experienceYears: 3,
    preferredSalary: 500,
    salaryPeriod: 'per_day',
    location: 'हजरतगंज, लखनऊ (Lucknow)',
    distanceKm: 1.8,
    preferredDistanceKm: 10,
    availabilityStatus: 'available_now',
    rating: 4.8,
    reviewsCount: 19,
    completedJobsCount: 28,
    verified: true,
    languages: ['Hindi'],
    about: 'मेहनती और फुर्तीला युवा। गोदाम, निर्माण स्थल या दुकान में हेल्पर के कार्य के लिए तुरंत उपलब्ध।',
    workHistory: [
      {
        id: 'wh-601',
        jobTitle: 'Warehouse Assistant',
        employerName: 'गुप्ता ट्रेडिंग कंपनी',
        dateRange: 'May 2024 - Sep 2024',
        attendanceRate: 98,
        rating: 4.9,
        reviewComment: 'बहुत ईमानदार और समय का पाबंद लड़का। भारी काम भी बिना शिकायत करता है।',
        isSampleData: true
      }
    ]
  },
  {
    id: 'w-7',
    name: 'अमित मौर्या (Amit Maurya)',
    mobile: '98765-XXXX7',
    category: 'Painter',
    categoryHi: 'पेंटर',
    skills: ['दीवार पुट्टी (Wall Putty)', 'प्राइमर & डिस्टेंपर', 'रॉयल लक्जरी इमल्शन', 'लकड़ी पॉलिश (Wood Polish)'],
    experienceYears: 6,
    preferredSalary: 700,
    salaryPeriod: 'per_day',
    location: 'आलमबाग, लखनऊ (Lucknow)',
    distanceKm: 5.1,
    preferredDistanceKm: 12,
    availabilityStatus: 'available_now',
    rating: 4.7,
    reviewsCount: 27,
    completedJobsCount: 36,
    verified: true,
    languages: ['Hindi'],
    about: 'घर और दफ्तर के पेंटिंग कार्य में माहिर। पुट्टी फिनिशिंग और टेक्सचर डिजाइनिंग में 6 साल का अनुभव।',
    workHistory: [
      {
        id: 'wh-701',
        jobTitle: 'Interior Painting Specialist',
        employerName: 'ड्रीम होम्स डेकोर',
        dateRange: 'Aug 2023 - Jan 2024',
        attendanceRate: 96,
        rating: 4.7,
        reviewComment: 'कलर मैचिंग और दीवार की चिकनाई का काम शानदार किया।',
        isSampleData: true
      }
    ]
  },
  {
    id: 'w-8',
    name: 'संजय तिवारी (Sanjay Tiwari)',
    mobile: '98765-XXXX8',
    category: 'Delivery Worker',
    categoryHi: 'डिलीवरी वर्कर',
    skills: ['Two-Wheeler Driving', 'Route Planning', 'Parcel Handling', 'Customer Communication'],
    experienceYears: 4,
    preferredSalary: 18000,
    salaryPeriod: 'per_month',
    location: 'विकास नगर, लखनऊ (Lucknow)',
    distanceKm: 3.8,
    preferredDistanceKm: 20,
    availabilityStatus: 'available_now',
    rating: 4.8,
    reviewsCount: 41,
    completedJobsCount: 55,
    verified: true,
    languages: ['Hindi', 'English'],
    about: 'खुद की बाइक और वैध ड्राइविंग लाइसेंस उपलब्ध। समय पर पार्सल डिलीवरी और ग्राहकों से सभ्य व्यवहार।',
    workHistory: [
      {
        id: 'wh-801',
        jobTitle: 'E-commerce Last Mile Rider',
        employerName: 'फास्ट एक्सप्रेस कूरियर',
        dateRange: 'Oct 2023 - Jul 2024',
        attendanceRate: 99,
        rating: 4.9,
        reviewComment: 'जीरो कैंसिलेशन और सबसे तेज डिलीवरी रिकॉर्ड।',
        isSampleData: true
      }
    ]
  }
];
