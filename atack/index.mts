import { api } from "./openAPI/main";
import { generateData } from "./utils";
import XssAttack from "./xssAttack/main";
import NoSQLInjection from "./NoSQLInjection/main";
import type { AxiosResponse } from "axios";

const attacks = async (): Promise<void> => {
  const requests = [new XssAttack(), new NoSQLInjection()].flatMap((atack) => {
    return api.allPaths.map((path) => {
      const schema = api.getSchemasByPath(path);
      const genData = generateData(schema, atack);
      return api.sendRequest(path, genData);
    });
  });
  await Promise.all(requests);
};

const rateLimiting = async (): Promise<void> => {
  const RATE_LIMIT = 5;
  const requests: Promise<AxiosResponse<any, any>>[] = [];
  api.allPaths.forEach((path) => {
    const schema = api.getSchemasByPath(path);
    const genData = generateData(schema);
    for (let i = 0; i < RATE_LIMIT; i++) {
      requests.push(api.sendRequest(path, genData));
    }
  });
  await Promise.all(requests);
};

const main = async (): Promise<void> => {
  await api.initialize();
//   await attacks();
  await rateLimiting();
  api.STATISCTICS.forEach((stat) => console.log(stat.differenceSendTime));
};

main();
