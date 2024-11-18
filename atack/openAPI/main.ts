import axios, { type AxiosResponse, type Method } from "axios";
import winston from "../logger/main";
import fs from "fs";
import { generateData, generateParams, generatePath } from "../utils";

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

  getSchemasBodyByPath(path: string): object | null {
    const httpType = this.getHTTP_TypeByPath(path);
    try {
      return this.getSchemasByRef(
        this.SCHEMAS.paths[path][httpType].requestBody.content["application/json"].schema["$ref"]
      );
    } catch {
      return null;
    }
  }

  getSchemasParamsByPath(path: string): object | null {
    const httpType = this.getHTTP_TypeByPath(path);
    try {
      return this.SCHEMAS.paths[path][httpType].parameters
        .filter((param: object) => param.in === "query")
        .reduce((acc, item) => {
          acc[item.name] = item.schema.type;
          return acc;
        }, {});
    } catch {
      return null;
    }
  }

  getSchemasPathByPath(path: string): object | null {
    const httpType = this.getHTTP_TypeByPath(path);
    try {
      return this.SCHEMAS.paths[path][httpType].parameters
        .filter((param: object) => param.in === "path")
        .reduce((acc, item) => {
          acc[item.name] = item.schema.type;
          return acc;
        }, {});
    } catch {
      return null;
    }
  }

  addStatistics(path: string, data: object, differenceSendTime: number): object {
    const newObject = { path, data, differenceSendTime };
    this.STATISCTICS.push(newObject);
    return newObject;
  }

  isGET_Method(path: string): boolean {
    return this.getHTTP_TypeByPath(path) === "get";
  }

  createURL_FromSQL(path: string): string {
    let schema = this.getSchemasBodyByPath(path);
    schema = generateData(schema);
    return `${urlBase + path}?${new URLSearchParams(schema).toString()}`;
  }

  async sendRequest(path: string, attack: object): Promise<AxiosResponse<any, any>> {
    // const startTime = Date.now();
    const data = generateData(this.getSchemasBodyByPath(path), attack);
    const params = generateParams(this.getSchemasParamsByPath(path), attack);
    const url = generatePath(this.getSchemasPathByPath(path), this.BASE_URL + path);

    winston.info(`📤 ${this.getHTTP_TypeByPath(path)} ${url}`);

    let send = axios({
      method: this.getHTTP_TypeByPath(path),
      url: url,
      params: params,
      data: data,
    });

    return send.then((response) => {
      if (response.status < 300 && 199 < response.status)
        winston.info(`📥 ${response.status} ${response.config.method} ${response.config.url}`);
      else winston.error(`📥 ${response.status} ${response.config.method} ${response.config.url}`);
      // this.addStatistics(response.config.url, data, Date.now() - startTime);
      return response;
    });
  }
}

export const api = new OpenAPI(urlOPENAPI, urlBase);
