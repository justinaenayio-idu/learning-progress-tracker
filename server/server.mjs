import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const topics = [
  {
    id: 1,
    title: "Understanding components",
    category: "React",
    status: "Completed",
  },
  {
    id: 2,
    title: "Passing data through props",
    category: "React",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Understanding state",
    category: "React",
    status: "Not Started",
  },
];

app.get("/api/topics", (_req, res) => {
  res.json(topics);
});

app.get("/api/health", (_req, res) => {
  res.json({ message: "Backend is running" });
});

app.post("/api/topics", (req, res) => {
  const { title, category } = req.body ?? {};

  const allowedCategories = ["React", "JavaScript", "Node.js"];

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Please enter a topic title.",
    });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      message: "Please select a valid category.",
    });
  }

  const newTopic = {
    id: randomUUID(),
    title: title.trim(),
    category,
    status: "Not Started",
  };

  topics.push(newTopic);

  return res.status(201).json(newTopic);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
