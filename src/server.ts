import express from 'express';
import { initializeDatabase } from './db/db';
import { authenticateJWT } from './middleware/auth';
import { loginRoutes } from './routes/login';
import { dashboardRoutes } from './routes/dashboard';
import ApiRoutes from './routes/api';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


initializeDatabase();

// Routes
app.use('/', loginRoutes);
app.use('/dashboard', authenticateJWT, dashboardRoutes);
app.use('/api', ApiRoutes);

app.use('*',(req, res) => {
    res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT} 😎🚀`);
});
