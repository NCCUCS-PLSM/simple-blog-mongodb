var C = function (data, callback) {
	$.ajax({
		url: './api?' + $.param({
			jsonstring: JSON.stringify(data)
		}),
		type: 'POST',
		success: callback
	});
};

var R = function (data, callback) {
	$.ajax({
		url: './api?' + $.param(data),
		type: 'GET',
		success: callback
	});
};

var U = function (data, callback) {
	$.ajax({
		url: './api?' + $.param(data),
		type: 'PUT',
		success: callback
	});
};

var D = function (data, callback) {
	$.ajax({
		url: './api?' + $.param(data),
		type: 'DELETE',
		success: callback
	});
};
