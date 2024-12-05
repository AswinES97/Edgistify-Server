import http from "node:http";
import { configKeys } from "./config/configKeys.js";
import app from "./app.js";
import connectDb from "./config/dbConfig.js";

const PORT = configKeys.PORT;
const server = http.createServer(app);

async function startServer() {
  await connectDb();
  server.listen(PORT, () => {
    if(configKeys.NODE_ENV === "development"){
      console.log(`listening on http://localhost:${PORT}`);
    }
  });
}

(async () => {
  await startServer();
})();
