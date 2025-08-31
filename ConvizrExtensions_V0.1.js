import { registerExtension } from 'https://convizr.github.io/Convizr/ConvizrExtensionRegistry.js';

export const ContactFormExtension = {
    name: 'ContactForm',
    type: 'response',
    match: ({ trace }) =>
        trace.type === 'ext_contact_form' || (trace.payload && trace.payload.name === 'ext_contact_form'),
    render: ({ trace, element }) => {
        console.log('Rendering ContactFormExtension');

        // Parse payload
        let payloadObj;
        if (typeof trace.payload === 'string') {
            try {
                payloadObj = JSON.parse(trace.payload);
            } catch (e) {
                console.error('Error parsing payload:', e);
                payloadObj = {};
            }
        } else {
            payloadObj = trace.payload || {};
        }

        // Extract dynamic labels from payload
        const { bt_submit = 'Submit', lb_fullName = 'Full Name', lb_email = 'Email' } = payloadObj;

        // Create form container
        const formContainer = document.createElement('form');

        formContainer.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                .convizr-form {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 2rem;
                    background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(255, 107, 53, 0.1);
                    border: 1px solid rgba(255, 107, 53, 0.1);
                    transition: all 0.3s ease;
                }
                
                .convizr-form:hover {
                    box-shadow: 0 12px 40px rgba(255, 107, 53, 0.15);
                    transform: translateY(-2px);
                }
                
                .form-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                
                .form-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .form-subtitle {
                    font-size: 0.95rem;
                    color: #666;
                    font-weight: 400;
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                    position: relative;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #1a1a1a;
                    transition: color 0.2s ease;
                }
                
                .form-input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    font-size: 0.95rem;
                    font-family: inherit;
                    border: 2px solid #e5e5e5;
                    border-radius: 12px;
                    background: #ffffff;
                    color: #1a1a1a;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: #FF6B35;
                    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
                    transform: translateY(-1px);
                }
                
                .form-input::placeholder {
                    color: #999;
                    font-weight: 400;
                }
                
                .form-input:hover {
                    border-color: #FF6B35;
                    transform: translateY(-1px);
                }
                
                .submit-btn {
                    width: 100%;
                    padding: 1rem 2rem;
                    font-size: 1rem;
                    font-weight: 600;
                    font-family: inherit;
                    color: #ffffff;
                    background: linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%);
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    margin-top: 1rem;
                }
                
                .submit-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }
                
                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
                }
                
                .submit-btn:hover::before {
                    left: 100%;
                }
                
                .submit-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
                }
                
                .submit-btn:disabled {
                    background: #e5e5e5;
                    color: #999;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .submit-btn:disabled::before {
                    display: none;
                }
                
                .loading {
                    display: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 20px;
                    height: 20px;
                    border: 2px solid #ffffff;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    display: none;
                }
                
                .success-message {
                    color: #28a745;
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    display: none;
                }
            </style>

            <div class="convizr-form">
                <div class="form-header">
                    <h2 class="form-title">Get in Touch</h2>
                    <p class="form-subtitle">Ready to transform your business with AI? Let's start the conversation.</p>
                </div>

                <div class="form-group">
                    <label for="fullName" class="form-label">${lb_fullName}</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        class="form-input" 
                        placeholder="Enter your full name" 
                        required
                    >
                    <div class="error-message" id="nameError"></div>
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">${lb_email}</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        class="form-input" 
                        placeholder="Enter your email address" 
                        required
                    >
                    <div class="error-message" id="emailError"></div>
                </div>

                <button type="submit" class="submit-btn" id="submitBtn">
                    <span class="btn-text">${bt_submit}</span>
                    <div class="loading" id="loading"></div>
                </button>
                
                <div class="success-message" id="successMessage">Thank you! We'll get back to you soon.</div>
            </div>
        `;

        // Handle form submission
        formContainer.addEventListener('submit', (event) => {
            event.preventDefault();

            const submitBtn = formContainer.querySelector('#submitBtn');
            const btnText = formContainer.querySelector('.btn-text');
            const loading = formContainer.querySelector('#loading');
            const successMessage = formContainer.querySelector('#successMessage');
            const nameError = formContainer.querySelector('#nameError');
            const emailError = formContainer.querySelector('#emailError');

            // Reset error messages
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            successMessage.style.display = 'none';

            // Get form values
            const fullName = formContainer.querySelector('#fullName').value.trim();
            const email = formContainer.querySelector('#email').value.trim();

            // Basic validation
            let hasErrors = false;

            if (!fullName) {
                nameError.textContent = 'Please enter your full name';
                nameError.style.display = 'block';
                hasErrors = true;
            }

            if (!email) {
                emailError.textContent = 'Please enter your email address';
                emailError.style.display = 'block';
                hasErrors = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                hasErrors = true;
            }

            if (hasErrors) {
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            loading.style.display = 'block';

            // Collect form data into payload
            const payload = {
                fullName: fullName,
                email: email,
                timestamp: new Date().toISOString(),
                source: 'contact_form'
            };

            console.log('Submitting Contact Form:', payload);

            // Simulate API call delay for better UX
            setTimeout(() => {
                // Send the payload back to Voiceflow
                window.voiceflow.chat.interact({
                    type: 'complete',
                    payload: payload,
                });

                // Show success state
                loading.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form
                formContainer.querySelector('#fullName').value = '';
                formContainer.querySelector('#email').value = '';

                // Re-enable button after a delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnText.style.display = 'block';
                    successMessage.style.display = 'none';
                }, 3000);

            }, 1000);
        });

        // Add input focus effects
        const inputs = formContainer.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.querySelector('.form-label').style.color = '#FF6B35';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.querySelector('.form-label').style.color = '#1a1a1a';
            });
        });

        // Append form to the element
        element.appendChild(formContainer);
    },
};

// ============================================================================
// INTEGRATION GUIDE FOR VOICEFLOW RUNTIME API
// ============================================================================

/*
HOW TO INTEGRATE WITH VOICEFLOW RUNTIME API:

1. SETUP IN YOUR MAIN APPLICATION:

```javascript
import { 
    extensionRegistry, 
    registerExtension, 
    ContactFormExtension,
    renderTraceWithExtensions 
} from 'https://convizr.github.io/Convizr/ConvizrExtensions_V0.1.js';

// Initialize the extension system
function initializeExtensions(voiceflowClient) {
    // Set the Voiceflow client
    extensionRegistry.setVoiceflowClient(voiceflowClient);
    
    // Register your extensions
    registerExtension(ContactFormExtension);
    
    // You can register more extensions here
    // registerExtension(AnotherExtension);
}
```

2. MODIFY YOUR TRACE RENDERING LOGIC:

```javascript
async function renderTraces(traces, container) {
    for (const trace of traces) {
        // Check if this trace should be handled by an extension
        const extensionHandled = await renderTraceWithExtensions(trace, container);
        
        if (!extensionHandled) {
            // Handle with your default trace rendering logic
            renderDefaultTrace(trace, container);
        }
    }
}
```

3. VOICEFLOW SETUP:

In your Voiceflow project, create a custom extension with:
- Type: ext_contact_form
- Payload: {
    "bt_submit": "Submit",
    "lb_fullName": "Full Name", 
    "lb_email": "Email"
}

4. COMPLETE INTEGRATION EXAMPLE:

```javascript
// Initialize Voiceflow
const voiceflowClient = new Voiceflow({
    versionID: 'your-version-id',
    apiKey: 'your-api-key'
});

// Initialize extensions
initializeExtensions(voiceflowClient);

// Handle traces
voiceflowClient.onMessage((message) => {
    const traces = message.traces;
    
    traces.forEach(async (trace) => {
        const container = document.getElementById('chat-container');
        
        if (trace.type === 'ext_contact_form') {
            // Let the extension handle it
            await renderTraceWithExtensions(trace, container);
        } else {
            // Handle other trace types normally
            handleRegularTrace(trace, container);
        }
    });
});
```

5. EXTENSION LIFECYCLE:

The extension system provides:
- Automatic extension discovery and registration
- Error handling and fallbacks
- Clean separation of concerns
- Easy testing and debugging

6. DEBUGGING:

Check the console for:
- "Registered extension: ContactForm"
- "Rendering extension: ContactForm" 
- "Submitting Contact Form: {payload}"

7. CUSTOMIZATION:

You can easily add more extensions by:
1. Creating a new extension object with the same structure
2. Registering it with registerExtension()
3. The system will automatically handle matching and rendering

*/

// Auto-register the ContactFormExtension when this module is imported
registerExtension(ContactFormExtension);