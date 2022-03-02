const baseResponse = require('../models/baseResponseModel');

module.exports =
    errorHandler = fn => async(req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(err => {
                res.status(400).send(new baseResponse(false, err.message));
            });
    };