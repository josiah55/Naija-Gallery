//Login for photos
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

// === Modal Image Preview ===
const galleryImages = document.querySelectorAll(".gallery-img");
const modalImage = document.getElementById("modalImage");

galleryImages.forEach((img) => {
  img.addEventListener("click", () => {
    const fullImageUrl = img.getAttribute("data-full");
    modalImage.src = fullImageUrl;
  });
});

// Search filter
const gallerySearchInput = document.getElementById("gallerySearchInput");
const galleryItems = document.querySelectorAll(".gallery-item");
gallerySearchInput.addEventListener("keyup", () => {
  const searchValue = gallerySearchInput.value.toLowerCase();
  galleryItems.forEach((item) => {
    const tags = item.getAttribute("data-tags").toLowerCase();
    item.style.display = tags.includes(searchValue) ? "block" : "none";
  });
});

// Tag filter
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tag = btn.getAttribute("data-tag").toLowerCase();
    galleryItems.forEach((item) => {
      const itemTags = item.getAttribute("data-tags").toLowerCase();
      item.style.display =
        tag === "all" || itemTags.includes(tag) ? "block" : "none";
    });
  });
});

// Allow right-click everywhere, except on images
document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault(); // disable right-click only on images
  }
});

//The back to top
// Show/hide button on scroll
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

// Scroll to top when clicked
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
