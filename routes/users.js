let express = require("express");
let router = express.Router();
const mongoConnection = require('../utilities/connections');
const responseManager = require('../utilities/response.manager');
const constants = require('../utilities/constants');
const helper = require('../utilities/helper');
const userModel = require('../models/users.model');
const mongoose = require('mongoose');
router.post('/save', helper.authenticateToken, async (req, res) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        const { userid, name, email, role, agentid, mobile, country_code, password, status } = req.body;
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && (userData.role == 'admin' || userData.role == 'agent')){
            if(userid && userid != '' && mongoose.Types.ObjectId.isValid(userid)){
                let existinguser = await primary.model(constants.MODELS.users, userModel).findById(userid);
                if(userData.role == 'admin'){
                    let obj = {
                        name : name,
                        email : email,
                        mobile : mobile,
                        country_code : country_code,
                        status : (status == true) ? true : false,
                        updatedBy : mongoose.Types.ObjectId(req.token.userid)
                    };
                    await primary.model(constants.MODELS.users, userModel).findByIdAndUpdate(userid, obj);
                    return responseManager.onSuccess('User data saved successfully...', 1, res);
                } else if(userData.role == 'agent' && existinguser.role == 'leadmanager'){
                    let obj = {
                        name : name,
                        email : email,
                        mobile : mobile,
                        country_code : country_code,
                        status : (status == true) ? true : false,
                        updatedBy : mongoose.Types.ObjectId(req.token.userid)
                    };
                    await primary.model(constants.MODELS.users, userModel).findByIdAndUpdate(userid, obj);
                    return responseManager.onSuccess('User data saved successfully...', 1, res);
                } else {
                    return responseManager.unauthorisedRequest(res);
                }
            }else{
                if(userData.role == 'admin'){
                    let obj = {
                        name : name,
                        email : email,
                        mobile : mobile,
                        country_code : country_code,
                        role : role,
                        status : (status == true) ? true : false,
                        password : await helper.passwordEncryptor(password),
                        createdBy : mongoose.Types.ObjectId(req.token.userid),
                        updatedBy : mongoose.Types.ObjectId(req.token.userid)
                    };
                    if(agentid && agentid != '' && mongoose.Types.ObjectId.isValid(agentid) && obj.role == 'leadmanager'){
                      obj.agentid = mongoose.Types.ObjectId(agentid);
                    }
                    let insertedObj = await primary.model(constants.MODELS.users, userModel).create(obj);
                    return responseManager.onSuccess('User data saved successfully...', insertedObj, res);
                } else if (userData.role == 'agent' && role == 'leadmanager'){
                    let obj = {
                        name : name,
                        email : email,
                        mobile : mobile,
                        country_code : country_code,
                        role : role,
                        status : (status == true) ? true : false,
                        agentid : mongoose.Types.ObjectId(req.token.userid),
                        password : await helper.passwordEncryptor(password),
                        createdBy : mongoose.Types.ObjectId(req.token.userid),
                        updatedBy : mongoose.Types.ObjectId(req.token.userid)
                    };
                    let insertedObj = await primary.model(constants.MODELS.users, userModel).create(obj);
                    return responseManager.onSuccess('User data saved successfully...', insertedObj, res);
                } else {
                    return responseManager.unauthorisedRequest(res);
                }
            }
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
        const { userid } = req.body;
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && (userData.role == 'admin' || userData.role == 'agent')){
            if(userid && userid != '' && mongoose.Types.ObjectId.isValid(userid)){
                let existinguser = await primary.model(constants.MODELS.users, userModel).findById(userid).populate({path: 'agentid', model: primary.model(constants.MODELS.users, userModel), select: "name email mobile country_code"}).select('-password').lean();
                if(userData.role == 'admin'){
                    return responseManager.onSuccess('User data..', existinguser, res);
                } else if(userData.role == 'agent' && existinguser.role == 'leadmanager' && existinguser.agentid._id.toString() == req.token.userid.toString()){
                    return responseManager.onSuccess('User data..', existinguser, res);
                } else {
                    return responseManager.unauthorisedRequest(res);
                }
            }else{
                return responseManager.unauthorisedRequest(res);
            }
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
module.exports = router;