import { api } from "./openAPI/main";
import { generateData } from "./utils";
import XssAttack from "./xssAttack/main";
import NoSQLInjection from "./NoSQLInjection/main";
import type { AxiosResponse } from "axios";

// Атаки

// await api.initialize();
// const atack = new NoSQLInjection();
// const requests = api.allPaths.map((path) => {
//   const schema = api.getSchemasByPath(path);
//   const genData = generateData(schema, atack);
//   return api.sendRequest(path, genData);
// });
// Promise.all(requests).then((responses) => {
//   responses.forEach((response) => console.log(response.config.url, response.status));
// });

// Rate Limiting Bypass
//
// const RATE_LIMIT = 1;
// await api.initialize();
// const requests: Promise<AxiosResponse<any, any>>[] = [];
// api.allPaths.forEach((path) => {
//   const schema = api.getSchemasByPath(path);
//   const genData = generateData(schema);
//   for (let i = 0; i < RATE_LIMIT; i++) {
//     requests.push(api.sendRequest(path, genData));
//   }
// });
// Promise.all(requests).then((responses) => {
//   responses.forEach((response) => console.log(response.config.url, response.status));
// });

//  Замер времени выполнения и сбор статы
//
// await api.initialize();
// const atack = new NoSQLInjection();
// const requests = api.allPaths.map((path) => {
//   const schema = api.getSchemasByPath(path);
//   const genData = generateData(schema, atack);
//   const startSendTime = Date.now();
//   const req = api.sendRequest(path, genData);
//   api.addStatistics(path, genData, startSendTime);
//   return req;
// });
// Promise.all(requests).then((responses) => {
//   responses.forEach((response) => console.log(response.config.url, response.status));
// });
// console.log(api.allStatistics);