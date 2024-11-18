import { api } from "./openAPI/main";
import { generateData } from "./utils";
import XssAttack from "./xssAttack/main";
import NoSQLInjection from "./NoSQLInjection/main";
import type { AxiosResponse } from "axios";
import { exec } from "child_process";
import path from "path";

const attacks = async (): Promise<void> => {
  for (const attack of [new XssAttack(), new NoSQLInjection()]) {
    for (const path of api.allPaths) {
      await api.sendRequest(path, attack);
    }
  }
};

const rateLimiting = async (): Promise<void> => {
  const RATE_LIMIT = 5;
  const requests: Promise<AxiosResponse<any, any>>[] = [];
  api.allPaths.forEach((path) => {
    const schema = api.getSchemasBodyByPath(path);
    const genData = generateData(schema);
    for (let i = 0; i < RATE_LIMIT; i++) {
      requests.push(api.sendRequest(path, genData));
    }
  });
  await Promise.all(requests);
};

const sqlMap = async (): Promise<void> => {
  const sqlmapPath = path.resolve(__dirname, "../sqlmap-dev/sqlmap.py");
  for (const path of api.allPaths) {
    if (api.isGET_Method(path)) {
      const command = `python3 ${sqlmapPath} -u "${api.createURL_FromSQL(path)}" --level=1 --risk=1 --batch`;
      console.log(command);
      exec(command, (_, stdout) => {
        if (stdout) {
          let filteredOut = stdout.split("\n");
          filteredOut = filteredOut.filter(str => !str.includes("[INFO]"));
          filteredOut = filteredOut.filter(str => !str.includes("[ERROR]"));
          filteredOut = filteredOut.filter(str => !str.includes("[WARNING]"));
          filteredOut = filteredOut.filter(str => !str.includes("[!]"));
          filteredOut = filteredOut.filter(str => !str.includes("[*]"));

          console.log(filteredOut.join("\n"));

          const result = [];
          let betweenMarkers = false;
          for (const str of filteredOut) {
            if (str === "---") {
              betweenMarkers = !betweenMarkers;
              continue;
            }
            if (betweenMarkers) {
              result.push(str);
            }
          }
          filteredOut = result;

          // console.log(stdout);
          return;
        }
      });
    }
  }
};

const main = async (): Promise<void> => {
  await api.initialize();
  await attacks();
  // await rateLimiting();
  // sqlMap();
  api.STATISCTICS.forEach((stat) => console.log(stat.differenceSendTime));
};

main();
