function handleSubmit() {
  const input = document.getElementById('emailInput');
  const email = input.value.trim();

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    input.style.outline = '2px solid red';
    input.focus();
    setTimeout(() => input.style.outline = '', 1200);
    return;
  }

  const FORM_ID = "1FAIpQLSf8QMyFwjl5ZfCnivxi2vWxThQdIkxORKJJj63cwwB1CrPYMg";
  const FIELD_ID = "entry.1567784964";

  const url = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

  // Send data silently
  fetch(`${url}?${FIELD_ID}=${encodeURIComponent(email)}`, {
    method: "POST",
    mode: "no-cors"
  });

  // UI success
  document.getElementById('emailForm').style.display = 'none';
  document.getElementById('successMsg').style.display = 'block';

  input.value = '';
}