const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const _nameModel = "users";

const userSchema = new Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  last_login: {
    type: Date
  },
  active: {
    type: Boolean
  },
  logged_in: {
    type: Boolean
  }
});

// userSchema.methods.encryptPassword = async password => {
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);
//   return hash;
// };

// userSchema.methods.matchPassword = async function(password, encryptPassword) {
//   return await bcrypt.compare(password, encryptPassword);
// };

// userSchema.methods.authenticate = async function(name, password) {
//   var existsUser = await this.model(_nameModel).findOne({ name: name });
//   const currenTime = Date.parse(new Date());
//   if (existsUser) {
//     const validPass = await this.matchPassword(password, existsUser.password);
//     if (validPass) {
//       const timeSession = currenTime - existsUser.last_login;
//       if (timeSession >= 240000) {
//         return {
//           status: false,
//           message: "Termino el tiempo maximo de la sesión."
//         };
//       } else if (timeSession >= 180000 && timeSession <= 240000) {
//         await this.model(_nameModel).findByIdAndUpdate(existsUser.id, {
//           last_login: Date.parse(new Date())
//         });
//         return { status: true, message: "Renicio la sesión." };
//       } else {
//         return { status: true, message: "Continua abierta la sesión." };
//       }
//     } else {
//       return { status: false, message: "Acceso denegado." };
//     }
//   } else {
//     return { status: false, message: "Acceso denegado." };
//   }
// };

module.exports = mongoose.model(_nameModel, userSchema);
