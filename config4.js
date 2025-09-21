<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="React Org Chart - Hierarchy View Replacement for Dataverse" />
    <title>Hierarchy View - Org Chart</title>
    
    <!-- Load Configuration First (if using separate file) -->
    <!-- <script src="dsr_hierarchy_config_js"></script> -->
    
    <!-- Dataverse Live Data Fetcher -->
    <script>
    window.DataverseFetcher = {
      async fetchHierarchyData(entityName, lookupField, recordId = null) {
        try {
          // Get current context - try multiple ways
          let webApi = null;
          
          if (window.parent && window.parent.Xrm && window.parent.Xrm.WebApi) {
            webApi = window.parent.Xrm.WebApi;
          } else if (window.Xrm && window.Xrm.WebApi) {
            webApi = window.Xrm.WebApi;
          } else if (window.parent && window.parent.parent && window.parent.parent.Xrm) {
            webApi = window.parent.parent.Xrm.WebApi;
          }
          
          if (!webApi) {
            console.warn('Xrm.WebApi not available, using sample data');
            return null;
          }

          // Build query for the entity
          const entitySetName = this.getEntitySetName(entityName);
          const fields = this.getFieldsForEntity(entityName, lookupField);
          
          let query = `?$select=${fields.join(',')}`;
          
          // Add filter for active records if applicable
          if (entityName === 'contact' || entityName === 'systemuser') {
            query += `&$filter=statecode eq 0`; // Active records only
          }
          
          // Limit to reasonable number for performance
          query += `&$top=500`;
          
          console.log(`Fetching data from: ${entitySetName}${query}`);
          
          const result = await webApi.retrieveMultipleRecords(entityName, query);
          
          console.log(`Fetched ${result.entities.length} records from ${entityName}`);
          return result.entities;
          
        } catch (error) {
          console.error('Error fetching Dataverse data:', error);
          console.warn('Falling back to sample data');
          return null;
        }
      },
      
      getEntitySetName(entityName) {
        const entitySetNames = {
          'contact': 'contacts',
          'account': 'accounts',
          'systemuser': 'systemusers',
          'team': 'teams'
        };
        
        return entitySetNames[entityName] || `${entityName}s`;
      },
      
      getFieldsForEntity(entityName, lookupField) {
        const fieldMappings = {
          'contact': [
            'contactid', 'fullname', 'jobtitle', 'emailaddress1', 
            'telephone1', 'department', '_parentcustomerid_value',
            'entityimage', 'address1_city', '_managerid_value'
          ],
          'account': [
            'accountid', 'name', 'accountnumber', 'telephone1', 
            'websiteurl', 'address1_city', '_parentaccountid_value',
            'entityimage', 'numberofemployees'
          ],
          'systemuser': [
            'systemuserid', 'fullname', 'title', 'internalemailaddress',
            'domainname', '_businessunitid_value', '_parentsystemuserid_value',
            'entityimage'
          ]
        };
        
        let fields = fieldMappings[entityName] || [
          `${entityName}id`, 'name', `_${lookupField}_value`
        ];
        
        // Ensure lookup field is included with proper naming
        const lookupFieldOData = `_${lookupField}_value`;
        if (!fields.includes(lookupFieldOData) && !fields.includes(lookupField)) {
          fields.push(lookupFieldOData);
        }
        
        return fields;
      }
    };
    </script>
    
    <!-- Configuration Application Script -->
    <script>
    function applyDataverseConfiguration() {
        // Get entity and record information from URL parameters or form context
        let entityFromUrl, lookupFromUrl, entityFromContext, recordIdFromContext;
        
        // Try to get from URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        entityFromUrl = urlParams.get('entity') || urlParams.get('entityName');
        lookupFromUrl = urlParams.get('lookup') || urlParams.get('lookupField');
        const useLiveData = urlParams.get('useLiveData') === 'true';
        
        // Try to get from Dataverse form context
        if (window.parent && window.parent.Xrm && window.parent.Xrm.Page) {
            try {
                const formContext = window.parent.Xrm.Page;
                entityFromContext = formContext.data.entity.getEntityName();
                recordIdFromContext = formContext.data.entity.getId();
                console.log('Detected entity from form context:', entityFromContext);
            } catch (e) {
                console.log('Could not get form context:', e);
            }
        }
        
        // Determine which entity configuration to use
        const targetEntity = entityFromUrl || entityFromContext || "contact";
        const targetLookupField = lookupFromUrl || getLookupFieldForEntity(targetEntity);
        
        console.log('Target entity:', targetEntity);
        console.log('Target lookup field:', targetLookupField);
        console.log('Use live data:', useLiveData);
        
        // Create configuration
        const config = {
            entityName: targetEntity,
            selfReferencingField: targetLookupField,
            currentRecordId: recordIdFromContext,
            useLiveData: useLiveData,
            
            // Card fields based on entity
            cardFields: getCardFieldsForEntity(targetEntity),
            
            displayOptions: {
                direction: "vertical",
                autoExpand: 2,
                showActions: true,
                showConnectors: true
            },
            
            cardStyle: {
                width: 200,
                height: 120,
                backgroundColor: "#ffffff",
                borderColor: "#e1e1e1",
                textColor: "#323130"
            }
        };
        
        // Apply configuration globally
        window.DataverseHierarchyConfig = config;
        
        console.log('Applied Dataverse Hierarchy Configuration:', window.DataverseHierarchyConfig);
        
        // Fetch live data if requested
        if (useLiveData || entityFromContext) {
            fetchAndApplyLiveData(targetEntity, targetLookupField);
        }
        
        return config;
    }
    
    function getLookupFieldForEntity(entityName) {
        const entityLookupMap = {
            "contact": "parentcustomerid",
            "account": "parentaccountid", 
            "systemuser": "parentsystemuserid",
            "team": "administratorid"
        };
        
        return entityLookupMap[entityName] || "parentcustomerid";
    }
    
    function getCardFieldsForEntity(entityName) {
        const entityCardFields = {
            "contact": {
                title: "fullname",
                subtitle: "jobtitle", 
                info1: "department",
                info2: "emailaddress1",
                info3: "telephone1",
                avatar: "entityimage"
            },
            "account": {
                title: "name",
                subtitle: "accountnumber",
                info1: "telephone1",
                info2: "websiteurl", 
                info3: "address1_city",
                avatar: "entityimage"
            },
            "systemuser": {
                title: "fullname",
                subtitle: "title",
                info1: "domainname",
                info2: "internalemailaddress",
                info3: "businessunitid",
                avatar: "entityimage"
            }
        };
        
        return entityCardFields[entityName] || entityCardFields["contact"];
    }
    
    async function fetchAndApplyLiveData(entityName, lookupField) {
        console.log('Attempting to fetch live data...');
        
        try {
            const liveData = await window.DataverseFetcher.fetchHierarchyData(entityName, lookupField);
            
            if (liveData && liveData.length > 0) {
                console.log('Live data fetched successfully:', liveData.length, 'records');
                
                // Store live data for React app to use
                window.DataverseHierarchyConfig.liveData = liveData;
                window.DataverseHierarchyConfig.dataSource = 'live';
                
                // Dispatch event to notify React app
                window.dispatchEvent(new CustomEvent('dataverseLiveDataLoaded', {
                    detail: { data: liveData, entityName: entityName }
                }));
                
            } else {
                console.log('No live data available, will use sample data');
                window.DataverseHierarchyConfig.dataSource = 'sample';
            }
        } catch (error) {
            console.error('Error fetching live data:', error);
            window.DataverseHierarchyConfig.dataSource = 'sample';
        }
    }
    
    // Apply configuration when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        applyDataverseConfiguration();
    });
    
    // Also apply immediately in case DOM is already loaded
    if (document.readyState !== 'loading') {
        applyDataverseConfiguration();
    }
    </script>
    
    <!-- React App Resources -->
    <script defer="defer" src="dsr_hierarchy_chunk_703_js"></script>
    <script defer="defer" src="dsr_hierarchy_chunk_700_js"></script>
    <script defer="defer" src="dsr_hierarchy_main_js"></script>
    <link href="dsr_hierarchy_main_css" rel="stylesheet">
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <!-- Debug Information -->
    <script>
    window.addEventListener('load', function() {
        console.log('=== Dataverse Hierarchy Debug Info ===');
        console.log('Configuration loaded:', !!window.DataverseHierarchyConfig);
        console.log('Data source:', window.DataverseHierarchyConfig?.dataSource || 'unknown');
        console.log('Live data records:', window.DataverseHierarchyConfig?.liveData?.length || 0);
        console.log('Current URL:', window.location.href);
        console.log('URL Parameters:', Object.fromEntries(new URLSearchParams(window.location.search)));
        
        if (window.parent && window.parent.Xrm) {
            console.log('Xrm context available:', true);
            try {
                const formContext = window.parent.Xrm.Page;
                console.log('Entity Name:', formContext.data.entity.getEntityName());
                console.log('Record ID:', formContext.data.entity.getId());
            } catch (e) {
                console.log('Error accessing form context:', e.message);
            }
        } else {
            console.log('Xrm context available:', false);
        }
        
        console.log('Final Configuration:', window.DataverseHierarchyConfig);
        console.log('========================================');
    });
    </script>
</body>
</html>
