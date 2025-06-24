//Login for photos
let isSignup = false;

// Toggle Login/Signup mode
document.getElementById('toggleAuth').onclick = function (e) {
  e.preventDefault();
  isSignup = !isSignup;

  document.getElementById('modalTitle').innerText = isSignup ? "Signup" : "Login";
  document.getElementById('authBtn').innerText = isSignup ? "Signup" : "Login";
  document.getElementById('toggleText').innerHTML = isSignup
    ? `Already have an account? <a href="#" id="toggleAuth">Login here</a>`
    : `Don't have an account? <a href="#" id="toggleAuth">Signup here</a>`;
  
  document.getElementById('nameField').classList.toggle('d-none', !isSignup);
  document.getElementById('toggleAuth').onclick = arguments.callee;
};

// Handle form submission
document.getElementById('authForm').onsubmit = function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value.trim();
  const name = document.getElementById('fullName').value.trim();

  if (isSignup) {
    localStorage.setItem("user", JSON.stringify({ email, pass, name }));
    alert("Signup successful. Please log in.");
    document.getElementById('toggleAuth').click(); // switch to login
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
  document.querySelectorAll(".protected").forEach(el => {
    el.addEventListener("click", function (e) {
      if (!user) {
        e.preventDefault();
        alert("Please login to access this feature.");
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
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


// hamburger menu 
const hamburgerBtn = document.getElementById('customHamburger');
const popup = document.getElementById('hamburgerPopup');
const closePopup = document.getElementById('closePopup');

hamburgerBtn.addEventListener('click', () => {
  popup.style.display = 'block';
});

closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});


//search photos on lensi africa
document.getElementById('searchForm').addEventListener('submit', function(e) {
e.preventDefault();

const input = document.getElementById('searchInput').value.trim().toLowerCase();
const target = document.getElementById(input);

if (target) {
  target.scrollIntoView({ behavior: 'smooth' });
} else {
  alert('No matching section found.');
}

// Optional: clear search input
document.getElementById('searchInput').value = '';
});


//search bar for photos on the AfricaVista
const searchInput = document.getElementById('searchInput');
const itemList = document.getElementById('explore');
const items = itemList.getElementsByTagName('button');

searchInput.addEventListener('keyup', function() {
const filter = searchInput.value.toLowerCase();

for (let i = 0; i < items.length; i++) {
  const text = items[i].textContent.toLowerCase();
  if (text.includes(filter)) {
    items[i].style.display = '';
  } else {
    items[i].style.display = 'none';
  }
}
});


//Carousel for next and previous page 
const carouselElement = document.getElementById('groupCarousel');
const carouselWrapper = document.getElementById('myCarouselWrapper');
carouselElement.addEventListener('slid.bs.carousel', function () {
  carouselWrapper.scrollIntoView({ behavior: 'smooth' });
});


//More Categories
function toggleGallery(id) {
const gallery = document.getElementById(id);
gallery.classList.toggle('d-none');
} 

//Modal for more categories
document.querySelectorAll('img[data-bs-toggle="modal"]').forEach(img => {
  img.addEventListener('click', function () {
    const src = this.getAttribute('src');
    document.getElementById('modalImage').src = src;
    document.querySelector('#imageModal a').href = src;
  });
});



// This is for the uploaded photos
const uploadForm = document.getElementById('uploadForm');
const photoUpload = document.getElementById('photoUpload');
const photoTitle = document.getElementById('photoTitle');
const photoGallery = document.getElementById('photoGallery');

window.addEventListener('DOMContentLoaded', loadStoredImages);

function loadStoredImages() {
const stored = JSON.parse(localStorage.getItem('uploadedPhotos')) || [];
stored.forEach(photo => {
  addImageToGallery(photo.dataURL, photo.title, photo.uploadedAt);
});
}

uploadForm.addEventListener('submit', function (e) {
e.preventDefault();

const files = photoUpload.files;
const title = photoTitle.value.trim();

if (files.length === 0 || title === '') {
  alert('Please add a title and at least one photo.');
  return;
}

const stored = JSON.parse(localStorage.getItem('uploadedPhotos')) || [];

Array.from(files).forEach(file => {
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      // Resize for display only
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const MAX_WIDTH = 300;
      const MAX_HEIGHT = 300;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const resizedDisplayURL = canvas.toDataURL("image/jpeg", 0.9); // For display
      const originalDataURL = event.target.result; // Original

      const uploadedAt = new Date().toLocaleString();

      // Save to localStorage
      stored.push({ title, dataURL: originalDataURL, uploadedAt });
      localStorage.setItem('uploadedPhotos', JSON.stringify(stored));

      // Display
      addImageToGallery(originalDataURL, title, uploadedAt);
    };
  };

  reader.readAsDataURL(file);
});

uploadForm.reset();
});

function addImageToGallery(dataURL, title, uploadedAt) {
const wrapper = document.createElement('div');
wrapper.className = 'm-2 text-center';

const img = document.createElement('img');
img.src = dataURL;
img.alt = title;
img.className = 'uploaded-photo rounded shadow';
img.style.maxWidth = '300px';
img.style.maxHeight = '300px';

const caption = document.createElement('div');
caption.textContent = title;
caption.className = 'mt-2 fw-medium';

const timeTag = document.createElement('div');
timeTag.textContent = `Uploaded: ${uploadedAt}`;
timeTag.className = 'text-muted small mb-2';

const downloadBtn = document.createElement('a');
downloadBtn.href = dataURL;
downloadBtn.download = `${title.replace(/\s+/g, '_')}.jpg`;
downloadBtn.className = 'btn btn-sm btn-success me-2';
downloadBtn.textContent = 'Download';

const deleteBtn = document.createElement('button');
deleteBtn.className = 'btn btn-sm btn-danger';
deleteBtn.textContent = 'Delete';
deleteBtn.onclick = function () {
  wrapper.remove();
  removeImageFromStorage(dataURL);
};

wrapper.appendChild(img);
wrapper.appendChild(caption);
wrapper.appendChild(timeTag);
wrapper.appendChild(downloadBtn);
wrapper.appendChild(deleteBtn);
photoGallery.appendChild(wrapper);
}

function removeImageFromStorage(dataURL) {
let stored = JSON.parse(localStorage.getItem('uploadedPhotos')) || [];
stored = stored.filter(photo => photo.dataURL !== dataURL);
localStorage.setItem('uploadedPhotos', JSON.stringify(stored));
}


//The back to top
window.addEventListener("scroll", function () {
const btn = document.getElementById("backToTop");
btn.style.display = window.scrollY > 300 ? "block" : "none";
});

document.getElementById("backToTop").addEventListener("click", function (e) {
e.preventDefault();
window.scrollTo({ top: 0, behavior: 'smooth' });
});
