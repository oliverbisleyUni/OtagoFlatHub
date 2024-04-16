// Function to toggle between login and create account forms
function toggleForms() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("create-account-container").style.display = "block";
}

// Function to toggle back to login form
function backToLogin() {
    document.getElementById("create-account-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
}

// Event listener for create account link
document.getElementById("create-account-link").addEventListener("click", function(event) {
    event.preventDefault();
    toggleForms();
});

// Event listener for back to login link
document.getElementById("login-link").addEventListener("click", function(event) {
    event.preventDefault();
    backToLogin();
});

// Event listener for login form submission (just for demonstration)
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log("Login - Username: " + username + ", Password: " + password);
});

// Event listener for create account form submission
document.getElementById("create-account-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var newUsername = document.getElementById("new-username").value;
    var newPassword = document.getElementById("new-password").value;
    console.log("Create Account - Username: " + newUsername + ", Password: " + newPassword);
    // Redirecting to login page after account creation
    window.location.href = "login.html";
});