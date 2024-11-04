export default class XssAtack {
  strings: string[];
  constructor() {
    this.strings = [
      "<script>var a=1; var b=3; alert('Sum: ' + (a + b));</script>",
      "<script>alert('XSS alert!');</script>",
      "<script>document.body.innerHTML = '<h1>This is a broken page</h1>';</script>",
    ];
  }
  randomString(): string {
    return this.strings[Math.floor(Math.random() * this.strings.length)];
  }
}
