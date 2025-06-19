import express from "express";
const router = express.Router();
import { AuthRequest, authenticateJWT } from "../middleware/auth";
import { Response, Request } from "express";
import { generateToken } from "../middleware/auth";
import { findUserByUsername } from "../db/db";

router.get("/dashboard", authenticateJWT, (req: AuthRequest, res: Response) => {
  const user = req.user!;

  let data;
  switch (user.role) {
    case "admin":
      data = {
        stats: {
          users: 45,
          activeUsers: 32,
          coaches: 5,
          players: 40,
        },
        recentActions: [
          { action: "User Added", time: "Today, 10:30 AM" },
          { action: "Permission Updated", time: "Yesterday, 2:15 PM" },
        ],
      };
      break;
    case "coach":
      data = {
        team: {
          name: "Eagles",
          playerCount: 15,
        },
        upcomingTraining: [
          { date: "2023-07-15", time: "10:00 AM", focus: "Defense" },
          { date: "2023-07-18", time: "2:00 PM", focus: "Tactics" },
        ],
      };
      break;
    case "player":
      data = {
        performance: {
          rating: 8.5,
          attendance: "90%",
          fitness: "Excellent",
        },
        upcomingTraining: [
          { date: "2023-07-15", time: "10:00 AM", focus: "Defense" },
          { date: "2023-07-18", time: "2:00 PM", focus: "Tactics" },
        ],
      };
      break;
    default:
      return res.status(403).json({ message: "Invalid role" });
  }

  res.json({ user: { username: user.username, role: user.role }, data });
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = findUserByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
