let express = require("express");
let router = express.Router();
const mongoConnection = require('../utilities/connections');
const responseManager = require('../utilities/response.manager');
const constants = require('../utilities/constants');
const helper = require('../utilities/helper');
const userModel = require('../models/users.model');
router.post('/', async (req, res) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { email, password } = req.body;
    if(email && password && password.length >= 6 && (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userData = await primary.model(constants.MODELS.users, userModel).findOne({email: email}).lean();
        if(userData && userData != null && userData.status == true){
            let decPassword = await helper.passwordDecryptor(userData.password);
            if(decPassword == password){
                let accessToken = await helper.generateAccessToken({ userid : userData._id.toString() });
                await primary.model(constants.MODELS.users, userModel).findByIdAndUpdate(userData._id, {last_login_at : Date.now()});
                return responseManager.onSuccess('User login successfully!', {token : accessToken}, res);
            }else{
                return responseManager.badrequest({message : 'Invalid password, please try again'}, res);
            }
        }else{
            return responseManager.badrequest({message : 'Invalid username or password please try again'}, res);
        }
    }else{
        return responseManager.badrequest({message : 'Invalid username or password please try again'}, res);
    } 
});
module.exports = router;