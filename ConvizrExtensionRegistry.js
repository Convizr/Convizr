// Extension Registry System for Voiceflow Runtime API
class ConvizrExtensionRegistry {
    constructor() {
        this.extensions = new Map();
        this.voiceflowClient = null;
    }

    // Register the Voiceflow client instance
    setVoiceflowClient(client) {
        this.voiceflowClient = client;
    }

    // Register an extension
    register(extension) {
        if (!extension.name || !extension.type || !extension.match || !extension.render) {
            throw new Error('Extension must have name, type, match, and render properties');
        }
        this.extensions.set(extension.name, extension);
        console.log(`Registered extension: ${extension.name}`);
    }

    // Get all registered extensions
    getExtensions() {
        return Array.from(this.extensions.values());
    }

    // Find matching extension for a trace
    findMatchingExtension(trace) {
        for (const extension of this.extensions.values()) {
            try {
                if (extension.match({ trace })) {
                    return extension;
                }
            } catch (error) {
                console.error(`Error matching extension ${extension.name}:`, error);
            }
        }
        return null;
    }

    // Render an extension
    async renderExtension(trace, element) {
        const extension = this.findMatchingExtension(trace);
        
        if (!extension) {
            console.warn('No matching extension found for trace:', trace);
            return false;
        }

        try {
            console.log(`Rendering extension: ${extension.name}`);
            
            // Clear the element
            element.innerHTML = '';
            
            // Render the extension
            await extension.render({ 
                trace, 
                element,
                voiceflowClient: this.voiceflowClient,
                registry: this
            });
            
            return true;
        } catch (error) {
            console.error(`Error rendering extension ${extension.name}:`, error);
            element.innerHTML = `<div style="color: red; padding: 1rem;">Error rendering extension: ${error.message}</div>`;
            return false;
        }
    }

    // Send data back to Voiceflow
    sendToVoiceflow(payload) {
        if (this.voiceflowClient) {
            this.voiceflowClient.interact({
                type: 'complete',
                payload: payload,
            });
        } else {
            console.warn('Voiceflow client not set, cannot send payload');
        }
    }
}

// Global extension registry instance
export const extensionRegistry = new ConvizrExtensionRegistry();

// Helper function to register extensions
export function registerExtension(extension) {
    extensionRegistry.register(extension);
}

// Helper function to render traces with extensions
export function renderTraceWithExtensions(trace, element) {
    return extensionRegistry.renderExtension(trace, element);
}

// Helper function to send data to Voiceflow
export function sendToVoiceflow(payload) {
    extensionRegistry.sendToVoiceflow(payload);
}
