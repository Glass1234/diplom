import winston from "winston";

export default winston.createLogger({
  level: "info", // Уровень логирования
  format: winston.format.combine(
    winston.format.timestamp(), // Добавление временной метки
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "logs/app.log" }), // Логирование в файл
    new winston.transports.Console(), // Логирование в консоль
  ],
});
