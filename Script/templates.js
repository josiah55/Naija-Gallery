// Price mapping for each template (in Kobo)
const priceEntries = [
  ["business-starter", 400000],
  ["creative-portfolio", 450000],
  ["ecommerce-shop", 600000],
  ["agency-landing-page", 450000],
  ["resume", 700000],
];

const prices = Object.fromEntries(priceEntries);

function payWithPaystack(templateId) {
  const price = prices[templateId];
  if (!price) {
    alert("Price not found for this template.");
    return;
  }

  const email = prompt("Please enter your email for receipt");
  if (!email) {
    alert("Email is required to proceed with payment.");
    return;
  }

  const handler = PaystackPop.setup({
    key: "pk_test_2f287f35ed8f6581128597acb9addebf13b71079", // Replace with your Paystack public key
    email: email,
    amount: price,
    currency: "NGN",
    ref: "" + Math.floor(Math.random() * 1000000000 + 1),
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
      // Redirect to thank-you page with template ID
      window.location.href =
        "thank_you.html?template=" + templateId + "&ref=" + response.reference;
    },
    onClose: function () {
      alert("❌ Payment was not completed.");
    },
  });

  handler.openIframe();
}
