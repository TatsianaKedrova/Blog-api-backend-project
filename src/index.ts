import { runDB } from "./db";
import { app } from "./settings";
import ngrok from "@ngrok/ngrok";

const port = process.env.PORT || 5000;
app.set("trust proxy", true);

const startApp = async () => {
  await runDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  // 4. Fire up ngrok directly from your code!
  const forwarder = await ngrok.forward({
    addr: `localhost:${port}`,
    authtoken: process.env.NGROK_AUTHTOKEN, // Read token securely from your .env file
    domain: "treefrog-fun-doberman.ngrok-free.app",
  });

  console.log(`🌐 Outside public link active at: ${forwarder.url()}`);
};
startApp();
export default app;
