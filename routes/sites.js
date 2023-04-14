let express = require("express");
let router = express.Router();
const mongoConnection = require('../utilities/connections');
const responseManager = require('../utilities/response.manager');
const constants = require('../utilities/constants');
const helper = require('../utilities/helper');
const userModel = require('../models/users.model');
const siteModel = require('../models/sites.model');
const leadModel = require('../models/leads.model');
const mongoose = require('mongoose');
router.post('/', helper.authenticateToken, async (req, res) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        const { page, limit, search } = req.body;
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && userData.role == 'admin'){
            
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
router.post('/create', helper.authenticateToken, async (req, res) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && userData.role == 'admin'){
            console.log('req.body', req.body);
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
router.post('/update', helper.authenticateToken, async (req, res) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && userData.role == 'admin'){
            console.log('req.body', req.body);
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
router.post('/remove', helper.authenticateToken, async (req, res) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && userData.role == 'admin'){
            console.log('req.body', req.body);
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
router.post('/getone', helper.authenticateToken, async (req, res) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && userData.role == 'admin'){
            console.log('req.body', req.body);
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
module.exports = router;