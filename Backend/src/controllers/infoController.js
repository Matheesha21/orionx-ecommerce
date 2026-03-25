export const getBusinessInfo = (req, res) => {
  res.json({
    company: {
      name: "ORIONX (PVT) LTD",
      about:
        "ORIONX is a premier provider of computer services and electronic devices, specializing in modern tech solutions.",
      contacts: {
        email: "support@orionx.com",
        phone: "+94 11XXXXXXX",
        location: "Sri Lanka",
      },
    },
    policies: {
      privacy:
        "We value your privacy. Your data is encrypted and never sold to third parties.",
      returns:
        "Products can be returned within 7 days if the original seal is intact.",
      shipping: "Island-wide delivery within 3-5 business days.",
    },
    payment_options: [
      "Bank Transfer",
      "Cash on Delivery (COD)",
      "Online Card Payment",
    ],
    faq: [
      {
        q: "Do you offer technical support?",
        a: "Yes, our technicians can assist with computer and printer maintenance.",
      },
      {
        q: "Are the products brand new?",
        a: "All products listed on ORIONX are 100% genuine and brand new unless stated otherwise.",
      },
    ],
  });
};