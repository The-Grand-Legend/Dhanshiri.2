import { useEffect, useRef, useState } from 'react'
import { useStore } from '../lib/store'
import { dict } from '../lib/i18n'
import { cn, taka } from '../lib/utils'
import { IconBot, IconClose, IconSend } from './ui/Icons'

interface Msg {
  id: string
  from: 'bot' | 'user'
  text: string
}

const GREETING_BN =
  'আসসালামু আলাইকুম! 🌿 আমি ধনশিরির AI সহকারী। মেনু, দাম, অফার, বুকিং, লোকেশন — যেকোনো বিষয়ে জিজ্ঞাসা করুন!'
const GREETING_EN =
  'Hello! 🌿 I am the Dhanshiri AI assistant. Ask me about menu, prices, offers, booking or location!'

export function Chatbot() {
  const { lang, data } = useStore()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)

  useEffect(() => {
    setMsgs([{ id: 'greet', from: 'bot', text: lang === 'bn' ? GREETING_BN : GREETING_EN }])
  }, [lang])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, open])

  const answer = (qRaw: string): string => {
    const q = qRaw.toLowerCase()
    const bn = lang === 'bn'
    const s = data.settings

    // Menu / price lookup: match against item names
    const match = data.menu.find(
      (m) =>
        m.available &&
        (q.includes(m.nameEn.toLowerCase()) ||
          (m.nameEn.toLowerCase().split(' ').some((w) => w.length > 4 && q.includes(w))) ||
          q.includes(m.nameBn))
    )
    if (match && /(price|দাম|কত|cost|rate|টাকা)/.test(q) === false && /(menu|মেনু|item|খাবার)/.test(q) === false) {
      return bn
        ? `${match.nameBn} — ${taka(match.price, 'bn')}। ${match.descBn}`
        : `${match.nameEn} — ${taka(match.price, 'en')}. ${match.descEn}`
    }
    if (match) {
      return bn
        ? `${match.nameBn} এর দাম ${taka(match.price, 'bn')}। ${match.descBn}`
        : `${match.nameEn} costs ${taka(match.price, 'en')}. ${match.descEn}`
    }

    if (/(price|দাম|কত|cost|rate|menu|মেনু)/.test(q)) {
      const top = data.menu.filter((m) => m.available).slice(0, 5)
      if (bn) {
        return `আমাদের জনপ্রিয় কিছু আইটেম:\n${top
          .map((m) => `• ${m.nameBn} — ${taka(m.price, 'bn')}`)
          .join('\n')}\nপুরো মেনু দেখতে উপরের "মেনু" বাটনে ক্লিক করুন।`
      }
      return `Our popular items:\n${top
        .map((m) => `• ${m.nameEn} — ${taka(m.price, 'en')}`)
        .join('\n')}\nTap "Menu" above to see the full menu.`
    }

    if (/(offer|ছাড়|discount|ডিসকাউন্ট|coupon|কোড)/.test(q)) {
      const offers = data.offers.filter((o) => o.active)
      if (offers.length === 0) return bn ? 'এই মুহূর্তে কোনো অফার নেই।' : 'No active offers right now.'
      return bn
        ? `চলমান অফারসমূহ:\n${offers
            .map((o) => `• ${o.titleBn} — ${o.discount > 0 ? o.discount + '% ছাড় ' : ''}(${o.code})`)
            .join('\n')}`
        : `Current offers:\n${offers
            .map((o) => `• ${o.titleEn} — ${o.discount > 0 ? o.discount + '% off ' : ''}(${o.code})`)
            .join('\n')}`
    }

    if (/(book|বুক|table|টেবিল|reservation|রিজার্ভ)/.test(q) && /(party|পার্টি|hall|হল|event|ইভেন্ট|room|কক্ষ)/.test(q)) {
      return bn
        ? `পার্টি হল বুকিং শুর৮ মাত্র ${taka(s.partyHallPrice, 'bn')} থেকে! বার্থডে, বিয়ে, কর্পোরেট ইভেন্ট — সব ধরনের আয়োজন হয়ে থাকে। উপরের "পার্টি হল" সেকশনে গিয়ে "ইভেন্ট বুক করুন" বাটনে ক্লিক করুন, অথবা কল করুন ${s.phone}।`
        : `Full party hall booking starts at just ${taka(s.partyHallPrice, 'en')}! Birthdays, weddings, corporate events — all covered. Use the "Book Your Event" button in the Party Hall section, or call ${s.phone}.`
    }

    if (/(book|বুক|table|টেবিল|reservation|রিজার্ভ)/.test(q)) {
      return bn
        ? `টেবিল বুক করতে উপরের হিরো সেকশনের বুকিং ফর্ম পূরণ করুন — নাম, মোবাইল, তারিখ, সময় ও অতিথি সংখ্যা দিন। প্রতি জন মাত্র ${taka(s.tableBookingPrice, 'bn')}। বুকিং সফল হলে নোটিফিকেশন পাবেন!`
        : `To book a table, fill the booking form in the hero section — name, mobile, date, time & guests. Only ${taka(s.tableBookingPrice, 'en')} per guest. You will get a confirmation notification!`
    }

    if (/(order|অর্ডার|delivery|ডেলিভারি|online)/.test(q)) {
      return bn
        ? `অনলাইন অর্ডার করতে মেনু থেকে খাবার কার্টে যোগ করুন, তারপর কার্ট থেকে "চেকআউট" করুন। বিকাশ, নগদ বা কার্ডে পেমেন্ট করতে পারবেন। ডেলিভারি চার্জ মাত্র ${taka(s.deliveryCharge, 'bn')}।`
        : `To order online, add items to your cart from the Menu, then Checkout. You can pay with bKash, Nagad or Card. Delivery charge is only ${taka(s.deliveryCharge, 'en')}.`
    }

    if (/(location|ঠিকানা|address|কোথায়|where|map|maps|direction|যাওয়া)/.test(q)) {
      return bn
        ? `আমাদের অবস্থান: ${s.address} — মোকামতলা, ঢাকা-রংপুর হাইওয়ে। Google Maps-এ "Dhanshiri Restaurant" সার্চ করুন অথবা নিচের "Get Directions" বাটন ব্যবহার করুন।`
        : `We are located at ${s.address} — Mokamtola, Dhaka-Rangpur Highway. Search "Dhanshiri Restaurant" on Google Maps or use the "Get Directions" button below.`
    }

    if (/(phone|call|ফোন|নম্বর|number|contact|যোগাযোগ)/.test(q)) {
      return bn ? `আমাদের হটলাইন: ${s.phone} — সকাল ${s.hours} পর্যন্ত খোলা।` : `Our hotline: ${s.phone} — open ${s.hours}.`
    }

    if (/(open|খোলা|ঘন্টা|hour|সময়|কখন)/.test(q)) {
      return bn ? `আমরা প্রতিদিন সকাল ১০টা থেকে রাত ১১:৩০ পর্যন্ত খোলা (${s.hours}).` : `We are open daily from 10:00 AM to 11:30 PM (${s.hours}).`
    }

    if (/(hi|hello|hey|assalam|সালাম|আসসালাম|কেমন|how are you)/.test(q)) {
      return bn
        ? 'আলহামদুলিল্লাহ, ভালো আছি! 😊 বলুন, কী জানতে চান — মেনু, অফার না বুকিং?'
        : "I'm great, thank you! 😊 What would you like to know — menu, offers or booking?"
    }

    if (/(thank|ধন্যবাদ|thanks|shukriya|শুকরিয়া)/.test(q)) {
      return bn ? 'আপনাকে ধন্যবাদ! 🌿 আরও কিছু জানার থাকলে বলুন।' : 'You are welcome! 🌿 Ask me anything else.'
    }

    // Default fallback
    return bn
      ? `দুঃখিত, আমি বুঝতে পারিনি। 😅 আপনি জিজ্ঞাসা করতে পারেন:\n• মেনু ও দাম (যেমন: "কাচ্চির দাম কত?")\n• অফার ও কোড\n• টেবিল বুকিং\n• পার্টি হল বুকিং\n• অনলাইন অর্ডার\n• লোকেশন ও ফোন নম্বর`
      : `Sorry, I didn't understand that. 😅 Try asking about:\n• Menu & prices (e.g. "price of kacchi?")\n• Offers & codes\n• Table booking\n• Party hall booking\n• Online order\n• Location & phone number`
  }

  const send = () => {
    const text = input.trim()
    if (!text || typing) return
    setMsgs((m) => [...m, { id: `u${idRef.current++}`, from: 'user', text }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      setMsgs((m) => [...m, { id: `b${idRef.current++}`, from: 'bot', text: answer(text) }])
      setTyping(false)
    }, 650)
  }

  const quickAsks =
    lang === 'bn'
      ? ['কাচ্চির দাম কত?', 'চলমান অফার', 'টেবিল বুকিং', 'পার্টি হল বুকিং']
      : ['Price of kacchi?', 'Current offers', 'Table booking', 'Party hall booking']

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 bottom-4 z-[95] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-2xl shadow-gold-500/30 transition hover:scale-110 sm:right-6 sm:bottom-6"
        aria-label={dict.chatTitle[lang]}
      >
        {open ? <IconClose width={22} height={22} /> : <IconBot width={26} height={26} />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand-400" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="animate-pop ring-soft fixed right-3 bottom-22 z-[96] flex h-[min(76vh,560px)] w-[min(94vw,380px)] flex-col overflow-hidden rounded-3xl border border-brand-500/25 bg-ink-900 sm:right-6 sm:bottom-24">
          <header className="flex items-center gap-3 border-b border-brand-500/15 bg-gradient-to-r from-brand-950 to-ink-900 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/20 text-gold-300">
              <IconBot width={18} height={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-gold-300">{dict.chatTitle[lang]}</p>
              <p className="flex items-center gap-1.5 text-[11px] text-brand-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                {lang === 'bn' ? 'অনলাইন' : 'Online'}
              </p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m) => (
              <div key={m.id} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                    m.from === 'user'
                      ? 'rounded-br-md bg-gold-400 text-ink-950'
                      : 'rounded-bl-md bg-ink-700 text-brand-50'
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-ink-700 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-300"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick asks */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 pb-2">
            {quickAsks.map((qa) => (
              <button
                key={qa}
                onClick={() => {
                  if (typing) return
                  setMsgs((m) => [...m, { id: `u${idRef.current++}`, from: 'user', text: qa }])
                  setTyping(true)
                  window.setTimeout(() => {
                    setMsgs((m) => [...m, { id: `b${idRef.current++}`, from: 'bot', text: answer(qa) }])
                    setTyping(false)
                  }, 550)
                }}
                className="shrink-0 rounded-full border border-gold-400/30 bg-gold-400/8 px-3 py-1.5 text-[11px] font-semibold text-gold-300 transition hover:bg-gold-400/20"
              >
                {qa}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-brand-500/15 px-3 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={dict.chatPlaceholder[lang]}
              className="flex-1 rounded-full border border-brand-500/25 bg-ink-950/70 px-4 py-2.5 text-sm outline-none transition focus:border-gold-400/60"
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400 text-ink-950 transition hover:scale-105 disabled:opacity-40"
              aria-label="Send"
            >
              <IconSend width={16} height={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
