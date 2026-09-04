import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  User,
} from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function ContactSupportModal({ open, onClose }) {
  const toast = useToast()
  const [tab, setTab] = useState('chat') // 'chat' | 'ticket' | 'info'

  // Live chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      name: 'Sarah (Support Lead)',
      text: 'Hello Adaeze! Welcome to UMEPAY 24/7 priority support. How can we assist you with your account, transfers, or KYC today?',
      time: 'Just now',
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatBottomRef = useRef(null)

  // Ticket state
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState('Account & KYC')
  const [ticketMessage, setTicketMessage] = useState('')
  const [submittingTicket, setSubmittingTicket] = useState(false)
  const [ticketSubmitted, setTicketSubmitted] = useState(false)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (!open) return null

  function handleSendMessage(e) {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      name: 'You',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    const query = inputMessage.toLowerCase()
    setInputMessage('')
    setIsTyping(true)

    // Generate intelligent instant support response
    setTimeout(() => {
      let replyText =
        'Thank you for reaching out! Our verification desk has noted your request and your account limits are monitored 24/7.'
      if (query.includes('kyc') || query.includes('verify') || query.includes('limit')) {
        replyText =
          'Your KYC status is verified for Tier 2 ($50,000 daily limit). If you uploaded documents, our automated system validates them in ~2 minutes with zero holds.'
      } else if (query.includes('send') || query.includes('transfer') || query.includes('pay')) {
        replyText =
          'All intra-network transfers via Universal Financial ID are instant and free. External blockchain withdrawals settle within ~15-60 seconds.'
      } else if (query.includes('qr') || query.includes('code')) {
        replyText =
          'You can generate, download, and share your scannable QR Code anytime in the "Receive" screen or through your Universal ID card menu.'
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          name: 'Sarah (Support Lead)',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setIsTyping(false)
    }, 1200)
  }

  function handleTicketSubmit(e) {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error('Fields required', 'Please enter a subject and message.')
      return
    }

    setSubmittingTicket(true)
    setTimeout(() => {
      setSubmittingTicket(false)
      setTicketSubmitted(true)
      toast.success('Support Ticket Created', `Ticket #${Math.floor(100000 + Math.random() * 900000)} submitted.`)
    }, 1000)
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title="24/7 Priority Support" onClose={onClose} />
      <div className="p-6 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setTab('chat')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'chat'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            Live Chat
          </button>
          <button
            onClick={() => setTab('ticket')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'ticket'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            Submit Ticket
          </button>
          <button
            onClick={() => setTab('info')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'info'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            Direct Channels
          </button>
        </div>

        {/* Tab 1: Live Chat */}
        {tab === 'chat' && (
          <div className="flex flex-col h-[400px] border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            {/* Agent Bar */}
            <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-900">Sarah • Priority Desk</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Online &amp; Active</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                Avg reply: &lt; 1m
              </span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-ink-900 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1 px-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">Support is typing...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-w-0 h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs sm:text-sm outline-none focus:bg-white focus:border-ink-500"
              />
              <button
                type="submit"
                className="h-10 w-10 rounded-xl bg-ink-900 text-white flex items-center justify-center hover:bg-ink-800 transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Submit Ticket */}
        {tab === 'ticket' && (
          <div>
            {ticketSubmitted ? (
              <div className="text-center py-8">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-base font-bold text-ink-900">Support Ticket Logged</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Our operations desk has received your ticket and will update you at your registered email address.
                </p>
                <Button
                  className="mt-6"
                  size="sm"
                  onClick={() => {
                    setTicketSubmitted(false)
                    setTicketSubject('')
                    setTicketMessage('')
                  }}
                >
                  Submit Another Ticket
                </Button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm bg-white outline-none focus:border-ink-500"
                  >
                    <option>Account &amp; KYC Verification</option>
                    <option>Transfer &amp; Settlement Issue</option>
                    <option>Currency Exchange Query</option>
                    <option>Virtual Card &amp; Apple Pay</option>
                    <option>Security &amp; 2FA Authentication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of the issue"
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm outline-none focus:border-ink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Explanation</label>
                  <textarea
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide details, transaction references, or screenshots..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm outline-none focus:border-ink-500"
                  />
                </div>

                <Button type="submit" fullWidth loading={submittingTicket}>
                  Submit Ticket
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Direct Channels */}
        {tab === 'info' && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-100 p-4 flex items-center gap-3.5 bg-slate-50/50">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400">Official Support Email</p>
                <p className="text-sm font-bold text-ink-900 truncate">support@umepay.com</p>
                <p className="text-[11px] text-slate-400">Response SLA: ~15 minutes</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 p-4 flex items-center gap-3.5 bg-slate-50/50">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400">24/7 Global Hotline</p>
                <p className="text-sm font-bold text-ink-900">+1 (800) 863-7290</p>
                <p className="text-[11px] text-slate-400">Toll-free priority line for verified users</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
