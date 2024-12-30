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

        const { header = 'Contact' } = payloadObj;

        // Create form container
        const formContainer = document.createElement('form');

        formContainer.innerHTML = `
            <style>
                label {
                    display: block;
                    margin: 10px 0 5px;
                    font-size: 14px;
                    font-weight: bold;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px;
                    margin: 5px 0 20px 0;
                    display: inline-block;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                textarea {
                    height: 100px;
                    resize: vertical;
                }
                input[type="submit"] {
                    background-color: #447f76;
                    color: white;
                    border: none;
                    padding: 10px;
                    font-size: 16px;
                    text-align: center;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }
                input[type="submit"]:hover {
                    background-color: #376b62;
                }
            </style>

            <fieldset>
                <legend>${header}</legend>

                <label for="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>

                <label for="phone">Phone (Optional):</label>
                <input type="tel" id="phone" name="phone" placeholder="Enter your phone number">

                <label for="question">Your Question:</label>
                <textarea id="question" name="question" placeholder="Ask your question here..." required></textarea>

                <input type="submit" value="Submit">
            </fieldset>
        `;

        // Handle form submission
        formContainer.addEventListener('submit', (event) => {
            event.preventDefault();

            // Collect all input values into the payload
            const payload = {
                name: formContainer.querySelector('#name').value.trim(),
                email: formContainer.querySelector('#email').value.trim(),
                phone: formContainer.querySelector('#phone').value.trim() || null,
                question: formContainer.querySelector('#question').value.trim(),
            };

            console.log('Submitting Contact Form:', payload);

            // Send the payload back to Voiceflow
            window.voiceflow.chat.interact({
                type: 'complete',
                payload: payload,
            });
        });

        // Append form to the element
        element.appendChild(formContainer);
    },
};