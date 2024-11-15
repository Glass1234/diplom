import axios, { type AxiosResponse, type Method } from "axios";
import winston from "../logger/main";
import fs from "fs";

const urlOPENAPI = "http://127.0.0.1:8000/openapi.json";
const urlBase = "http://127.0.0.1:8000";

class OpenAPI {
  SCHEMAS: object = {};
  SCHEMAS_URL: string;
  BASE_URL: string;
  STATISCTICS: object[] = [];

  constructor(urlOPEN_API: string, urlBase: string) {
    this.SCHEMAS_URL = urlOPEN_API;
    this.BASE_URL = urlBase;
  }

  async initialize(): Promise<void> {
    this.SCHEMAS = (await axios.get(this.SCHEMAS_URL)).data;
    fs.writeFileSync("openapi.json", JSON.stringify(this.SCHEMAS, null, 2), "utf-8");
  }

  get allPaths(): Array<string> {
    return Object.keys(this.SCHEMAS.paths);
  }

  get allStatistics(): object[] {
    return this.STATISCTICS;
  }

  getHTTP_TypeByPath(path: string): Method {
    return Object.keys(this.SCHEMAS.paths[path])[0] as Method;
  }

  getSchemasByRef(ref: string): object {
    ref = ref.split("/").at(-1);
    return this.SCHEMAS.components.schemas[ref];
  }

  getSchemasByPath(path: string): object {
    const httpType = this.getHTTP_TypeByPath(path);
    return this.getSchemasByRef(
      this.SCHEMAS.paths[path][httpType].requestBody.content["application/json"].schema["$ref"]
    );
  }

  addStatistics(path: string, data: object, differenceSendTime: number): object {
    const newObject = { path, data, differenceSendTime};
    this.STATISCTICS.push(newObject);
    return newObject;
  }

  sendRequest(path: string, data: any): Promise<AxiosResponse<any, any>> {
    winston.info(`send ${this.getHTTP_TypeByPath(path)} ${urlBase + path}`);
    const startTime = Date.now();
    console.log('send request');
    return axios({
      method: this.getHTTP_TypeByPath(path),
      url: urlBase + path,
      data,
    }).then((response) => {
      if (response.status < 300 && 199 < response.status)
        winston.info(`get ${response.config.method} ${response.config.url} ${response.status}`);
      else winston.error(`get ${response.config.method} ${response.config.url} ${response.status}`);
      this.addStatistics(response.config.url, data, Date.now() - startTime);
      console.log(Date.now() - startTime);
      return response;
    });
  }
}

export const api = new OpenAPI(urlOPENAPI, urlBase);
