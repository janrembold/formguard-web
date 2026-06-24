import { FORM_ACTION_EXAMPLE } from "./constants";

export const heroSnippet = `<form action="${FORM_ACTION_EXAMPLE}" method="POST">
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Senden</button>
</form>`;

export const htmlSnippet = `<form action="https://www.submit-api.com/f/YOUR_FORM_ID"
      method="POST" enctype="multipart/form-data">
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <input type="file" name="attachment" />
  <button type="submit">Send</button>
</form>`;

export const fetchSnippet = `const form = document.querySelector('#contact');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('https://www.submit-api.com/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new FormData(form),
  });
  const data = await res.json();
  console.log(data.status); // "delivered"
});`;

export const curlSnippet = `curl -X POST https://www.submit-api.com/f/YOUR_FORM_ID \\
  -H "Accept: application/json" \\
  -F "email=jane@example.com" \\
  -F "message=Hello from cURL"`;
