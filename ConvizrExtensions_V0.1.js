import { registerExtension } from 'https://convizr.github.io/Convizr/ConvizrExtensionRegistry.js';

export const OnboardingFormExtension = {
    name: 'OnboardingForm',
    type: 'response',
    match: ({ trace }) =>
        trace.type === 'ext_onboarding_form' || (trace.payload && trace.payload.name === 'ext_onboarding_form'),
    render: ({ trace, element }) => {
        console.log('Rendering OnboardingFormExtension');

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
        const { 
            bt_submit = 'Submit', 
            lb_fullName = 'Full Name', 
            lb_email = 'Email', 
            lb_companyName = 'Company Name',
            lb_preferredDays = 'Preferred Days',
            lb_preferredTime = 'Preferred Time',
            lb_timezone = 'Your Timezone'
        } = payloadObj;

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
                
                .timezone-display {
                    background: #f8f9fa;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 2px solid #e5e5e5;
                    margin-bottom: 1rem;
                }
                
                .timezone-info {
                    font-weight: 500;
                    color: #1a1a1a;
                }
                
                .days-selection {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                
                .day-checkbox {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem;
                    background: #ffffff;
                    border: 2px solid #e5e5e5;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .day-checkbox:hover {
                    border-color: #FF6B35;
                    background: #fff5f2;
                }
                
                .day-checkbox input[type="checkbox"] {
                    margin-right: 0.5rem;
                    width: auto;
                    padding: 0;
                }
                
                .day-checkbox input[type="checkbox"]:checked + .day-label {
                    color: #FF6B35;
                    font-weight: 600;
                }
                
                .day-checkbox:has(input[type="checkbox"]:checked) {
                    border-color: #FF6B35;
                    background: #fff5f2;
                }
                
                .day-label {
                    font-size: 0.9rem;
                    color: #1a1a1a;
                    transition: color 0.2s ease;
                }
                
                .time-selection {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }
                
                .time-slot {
                    background: #ffffff;
                    border: 2px solid #e5e5e5;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }
                
                .time-slot:hover {
                    border-color: #FF6B35;
                    background: #fff5f2;
                }
                
                .time-checkbox {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    cursor: pointer;
                    width: 100%;
                }
                
                .time-checkbox input[type="checkbox"] {
                    margin-right: 0.75rem;
                    width: auto;
                    padding: 0;
                }
                
                .time-label {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .time-label strong {
                    color: #1a1a1a;
                    font-size: 0.95rem;
                }
                
                .time-range {
                    color: #666;
                    font-size: 0.85rem;
                }
                
                .local-time {
                    color: #FF6B35;
                    font-size: 0.8rem;
                    font-weight: 500;
                }
                
                .time-checkbox input[type="checkbox"]:checked + .time-label strong {
                    color: #FF6B35;
                }
                
                .time-slot:has(input[type="checkbox"]:checked) {
                    border-color: #FF6B35;
                    background: #fff5f2;
                }
            </style>

            <div class="convizr-form">
                <div class="form-header">
                    <h2 class="form-title">Welcome to Convizr</h2>
                    <p class="form-subtitle">Let's get started with your AI transformation journey. Tell us about yourself and schedule a consultation.</p>
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

                <div class="form-group">
                    <label for="companyName" class="form-label">${lb_companyName}</label>
                    <input 
                        type="text" 
                        id="companyName" 
                        name="companyName" 
                        class="form-input" 
                        placeholder="Enter your company name" 
                        required
                    >
                    <div class="error-message" id="companyError"></div>
                </div>

                <div class="form-group">
                    <label class="form-label">${lb_timezone}</label>
                    <div class="timezone-display" id="timezoneDisplay">
                        <span class="timezone-info">Detecting your timezone...</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">${lb_preferredDays}</label>
                    <div class="days-selection">
                        <label class="day-checkbox">
                            <input type="checkbox" name="preferredDays" value="monday">
                            <span class="day-label">Monday</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" name="preferredDays" value="tuesday">
                            <span class="day-label">Tuesday</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" name="preferredDays" value="wednesday">
                            <span class="day-label">Wednesday</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" name="preferredDays" value="thursday">
                            <span class="day-label">Thursday</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" name="preferredDays" value="friday">
                            <span class="day-label">Friday</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" name="preferredDays" value="saturday">
                            <span class="day-label">Saturday</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" name="preferredDays" value="sunday">
                            <span class="day-label">Sunday</span>
                        </label>
                    </div>
                    <div class="error-message" id="daysError"></div>
                </div>

                <div class="form-group">
                    <label class="form-label">${lb_preferredTime}</label>
                    <div class="time-selection" id="timeSelection">
                        <div class="time-slot">
                            <label class="time-checkbox">
                                <input type="checkbox" name="preferredTimes" value="morning">
                                <span class="time-label">
                                    <strong>Morning</strong>
                                    <span class="time-range">9:00 AM - 12:00 PM CET</span>
                                    <span class="local-time" id="morningLocal"></span>
                                </span>
                            </label>
                        </div>
                        <div class="time-slot">
                            <label class="time-checkbox">
                                <input type="checkbox" name="preferredTimes" value="midday">
                                <span class="time-label">
                                    <strong>Midday</strong>
                                    <span class="time-range">12:00 PM - 3:00 PM CET</span>
                                    <span class="local-time" id="middayLocal"></span>
                                </span>
                            </label>
                        </div>
                        <div class="time-slot">
                            <label class="time-checkbox">
                                <input type="checkbox" name="preferredTimes" value="evening">
                                <span class="time-label">
                                    <strong>Evening</strong>
                                    <span class="time-range">3:00 PM - 6:00 PM CET</span>
                                    <span class="local-time" id="eveningLocal"></span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="error-message" id="timeError"></div>
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
            const companyError = formContainer.querySelector('#companyError');
            const daysError = formContainer.querySelector('#daysError');
            const timeError = formContainer.querySelector('#timeError');

            // Reset error messages
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            companyError.style.display = 'none';
            daysError.style.display = 'none';
            timeError.style.display = 'none';
            successMessage.style.display = 'none';

            // Get form values
            const fullName = formContainer.querySelector('#fullName').value.trim();
            const email = formContainer.querySelector('#email').value.trim();
            const companyName = formContainer.querySelector('#companyName').value.trim();
            
            // Get selected days
            const selectedDays = Array.from(formContainer.querySelectorAll('input[name="preferredDays"]:checked'))
                .map(checkbox => checkbox.value);
            
            // Get selected times
            const selectedTimes = Array.from(formContainer.querySelectorAll('input[name="preferredTimes"]:checked'))
                .map(checkbox => checkbox.value);
            
            // Get user timezone
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin';

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

            if (!companyName) {
                companyError.textContent = 'Please enter your company name';
                companyError.style.display = 'block';
                hasErrors = true;
            }

            if (selectedDays.length === 0) {
                daysError.textContent = 'Please select at least one preferred day';
                daysError.style.display = 'block';
                hasErrors = true;
            }

            if (selectedTimes.length === 0) {
                timeError.textContent = 'Please select at least one preferred time';
                timeError.style.display = 'block';
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
                companyName: companyName,
                preferredDays: selectedDays,
                preferredTimes: selectedTimes,
                userTimezone: userTimezone,
                timestamp: new Date().toISOString(),
                source: 'onboarding_form'
            };

            console.log('Submitting Onboarding Form:', payload);

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
                formContainer.querySelector('#companyName').value = '';
                
                // Reset checkboxes
                formContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });

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

        // Timezone detection and time conversion
        function detectTimezone() {
            try {
                const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const timezoneDisplay = formContainer.querySelector('#timezoneDisplay');
                timezoneDisplay.innerHTML = `
                    <span class="timezone-info">
                        <strong>Your timezone:</strong> ${userTimezone}
                        <br><small>Times shown in your local time</small>
                    </span>
                `;
                
                // Convert CET times to user's timezone
                convertTimesToLocal(userTimezone);
                
                return userTimezone;
            } catch (error) {
                console.error('Error detecting timezone:', error);
                const timezoneDisplay = formContainer.querySelector('#timezoneDisplay');
                timezoneDisplay.innerHTML = `
                    <span class="timezone-info">
                        <strong>Timezone:</strong> Unable to detect automatically
                        <br><small>Times shown in CET (Central European Time)</small>
                    </span>
                `;
                return 'Europe/Berlin'; // Default to CET
            }
        }

        function convertTimesToLocal(userTimezone) {
            const timeSlots = [
                { id: 'morningLocal', cetStart: '09:00', cetEnd: '12:00', label: 'Morning' },
                { id: 'middayLocal', cetStart: '12:00', cetEnd: '15:00', label: 'Midday' },
                { id: 'eveningLocal', cetStart: '15:00', cetEnd: '18:00', label: 'Evening' }
            ];

            timeSlots.forEach(slot => {
                try {
                    // Create dates for today in CET
                    const today = new Date();
                    const cetStartTime = new Date(today.toLocaleDateString() + ' ' + slot.cetStart + ':00');
                    const cetEndTime = new Date(today.toLocaleDateString() + ' ' + slot.cetEnd + ':00');
                    
                    // Convert to user's timezone
                    const userStartTime = new Date(cetStartTime.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
                    const userEndTime = new Date(cetEndTime.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
                    
                    const localStart = userStartTime.toLocaleTimeString('en-US', { 
                        timeZone: userTimezone,
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                    const localEnd = userEndTime.toLocaleTimeString('en-US', { 
                        timeZone: userTimezone,
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                    
                    const localTimeElement = formContainer.querySelector(`#${slot.id}`);
                    if (localTimeElement) {
                        localTimeElement.textContent = `(${localStart} - ${localEnd} your time)`;
                    }
                } catch (error) {
                    console.error(`Error converting ${slot.label} time:`, error);
                }
            });
        }

        // Initialize timezone detection
        detectTimezone();

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
- Type: ext_onboarding_form
- Payload: {
    "bt_submit": "Submit",
    "lb_fullName": "Full Name", 
    "lb_email": "Email",
    "lb_companyName": "Company Name",
    "lb_preferredDays": "Preferred Days",
    "lb_preferredTime": "Preferred Time",
    "lb_timezone": "Your Timezone"
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
        
        if (trace.type === 'ext_onboarding_form') {
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
- "Registered extension: OnboardingForm"
- "Rendering extension: OnboardingForm" 
- "Submitting Onboarding Form: {payload}"

7. CUSTOMIZATION:

You can easily add more extensions by:
1. Creating a new extension object with the same structure
2. Registering it with registerExtension()
3. The system will automatically handle matching and rendering

*/

// Auto-register the OnboardingFormExtension when this module is imported
registerExtension(OnboardingFormExtension);