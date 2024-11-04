import { api } from "./openAPI/main";
import { generateData } from "./utils";
import XssAttack from "./xssAttack/main";

(async () => {
  await api.initialize();
  const allPaths = api.allPaths;
  const requests = allPaths.map(async (path) => {
    const xss = new XssAttack();
    const schema = api.getSchemasByPath(path);
    const genData = generateData(schema, xss);
    return await api.sendRequest(path, genData);
  });
  Promise.all(requests).then((responses) => {
    responses.forEach((response) => console.log(response.config.url, response.status));
  });
})();
