// 🎯 Dataverse Hierarchy Configuration
// Copy this configuration into your web resource or form parameters

// ===================================
// CONFIGURATION FOR YOUR ENTITY
// ===================================

// 👤 CONTACT ENTITY EXAMPLE (Employee Hierarchy)
const contactHierarchyConfig = {
  entityName: "contact",
  entitySetName: "contacts", 
  selfReferencingField: "parentcustomerid",
  primaryKey: "contactid",
  
  // Fields to display on each card
  displayFields: {
    primary: "fullname",           // Main name/title
    secondary: "jobtitle",         // Job title/role  
    tertiary: "department",        // Department/division
    quaternary: "emailaddress1",   // Email address
    avatar: "entityimage",         // Profile picture
    phone: "telephone1"            // Phone number
  },
  
  // Additional fields for detailed view
  extraFields: [
    "address1_city",      // City
    "address1_stateorprovince", // State
    "managername",        // Manager name
    "employeeid"          // Employee ID
  ],
  
  // Filter for root nodes (top-level)
  rootFilter: "_parentcustomerid_value eq null",
  
  // Card display options
  cardOptions: {
    showAvatar: true,
    showEmail: true, 
    showPhone: true,
    showActions: true,
    maxFields: 4
  }
};

// 🏢 ACCOUNT ENTITY EXAMPLE (Company Structure)  
const accountHierarchyConfig = {
  entityName: "account",
  entitySetName: "accounts",
  selfReferencingField: "parentaccountid", 
  primaryKey: "accountid",
  
  displayFields: {
    primary: "name",               // Company name
    secondary: "accountnumber",    // Account number
    tertiary: "telephone1",        // Main phone
    quaternary: "websiteurl",      // Website
    avatar: "entityimage",         // Company logo
    phone: "telephone1"
  },
  
  extraFields: [
    "address1_city",
    "numberofemployees", 
    "revenue",
    "industrycode"
  ],
  
  rootFilter: "_parentaccountid_value eq null",
  
  cardOptions: {
    showAvatar: true,
    showEmail: false,
    showPhone: true,
    showActions: true,
    maxFields: 5
  }
};

// 🏛️ CUSTOM ENTITY EXAMPLE (Department Structure)
const customEntityConfig = {
  entityName: "new_department",      // Your custom entity name
  entitySetName: "new_departments",  // Plural form for Web API
  selfReferencingField: "new_parentdepartment", // Your lookup field
  primaryKey: "new_departmentid",    // Primary key field
  
  displayFields: {
    primary: "new_name",           // Department name
    secondary: "new_manager",      // Manager
    tertiary: "new_location",      // Location
    quaternary: "new_budget",      // Budget
    avatar: "new_logo",            // Department logo
    phone: "new_phone"             // Department phone
  },
  
  extraFields: [
    "new_employeecount",
    "new_description", 
    "new_costcenter",
    "createdon"
  ],
  
  rootFilter: "_new_parentdepartment_value eq null",
  
  cardOptions: {
    showAvatar: false,
    showEmail: false,
    showPhone: true,
    showActions: true, 
    maxFields: 4
  }
};

// ===================================
// CARD STYLING CONFIGURATION
// ===================================

const cardStyling = {
  // Color scheme
  colors: {
    primary: "#0078d4",      // Microsoft blue
    secondary: "#106ebe",    // Darker blue
    success: "#107c10",      // Green
    warning: "#ff8c00",      // Orange
    error: "#d13438",        // Red
    neutral: "#8a8886"       // Gray
  },
  
  // Card dimensions
  dimensions: {
    width: 200,              // Card width in pixels
    height: 120,             // Card height in pixels
    padding: 12,             // Internal padding
    margin: 8,               // Space between cards
    borderRadius: 6          // Rounded corners
  },
  
  // Typography
  typography: {
    primarySize: "14px",     // Main text size
    secondarySize: "12px",   // Secondary text size
    tertiarySize: "11px",    // Additional info size
    fontFamily: "Segoe UI, sans-serif"
  },
  
  // Level-based styling
  levelStyles: {
    level1: { borderLeft: "4px solid #107c10" },  // Green for top level
    level2: { borderLeft: "4px solid #0078d4" },  // Blue for level 2
    level3: { borderLeft: "4px solid #ff8c00" },  // Orange for level 3
    level4: { borderLeft: "4px solid #d13438" }   // Red for level 4+
  }
};

// ===================================
// INTERACTION CONFIGURATION  
// ===================================

const interactionConfig = {
  // Click actions for cards
  cardActions: [
    {
      name: "viewRecord",
      label: "View Details",
      icon: "👁️",
      action: "navigate",
      url: "/main.aspx?etn={entityName}&id={recordId}"
    },
    {
      name: "sendEmail", 
      label: "Send Email",
      icon: "📧",
      action: "mailto",
      field: "emailaddress1",
      condition: "hasEmail"  // Only show if email exists
    },
    {
      name: "makeCall",
      label: "Call",
      icon: "📞", 
      action: "tel",
      field: "telephone1",
      condition: "hasPhone"   // Only show if phone exists
    }
  ],
  
  // Hierarchy behavior
  hierarchyOptions: {
    autoExpand: 2,           // Auto-expand first 2 levels
    maxLevels: 5,            // Maximum hierarchy depth
    allowCollapse: true,     // Allow collapsing nodes
    showConnectors: true,    // Show connecting lines
    direction: "vertical"    // "vertical" or "horizontal"
  },
  
  // Performance settings
  performance: {
    lazyLoad: true,          // Load children on demand
    batchSize: 50,           // Records per API call
    cacheResults: true,      // Cache hierarchy data
    refreshInterval: 300000  // Refresh every 5 minutes
  }
};

// ===================================
// WEB RESOURCE PARAMETERS
// ===================================

// Use these URL parameters when configuring the web resource on forms:

// For Contact (Employee) Hierarchy:
// ?config=contact&lookup=parentcustomerid&fields=fullname,jobtitle,department,emailaddress1

// For Account (Company) Hierarchy:  
// ?config=account&lookup=parentaccountid&fields=name,accountnumber,telephone1,address1_city

// For Custom Entity:
// ?config=new_department&lookup=new_parentdepartment&fields=new_name,new_manager,new_location

// ===================================
// SECURITY CONSIDERATIONS
// ===================================

const securitySettings = {
  // Required privileges
  requiredPrivileges: [
    "Read",                  // Read access to entity
    "ReadPartial"           // Read related records
  ],
  
  // Field-level security
  securedFields: [
    "emailaddress1",        // Personal email
    "telephone1",           // Personal phone
    "address1_line1"        // Personal address
  ],
  
  // Business unit filtering
  respectBusinessUnits: true,
  
  // Row-level security
  respectOwnership: true
};

// ===================================
// QUICK SETUP GUIDE
// ===================================

/*
1. IDENTIFY YOUR SETUP:
   - Entity name (e.g., "contact", "account", "new_department")
   - Self-referencing lookup field name
   - Fields you want to display on cards

2. CONFIGURE WEB RESOURCE:
   - Edit the HTML web resource (dsr_hierarchy_main_html)
   - Add your configuration using one of the examples above
   - Save and publish

3. ADD TO FORM:
   - Edit your entity's main form
   - Insert web resource component
   - Set dimensions (recommend 100% width, 600px+ height)
   - Add URL parameters if needed

4. TEST:
   - Create test records with hierarchy relationships
   - Open form and verify hierarchy displays correctly
   - Test card interactions and actions

5. CUSTOMIZE:
   - Modify styling in CSS web resource (dsr_hierarchy_main_css)
   - Adjust card actions and interactions
   - Configure security and performance settings
*/

// Export configurations for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    contactHierarchyConfig,
    accountHierarchyConfig, 
    customEntityConfig,
    cardStyling,
    interactionConfig,
    securitySettings
  };
}
