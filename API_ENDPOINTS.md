# Backend API Contract & Specification

**Base URL**: `http://localhost:5000/api/v1` (set in frontend `.env` via `VITE_API_URL`)  
**Authorization**: `Bearer <token>` in `Authorization` HTTP header.  
**Content-Type**: `application/json`

---

## 1. Authentication & Onboarding (`/auth`)

### `POST /auth/login`
- **Request Body**:
```json
{
  "identifier": "+2348123456789",
  "pin": "1234",
  "method": "phone"
}
```
- **Response `200 OK`**:
```json
{
  "token": "jwt_token_string_here",
  "user": {
    "id": "usr-1",
    "name": "Adaeze Okafor",
    "phone": "+234 812 345 6789",
    "email": "adaeze.okafor@example.com",
    "tier": "Personal Tier 2",
    "kycVerified": true,
    "dailySendLimit": 5000,
    "monthlyCardLimit": 10000,
    "universalAccountNumber": "812 345 6789"
  }
}
```

### `POST /auth/register`
- **Request Body**:
```json
{
  "name": "Adaeze Okafor",
  "phone": "+2348123456789",
  "email": "adaeze.okafor@example.com",
  "pin": "1234"
}
```
- **Response `201 Created`**: `{ "token": "...", "user": { ... } }`

### `POST /auth/verify-otp`
- **Request Body**: `{ "phone": "+2348123456789", "code": "472815" }`
- **Response `200 OK`**: `{ "success": true, "message": "Phone number verified" }`

### `POST /auth/resend-otp`
- **Request Body**: `{ "phone": "+2348123456789" }`
- **Response `200 OK`**: `{ "success": true, "message": "OTP resent" }`

### `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Returns current user object.

### `PATCH /auth/profile`
- **Request Body**: `{ "name": "...", "email": "...", "avatar": "..." }`
- **Response `200 OK`**: Updated user object.

---

## 2. KYC Tier 2 Verification (`/kyc`)

### `POST /kyc/submit`
- **Request Body**:
```json
{
  "fullName": "Adaeze Okafor",
  "dob": "1995-12-04",
  "nationality": "Nigeria (NG)",
  "gender": "Female",
  "address": "82 Orchard Street, Suite 4B",
  "city": "Lagos",
  "state": "Lagos State",
  "postalCode": "100011",
  "documentType": "National Identity Number",
  "idNumber": "0123456789",
  "frontDocUrl": "https://...",
  "backDocUrl": "https://...",
  "selfieUrl": "https://..."
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "status": "VERIFIED",
  "tier": "Personal Tier 2",
  "unlockedFeatures": ["VIRTUAL_CARDS", "HIGH_LIMITS"]
}
```

### `GET /kyc/status`
- **Response `200 OK`**: `{ "status": "VERIFIED", "tier": "Personal Tier 2" }`

---

## 3. Wallets & Currency Swaps (`/wallets`)

### `GET /wallets/fiat`
- **Response `200 OK`**: Array of fiat accounts.
```json
[
  {
    "id": "ngn",
    "code": "NGN",
    "name": "Nigerian Naira",
    "shortLabel": "Naira Account",
    "accountMask": "•••• 6789",
    "bankName": "Wema Bank NGN",
    "accountNumber": "1023476789",
    "balance": 4250000,
    "usdEquivalent": 2656.25,
    "symbol": "₦"
  },
  {
    "id": "usd",
    "code": "USD",
    "name": "USD Wallet",
    "shortLabel": "USD Virtual Vault",
    "accountMask": "•••• 1102",
    "bankName": "Standard Chartered USD",
    "accountNumber": "4471021102",
    "balance": 2100.50,
    "usdEquivalent": 2100.50,
    "symbol": "$"
  },
  {
    "id": "gbp",
    "code": "GBP",
    "name": "British Pound",
    "shortLabel": "GBP Virtual Account",
    "accountMask": "•••• 4591",
    "bankName": "Barclays Bank GBP",
    "accountNumber": "00224591",
    "balance": 1500.00,
    "usdEquivalent": 1920.00,
    "symbol": "£"
  },
  {
    "id": "eur",
    "code": "EUR",
    "name": "Euro Wallet",
    "shortLabel": "GBP Virtual Account",
    "accountMask": "•••• 4591",
    "bankName": "Barclays Bank GBP",
    "accountNumber": "DE894591000",
    "balance": 1500.00,
    "usdEquivalent": 1920.00,
    "symbol": "£"
  }
]
```

### `GET /wallets/digital`
- **Response `200 OK`**: Array of digital assets.
```json
[
  {
    "id": "usdt",
    "code": "USDT",
    "name": "Tether Stablecoin",
    "balance": 3200.00,
    "usdEquivalent": 3200.00,
    "changePct": 0.02
  },
  {
    "id": "usdc",
    "code": "USDC",
    "name": "USD Coin",
    "balance": 1500.25,
    "usdEquivalent": 1500.25,
    "changePct": -0.01
  },
  {
    "id": "btc",
    "code": "BTC",
    "name": "Bitcoin Core",
    "balance": 0.0045,
    "usdEquivalent": 4493.57,
    "changePct": 4.12
  },
  {
    "id": "eth",
    "code": "ETH",
    "name": "Ethereum Core",
    "balance": 0.125,
    "usdEquivalent": 397.45,
    "changePct": 2.85
  }
]
```

### `POST /wallets/link`
- **Request Body**:
```json
{
  "bankName": "Access Bank",
  "accountNumber": "0123456789",
  "currency": "NGN"
}
```
- **Response `201 Created`**: `{ "success": true, "accountId": "acc-new" }`

### `POST /wallets/convert`
- **Request Body**:
```json
{
  "fromAmount": 500.00,
  "fromCurrency": "USD",
  "toAmount": 790000.00,
  "toCurrency": "NGN",
  "exchangeRate": "1 USD = 1,580.00 NGN"
}
```
- **Response `200 OK`**:
```json
{
  "id": "CV-992847-XR",
  "reference": "CV-992847-XR",
  "fromAmount": 500.00,
  "fromCurrency": "USD",
  "toAmount": 790000.00,
  "toCurrency": "NGN",
  "exchangeRate": "1 USD = 1,580.00 NGN",
  "settlementDate": "Sep 3, 2026 • 2:15 PM",
  "status": "SUCCESSFUL"
}
```

---

## 4. Virtual Debit Cards (`/cards`)

### `GET /cards`
- **Response `200 OK`**: Array of cards.
```json
[
  {
    "id": "card-1",
    "label": "Netflix & Subscriptions",
    "currency": "USD",
    "symbol": "$",
    "balance": 0.00,
    "spendLimit": 500.00,
    "spentThisMonth": 0.00,
    "autoFund": true,
    "fundingSource": "USD Wallet",
    "last4": "4852",
    "cardNumber": "4821 •••• •••• 4852",
    "holder": "ADAEZE OKAFOR",
    "expiry": "09/29",
    "cvv": "392",
    "status": "ACTIVE",
    "colorScheme": "blue"
  }
]
```

### `POST /cards`
- **Request Body**:
```json
{
  "currency": "USD",
  "label": "Netflix & Subscriptions",
  "spendLimit": 500.00,
  "autoFund": true,
  "fundingSource": "USD Wallet"
}
```
- **Response `201 Created`**: Full created card object.

### `PATCH /cards/:id/freeze`
- **Response `200 OK`**: `{ "success": true, "status": "FROZEN" }`

### `POST /cards/:id/fund`
- **Request Body**: `{ "amount": 250.00 }`
- **Response `200 OK`**: `{ "success": true, "balance": 250.00 }`

### `PATCH /cards/:id/settings`
- **Request Body**:
```json
{
  "spendingLimit": 1000.00,
  "onlineTx": true,
  "internationalTx": true,
  "autoFund": true
}
```
- **Response `200 OK`**: `{ "success": true, "settings": { ... } }`

### `DELETE /cards/:id`
- **Response `200 OK`**: `{ "success": true }`

---

## 5. Transfers & Contacts (`/transfers`)

### `GET /transfers/contacts`
- **Response `200 OK`**:
```json
{
  "recent": [
    { "id": "c1", "name": "Chinedu", "phone": "+234 803 112 3344", "initials": "C" }
  ],
  "all": [
    { "id": "c2", "name": "Fatima", "phone": "+234 802 221 4455", "initials": "F" }
  ]
}
```

### `POST /transfers/send`
- **Request Body**:
```json
{
  "recipientId": "c1",
  "recipientName": "Chinedu",
  "amount": 450.00,
  "currency": "USD",
  "remark": "Project Freelance"
}
```
- **Response `200 OK`**:
```json
{
  "reference": "TX-908234-AD",
  "amount": 450.00,
  "currency": "USD",
  "recipient": "Chinedu",
  "status": "Success",
  "date": "Today",
  "time": "10:24 AM"
}
```

### `POST /transfers/external`
- **Request Body**:
```json
{
  "asset": "USDT",
  "address": "0x71C8392AB42145A893c8340d8923a49182390392A",
  "network": "Tron (TRC-20)",
  "amount": 400.00,
  "remark": "External Wallet Transfer"
}
```
- **Response `200 OK`**: Receipt object.

---

## 6. Activity & Ledger (`/transactions`)

### `GET /transactions`
- **Query Params**: `?filter=All&page=1&limit=9`
  - Valid `filter` values: `All`, `Sent`, `Received`, `Converted`, `Failed`
- **Response `200 OK`**:
```json
{
  "items": [
    {
      "id": "tx-1",
      "date": "Jan 25, 2026",
      "time": "10:24 AM",
      "description": "Salary Deposit",
      "type": "Receive",
      "asset": "USD",
      "amount": 2500.00,
      "direction": "in",
      "fee": "$0.00",
      "status": "Success",
      "reference": "TX-908234-AD"
    },
    {
      "id": "tx-2",
      "date": "Jan 24, 2026",
      "time": "03:15 PM",
      "description": "Sent to Emma Watson",
      "type": "Send",
      "asset": "USD",
      "amount": -450.00,
      "direction": "out",
      "fee": "$1.50",
      "status": "Success",
      "reference": "TX-112349-OD"
    }
  ],
  "total": 148,
  "page": 1,
  "limit": 9,
  "totalPages": 17
}
```

### `GET /transactions/export`
- **Query Params**: `?filter=All&format=csv`
- **Response `200 OK`**: `text/csv` stream with header `Content-Disposition: attachment; filename=transactions.csv`.

---

## 7. Error Format

When a request fails, the API should return standard JSON errors:

```json
{
  "message": "Invalid PIN provided",
  "status": 401
}
```
HTTP status codes used:
- `400 Bad Request` — Missing or invalid parameters
- `401 Unauthorized` — Missing or expired Bearer token
- `403 Forbidden` — KYC Tier insufficient for action (e.g. Tier 1 attempting card creation)
- `404 Not Found` — Resource not found
- `422 Unprocessable Entity` — Insufficient wallet balance
- `500 Internal Server Error` — Server error
