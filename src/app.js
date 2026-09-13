import express from "express";

const app = express();

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
