import axios, { type AxiosResponse, type Method } from "axios";
import fs from "fs";

const urlOPENAPI = "http://127.0.0.1:8000/openapi.json";
const urlBase = "http://127.0.0.1:8000";

class OpenAPI {
  SCHEMAS: object;
  SCHEMAS_URL: string;
  BASE_URL: string;

  constructor(urlOPEN_API: string, urlBase: string) {
    this.SCHEMAS_URL = urlOPEN_API;
    this.BASE_URL = urlBase;
    this.SCHEMAS = {};
  }

  async initialize(): Promise<void> {
    this.SCHEMAS = (await axios.get(this.SCHEMAS_URL)).data;
    fs.writeFileSync("openapi.json", JSON.stringify(this.SCHEMAS, null, 2), "utf-8");
  }

  get allPaths(): Array<string> {
    return Object.keys(this.SCHEMAS.paths);
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

  async sendRequest(path: string, data: any): Promise<AxiosResponse<any, any>> {
    return await axios({
      method: this.getHTTP_TypeByPath(path),
      url: urlBase + path,
      data,
    });
  }
}

export const api = new OpenAPI(urlOPENAPI, urlBase);
