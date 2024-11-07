import { api } from "./openAPI/main";
import { generateData } from "./utils";
import XssAttack from "./xssAttack/main";
import NoSQLInjection from "./NoSQLInjection/main";

await api.initialize();
const atack = new NoSQLInjection();
const requests = api.allPaths.map((path) => {
  const schema = api.getSchemasByPath(path);
  const genData = generateData(schema, atack);
  return api.sendRequest(path, genData);
});
Promise.all(requests).then((responses) => {
  responses.forEach((response) => console.log(response.config.url, response.status));
});
