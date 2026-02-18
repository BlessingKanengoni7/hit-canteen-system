/* ===============================
   SECURITY LOGIN CONTROLLER
   =============================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("securityLoginForm");
    const securityIdInput = document.getElementById("securityId");
    const securityPinInput = document.getElementById("securityPin");

    if (!loginForm || !securityIdInput || !securityPinInput) return;

    // Prevent browser autofill residue
    securityIdInput.value = "";
    securityPinInput.value = "";

    // Ensure PIN field is ALWAYS clean on focus
    securityPinInput.addEventListener("focus", () => {
        securityPinInput.value = "";
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const securityId = securityIdInput.value.trim().toUpperCase();
        const securityPin = securityPinInput.value.trim();

        /* ===============================
           TEMP MOCK AUTHENTICATION
           (Replace with backend later)
           =============================== */

        const VALID_SECURITY = {
            id: "SEC-001",
            pin: "123456"
        };

        if (
            securityId === VALID_SECURITY.id &&
            securityPin === VALID_SECURITY.pin
        ) {
            // DO NOT nuke everything — isolate security session
            sessionStorage.removeItem("ADMIN_AUTH");
            sessionStorage.removeItem("STUDENT_AUTH");

            sessionStorage.setItem("SECURITY_AUTH", "true");
            sessionStorage.setItem("SECURITY_ID", securityId);

            window.location.href = "security-verify.html";
        } else {
            alert("❌ Invalid Security ID or Access PIN");

            securityPinInput.value = "";
            securityPinInput.focus();
        }
    });

});
