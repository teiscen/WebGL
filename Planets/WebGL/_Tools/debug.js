// Add this to your file
let debugLogs = [];

function logDebug(message) {
    debugLogs.push(`[${new Date().toISOString()}] ${message}`);
    console.log(message);
}

function downloadLogs() {
    const blob = new Blob([debugLogs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debug-log.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Usage:
// logDebug("This is a debug message");
// Call downloadLogs() to save the log file

export {logDebug, downloadLogs}