document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const response = await fetch('http://localhost:3000/authn/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();
    if (result.success) {
      localStorage.setItem('email', email);
      alert('Login successful!');
      window.location.href = 'voice.html';
    } else {
      alert(result.message || 'Login failed.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred during login. Please try again.');
  }
});
