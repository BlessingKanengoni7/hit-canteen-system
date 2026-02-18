document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("http://localhost:5000/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {

            // Save role in session
            sessionStorage.setItem("ADMIN_ROLE", data.role);

            if (data.role === "finance") {
                window.location.href = "finance-dashboard.html";
            } 
            else if (data.role === "canteen") {
                window.location.href = "canteen-dashboard.html";
            }

        } else {
            alert(data.message);
        }

    } catch (error) {
        alert("Server error. Make sure backend is running.");
    }
});
