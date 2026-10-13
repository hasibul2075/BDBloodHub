// All site text lives here. Each key has an English (en) and Bangla (bn) version.
// Add new keys at the end of both objects.

export const translations = {
  en: {
    // ----- common -----
    blood_group: "Blood Group",
    all: "All",
    name_label: "Name",
    location_label: "Location",
    contact_donor: "Contact Donor",
    not_available: "Not Available",
    available_now: "Available Now",
    currently_unavailable: "Currently Unavailable",
    copy_number: "Copy Number",
    copied: "Copied!",
    close: "Close",

    // ----- navbar -----
    nav_home: "Home",
    nav_find_donors: "Find Donors",
    nav_become_donor: "Become a Donor",
    nav_blood_requests: "Blood Requests",
    nav_about: "About Us",
    nav_my_profile: "My Profile",
    nav_hi: "Hi, {name}",
    nav_user_fallback: "User",
    nav_logout: "Logout",
    nav_login: "Login",
    nav_register: "Register",
    nav_toggle_menu: "Toggle menu",

    // ----- footer -----
    footer_tagline_1: "Connecting blood donors with people in need.",
    footer_tagline_2: "Together, we can save more lives.",
    footer_quick_links: "Quick Links",
    footer_get_involved: "Get Involved",
    footer_register_donor: "Register as Donor",
    footer_find_blood: "Find Blood",
    footer_emergency: "Emergency Request",
    footer_contact_us: "Contact Us",
    footer_contact: "Contact",
    footer_country: "Bangladesh",
    footer_rights: "© 2026 BD Blood Hub. All rights reserved.",

    // ----- find donors page -----
    fd_tag: "FIND DONORS",
    fd_title: "Find Blood Donors Near You",
    fd_subtitle:
      "Search for available blood donors by blood group and location.",
    fd_blood_group_all: "Blood Group: All",
    fd_location_placeholder: "Enter Location...",
    fd_searching: "Searching...",
    fd_search: "Search Donors",
    fd_reset: "Reset",
    fd_results_tag: "DONOR RESULTS",
    fd_results_title: "Available Donors",
    fd_found_one: "{n} Donor Found",
    fd_found_many: "{n} Donors Found",
    fd_loading_title: "Finding donors...",
    fd_loading_text: "Please wait while we search the donor database.",
    fd_error_title: "Unable to load donors",
    fd_try_again: "Try Again",
    fd_none_title: "No donors found",
    fd_none_text:
      "No donors match your selected blood group and location.",
    fd_clear: "Clear Filters",
    fd_err_fetch: "Failed to fetch donors.",
    fd_err_generic: "Something went wrong while loading donors.",

    // ----- home page donors list -----
    dn_tag: "AVAILABLE DONORS",
    dn_show_more: "Show More",
  },

  bn: {
    // ----- common -----
    blood_group: "রক্তের গ্রুপ",
    all: "সব",
    name_label: "নাম",
    location_label: "এলাকা",
    contact_donor: "ডোনারের সাথে যোগাযোগ",
    not_available: "পাওয়া যাচ্ছে না",
    available_now: "এখন পাওয়া যাবে",
    currently_unavailable: "এখন পাওয়া যাবে না",
    copy_number: "নম্বর কপি করুন",
    copied: "কপি হয়েছে!",
    close: "বন্ধ করুন",

    // ----- navbar -----
    nav_home: "হোম",
    nav_find_donors: "ডোনার খুঁজুন",
    nav_become_donor: "ডোনার হোন",
    nav_blood_requests: "রক্তের অনুরোধ",
    nav_about: "আমাদের সম্পর্কে",
    nav_my_profile: "আমার প্রোফাইল",
    nav_hi: "হ্যালো, {name}",
    nav_user_fallback: "ব্যবহারকারী",
    nav_logout: "লগআউট",
    nav_login: "লগইন",
    nav_register: "রেজিস্টার",
    nav_toggle_menu: "মেনু খুলুন বা বন্ধ করুন",

    // ----- footer -----
    footer_tagline_1: "রক্তদাতাদের সাথে প্রয়োজনে থাকা মানুষদের যুক্ত করছি।",
    footer_tagline_2: "একসাথে আমরা আরও অনেক প্রাণ বাঁচাতে পারি।",
    footer_quick_links: "দ্রুত লিংক",
    footer_get_involved: "যুক্ত হোন",
    footer_register_donor: "ডোনার হিসেবে নিবন্ধন",
    footer_find_blood: "রক্ত খুঁজুন",
    footer_emergency: "জরুরি অনুরোধ",
    footer_contact_us: "যোগাযোগ করুন",
    footer_contact: "যোগাযোগ",
    footer_country: "বাংলাদেশ",
    footer_rights: "© ২০২৬ বিডি ব্লাড হাব। সর্বস্বত্ব সংরক্ষিত।",

    // ----- find donors page -----
    fd_tag: "ডোনার খুঁজুন",
    fd_title: "আপনার কাছের রক্তদাতা খুঁজুন",
    fd_subtitle:
      "রক্তের গ্রুপ ও এলাকা দিয়ে রক্ত দিতে প্রস্তুত ডোনার খুঁজুন।",
    fd_blood_group_all: "রক্তের গ্রুপ: সব",
    fd_location_placeholder: "এলাকা লিখুন...",
    fd_searching: "খোঁজা হচ্ছে...",
    fd_search: "ডোনার খুঁজুন",
    fd_reset: "রিসেট",
    fd_results_tag: "ডোনারের তালিকা",
    fd_results_title: "প্রস্তুত ডোনার",
    fd_found_one: "{n} জন ডোনার পাওয়া গেছে",
    fd_found_many: "{n} জন ডোনার পাওয়া গেছে",
    fd_loading_title: "ডোনার খোঁজা হচ্ছে...",
    fd_loading_text: "ডোনারের তালিকা খোঁজা হচ্ছে, একটু অপেক্ষা করুন।",
    fd_error_title: "ডোনারের তালিকা আনা যায়নি",
    fd_try_again: "আবার চেষ্টা করুন",
    fd_none_title: "কোনো ডোনার পাওয়া যায়নি",
    fd_none_text:
      "আপনার বেছে নেওয়া রক্তের গ্রুপ ও এলাকায় কোনো ডোনার মেলেনি।",
    fd_clear: "ফিল্টার মুছুন",
    fd_err_fetch: "ডোনারের তথ্য আনা যায়নি।",
    fd_err_generic: "ডোনারের তালিকা লোড করার সময় সমস্যা হয়েছে।",

    // ----- home page donors list -----
    dn_tag: "প্রস্তুত ডোনার",
    dn_show_more: "আরও দেখুন",
  },
};