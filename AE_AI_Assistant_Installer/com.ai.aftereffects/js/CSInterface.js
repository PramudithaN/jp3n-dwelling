/**
 * Minimal CSInterface bridge for Adobe CEP
 */
function CSInterface() {}

CSInterface.prototype.evalScript = function(script, callback) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.evalScript(script, callback || function() {});
    } else {
        console.warn("Adobe CEP environment not detected (running in standard browser). Script:", script);
        if (callback) {
            callback("MOCK_RESPONSE: Browser test mode (Not inside After Effects)");
        }
    }
};

window.CSInterface = CSInterface;
