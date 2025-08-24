import express from "express";

const app = express();
const PORT = 5000;

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

// Example API route
app.get("/api/projects", (req, res) => {
  res.json([
    { id: 1, title: "Analytics Dashboard", tech: ["React", "Tailwind", "Node"] },
    { id: 2, title: "AI Portfolio Generator", tech: ["Next.js", "Express", "MongoDB"] }
  ]);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
