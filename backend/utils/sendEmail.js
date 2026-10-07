// Sends an email through Brevo's HTTP API (SMTP ports are blocked on Render's free plan)
async function sendEmail(to, subject, text) {
  const key = process.env.BREVO_API_KEY;

  // Without a key (for example on your laptop) just print the email in the terminal
  if (!key) {
    console.log("Email not configured. Would send to " + to + "\n" + subject + "\n" + text);
    return;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": key,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Bunkwise", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error("Brevo error: " + body);
  }
}

module.exports = { sendEmail };