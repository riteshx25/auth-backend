import app from "./app.js";
import ConnectDB from "./db/db.js";

const PORT = process.env.PORT;

if (!PORT) {
  console.error("PORT is not defined in the environment variables.");
  process.exit(1);
}

(async () => {
  try {
    await ConnectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("HTTP Server Error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
})();
