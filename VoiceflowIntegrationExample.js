// Complete Voiceflow Runtime API Integration Example
// This shows how to integrate the Convizr ContactFormExtension with Voiceflow

import { 
    extensionRegistry, 
    registerExtension, 
    renderTraceWithExtensions 
} from './ConvizrExtensionRegistry.js';
import { ContactFormExtension } from './ConvizrExtensions_V0.1.js';

// ============================================================================
// PHASE 1: EXTENSION FRAMEWORK SETUP
// ============================================================================

// Initialize the extension system
function initializeExtensions(voiceflowClient) {
    console.log('🚀 Initializing Convizr Extension System...');
    
    // Set the Voiceflow client
    extensionRegistry.setVoiceflowClient(voiceflowClient);
    
    // Register your extensions
    registerExtension(ContactFormExtension);
    
    // You can register more extensions here
    // registerExtension(AnotherExtension);
    
    console.log('✅ Extension system initialized successfully');
}

// ============================================================================
// PHASE 2: TRACE RENDERING LOGIC
// ============================================================================

// Modified trace rendering function that supports extensions
async function renderTraces(traces, container) {
    console.log('📨 Processing traces:', traces.length);
    
    for (const trace of traces) {
        console.log('🔍 Processing trace:', trace.type);
        
        // Check if this trace should be handled by an extension
        const extensionHandled = await renderTraceWithExtensions(trace, container);
        
        if (!extensionHandled) {
            // Handle with your default trace rendering logic
            await renderDefaultTrace(trace, container);
        }
    }
}

// Default trace rendering (your existing logic)
async function renderDefaultTrace(trace, container) {
    console.log('📝 Rendering default trace:', trace.type);
    
    // Your existing trace rendering logic here
    switch (trace.type) {
        case 'text':
            renderTextTrace(trace, container);
            break;
        case 'choice':
            renderChoiceTrace(trace, container);
            break;
        case 'image':
            renderImageTrace(trace, container);
            break;
        default:
            console.warn('Unknown trace type:', trace.type);
    }
}

// ============================================================================
// PHASE 3: VOICEFLOW INTEGRATION
// ============================================================================

// Complete Voiceflow setup and integration
async function setupVoiceflowWithExtensions() {
    try {
        // Initialize Voiceflow client
        const voiceflowClient = new Voiceflow({
            versionID: 'your-version-id', // Replace with your actual version ID
            apiKey: 'your-api-key'        // Replace with your actual API key
        });

        // Initialize the extension system
        initializeExtensions(voiceflowClient);

        // Set up message handling
        voiceflowClient.onMessage((message) => {
            console.log('📬 Received message from Voiceflow:', message);
            
            const traces = message.traces || [];
            const container = document.getElementById('chat-container');
            
            if (container) {
                renderTraces(traces, container);
            } else {
                console.error('❌ Chat container not found');
            }
        });

        // Set up error handling
        voiceflowClient.onError((error) => {
            console.error('❌ Voiceflow error:', error);
        });

        // Start the session
        await voiceflowClient.start();
        console.log('✅ Voiceflow session started successfully');

        return voiceflowClient;
        
    } catch (error) {
        console.error('❌ Failed to setup Voiceflow:', error);
        throw error;
    }
}

// ============================================================================
// PHASE 4: EXAMPLE TRACE RENDERING FUNCTIONS
// ============================================================================

function renderTextTrace(trace, container) {
    const textElement = document.createElement('div');
    textElement.className = 'voiceflow-text';
    textElement.innerHTML = `
        <div style="
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 12px;
            margin: 0.5rem 0;
            border-left: 4px solid #FF6B35;
        ">
            ${trace.payload.message || trace.payload.text || 'No message content'}
        </div>
    `;
    container.appendChild(textElement);
}

function renderChoiceTrace(trace, container) {
    const choiceElement = document.createElement('div');
    choiceElement.className = 'voiceflow-choice';
    
    const buttons = trace.payload.choices?.map(choice => 
        `<button 
            onclick="handleChoice('${choice.value}')"
            style="
                background: #FF6B35;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                margin: 0.25rem;
                cursor: pointer;
                transition: all 0.2s ease;
            "
            onmouseover="this.style.background='#E55A2B'"
            onmouseout="this.style.background='#FF6B35'"
        >
            ${choice.label || choice.value}
        </button>`
    ).join('') || '';
    
    choiceElement.innerHTML = `
        <div style="margin: 1rem 0;">
            ${buttons}
        </div>
    `;
    container.appendChild(choiceElement);
}

function renderImageTrace(trace, container) {
    const imageElement = document.createElement('div');
    imageElement.className = 'voiceflow-image';
    imageElement.innerHTML = `
        <img 
            src="${trace.payload.url}" 
            alt="${trace.payload.alt || 'Voiceflow image'}"
            style="
                max-width: 100%;
                border-radius: 8px;
                margin: 0.5rem 0;
            "
        />
    `;
    container.appendChild(imageElement);
}

// ============================================================================
// PHASE 5: UTILITY FUNCTIONS
// ============================================================================

// Handle choice button clicks
window.handleChoice = function(choiceValue) {
    console.log('🎯 User selected choice:', choiceValue);
    
    // Send the choice back to Voiceflow
    if (window.voiceflowClient) {
        window.voiceflowClient.interact({
            type: 'choice',
            payload: { choice: choiceValue }
        });
    }
};

// Clear chat container
function clearChat() {
    const container = document.getElementById('chat-container');
    if (container) {
        container.innerHTML = '';
    }
}

// ============================================================================
// PHASE 6: INITIALIZATION
// ============================================================================

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌐 Page loaded, initializing Voiceflow integration...');
    
    try {
        // Setup Voiceflow with extensions
        const voiceflowClient = await setupVoiceflowWithExtensions();
        
        // Store the client globally for access
        window.voiceflowClient = voiceflowClient;
        
        console.log('🎉 Voiceflow integration complete!');
        
    } catch (error) {
        console.error('💥 Failed to initialize Voiceflow integration:', error);
        
        // Show error message to user
        const container = document.getElementById('chat-container');
        if (container) {
            container.innerHTML = `
                <div style="
                    color: #dc3545;
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                ">
                    <strong>Error:</strong> Failed to initialize chat. Please refresh the page or contact support.
                </div>
            `;
        }
    }
});

// ============================================================================
// USAGE INSTRUCTIONS
// ============================================================================

/*
TO USE THIS INTEGRATION:

1. HTML Setup:
   Add this to your HTML:
   ```html
   <div id="chat-container"></div>
   ```

2. Voiceflow Setup:
   - Create a custom extension in your Voiceflow project
   - Set the type to: ext_contact_form
   - Set the payload to:
     {
       "bt_submit": "Submit",
       "lb_fullName": "Full Name",
       "lb_email": "Email"
     }

3. Configuration:
   - Replace 'your-version-id' with your actual Voiceflow version ID
   - Replace 'your-api-key' with your actual Voiceflow API key

4. Files Required:
   - ConvizrExtensionRegistry.js
   - ConvizrExtensions_V0.1.js
   - VoiceflowIntegrationExample.js (this file)

5. Testing:
   - Open browser console to see debug messages
   - Test the contact form extension
   - Verify data is sent back to Voiceflow correctly

The extension will automatically:
- Match traces with type 'ext_contact_form'
- Render the beautiful Convizr-styled contact form
- Handle form submission and validation
- Send data back to Voiceflow with the correct payload structure
*/
