import server from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 2422;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

startServer();
