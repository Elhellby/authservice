const UserSchema = require("../models/userModel");
const jwt = require("jsonwebtoken");
const key = require("../Utils/generateKey");
const customError = require("../handlers/customErrorHandler");
const baseResponse = require("../models/baseResponseModel");
const crypto = require("../Utils/crypto")
var response = null;
var httpCode = 200;
controller = {
  login: customError(async (req, res, next) => {
    const user = new UserSchema(req.body);
    const existUser = await UserSchema.findOne({ email: user.email });
    if (existUser) {
      if (existUser.active) {
        const currenTime = Date.parse(new Date());
        const timeSession = currenTime - existUser.last_login;
        if (!existUser.logged_in || timeSession >= 180000) {
          const validPass = user.password == crypto.decrypt(existUser.password);
          if (validPass) {
            user.password = crypto.encrypt(user.password);
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
            httpCode = 401
            response = new baseResponse(false, "Contraseña incorrecta.");
          }
        } else {
          httpCode = 403
          response = new baseResponse(false, `${user.email} ya cuentas con una sesion abierta. Intentalo nuevamente en 5 minutos.`);
        }
      } else {
        httpCode = 403
        response = new baseResponse(
          false,
          `El usuario ${user.email} esta inactivo.`
        );
      }
    } else {
      httpCode = 404
      response = new baseResponse(false, `El usuario ${user.email} no existe.`);
    }
    res.status(httpCode).json(response);
  }),
  logout: customError(async (req, res, next) => {
    const userId = req.params.id;
    const existUser = await UserSchema.findById(userId);
    if (existUser) {
      if (existUser.active) {
        await UserSchema.findByIdAndUpdate(userId, { $set: { logged_in: false } });
        response = new baseResponse(
          true,
          `El usuario ${existUser.email} ha cerrado sesion.`
        );
      } else {
        httpCode = 403
        response = new baseResponse(
          true,
          `El usuario ${existUser.email} se encuentra desactivado.`
        );
      }
    }
    else {
      httpCode = 404
      response = new baseResponse(
        false,
        `Usuario no encontrado.`
      );
    }
    res.status(httpCode).json(response);
  }),
  ping: customError(async (req, res, next) => {
    response = new baseResponse(true, "Servicio disponible.");
    res.status(httpCode).json(response);
  }),
  register: customError(async (req, res, next) => {
    const user = new UserSchema(req.body);
    const existUser = await UserSchema.findOne({ email: user.email });
    if (!existUser) {
      user.active = true;
      user.logged_in = false
      user.password = crypto.encrypt(user.password);
      await user.save()
      response = new baseResponse(true, "Usuario registrado.");
    } else {
      httpCode = 403
      response = new baseResponse(false, "El Usuario ya existe.");
    }
    res.status(httpCode).json(response);
  }),
  activate: customError(async (req, res, next) => {
    const userId = req.params.id;
    const existUser = await UserSchema.findById(userId);
    if (existUser) {
      await UserSchema.findByIdAndUpdate(userId, { $set: { logged_in: false, active: !existUser.active } });
      response = new baseResponse(
        true,
        `El usuario ${existUser.email} se ha ${existUser.active?'desactivado':'activado'}.`
      );
    }
    else {
      httpCode = 404
      response = new baseResponse(
        false,
        `Usuario no encontrado.`
      );
    }
    res.status(httpCode).json(response);
  }),
  encrypt: customError(async (req, res, next) => {
    var data = req.body.textplain;
    response = new baseResponse(true, "Success.", {
      encryptData: crypto.encrypt(data)
    });
    res.status(200).json(response);
  }),
  decrypt: customError(async (req, res, next) => {
    var data = req.body.encrypttext;
    response = new baseResponse(true, "Success.", {
      decryptData: crypto.decrypt(data)
    });
    res.status(200).json(response);
  })
};

module.exports = controller;
