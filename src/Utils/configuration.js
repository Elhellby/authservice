require('dotenv').config(); 

module.exports={
    getKey(key) {
      return process.env[key];
    }
  };