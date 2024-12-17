document.getElementById('registerBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/authn/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    console.log(result);

    if (result.success) {
      localStorage.setItem('email', email);
      alert('Sign-up successful! Proceed to login.');
      window.location.href = 'voice.html';
    } else {
      alert('Error during sign-up.');
    }
  } catch (error) {
    console.error(error);
  }
});
