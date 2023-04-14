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
        if(userData && userData.status == true && userData.role == 'admin' || userData.role == 'leadmanager'){
            const { page, limit, search } = req.body;
            if(userData.role == 'admin'){
                await primary.model(constants.MODELS.users, userModel).paginate({
                    $or: [
                        { name: { '$regex': new RegExp(search, "i") } },
                        { email: { '$regex': new RegExp(search, "i") } },
                        { mobile: { '$regex': new RegExp(search, "i") } }
                    ],
                    role : 'leadmanager'
                }, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    populate: [{ path: 'agentid', model: primary.model(constants.MODELS.users, userModel), select: "name email mobile country_code" },{path: 'siteid', model: primary.model(constants.MODELS.sites, siteModel), select: "site_name"}],
                    select: 'name role email mobile country_code status createdAt updatedAt last_login_at agentid',
                    lean: true
                }).then((leadmanagers) => {
                    return responseManager.onSuccess('Lead Manager list..', leadmanagers, res);
                }).catch((error) => {
                    return responseManager.onError(error, res);
                });
            }else if(userData.role == 'leadmanager'){
                await primary.model(constants.MODELS.users, userModel).paginate({
                    $or: [
                        { name: { '$regex': new RegExp(search, "i") } },
                        { email: { '$regex': new RegExp(search, "i") } },
                        { mobile: { '$regex': new RegExp(search, "i") } }
                    ],
                    agentid : new mongoose.Types.ObjectId(req.token.userid),
                    role : 'leadmanager'
                }, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    populate: { path: 'agentid', model: primary.model(constants.MODELS.users, userModel), select: "name email mobile country_code" },
                    select: 'name role email mobile country_code status createdAt updatedAt last_login_at agentid',
                    lean: true
                }).then((leadmanagers) => {
                    return responseManager.onSuccess('Lead Manager list..', leadmanagers, res);
                }).catch((error) => {
                    return responseManager.onError(error, res);
                });
            }
        }else{
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        return responseManager.unauthorisedRequest(res);
    }
});
module.exports = router;