import { api } from "./openAPI/main";

export const randomString = (min = 10, max = 13): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return Array.from(
    { length: Math.floor(Math.random() * (max - min + 1)) + min },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export const randomInteger = (min = 2, max = 7): number => {
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const otherDigits = Array.from({ length: length - 1 }, () => Math.floor(Math.random() * 10)).join("");
  return Number(firstDigit + otherDigits);
};

export const randomNumber = (min = 1, max = 1000): number => {
  const random = Math.random() * (max - min) + min;
  return parseFloat(random.toFixed(2));
};

export const randomArray = (insertObj: any, min = 2, max = 7): any[] => {
  return Array.from({ length: Math.floor(Math.random() * (max - min + 1)) + min }, () => insertObj);
};

export const randomBoolean = () => {
  return Math.random() < 0.5;
};

export const distributor = (modified: object, defaultF: Function) => {
  if (modified && defaultF.name in modified) {
    return modified[defaultF.name]();
  } else {
    return defaultF();
  }
};

export const generateData = (schema: object, generator?: object): object => {
  schema = schema.properties;
  const newObj = {};
  for (const key in schema) {
    const typeKey = schema[key].type;
    if (typeKey === "string") newObj[key] = distributor(generator, randomString);
    if (typeKey === "integer") newObj[key] = distributor(generator, randomInteger);
    if (typeKey === "number") newObj[key] = distributor(generator, randomNumber);
    if (typeKey === "boolean") newObj[key] = distributor(generator, randomBoolean);
    if (typeKey === "array") newObj[key] = randomArray(generateData(api.getSchemasByRef(schema[key].items.$ref), generator));
    if (!typeKey && randomBoolean()) newObj[key] = generateData(api.getSchemasByRef(schema[key].anyOf[0].$ref), generator);
  }

  return newObj;
};
