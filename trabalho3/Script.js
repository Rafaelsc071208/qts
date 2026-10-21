document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita o recarregamento da página

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (data.success) {
          alert(data.message);
          // Redirecionar para o dashboard
          window.location.href = '/dashboard.html';
      } else {
          alert(data.message);
      }
  } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert('Erro ao conectar ao servidor.');
  }
});