//Login/signup to access photos
let isSignup = false;

// Toggle Login/Signup mode
document.getElementById("toggleAuth").onclick = function (e) {
  e.preventDefault();
  isSignup = !isSignup;

  document.getElementById("modalTitle").innerText = isSignup
    ? "Signup"
    : "Login";
  document.getElementById("authBtn").innerText = isSignup ? "Signup" : "Login";
  document.getElementById("toggleText").innerHTML = isSignup
    ? `Already have an account? <a href="#" id="toggleAuth">Login here</a>`
    : `Don't have an account? <a href="#" id="toggleAuth">Signup here</a>`;

  document.getElementById("nameField").classList.toggle("d-none", !isSignup);
  document.getElementById("toggleAuth").onclick = arguments.callee;
};

// Handle form submission
document.getElementById("authForm").onsubmit = function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  const name = document.getElementById("fullName").value.trim();

  if (isSignup) {
    localStorage.setItem("user", JSON.stringify({ email, pass, name }));
    alert("Signup successful. Please log in.");
    document.getElementById("toggleAuth").click(); // switch to login
  } else {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.email === email && stored.pass === pass) {
      sessionStorage.setItem("loggedInUser", stored.name || stored.email);
      alert("Login successful!");
      location.reload();
    } else {
      alert("Invalid credentials!");
    }
  }
};

// On page load
window.onload = function () {
  const user = sessionStorage.getItem("loggedInUser");

  // Show name or Login button
  const loginBtn = document.getElementById("loginBtn");
  if (user) {
    loginBtn.innerText = `Welcome, ${user} (Logout)`;
    loginBtn.onclick = function () {
      sessionStorage.removeItem("loggedInUser");
      location.reload();
    };
  }

  // Protect all .protected elements (anchor tags or buttons)
  document.querySelectorAll(".protected").forEach((el) => {
    el.addEventListener("click", function (e) {
      if (!user) {
        e.preventDefault();
        alert("Please login to access this feature.");
        const modal = new bootstrap.Modal(
          document.getElementById("loginModal")
        );
        modal.show();
        return;
      }

      // If it's a button and has a data-file attribute (for download)
      const file = el.getAttribute("data-file");
      if (file) {
        const a = document.createElement("a");
        a.href = file;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  });
};

// Disable right-click on image
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  });
});
