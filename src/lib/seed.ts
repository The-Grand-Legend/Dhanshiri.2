import type { AppData } from '../types'
import { nowISO } from './utils'

const IMG = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const IMG_HERO = IMG('1589302168068-964664d93dc0', 1600)

export function defaultData(): AppData {
  return {
    settings: {
      password: '202020',
      tableBookingPrice: 200,
      partyHallPrice: 15000,
      deliveryCharge: 60,
      phone: '01912-845151',
      address: '2979+7F9 Haji Market, 5800 Dhaka - Rangpur Hwy, Mokamtola',
      hours: '10:00 AM - 11:30 PM',
    },
    menu: [
      // Kacchi & Biryani
      { id: 'm01', nameBn: 'কাচ্চি বিরিয়ানি (স্পেশাল)', nameEn: 'Kacchi Biryani (Special)', descBn: 'মাটির হাঁড়িতে রান্না, আলু ও কাচ্চি মাংসের ঐতিহ্যবাহী স্বাদ', descEn: 'Traditional mutton kacchi slow-cooked in clay pot', price: 300, category: 'biryani', badge: 'bestseller', image: IMG('1563379091339-03b21ab4a4f8'), available: true },
      { id: 'm02', nameBn: 'চিকেন বিরিয়ানি', nameEn: 'Chicken Biryani', descBn: 'ঘি ভরপুর সুগন্ধি চাল ও মসলাদার চিকেন', descEn: 'Aromatic rice with masala chicken & ghee', price: 220, category: 'biryani', badge: 'bestseller', image: IMG('1589302168068-964664d93dc0'), available: true },
      { id: 'm03', nameBn: 'বিফ বিরিয়ানি', nameEn: 'Beef Biryani', descBn: 'রসালো বিফ ও বিরিয়ানি মসলার অসাধারণ মিশ্রণ', descEn: 'Tender beef layered with biryani spices', price: 260, category: 'biryani', badge: 'hot', image: IMG('1631515243349-e0cb75fb8d3a'), available: true },
      { id: 'm04', nameBn: 'মোরগ পোলাও', nameEn: 'Morog Polao', descBn: 'নরম মোরগের মাংস দিয়ে বিশেষ পোলাও', descEn: 'Fragrant polao with tender chicken', price: 250, category: 'biryani', badge: '', image: IMG('1596797038530-2c107229654b'), available: true },
      // Burgers
      { id: 'm05', nameBn: 'বিফ বার্গার', nameEn: 'Beef Burger', descBn: 'জুসি বিফ প্যাটি, সালাদ ও সিক্রেট সস', descEn: 'Juicy beef patty with fresh salad & secret sauce', price: 150, category: 'burger', badge: 'bestseller', image: IMG('1568901346375-23c9450c58cd'), available: true },
      { id: 'm06', nameBn: 'চিকেন চিজ বার্গার', nameEn: 'Chicken Cheese Burger', descBn: 'কুড়ি পিস চিকেন ও মোজারেলা চিজের সাথে', descEn: 'Crispy chicken fillet with melted mozzarella', price: 180, category: 'burger', badge: 'popular', image: IMG('1571091718767-18b5b1457add'), available: true },
      { id: 'm07', nameBn: 'গ্রিল চিকেন বার্গার', nameEn: 'Grilled Chicken Burger', descBn: 'গ্রিল করা চিকেন ব্রেস্ট, হালকা ও সুস্বাদু', descEn: 'Smoky grilled chicken breast, light & tasty', price: 170, category: 'burger', badge: '', image: IMG('1615297928064-24977384d0da'), available: true },
      { id: 'm08', nameBn: 'স্মোকি বিফ বার্গার', nameEn: 'Smoky Beef Burger', descBn: 'বার্বিকিউ সস দিয়ে স্মোকি টেস্ট', descEn: 'Double beef with BBQ smoky twist', price: 200, category: 'burger', badge: 'new', image: IMG('1553979459-d2229ba7433a'), available: true },
      // BBQ & Grill
      { id: 'm09', nameBn: 'চিকেন বিকিউ', nameEn: 'Chicken BBQ', descBn: 'কাঠকয়লায় গ্রিল করা মসলাদার চিকেন', descEn: 'Charcoal grilled spicy chicken', price: 160, category: 'bbq', badge: 'popular', image: IMG('1529193591184-b1d58069ecdd'), available: true },
      { id: 'm10', nameBn: 'বিফ কাবাব', nameEn: 'Beef Kabab', descBn: 'নরম বিফ কাবাব, পেঁয়াজ চাটনি সহ', descEn: 'Soft minced beef kabab with onion chutney', price: 180, category: 'bbq', badge: '', image: IMG('1599487488170-d11ec9c172f0'), available: true },
      { id: 'm11', nameBn: 'চিকেন টিক্কা', nameEn: 'Chicken Tikka', descBn: 'দই-মসলা মেরিনেট করা টিক্কা', descEn: 'Yogurt-marinated chicken tikka', price: 190, category: 'bbq', badge: 'hot', image: IMG('1599487488170-d11ec9c172f0'), available: true },
      { id: 'm12', nameBn: 'মিক্সড গ্রিল প্ল্যাটার', nameEn: 'Mixed Grill Platter', descBn: 'চিকেন, বিফ ও কাবাবের একসাথে প্ল্যাটার', descEn: 'Chicken, beef & kabab platter for sharing', price: 450, category: 'bbq', badge: 'new', image: IMG('1544025162-d76694265947'), available: true },
      // Chinese
      { id: 'm13', nameBn: 'চিকেন ফ্রাইড রাইস', nameEn: 'Chicken Fried Rice', descBn: 'সবজি ও চিকেন দিয়ে বিশেষ ফ্রাইড রাইস', descEn: 'Wok-fried rice with chicken & vegetables', price: 180, category: 'chinese', badge: '', image: IMG('1603133872878-684f208fb84b'), available: true },
      { id: 'm14', nameBn: 'বিফ চিলি', nameEn: 'Beef Chilli', descBn: 'ঝাল-মিষ্টি চিলি সসে বিফ', descEn: 'Beef tossed in sweet & chilli sauce', price: 220, category: 'chinese', badge: 'hot', image: IMG('1525755662778-989d0524087e'), available: true },
      { id: 'm15', nameBn: 'চিকেন মাঞ্চুরিয়ান', nameEn: 'Chicken Manchurian', descBn: 'গাঢ় সসে কুড়ি চিকেন', descEn: 'Crispy chicken in dark manchurian sauce', price: 200, category: 'chinese', badge: '', image: IMG('1626645738196-c2a7c87a8f58'), available: true },
      // Pasta
      { id: 'm16', nameBn: 'পাস্তা আলফ্রেডো', nameEn: 'Pasta Alfredo', descBn: 'ক্রিমি আলফ্রেডো সসে পাস্তা ও চিকেন', descEn: 'Creamy alfredo pasta with chicken', price: 240, category: 'pasta', badge: 'popular', image: IMG('1645112411341-6c4fd0d0c34c'), available: true },
      { id: 'm17', nameBn: 'স্পাইসি পেনে পাস্তা', nameEn: 'Spicy Penne Pasta', descBn: 'ঝাল-টিজি টমেটো সসে পেনে পাস্তা', descEn: 'Penne tossed in spicy tomato sauce', price: 210, category: 'pasta', badge: '', image: IMG('1563379926898-05f4575a45d8'), available: true },
      // Starters
      { id: 'm18', nameBn: 'চিকেন ললিপপ', nameEn: 'Chicken Lollipop', descBn: 'কুড়ি চিকেন ললিপপ, চাটনি সহ', descEn: 'Crispy chicken lollipop with dip', price: 150, category: 'starter', badge: '', image: IMG('1626082927389-6cd097cdc6ec'), available: true },
      { id: 'm19', nameBn: 'ফ্রেঞ্চ ফ্রাইজ', nameEn: 'French Fries', descBn: 'সোনালি ও কুড়ি ফ্রেঞ্চ ফ্রাইজ', descEn: 'Golden crispy fries', price: 80, category: 'starter', badge: 'popular', image: IMG('1573080496219-bb080dd4f877'), available: true },
      { id: 'm20', nameBn: 'চিকেন চাঁপ', nameEn: 'Chicken Chaap', descBn: 'ঘি-মসলায় ভাজা চিকেন চাঁপ', descEn: 'Ghee-fried chicken chaap', price: 140, category: 'starter', badge: '', image: IMG('1610057099443-fde8c4d50f91'), available: true },
      // Desserts
      { id: 'm21', nameBn: 'চকলেট ব্রাউনি', nameEn: 'Chocolate Brownie', descBn: 'ভেজা চকলেট ব্রাউনি, আইসক্রিম সহ', descEn: 'Fudgy brownie served with ice cream', price: 120, category: 'dessert', badge: 'dessert', image: IMG('1606313564200-e75d5e30476c'), available: true },
      { id: 'm22', nameBn: 'ফিরনি', nameEn: 'Firni', descBn: 'ঐতিহ্যবাহী চালের গুঁড়োর ফিরনি', descEn: 'Traditional Bengali rice pudding', price: 90, category: 'dessert', badge: 'dessert', image: IMG('1488477181946-6428a0291777'), available: true },
      { id: 'm23', nameBn: 'আইসক্রিম সানডে', nameEn: 'Ice Cream Sundae', descBn: 'তিন ফ্লেভার আইসক্রিম ও চকলেট সস', descEn: 'Three flavours with chocolate sauce', price: 130, category: 'dessert', badge: '', image: IMG('1563805042-7684c019e1cb'), available: true },
      // Drinks
      { id: 'm24', nameBn: 'আমের লাচ্ছি', nameEn: 'Mango Lassi', descBn: 'ঘন দই ও আমের মিষ্টি লাচ্ছি', descEn: 'Thick sweet mango lassi', price: 90, category: 'drink', badge: 'popular', image: IMG('1546173159-315724a31696'), available: true },
      { id: 'm25', nameBn: 'কোল্ড কফি', nameEn: 'Cold Coffee', descBn: 'ঠান্ডা ও ক্রিমি কফি', descEn: 'Chilled creamy coffee', price: 110, category: 'drink', badge: '', image: IMG('1461023058943-07fcbe16d735'), available: true },
      { id: 'm26', nameBn: 'ফ্রেশ লাইম মিন্ট', nameEn: 'Fresh Lime Mint', descBn: 'টক-ঝাল রিফ্রেশিং লাইম মিন্ট', descEn: 'Zesty refreshing lime mint', price: 70, category: 'drink', badge: '', image: IMG('1513558161293-cdaf765ed2fd'), available: true },
    ],
    gallery: [
      { id: 'g1', url: IMG('1517248135467-4c7edcad34c4', 1000), titleBn: 'আমাদের রেস্টুরেন্ট', titleEn: 'Our Restaurant', category: 'interior' },
      { id: 'g2', url: IMG('1552566626-52f8b828add9', 1000), titleBn: 'খাবারের হল', titleEn: 'Dining Hall', category: 'interior' },
      { id: 'g3', url: IMG('1414235077428-338989a2e8c0', 1000), titleBn: 'পরিবেশনা', titleEn: 'Fine Plating', category: 'food' },
      { id: 'g4', url: IMG('1563379091339-03b21ab4a4f8', 1000), titleBn: 'কাচ্চি বিরিয়ানি', titleEn: 'Kacchi Biryani', category: 'food' },
      { id: 'g5', url: IMG('1519671482749-fd09be7ccebf', 1000), titleBn: 'পার্টি সেলিব্রেশন', titleEn: 'Party Nights', category: 'event' },
      { id: 'g6', url: IMG('1530103862676-de8c9debad1d', 1000), titleBn: 'বার্থডে পার্টি', titleEn: 'Birthday Parties', category: 'event' },
      { id: 'g7', url: IMG('1555396273-367ea4eb4db5', 1000), titleBn: 'পরিষ্কার পরিচ্ছন্ন রান্নাঘর', titleEn: 'Clean Kitchen', category: 'interior' },
      { id: 'g8', url: IMG('1544025162-d76694265947', 1000), titleBn: 'বিকিউ স্পেশাল', titleEn: 'BBQ Specials', category: 'food' },
      { id: 'g9', url: IMG('1464366400600-7168b8af9bc3', 1000), titleBn: 'বিয়ের অনুষ্ঠান', titleEn: 'Wedding Ceremonies', category: 'event' },
      { id: 'g10', url: IMG('1555244162-803834f70033', 1000), titleBn: 'পার্টি হল সাজানো', titleEn: 'Decorated Party Hall', category: 'event' },
      { id: 'g11', url: IMG('1571091718767-18b5b1457add', 1000), titleBn: 'বার্গার কালেকশন', titleEn: 'Burger Collection', category: 'food' },
      { id: 'g12', url: IMG('1559339352-11d035aa65de', 1000), titleBn: 'ক্যাফে কর্নার', titleEn: 'Cafe Corner', category: 'interior' },
    ],
    offers: [
      { id: 'o1', titleBn: 'কাচ্চি বিরিয়ানি ফ্যামিলি প্যাক', titleEn: 'Kacchi Family Pack', descBn: '৪ পর্যন্ত কাচ্চি বিরিয়ানি অর্ডারে ১৫% ছাড়! কোড ব্যবহার করুন DHAN15', descEn: '15% off on Kacchi Biryani orders up to 4 pcs. Use code DHAN15', code: 'DHAN15', discount: 15, active: true },
      { id: 'o2', titleBn: 'বার্থডে পার্টি অফার', titleEn: 'Birthday Party Offer', descBn: 'বার্থডে পার্টি বুকিং-এ ফ্রি কেক ও ১০% ছাড়', descEn: 'Free cake + 10% off on birthday hall bookings', code: 'BDAY10', discount: 10, active: true },
      { id: 'o3', titleBn: 'লাঞ্চ কম্বো', titleEn: 'Lunch Combo', descBn: 'দুপুর ১২টা-৩টার মধ্যে বিরিয়ানি + লাচ্ছি মাত্র ৳২৫০', descEn: 'Biryani + Lassi only ৳250, 12PM - 3PM', code: 'LUNCH250', discount: 0, active: true },
    ],
    notices: [
      { id: 'n1', titleBn: 'ঈদ স্পেশাল অফার চলছে', titleEn: 'Eid Special Offer Running', bodyBn: 'ঈদ উপলক্ষে সকল বিরিয়ানি ও কাচ্চিতে বিশেষ ছাড়। এখনই অর্ডার করুন!', bodyEn: 'Special discounts on all Biryani & Kacchi this Eid. Order now!', date: nowISO().slice(0, 10), pinned: true },
      { id: 'n2', titleBn: 'পার্টি হল বুকিং চলছে', titleEn: 'Party Hall Booking Open', bodyBn: 'বিয়ে, বার্থডে ও কর্পোরেট ইভেন্টের জন্য পূর্ণ পার্টি হল বুকিং শুরু। আগে বুক করলে বেশি সুবিধা।', bodyEn: 'Full hall booking open for weddings, birthdays & corporate events.', date: nowISO().slice(0, 10), pinned: false },
      { id: 'n3', titleBn: 'নতুন আইটেম এসেছে', titleEn: 'New Items Added', bodyBn: 'মেনুতে এসেছে স্মোকি বিফ বার্গার ও মিক্সড গ্রিল প্ল্যাটার। ট্রাই করে দেখুন!', bodyEn: 'Smoky Beef Burger & Mixed Grill Platter now on the menu. Try them!', date: nowISO().slice(0, 10), pinned: false },
    ],
    reviews: [
      { id: 'r1', name: 'Rahim Uddin', rating: 5, comment: 'কাচ্চি বিরিয়ানির দাম আর স্বাদ দুটোই দারুণ। পরিবেশনাও চমৎকার। Highly recommended!', date: '2026-09-20' },
      { id: 'r2', name: 'Fatema Akter', rating: 5, comment: 'আমার ছেলের বার্থডে পার্টি এখানে করেছি। পার্টি হল খুব সুন্দর সাজানো ছিল। সবাই খুশি ছিল।', date: '2026-09-12' },
      { id: 'r3', name: 'Kamal Hossain', rating: 4, comment: 'Burger and BBQ were amazing. Service was fast. Must visit if you are in Mokamtola!', date: '2026-08-30' },
      { id: 'r4', name: 'Nusrat Jahan', rating: 5, comment: 'অনলাইনে অর্ডার করেছিলাম, খুব দ্রুত ডেলিভারি পেয়েছি। চিকেন চিজ বার্গার অসাধারণ!', date: '2026-08-18' },
      { id: 'r5', name: 'Shakil Ahmed', rating: 5, comment: 'Corporate event এর জন্য পুরো হল নিয়েছিলাম। খাবার ও সেবা দুটোই প্রশংসনীয়।', date: '2026-07-25' },
      { id: 'r6', name: 'Tanvir Alam', rating: 4, comment: 'Great food, affordable price. The biryani here is one of the best in Rangpur highway area.', date: '2026-07-02' },
    ],
    bookings: [],
    orders: [],
    events: [],
  }
}
