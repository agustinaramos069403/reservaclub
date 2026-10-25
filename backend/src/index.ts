import { createApplication } from "./app.js";

const DEFAULT_PORT = 3000;
const portValue = process.env.PORT;
const port = portValue === undefined || portValue === "" ? DEFAULT_PORT : Number(portValue);

const application = createApplication();

application.listen(port, () => {
  console.log(`ReservaClub backend listening on port ${port}`);
});
