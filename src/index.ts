import "reflect-metadata";
import { app } from "./settings";

import ngrok from "@ngrok/ngrok";
import { runDB } from "./db/mongoDB/mongoDB";

const port = process.env.PORT || 5000;
app.set("trust proxy", true);

const startApp = async () => {
  try {
    await runDB();
    app.listen(port, () => {
      console.log(`Express 5 successfully running on port ${port}`);
    });
    try {
      const forwarder = await ngrok.forward({
        addr: `localhost:${port}`,
        authtoken: process.env.NGROK_AUTHTOKEN,
        domain: "treefrog-fun-doberman.ngrok-free.app",
      });

      console.log(`🌐 Outside public link active at: ${forwarder.url()}`);
    } catch (ngrokError) {
      console.error(
        "❌ Ngrok failed to initialize, but local server is safe:",
        ngrokError,
      );
    }
  } catch (criticalError) {
    console.error(
      "💥 Critical startup failure! Application shutting down:",
      criticalError,
    );
    process.exit(1);
  }
};

startApp();
