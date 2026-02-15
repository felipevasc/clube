import { loadDotEnv } from "../../_shared/dotenv.js";
import { makeApp } from "./http.js";
import { registerRoutes } from "./routes.js";

loadDotEnv();

const PORT = Number(process.env.PORT || 3004);

const app = makeApp();
registerRoutes(app);

app.listen(PORT, () => console.log(`[feed] listening on :${PORT}`));
