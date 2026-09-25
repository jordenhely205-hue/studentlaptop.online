export interface InstituteItem {
  name: string;
  city: string;
  province: string;
  type: "Board" | "University" | "College" | "School";
}

export const INITIAL_INSTITUTES: InstituteItem[] = [
  // Boards
  { name: "Federal Board of Intermediate and Secondary Education (FBISE)", city: "Islamabad", province: "Federal", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Lahore", city: "Lahore", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Rawalpindi", city: "Rawalpindi", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Faisalabad", city: "Faisalabad", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Multan", city: "Multan", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Gujranwala", city: "Gujranwala", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Sahiwal", city: "Sahiwal", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Sargodha", city: "Sargodha", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Bahawalpur", city: "Bahawalpur", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) D.G. Khan", city: "Dera Ghazi Khan", province: "Punjab", type: "Board" },
  { name: "Board of Intermediate Education Karachi (BIEK)", city: "Karachi", province: "Sindh", type: "Board" },
  { name: "Board of Secondary Education Karachi (BSEK)", city: "Karachi", province: "Sindh", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Hyderabad", city: "Hyderabad", province: "Sindh", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Sukkur", city: "Sukkur", province: "Sindh", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Larkana", city: "Larkana", province: "Sindh", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Mirpurkhas", city: "Mirpurkhas", province: "Sindh", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Shaheed Benazirabad", city: "Nawabshah", province: "Sindh", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Peshawar", city: "Peshawar", province: "Khyber Pakhtunkhwa", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Mardan", city: "Mardan", province: "Khyber Pakhtunkhwa", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Abbottabad", city: "Abbottabad", province: "Khyber Pakhtunkhwa", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Swat", city: "Swat", province: "Khyber Pakhtunkhwa", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Kohat", city: "Kohat", province: "Khyber Pakhtunkhwa", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Bannu", city: "Bannu", province: "Khyber Pakhtunkhwa", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Malakand", city: "Malakand", province: "Khyber Pakhtunkhwa", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) D.I. Khan", city: "Dera Ismail Khan", province: "Khyber Pakhtunkhwa", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Quetta", city: "Quetta", province: "Balochistan", type: "Board" },
  { name: "Board of Intermediate and Secondary Education (BISE) Mirpur", city: "Mirpur", province: "AJK", type: "Board" },
  { name: "Karakoram International University Examination Board", city: "Gilgit", province: "Gilgit-Baltistan", type: "Board" },

  // Universities - Federal
  { name: "Quaid-i-Azam University (QAU)", city: "Islamabad", province: "Federal", type: "University" },
  { name: "National University of Sciences and Technology (NUST)", city: "Islamabad", province: "Federal", type: "University" },
  { name: "COMSATS University Islamabad (CUI)", city: "Islamabad", province: "Federal", type: "University" },
  { name: "FAST National University of Computer and Emerging Sciences", city: "Islamabad", province: "Federal", type: "University" },
  { name: "Air University", city: "Islamabad", province: "Federal", type: "University" },
  { name: "Bahria University", city: "Islamabad", province: "Federal", type: "University" },
  { name: "International Islamic University (IIUI)", city: "Islamabad", province: "Federal", type: "University" },
  { name: "Pakistan Institute of Engineering and Applied Sciences (PIEAS)", city: "Islamabad", province: "Federal", type: "University" },
  { name: "National University of Modern Languages (NUML)", city: "Islamabad", province: "Federal", type: "University" },

  // Universities - Punjab
  { name: "University of the Punjab (PU)", city: "Lahore", province: "Punjab", type: "University" },
  { name: "University of Engineering and Technology (UET) Lahore", city: "Lahore", province: "Punjab", type: "University" },
  { name: "Lahore University of Management Sciences (LUMS)", city: "Lahore", province: "Punjab", type: "University" },
  { name: "Government College University (GCU) Lahore", city: "Lahore", province: "Punjab", type: "University" },
  { name: "University of Central Punjab (UCP)", city: "Lahore", province: "Punjab", type: "University" },
  { name: "University of Management and Technology (UMT)", city: "Lahore", province: "Punjab", type: "University" },
  { name: "Lahore College for Women University (LCWU)", city: "Lahore", province: "Punjab", type: "University" },
  { name: "University of Agriculture (UAF) Faisalabad", city: "Faisalabad", province: "Punjab", type: "University" },
  { name: "Government College University Faisalabad (GCUF)", city: "Faisalabad", province: "Punjab", type: "University" },
  { name: "Bahauddin Zakariya University (BZU)", city: "Multan", province: "Punjab", type: "University" },
  { name: "Islamia University of Bahawalpur (IUB)", city: "Bahawalpur", province: "Punjab", type: "University" },
  { name: "University of Gujrat (UOG)", city: "Gujrat", province: "Punjab", type: "University" },
  { name: "University of Sargodha (UOS)", city: "Sargodha", province: "Punjab", type: "University" },
  { name: "Pir Mehr Ali Shah Arid Agriculture University", city: "Rawalpindi", province: "Punjab", type: "University" },

  // Universities - Sindh
  { name: "University of Karachi (UOK)", city: "Karachi", province: "Sindh", type: "University" },
  { name: "NED University of Engineering and Technology", city: "Karachi", province: "Sindh", type: "University" },
  { name: "Institute of Business Administration (IBA) Karachi", city: "Karachi", province: "Sindh", type: "University" },
  { name: "Dow University of Health Sciences (DUHS)", city: "Karachi", province: "Sindh", type: "University" },
  { name: "Dawood University of Engineering and Technology", city: "Karachi", province: "Sindh", type: "University" },
  { name: "Mehran University of Engineering and Technology (MUET)", city: "Jamshoro", province: "Sindh", type: "University" },
  { name: "University of Sindh", city: "Jamshoro", province: "Sindh", type: "University" },
  { name: "Liaquat University of Medical and Health Sciences (LUMHS)", city: "Jamshoro", province: "Sindh", type: "University" },
  { name: "Sukkur IBA University", city: "Sukkur", province: "Sindh", type: "University" },
  { name: "Shah Abdul Latif University (SALU)", city: "Khairpur", province: "Sindh", type: "University" },

  // Universities - Khyber Pakhtunkhwa
  { name: "University of Peshawar", city: "Peshawar", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "University of Engineering and Technology (UET) Peshawar", city: "Peshawar", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "Ghulam Ishaq Khan Institute (GIKI)", city: "Topi", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "Institute of Management Sciences (IMSciences)", city: "Peshawar", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "Khyber Medical University (KMU)", city: "Peshawar", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "Islamia College University Peshawar", city: "Peshawar", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "Abdul Wali Khan University (AWKUM)", city: "Mardan", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "University of Malakand", city: "Chakdara", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "University of Swat", city: "Swat", province: "Khyber Pakhtunkhwa", type: "University" },
  { name: "University of Haripur", city: "Haripur", province: "Khyber Pakhtunkhwa", type: "University" },

  // Universities - Balochistan
  { name: "University of Balochistan", city: "Quetta", province: "Balochistan", type: "University" },
  { name: "Balochistan University of Information Technology, Engineering and Management Sciences (BUITEMS)", city: "Quetta", province: "Balochistan", type: "University" },
  { name: "Sardar Bahadur Khan Women's University", city: "Quetta", province: "Balochistan", type: "University" },
  { name: "Lasbela University of Agriculture, Water and Marine Sciences (LUAWMS)", city: "Uthal", province: "Balochistan", type: "University" },
  { name: "University of Turbat", city: "Turbat", province: "Balochistan", type: "University" },

  // Universities - AJK & GB
  { name: "University of Azad Jammu and Kashmir (UAJK)", city: "Muzaffarabad", province: "AJK", type: "University" },
  { name: "Mirpur University of Science and Technology (MUST)", city: "Mirpur", province: "AJK", type: "University" },
  { name: "University of Poonch", city: "Rawalakot", province: "AJK", type: "University" },
  { name: "Karakoram International University (KIU)", city: "Gilgit", province: "Gilgit-Baltistan", type: "University" },
  { name: "Baltistan University", city: "Skardu", province: "Gilgit-Baltistan", type: "University" },
];
