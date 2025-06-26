// Paystack public key (use environment variable in production)
const PAYSTACK_PUBLIC_KEY = "pk_test_2f287f35ed8f6581128597acb9addebf13b71079";

// Price mapping (Kobo)
const priceMap = new Map([
  ["business-starter", 400000],
  ["business-starter1", 450000],
  ["business-starter2", 320000],
  ["creative-portfolio", 70000],
  ["ecommerce-shop", 600000],
  ["agency-landing-page", 450000],
  ["resume", 700000],
]);

// Email validation helper
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Generate a unique payment reference
function generateReference() {
  return "REF" + Date.now() + Math.floor(Math.random() * 1000);
}

// Main function to handle Paystack payment
function payWithPaystack(templateId) {
  const price = priceMap.get(templateId);

  if (!price) {
    alert("❌ Price not found for this template.");
    return;
  }

  const email = prompt("📧 Enter your email to receive the receipt:");

  if (!email || !isValidEmail(email)) {
    alert("❌ A valid email is required.");
    return;
  }

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: price,
    currency: "NGN",
    ref: generateReference(),
    metadata: {
      custom_fields: [
        {
          display_name: "Template ID",
          variable_name: "template_id",
          value: templateId,
        },
      ],
    },
    callback: function (response) {
      // Redirect to Thank You page with reference
      window.location.href = `thank_you.html?template=${templateId}&ref=${response.reference}`;
    },
    onClose: function () {
      alert("❌ Payment was not completed.");
    },
  });

  handler.openIframe();
}
