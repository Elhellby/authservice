const UserSchema = require("../models/userModel");
const jwt = require("jsonwebtoken");
const key = require("../Utils/generateKey");
const customError = require("../handlers/customErrorHandler");
const baseResponse = require("../models/baseResponseModel");
const crypto = require("../Utils/crypto")
var response = null;

controller = {
  login: customError(async (req, res, next) => {
    const user = new UserSchema(req.body);
    const existUser = await UserSchema.findOne({ email: user.email });
    if (existUser) {
      if (existUser.active) {
        const currenTime = Date.parse(new Date());
        const timeSession = currenTime - existUser.last_login;
        if (!existUser.logged_in || timeSession >= 300000) {
          const validPass = user.password==crypto.decrypt(existUser.password);
          if (validPass) {
            user.password="";
            const token = jwt.sign({ user }, key.getKey());
            await UserSchema.findByIdAndUpdate(existUser.id, {
              last_login: Date.parse(new Date()),
              logged_in: true
            });
            response = new baseResponse(true, "Acceso concedido.", {
              token: token,
              userId: existUser.id
            });
          } else {
            response = new baseResponse(false, "Contraseña incorrecta.");
          }
        } else {
          response = new baseResponse(false, `${user.email} ya cuentas con una sesion abierta. Intentalo nuevamente en 5 minutos.`);
        }
      } else {
        response = new baseResponse(
          false,
          `El usuario ${user.email} esta inactivo.`
        );
      }
    } else {
      response = new baseResponse(false, `El usuario ${user.email} no existe.`);
    }
    res.status(200).json(response);
  }),
  logout: customError(async (req, res, next) => {
    const userId = req.body.userId;
    const existUser = await UserSchema.findById(userId);
    if (existUser.active) {
      await UserSchema.findByIdAndUpdate(userId, { $set: { logged_in: false } });
      response = new baseResponse(
        true,
        `El usuario ${existUser.email} ha cerrado sesion.`
      );
    } else {
      response = new baseResponse(
        true,
        `El usuario ${existUser.email} se encuentra desactivado.`
      );
    }
    res.status(200).json(response);
  }),
  ping: customError(async (req, res, next) => {
    response = new baseResponse(true, "Sesion activa.");
    res.status(200).json(response);
  }),
  register: customError(async (req, res, next) => {
    res.status(200).json(response);
  }),
  encrypt: customError(async (req, res, next) => {
    var data = req.body.data;
    response = new baseResponse(true, "Success.", {
      encryptData: crypto.encrypt(data)
    });
    res.status(200).json(response);
  }),
  decrypt: customError(async (req, res, next) => {
    var data = req.body.data;
    response = new baseResponse(true, "Success.", {
      decryptData: crypto.decrypt(data)
    });
    res.status(200).json(response);
  })
};

module.exports = controller;
