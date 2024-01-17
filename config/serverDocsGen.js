const swaggerAutogen = require("swagger-autogen")();
const outputFile = "../swagger.json";
const endpointsFiles = ["../app/routes/index.js"];

const config = {
  info: {
    title: "Trade API Documentation",
    description: "",
  },
  tags: [],
  host: "localhost:4000/api",
  schemes: ["http", "https"],
};

module.exports = {
  autoGenerateDocumentation: (i) => {
    console.log("Route files changed. Regenerating Swagger documentation...");
    swaggerAutogen(outputFile, endpointsFiles, config);
  },
};
