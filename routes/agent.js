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
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && userData.role == 'admin'){
            const { page, limit, search } = req.body;
            await primary.model(constants.MODELS.users, userModel).paginate({
                $or: [
                    { name: { '$regex': new RegExp(search, "i") } },
                    { email: { '$regex': new RegExp(search, "i") } },
                    { mobile: { '$regex': new RegExp(search, "i") } }
                ],
                role : 'agent'
            }, {
                page,
                limit: parseInt(limit),
                sort: { _id: -1 },
                select: 'name role email mobile country_code status createdAt updatedAt last_login_at',
                lean: true
            }).then((agents) => {
                return responseManager.onSuccess('Agent list..', agents, res);
            }).catch((error) => {
                return responseManager.onError(error, res);
            });
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
router.get('/', helper.authenticateToken, async (req, res) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findById(req.token.userid).select('-password').lean();
        if(userData && userData.status == true && userData.role == 'admin'){
            let agentlist = await primary.model(constants.MODELS.users, userModel).find({role : 'agent'}).select('-password').sort({"name" : 1}).lean()
            return responseManager.onSuccess('Agent list..', agentlist, res);
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
module.exports = router;