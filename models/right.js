var mongoose = require('mongoose'),
RightSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Right = new RightSchema({
	id: ObjectId,
	isAdmin:{
		type: Boolean,
		default:false
	},
	canViewUser: {
		type: Boolean,
		default:false
	},
	canEditUser: {
		type: Boolean,
		default:false
	},
	canDeleteUser: {
		type: Boolean,
		default:false
	},
	canViewCompany: {
		type: Boolean,
		default:false
	},
	canEditCompany: {
		type: Boolean,
		default:false
	},
	canDeleteCompany: {
		type: Boolean,
		default:false
	},
	canViewSurvey: {
		type: Boolean,
		default:false
	},
	canEditSurvey: {
		type: Boolean,
		default:false
	},
	canDeleteSurvey: {
		type: Boolean,
		default:false
	},
	canMakeAdmin: {
		type: Boolean,
		default:false
	},
	adminCompanies: [String]
}, {_id: false});

module.exports = mongoose.model('Right', Right);