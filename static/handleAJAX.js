var genPostHTML = function (obj) {
	return '<div id="' + obj._id + '" style="margin-bottom: 50px" class="blogpost">\
		<div style="heigth:40px; padding-top:7px; padding-bottom:7px" class="ui blue top attached segment">\
			<h3 id="' + obj._id + '-title">' + obj.title + '</h3>\
		</div>\
		<div style="padding-bottom:7px" class="ui bottom attached segment blogpostblock">\
			<div id="' + obj._id + '-content" class="blogpostcontent">' + obj.content + '</div>\
			<div><button id="' + obj._id + '-confirm" style="display:none" class="ui green small button" onclick="confirmEditPost(\'' + obj._id + '\')">Confirm</button>\
			<button id="' + obj._id + '-cancel" style="display:none" class="ui red small button" onclick="cancelEditPost(\'' + obj._id + '\')">Cancel</button></div>\
			<div class="actions" style="font-size:small; margin-top:10px">\
				<a style="cursor:pointer; margin-right: 10px" class="edit" onclick="editPost(\'' + obj._id + '\')">Edit</a>\
				<a style="cursor:pointer" class="delete" onclick="removePost(\'' + obj._id + '\')">Delete</a>\
			</div>\
		</div>\
		<div class="ui comments">\
			' +
		(function () {
			var tmp = '';
			obj.comments.forEach(function (comment) {
				tmp += '<div id="' + comment._id + '" class="comment blogpostcomment">\
					<a class="avatar">\
						<img src="./static/avatar.png">\
					</a>\
					<div class="content blogpostcommentcontent">\
						<a class="author">Joe Henderson</a>\
						<div class="text">' + comment.content + '</div>\
					</div>\
					<div class="actions">\
						<a class="edit">Edit</a>\
						<a class="delete" onclick="D({\'comments._id\':' + comment._id + '}, null)">Delete</a>\
					</div>\
				</div>';
			});
			return tmp;
		})() +
		'	<div style="margin-top:30px" class="ui pointing below label">\
				Leave a comment\
			</div>\
			<form class="ui reply form">\
				<div class="field">\
					<textarea style="height: 60px" rows="2"></textarea>\
				</div>\
				<div class="ui primary submit labeled icon button">\
					<i class="icon edit"></i> Add Comment\
				</div>\
			</form>\
		</div>\
	</div>';
};

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

var init = function () {
	R({}, function (posts) {
		posts.forEach(function (post) {
			$('#blogposts').prepend(genPostHTML(post));
		});
	});
};

var newPost = function () {
	C([{
		title: '新的標題',
		content: '新的文章',
		comments: []
	}], function (data) {
		console.log(data.ops[0]);
		$('#blogposts').prepend(genPostHTML(data.ops[0]));
	});
};

var removePost = function (id) {
	D({
		_id: id
	}, function (data) {
		$('#' + id).remove();
		console.log(data);
	});
};

var editPost = function (id) {
	var targetContent = $('#' + id + '-content');
	targetContent.replaceWith($('<textarea id="' + id + '-content" style="width: 100%;">' + targetContent.html() + '</textarea>'));
	var targetTitle = $('#' + id + '-title');
	targetTitle.replaceWith($('<textarea id="' + id + '-title" style="width: 100%;">' + targetTitle.html() + '</textarea>'));
	$('#' + id + '-confirm').show(1);
	$('#' + id + '-cancel').show(1);
};

var confirmEditPost = function (id) {
	U({
		filter: {
			_id: id
		},
		updateOp: {
			$set: {
				title: $('#' + id + '-title').val(),
				content: $('#' + id + '-content').val()
			}
		}
	}, function (data) {
		console.log(data);
		var targetContent = $('#' + id + '-content');
		targetContent.replaceWith($('<div id="' + id + '-content" class="blogpostcontent"">' + targetContent.val() + '</div>'));
		var targetTitle = $('#' + id + '-title');
		targetTitle.replaceWith($('<h3 id="' + id + '-title">' + targetTitle.val() + '</h3>'));
		$('#' + id + '-confirm').hide(1);
		$('#' + id + '-cancel').hide(1);
	});
};

var cancelEditPost = function (id) {
	var targetContent = $('#' + id + '-content');
	targetContent.replaceWith($('<div id="' + id + '-content" class="blogpostcontent"">' + targetContent.val() + '</div>'));
	var targetTitle = $('#' + id + '-title');
	targetTitle.replaceWith($('<h3 id="' + id + '-title">' + targetTitle.val() + '</h3>'));
	$('#' + id + '-confirm').hide(1);
	$('#' + id + '-cancel').hide(1);
};

var updateBlock = function () {
	$('#blogposts').empty();
	init();
};
