import { app } from "./app.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { initContacts } from "./db/initContacts.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initMongoConnection();
  await initContacts();

  app.listen(PORT, () => {
    console.log(`🚀 Server running. Use our API on port: ${PORT}`);
  });
};

startServer();
