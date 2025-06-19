import express, { Request, Response } from "express";

const router = express.Router();

router.get("/login", (req: Request, res: Response) => {
  const loginForm = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 8px; box-sizing: border-box; }
        button { padding: 10px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
        .error { color: red; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>Login</h1>
      <div id="errorMessage" class="error"></div>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
      </div>
      <button onclick="login()">Login</button>

      <script>
        async function login() {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          
          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              localStorage.setItem('token', data.token);
              window.location.href = '/dashboard';
            } else {
              document.getElementById('errorMessage').textContent = data.message;
            }
          } catch (error) {
            document.getElementById('errorMessage').textContent = 'An error occurred during login';
          }
        }
      </script>
    </body>
    </html>
  `;

  res.send(loginForm);
});


export const loginRoutes = router;
