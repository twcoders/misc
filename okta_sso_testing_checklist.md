
# ✅ Okta SSO with Subdomain – Setup & Reversal Checklist

## 📌 PHASE 1: TESTING WITH OKTA (SUBDOMAIN)

### 🔹 Step 1: Prepare Your Environment
- [ ] Create a test subdomain in Microsoft 365 (e.g., `oktatest.yourcompany.com`)
- [ ] Add subdomain DNS records (TXT, MX, etc.)
- [ ] Verify domain ownership in Microsoft 365 Admin Center
- [ ] Ensure test users are assigned to this subdomain

### 🔹 Step 2: Set Up Federation with Okta (SAML)
- [ ] Create a SAML app in Okta for Microsoft 365
- [ ] Configure **ACS URL** and **Entity ID** (from Microsoft docs)
- [ ] Upload Okta's signing certificate if needed
- [ ] Run the following PowerShell commands:

```powershell
Connect-MsolService

Set-MsolDomainAuthentication `
  -DomainName oktatest.yourcompany.com `
  -FederationBrandName "OktaSSOTest" `
  -Authentication Federated `
  -PassiveLogOnUri "https://your-okta-domain.okta.com/app/.../sso/saml" `
  -SigningCertificate "<certificate content>" `
  -IssuerUri "http://www.okta.com/..."
```

### 🔹 Step 3: Assign Test Users
- [ ] Assign the Microsoft 365 SAML app to test users in Okta
- [ ] Verify their UPN ends with `@oktatest.yourcompany.com`

### 🔹 Step 4: Test Login Flow
- [ ] Log in as test user via [office.com](https://office.com)
- [ ] Confirm redirect to Okta for login
- [ ] Confirm access after login:
  - PowerApps / Model-Driven Apps
  - SharePoint Online
  - Teams or Outlook
  - Custom project management app (via SAML or WS-Fed)
  - Azure K8s-hosted app (via reverse proxy or protected route)

---

## 🔁 PHASE 2: REVERSE & CLEANUP

### 🔹 Step 1: Convert Domain Back to Azure AD
```powershell
Connect-MsolService

Set-MsolDomainAuthentication -DomainName oktatest.yourcompany.com -Authentication Managed
```

### 🔹 Step 2: Confirm Status
```powershell
Get-MsolDomain -DomainName oktatest.yourcompany.com | fl Authentication
# Should return:
# Authentication : Managed
```

### 🔹 Step 3: Okta Cleanup (Optional)
- [ ] Remove or disable the Microsoft 365 SAML app in Okta
- [ ] Unassign test users from the app
- [ ] Delete the domain from **Directory → Domains** in Okta (if needed)

### 🔹 Step 4: Microsoft 365 Cleanup (Optional)
- [ ] Remove test users
- [ ] Remove test subdomain from Microsoft 365 Admin Center (if not used elsewhere)
