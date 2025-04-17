
# ✅ Okta SSO with Full Domain – Setup & Reversal Checklist

## 📌 PHASE 1: SETTING UP OKTA SSO WITH MAIN DOMAIN

### 🔹 Step 1: Prepare Microsoft 365 Domain
- [ ] Use existing verified domain in Microsoft 365 (e.g., yourcompany.com)
- [ ] Ensure all DNS records (MX, TXT, CNAME, etc.) are correct
- [ ] Backup current MFA and authentication settings

### 🔹 Step 2: Set Up Federation with Okta (SAML)
- [ ] In Okta, create a SAML app for Microsoft 365
- [ ] Note the following from Microsoft documentation:
  - **ACS URL**
  - **Entity ID**
- [ ] Obtain Okta's Identity Provider (IdP) metadata or certificate
- [ ] Run the following PowerShell to configure federation:

```powershell
Connect-MsolService

Set-MsolDomainAuthentication `
  -DomainName yourcompany.com `
  -FederationBrandName "OktaSSO" `
  -Authentication Federated `
  -PassiveLogOnUri "https://your-okta-domain.okta.com/app/.../sso/saml" `
  -SigningCertificate "<certificate content>" `
  -IssuerUri "http://www.okta.com/..."
```

### 🔹 Step 3: Configure Okta & Assign Users
- [ ] Assign Microsoft 365 SAML app to target users
- [ ] Ensure their UPNs match the federated domain (e.g., user@yourcompany.com)
- [ ] Configure attributes (NameID, ImmutableID, etc.)

### 🔹 Step 4: Test Login
- [ ] Test login at [office.com](https://office.com) for assigned users
- [ ] Validate:
  - Redirect to Okta login page
  - Successful login and access to M365 apps
  - No password prompts post-login

---

## 🔁 PHASE 2: REVERSING OKTA SSO (RESTORE TO AZURE AD)

### 🔹 Step 1: Restore to Azure AD (Managed)
```powershell
Connect-MsolService

Set-MsolDomainAuthentication -DomainName yourcompany.com -Authentication Managed
```

### 🔹 Step 2: Confirm Federation Reversal
```powershell
Get-MsolDomain -DomainName yourcompany.com | fl Authentication
# Expected Output:
# Authentication : Managed
```

### 🔹 Step 3: Disable or Remove Okta Integration
- [ ] Unassign Microsoft 365 SAML app in Okta
- [ ] Optionally disable or delete the app
- [ ] Confirm users can log in via Microsoft credentials again

### 🔹 Step 4: MFA & Conditional Access Review
- [ ] Verify if Microsoft Entra ID (Azure AD) MFA settings are intact
- [ ] Review conditional access policies for any updates

---

## ⚠️ Notes
- Switching a main domain to federated redirects **all** login attempts to Okta.
- Ensure sufficient testing and communication to impacted users before switching.
