/* =========================================
   SECURITY VERIFICATION CONTROLLER
   HIT CANTEEN SYSTEM
   SERVER-VALIDATED VERSION (NO EXPIRY)
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ================= ACCESS CONTROL ================= */
    if (sessionStorage.getItem("SECURITY_AUTH") !== "true") {
        window.location.href = "security-login.html";
        return;
    }

    /* ================= ELEMENTS ================= */
    const verifyHeader  = document.getElementById("verifyHeader");
    const logoutBtn     = document.getElementById("logoutBtn");
    const scanBtn       = document.getElementById("scanBtn");
    const manualBtn     = document.getElementById("manualBtn");
    const resultStatus  = document.getElementById("resultStatus");
    const resultDetails = document.getElementById("resultDetails");

    let qrScanner = null;
    let resetTimer = null;

    /* =========================================
       🔊 AUDIO SYSTEM
       ========================================= */

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function beep(freq, duration, volume = 0.6) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = freq;

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        gain.gain.setValueAtTime(volume, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }

    function playApprovedSound() {
        if (audioContext.state === "suspended") audioContext.resume();
        beep(1200, 0.12);
        setTimeout(() => beep(1400, 0.12), 180);
    }

    function playDeniedSound() {
        if (audioContext.state === "suspended") audioContext.resume();
        beep(250, 0.6, 0.8);
    }

    function setHeaderState(state) {

        verifyHeader.className = `header verify-header ${state}`;

        if (state === "approved") playApprovedSound();
        if (state === "denied")   playDeniedSound();

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            verifyHeader.className = "header verify-header neutral";
        }, 5000);
    }

    /* ================= LOGOUT ================= */
    logoutBtn.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "security-login.html";
    });

    /* ================= QR SCANNING ================= */
    scanBtn.addEventListener("click", () => startScanner());

    function startScanner() {
        if (qrScanner) return;

        qrScanner = new Html5Qrcode("qr-video");

        qrScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            onScanSuccess
        );
    }

    function onScanSuccess(decodedText) {
        qrScanner.stop().then(() => {
            qrScanner.clear();
            qrScanner = null;
            verifyFromQR(decodedText);
        });
    }

    async function verifyFromQR(qrData) {

        try {

            const parts = qrData.split("|");

            if (parts.length !== 5 || parts[0] !== "HIT") {
                throw new Error("Invalid QR Format");
            }

            const orderNumber = parts[1];
            const studentId   = parts[2];

            await verifyWithServer(orderNumber, studentId);

        } catch (err) {
            showDenied(err.message);
        }
    }

    /* ================= MANUAL ENTRY ================= */
    manualBtn.addEventListener("click", async () => {

        const orderNumber = prompt("Enter Order Number:");
        if (!orderNumber) return;

        const studentId = prompt("Enter Student Registration Number:");
        if (!studentId) return;

        await verifyWithServer(orderNumber.trim(), studentId.trim());
    });

    /* ================= SERVER VERIFICATION ================= */
    async function verifyWithServer(orderNumber, studentId) {

        try {

            const res = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderNumber, studentId })
            });

            const data = await res.json();

            if (data.success) {

                setHeaderState("approved");

                const mealsList = data.order.meals
                    .map(m => `${m.name} x${m.quantity}`)
                    .join(", ");

                resultStatus.className = "status approved";
                resultStatus.innerText = "✅ APPROVED";

                resultDetails.innerHTML = `
                    <li>Student: ${data.order.studentName}</li>
                    <li>Reg No: ${data.order.studentId}</li>
                    <li>Meal: ${mealsList}</li>
                    <li>Time: ${new Date(data.order.timestamp).toLocaleTimeString()}</li>
                `;

            } else {

                showDenied(data.message);
            }

        } catch (error) {

            showDenied("Server Error");
        }
    }

    function showDenied(message) {

        setHeaderState("denied");

        resultStatus.className = "status denied";
        resultStatus.innerText = "❌ DENIED";

        resultDetails.innerHTML = `
            <li>Reason: ${message}</li>
        `;
    }

});
