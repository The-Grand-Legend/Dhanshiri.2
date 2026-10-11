import type { Lang } from '../types'

export const CATEGORIES = [
  { key: 'biryani', bn: 'বিরিয়ানি ও কাচ্চি', en: 'Biryani & Kacchi' },
  { key: 'burger', bn: 'বার্গার', en: 'Burgers' },
  { key: 'bbq', bn: 'বিকিউ ও গ্রিল', en: 'BBQ & Grill' },
  { key: 'chinese', bn: 'চাইনিজ', en: 'Chinese' },
  { key: 'pasta', bn: 'পাস্তা', en: 'Pasta' },
  { key: 'starter', bn: 'স্টার্টার', en: 'Starters' },
  { key: 'dessert', bn: 'ডেজার্ট', en: 'Desserts' },
  { key: 'drink', bn: 'পানীয়', en: 'Drinks' },
] as const

export const BADGE_LABEL: Record<string, { bn: string; en: string }> = {
  bestseller: { bn: 'বেস্টসেলার', en: 'Bestseller' },
  hot: { bn: 'হট', en: 'Hot' },
  popular: { bn: 'জনপ্রিয়', en: 'Popular' },
  new: { bn: 'নতুন', en: 'New' },
  dessert: { bn: 'ডেজার্ট', en: 'Dessert' },
}

export const PAYMENT_LABEL: Record<string, { bn: string; en: string }> = {
  bkash: { bn: 'বিকাশ', en: 'bKash' },
  nagad: { bn: 'নগদ', en: 'Nagad' },
  card: { bn: 'কার্ড', en: 'Card' },
  cash: { bn: 'ক্যাশ', en: 'Cash' },
}

type Dict = Record<string, { bn: string; en: string }>

export const dict: Dict = {
  brand: { bn: 'ধনশিরি রেস্টুরেন্ট ও পার্টি সেন্টার', en: 'Dhanshiri Restaurant & Party Center' },
  tagline: { bn: 'খাবার শুধু পেট ভরে না মনও ভরে..', en: 'Food that fills the stomach AND the soul..' },
  navHome: { bn: 'হোম', en: 'Home' },
  navMenu: { bn: 'মেনু', en: 'Menu' },
  navGallery: { bn: 'গ্যালারি', en: 'Gallery' },
  navParty: { bn: 'পার্টি হল', en: 'Party Hall' },
  navReviews: { bn: 'রিভিউ', en: 'Reviews' },
  navContact: { bn: 'যোগাযোগ', en: 'Contact' },
  orderNow: { bn: 'অর্ডার করুন', en: 'Order Now' },
  exploreMenu: { bn: 'আমাদের মেনু দেখুন', en: 'Explore Our Menu' },
  bookTable: { bn: 'টেবিল বুক করুন', en: 'Book a Table' },
  heroStat1: { bn: 'খাবার আইটেম', en: 'Food Items' },
  heroStat2: { bn: 'গ্রাহক সন্তুষ্টি', en: 'Happy Customers' },
  heroStat3: { bn: 'বছরের অভিজ্ঞতা', en: 'Years of Taste' },

  bookingTitle: { bn: 'টেবিল বুকিং', en: 'Table Booking' },
  bookingSub: { bn: 'আপনার পছন্দের সময়ে টেবিল রিজার্ভ করুন', en: 'Reserve your table at your preferred time' },
  fullName: { bn: 'পুরো নাম', en: 'Full Name' },
  mobile: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' },
  date: { bn: 'তারিখ', en: 'Date' },
  time: { bn: 'সময়', en: 'Time' },
  guests: { bn: 'অতিথি সংখ্যা', en: 'Guests' },
  paymentMethod: { bn: 'পেমেন্ট পদ্ধতি', en: 'Payment Method' },
  bookPay: { bn: 'বুক করুন ও পে করুন', en: 'Book Now & Pay' },
  bookingSuccess: { bn: 'বুকিং সফল হয়েছে!', en: 'Booking Successful!' },
  bookingSuccessBody: { bn: 'আপনার টেবিল রিজার্ভ হয়ে গেছে। শীঘ্রই আমরা কল করব।', en: 'Your table is reserved. We will call you shortly.' },
  perSeat: { bn: 'প্রতি জন', en: 'per guest' },
  nameRequired: { bn: 'অনুগ্রহ করে নাম লিখুন', en: 'Please enter your name' },
  phoneInvalid: { bn: 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন', en: 'Enter a valid BD mobile number' },
  selectTime: { bn: 'অনুগ্রহ করে সময় নির্বাচন করুন', en: 'Please select a time' },

  menuTitle: { bn: 'আমাদের মেনু', en: 'Our Menu' },
  menuSub: { bn: 'তাজা উপকরণ দিয়ে প্রতিদিন রান্না হয় সেরা স্বাদের খাবার', en: 'Freshly cooked every day with the finest ingredients' },
  addToCart: { bn: 'কার্টে যোগ করুন', en: 'Add to Cart' },
  addedToCart: { bn: 'কার্টে যোগ হয়েছে!', en: 'Added to cart!' },
  all: { bn: 'সব', en: 'All' },
  tk: { bn: '৳', en: '৳' },

  cartTitle: { bn: 'আপনার কার্ট', en: 'Your Cart' },
  emptyCart: { bn: 'আপনার কার্ট খালি', en: 'Your cart is empty' },
  emptyCartBody: { bn: 'মেনু থেকে পছন্দের খাবার যোগ করুন', en: 'Add your favourite items from the menu' },
  subtotal: { bn: 'সাবটোটাল', en: 'Subtotal' },
  deliveryCharge: { bn: 'ডেলিভারি চার্জ', en: 'Delivery Charge' },
  total: { bn: 'মোট', en: 'Total' },
  checkout: { bn: 'চেকআউট করুন', en: 'Checkout' },
  checkoutTitle: { bn: 'অনলাইন অর্ডার ও পেমেন্ট', en: 'Online Order & Payment' },
  deliveryAddress: { bn: 'ডেলিভারি ঠিকানা', en: 'Delivery Address' },
  placeOrder: { bn: 'অর্ডার কনফার্ম করুন', en: 'Confirm Order' },
  orderSuccess: { bn: 'অর্ডার সফল হয়েছে!', en: 'Order Placed!' },
  orderSuccessBody: { bn: 'আপনার অর্ডার নেওয়া হয়েছে। খুব দ্রুত ডেলিভারি পাবেন।', en: 'Your order has been accepted. Delivery incoming soon!' },
  orderNo: { bn: 'অর্ডার নম্বর', en: 'Order No' },
  payWith: { bn: 'পেমেন্ট করুন', en: 'Pay with' },
  bkashHint: { bn: 'বিকাশ/নগদ নম্বরে সেন্ড মানি করুন: 01912-845151', en: 'Send Money to bKash/Nagad: 01912-845151' },
  clearCart: { bn: 'কার্ট খালি করুন', en: 'Clear Cart' },

  partyTitle: { bn: 'পার্টি ও ইভেন্ট', en: 'Party & Events' },
  partySub: { bn: 'প্রতিটি উৎসবকে করুন অবিস্মরণীয়', en: 'Make every celebration unforgettable' },
  bookEvent: { bn: 'ইভেন্ট বুক করুন', en: 'Book Your Event' },
  fullRoomBooking: { bn: 'পূর্ণ পার্টি হল বুকিং', en: 'Full Room Booking' },
  fullRoomDesc: { bn: 'একসাথে ২০০+ অতিথি, সাজসজ্জা, লাইটিং ও কেটারিং সুবিধা', en: '200+ guests, decoration, lighting & catering facility' },
  eventBookingTitle: { bn: 'ইভেন্ট বুকিং ফর্ম', en: 'Event Booking Form' },
  eventType: { bn: 'ইভেন্টের ধরন', en: 'Event Type' },
  birthday: { bn: 'বার্থডে পার্টি', en: 'Birthday Party' },
  wedding: { bn: 'বিয়ের অনুষ্ঠান', en: 'Wedding Ceremony' },
  corporate: { bn: 'কর্পোরেট ইভেন্ট', en: 'Corporate Event' },
  special: { bn: 'বিশেষ উৎসব', en: 'Special Occasion' },
  hallOnly: { bn: 'শুধু পার্টি হল', en: 'Hall Only (Full Room)' },
  eventSuccess: { bn: 'ইভেন্ট বুকিং সফল হয়েছে!', en: 'Event Booking Successful!' },

  reviewsTitle: { bn: 'গ্রাহকদের মতামত', en: 'Customer Reviews' },
  reviewsSub: { bn: 'আমাদের অতিথিদের সুন্দর অভিজ্ঞতার কথা', en: 'Words from our lovely guests' },
  writeReview: { bn: 'রিভিউ লিখুন', en: 'Write a Review' },
  yourName: { bn: 'আপনার নাম', en: 'Your Name' },
  rating: { bn: 'রেটিং', en: 'Rating' },
  comment: { bn: 'মন্তব্য', en: 'Comment' },
  submitReview: { bn: 'রিভিউ জমা দিন', en: 'Submit Review' },
  reviewThanks: { bn: 'ধন্যবাদ! আপনার রিভিউ যোগ হয়েছে।', en: 'Thank you! Your review has been added.' },

  noticeTitle: { bn: 'নোটিশ বোর্ড ও অফার', en: 'Notice Board & Offers' },
  noticeSub: { bn: 'চলতি নোটিশ ও বিশেষ অফারের খবর', en: 'Current notices & special food offers' },
  noticesLabel: { bn: 'নোটিশ', en: 'Notices' },
  offersLabel: { bn: 'বিশেষ অফার', en: 'Special Offers' },
  copyCode: { bn: 'কোড কপি করুন', en: 'Copy Code' },
  codeCopied: { bn: 'কোড কপি হয়েছে!', en: 'Code copied!' },

  contactTitle: { bn: 'লোকেশন ও যোগাযোগ', en: 'Location & Contact' },
  contactSub: { bn: 'মোকামতলা, ঢাকা-রংপুর হাইওয়ে', en: 'Mokamtola, Dhaka-Rangpur Highway' },
  address: { bn: 'ঠিকানা', en: 'Address' },
  phone: { bn: 'ফোন', en: 'Phone' },
  openHours: { bn: 'খোলার সময়', en: 'Open Hours' },
  getDirections: { bn: 'দিকনির্দেশ নিন', en: 'Get Directions' },
  callNow: { bn: 'এখনই কল করুন', en: 'Call Now' },

  chatTitle: { bn: 'Dhanshiri AI সহকারী', en: 'Dhanshiri AI Assistant' },
  chatPlaceholder: { bn: 'আপনার প্রশ্ন লিখুন...', en: 'Type your question...' },
  chatGreeting: { bn: 'আসসালামু আলাইকুম! 🌿 আমি Dhanshiri-এর AI সহকারী। মেনু, বুকিং, অফার বা অর্ডার সম্পর্কে জানতে চাইলে লিখুন!', en: 'Hello! 🌿 I am the Dhanshiri AI assistant. Ask me about menu, booking, offers or orders!' },

  footerTagline: { bn: 'Good Food Good Mood', en: 'Good Food Good Mood' },
  quickLinks: { bn: 'দ্রুত লিংক', en: 'Quick Links' },
  followUs: { bn: 'আমাদের ফলো করুন', en: 'Follow Us' },
  rights: { bn: 'সর্বস্বত্ব সংরক্ষিত', en: 'All Rights Reserved' },
  credit: { bn: 'ওয়েবসাইট তৈরি: Unique Web Pro', en: 'Website by Unique Web Pro' },
  devContact: { bn: 'ডেভেলপার: 01644059887', en: 'Developer: 01644059887' },
  installApp: { bn: 'অ্যাপ ইনস্টল করুন', en: 'Install App' },
  notifTitle: { bn: 'নোটিফিকেশন', en: 'Notifications' },
  notifEmpty: { bn: 'কোনো নোটিফিকেশন নেই', en: 'No notifications yet' },
  items: { bn: 'আইটেম', en: 'items' },
  qty: { bn: 'পরিমাণ', en: 'Qty' },
}

export function tr(key: string, lang: Lang): string {
  const e = dict[key]
  if (!e) return key
  return lang === 'bn' ? e.bn : e.en
}
