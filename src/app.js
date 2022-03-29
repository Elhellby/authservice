const bodyParser = require("body-parser");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const configuration = require("./Utils/configuration")

const app = express();

global.isDev = true;

//#region Data base
mongoose.Promise = global.Promise;
mongoose
  .connect(configuration.getKey('MONGO_SERVER'), {
    useNewUrlParser: true,
    dbName: configuration.getKey("MONGO_DB"),
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(db => {
    console.log("Base de datos conectada");
  })
  .catch(err => {
    console.log(`Error BD => ${err}`);
  });
//#endregion

//#region settings
app.set("port", configuration.getKey('PORT') || 3000);
//#endregion

//#region middelware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: configuration.getKey('JSON_LIMIT'), extended: true }))
app.use(bodyParser.urlencoded({ limit: configuration.getKey('JSON_LIMIT'), extended: true }))
app.use(cors());

//#endregion

//#region routes
app.use(require("./routes/configRoute"));
//#endregion

//error handlers
// app.use(require("./handlers/pathErrorHandelr"));

//#region start the server
app.listen(app.get("port"), () => {
  console.log(`SERVER iniciado en el puerto ${app.get("port")}`);
});
//#endregion