const UserSchema = require("../models/userModel");
const express = require("express");
const jwt = require("jsonwebtoken");
const key = require("../Utils/generateKey");
const app = express();



//#region Funcion que valida el token
validaToken = (req, res, next) => {
  const urlReq = req.url;
  if (urlReq == "/login" || urlReq == '/register') {
    next();
  } else {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader != "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(bearerToken, key.getKey(), async (error, usr) => {
        if (usr != undefined) {
          const userModel = new UserSchema(usr.user);
          const validUser = await userModel.authenticate(
            userModel.email,
            userModel.password
          );
          if (validUser.status) {
            next();
          } else {
            res.status(403).json(validUser);
          }
        } else {
          res.status(403).json({ success: false, message: "Acceso denegado" });
        }
      });
    } else {
      res.status(403).json({ success: false, message: "Acceso denegado" });
    }
  }
};
//#endregion

//#region Rutas del api
app.use('/api/auth', validaToken, require("../routes/securityRoute"));
//#endregion

module.exports = app;
