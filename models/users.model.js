let mongoose = require("mongoose");
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	name : {
		type: String,
		require: true
	},
    role : {
		type: String,
        enum: ['admin', 'agent', 'leadmanager']
	},
	email: {
		type: String,
		require: true
	},
	mobile: {
		type: String,
		require: true
	},
	country_code: {
		type: String,
		require: true
	},
	password: {
		type: String,
		default: ''
	},
    status: {
        type: Boolean,
		default: true
    },
	agentid : {
		type: mongoose.Types.ObjectId,
		default: null
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null
	}
}, { timestamps: true, strict: false, autoIndex: true });
schema.plugin(mongoosePaginate);
module.exports = schema;