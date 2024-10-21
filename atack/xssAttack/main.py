import random
from utils import randomInteger

class XssAttack:
    def __generate(self, Ptype):
        firstNum = random.randint(100, 999)
        lastNum = random.randint(100, 999)
        if Ptype == "string":
            return random.choice(
                [
                    f"<script>var a={firstNum}; var b={lastNum}; alert('Sum: ' + (a + b));</script>",
                    "<script>alert('XSS alert!');</script>",
                    "<script>document.body.innerHTML = '<h1>This is a broken page</h1>';</script>",
                ]
            )
        else:
            return None

    def get(self, shemas):
        generateData = {}
        propertyShemas = next(iter(shemas.values()))["properties"]
        for propert in propertyShemas:
            Pkey = propert
            Ptype = propertyShemas[propert]["type"]
            if Ptype == "string":
                generateData[Pkey] = self.__generate(Ptype)
            if Ptype == "integer":
                generateData[Pkey] = randomInteger()
        return generateData

    def check(self,data,responsData):
        total_items = len(data)
        matches = 0
        for key in data:
            for response_key in responsData:
                if str(data[key]) in responsData[response_key]:
                    matches += 1
        return (matches / total_items) * 100