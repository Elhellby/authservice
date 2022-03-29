const express = require('express');
const baseResponse=require('../models/baseResponseModel');
const router = express();
const message='La ruta no es valida';

wrapAsync=(fn) =>{
    return  (req, res, next) =>{
        fn(req, res, next).catch(next);
    };
}

router.get('*', wrapAsync(async (req, res) => {
    await new Promise(resolve => setTimeout(() => resolve(), 50));
    throw new Error(message);
}));
router.post('*', wrapAsync(async (req, res) => {
    await new Promise(resolve => setTimeout(() => resolve(), 50));
    throw new Error(message);
}));
router.patch('*', wrapAsync(async (req, res) => {
    await new Promise(resolve => setTimeout(() => resolve(), 50));
    throw new Error(message);
}));

router.use((error, req, res, next) => {
    res.status(404).send(new baseResponse(false, error.message));
});

module.exports = router;