import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import PhoneEntry from './pages/onboarding/PhoneEntry.jsx'
import OtpVerify from './pages/onboarding/OtpVerify.jsx'
import IdentityVerified from './pages/onboarding/IdentityVerified.jsx'
import KycVerification from './pages/onboarding/KycVerification.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SendMoney from './pages/SendMoney.jsx'
import ReceivePayment from './pages/ReceivePayment.jsx'
import Wallets from './pages/Wallets.jsx'
import TransactionHistory from './pages/TransactionHistory.jsx'

import ProfileSettings from './pages/ProfileSettings.jsx'
import CurrencyConversion from './pages/CurrencyConversion.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signup" element={<RegisterPage />} />

            {/* Onboarding & KYC */}
            <Route path="/onboarding" element={<PhoneEntry />} />
            <Route path="/onboarding/verify" element={<OtpVerify />} />
            <Route path="/onboarding/success" element={<IdentityVerified />} />
            <Route path="/onboarding/kyc" element={<KycVerification />} />
            <Route path="/kyc" element={<KycVerification />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/receive" element={<ReceivePayment />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/convert" element={<CurrencyConversion />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  )
}
