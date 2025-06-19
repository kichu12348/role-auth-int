import express, { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', (req: AuthRequest, res: Response) => {
  const user = req.user!;
  let dashboardContent = '';

  switch (user.role) {
    case 'admin':
      dashboardContent = `
        <h2>Admin Dashboard</h2>
        <p>Welcome, ${user.username}!</p>
        <p>You have full administrative privileges.</p>
        <button onclick="fetchDashboardData()">Load Admin Data</button>
        <div id="dashboardData"></div>
      `;
      break;
    case 'coach':
      dashboardContent = `
        <h2>Coach Dashboard</h2>
        <p>Welcome, ${user.username}!</p>
        <p>You can manage your team and training schedules.</p>
        <button onclick="fetchDashboardData()">Load Coach Data</button>
        <div id="dashboardData"></div>
      `;
      break;
    case 'player':
      dashboardContent = `
        <h2>Player Dashboard</h2>
        <p>Welcome, ${user.username}!</p>
        <p>You can view your training schedule and performance stats.</p>
        <button onclick="fetchDashboardData()">Load Player Data</button>
        <div id="dashboardData"></div>
      `;
      break;
    default:
      return res.status(403).json({ message: 'Invalid role' });
  }

  const dashboard = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2 { color: #333; }
        button { padding: 10px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer; margin-top: 20px; }
        #dashboardData { margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Dashboard</h1>
      ${dashboardContent}
      <button onclick="logout()">Logout</button>

      <script>
        // Check if token exists, if not redirect to login
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
        }

        function logout() {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }

        async function fetchDashboardData() {
          try {
            const response = await fetch('/api/dashboard', {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              document.getElementById('dashboardData').innerText = JSON.stringify(data, null, 2);
            } else {
              document.getElementById('dashboardData').innerText = 'Failed to load data';
            }
          } catch (error) {
            document.getElementById('dashboardData').innerText = 'Error fetching data';
          }
        }
      </script>
    </body>
    </html>
  `;

  res.send(dashboard);
});

export const dashboardRoutes = router;
