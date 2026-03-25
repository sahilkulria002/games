// Common programming utilities and shared code snippets
// This file contains reusable functions and constants for programming tutorials

// Example: Utility function for logging
function logMessage(message) {
    console.log(`[Programming Hub] ${message}`);
}

// Example: Common code snippets object
const commonSnippets = {
    python: {
        helloWorld: 'print("Hello, World!")',
        loop: 'for i in range(5):\n    print(i)'
    },
    arduino: {
        setup: 'void setup() {\n    // put your setup code here, to run once:\n}',
        loop: 'void loop() {\n    // put your main code here, to run repeatedly:\n}'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { logMessage, commonSnippets };
}