let currentImage = "";
let currentPrice = 0;

function openModal(imgUrl, price) {
  currentImage = imgUrl;
  currentPrice = price;

  document.getElementById("modalImage").src = imgUrl;
  document.getElementById("modalPrice").innerText =
    "Price: ₦" + (price / 100).toLocaleString();

  const photoModal = new bootstrap.Modal(document.getElementById("photoModal"));
  photoModal.show();
}

document.getElementById("payButton").addEventListener("click", function () {
  payWithPaystack();
});

function payWithPaystack() {
  let handler = PaystackPop.setup({
    key: "pk_test_2f287f35ed8f6581128597acb9addebf13b71079", // Replace with your public key
    email: "kadirijossy@gmail.com",
    amount: currentPrice, // Amount in Kobo
    currency: "NGN",
    callback: function (response) {
      // After payment success
      downloadImage(currentImage);
    },
    onClose: function () {
      alert("Payment cancelled");
    },
  });
  handler.openIframe();
}

function downloadImage(imgUrl) {
  const a = document.createElement("a");
  a.href = imgUrl;
  a.download = imgUrl.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Allow right-click everywhere, except on images
document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault(); // disable right-click only on images
  }
});

//The back to top
window.addEventListener("scroll", function () {
  const btn = document.getElementById("backToTop");
  btn.style.display = window.scrollY > 300 ? "block" : "none";
});

document.getElementById("backToTop").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
