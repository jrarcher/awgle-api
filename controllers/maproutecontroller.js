exports.mapRoute = function(app, prefix){
	
	prefix = '/' + prefix;

	var prefixObj = require('../controllers' + prefix);

	/*index*/
	app.get(prefix, prefixObj.index);

	/*create*/
	app.post(prefix, prefixObj.create);
	
	/*show*/
	app.get(prefix + '/:id', prefixObj.show);

	/*update*/
	app.put(prefix + '/:id', prefixObj.update);

	/*destroy*/
	app.del(prefix + '/:id', prefixObj.destroy);
};