function Resource () {
	
}

Resource.prototype.toObject = function() {
	var obj = {};
	for (var key in this){
		//prop name that do not start with "_"
		if (this[key] === undefined || this[key] instanceof Function) {
			continue;
		};
		if (/^(?!_.*)/.test(key)) {
			if (this[key] instanceof Array) {
				obj[key] = [];
				for (var i = 0; i < this[key].length; i++) {
					if(this[key][i].hasOwnProperty('toObject')){
						obj[key].push(this[key][i].toObject());
					}else{
						obj[key].push(this[key][i]);
					};
				};
			}else{
				if(this[key].hasOwnProperty('toObject')){
					obj[key] = this[key].toObject();
				}else{
					obj[key] = this[key];
				};
			};
		};
	};
	return obj;
};

module.exports = Resource;