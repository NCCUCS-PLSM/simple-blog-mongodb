var newPosting = false;

var genCommentHTML = function (comment) {
	return '<div id="' + comment._id + '" class="comment blogpostcomment">\
		<a class="avatar">\
			<img src="./static/avatar.png">\
		</a>\
		<div class="content blogpostcommentcontent">\
			<div><a id="' + comment._id + '-name" class="author">' + comment.name + '</a></div>\
			<div id="' + comment._id + '-content" class="text">' + comment.content + '</div>\
		</div>\
		<div id="' + comment._id + '-actions" class="actions">\
			<a class="edit" onclick="editComment(\'' + comment._id + '\')">Edit</a>\
			<a class="delete" onclick="removeComment(\'' + comment._id + '\')">Delete</a>\
		</div>\
	</div>';
};

var genPostHTML = function (obj) {
	return '<div id="' + obj._id + '" style="margin-bottom: 50px" class="blogpost ui piled segment">\
		<div style="heigth:40px; padding-top:7px; padding-bottom:7px" class="ui blue top attached segment">\
			<h3 id="' + obj._id + '-title">' + obj.title + '</h3>\
		</div>\
		<div style="padding-bottom:7px" class="ui bottom attached segment blogpostblock">\
			<div id="' + obj._id + '-content" class="blogpostcontent">' + obj.content + '</div>\
			<div><button id="' + obj._id + '-confirm" style="display:none" class="ui green small button" onclick="confirmEditPost(\'' + obj._id + '\')">Confirm</button>\
			<button id="' + obj._id + '-cancel" style="display:none" class="ui red small button" onclick="cancelEditPost(\'' + obj._id + '\')">Cancel</button></div>\
			<div id="' + obj._id + '-actions" class="actions" style="font-size:small; margin-top:10px">\
				<a style="cursor:pointer; margin-right: 10px" class="edit" onclick="editPost(\'' + obj._id + '\')">Edit</a>\
				<a style="cursor:pointer" class="delete" onclick="removePost(\'' + obj._id + '\')">Delete</a>\
			</div>\
		</div>\
		<div id="' + obj._id + '-comments" class="ui comments">\
			' +
		(function () {
			var tmp = '';
			obj.comments.reverse().forEach(function (comment) {
				tmp += genCommentHTML(comment);
			});
			return tmp;
		})() +
		'	<div style="margin-top:30px" class="ui pointing below label">\
				Leave a comment\
			</div>\
			<form class="ui reply form">\
				<div class="field" style="margin-bottom: 5px">\
   					<label>User name</label>\
   					<input id="' + obj._id + '-reply-name" type="text">\
 				</div>\
				<div class="field">\
					<label>Content</label>\
					<textarea id="' + obj._id + '-reply-content" style="height: 60px" rows="2"></textarea>\
				</div>\
				<div class="ui primary submit labeled icon button" onclick="replyPost(\'' + obj._id + '\')">\
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
	// C([{
	// 	title: '新的標題',
	// 	content: '新的文章',
	// 	comments: []
	// }], function (data) {
	// 	console.log(data.ops[0]);
	// 	$('#blogposts').prepend(genPostHTML(data.ops[0]));
	// });

	if (newPosting === true) {
		return;
	}

	newPosting = true;

	var tmpObj = {
		_id: 'NEW',
		title: '新的標題',
		content: '新的文章',
		comments: []
	};

	$('#blogposts').prepend(genPostHTML(tmpObj));

	var targetContent = $('#' + tmpObj._id + '-content');
	targetContent.replaceWith($('<textarea id="' + tmpObj._id + '-content" style="width: 100%;">' + targetContent.html() + '</textarea>'));
	var targetTitle = $('#' + tmpObj._id + '-title');
	targetTitle.replaceWith($('<textarea id="' + tmpObj._id + '-title" style="width: 100%;">' + targetTitle.html() + '</textarea>'));
	$('#' + tmpObj._id + '-confirm').show(1);
	$('#' + tmpObj._id + '-cancel').show(1);
	$('#' + tmpObj._id + '-actions').hide(1);
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
	if (id === 'NEW') {
		C({
			title: $('#' + id + '-title').val(),
			content: $('#' + id + '-content').val(),
			comments: []
		}, function (data) {
			$('#' + id).remove();
			updateBlock();
			newPosting = false;
		});
		return;
	}

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
	if (id === 'NEW') {
		$('#' + id).remove();
		newPosting = false;
		return;
	}

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

var replyPost = function (id) {
	var tmpCommentName = $('#' + id + '-reply-name').val();
	var tmpCommentContent = $('#' + id + '-reply-content').val();

	if (tmpCommentName === '') {
		$('#' + id + '-reply-name').val('Please input your name before submit');
	}
	if (tmpCommentContent === '') {
		$('#' + id + '-reply-content').val('Please input some texts before submit');
		return;
	}

	var preparedComment = {
		_id: id + '-comments-' + ((new Date()).getTime()),
		name: tmpCommentName,
		content: tmpCommentContent
	};

	U({
		filter: {
			_id: id
		},
		updateOp: {
			$push: {
				comments: preparedComment
			}
		}
	}, function (data) {
		console.log(data);
		$('#' + id + '-comments').prepend(genCommentHTML(preparedComment));
		$('#' + id + '-reply-name').val('');
		$('#' + id + '-reply-content').val('');
	});
};

var removeComment = function (id) {
	U({
		filter: {},
		updateOp: {
			$pull: {
				comments: {
					_id: id
				}
			}
		}
	}, function (data) {
		console.log(data);
		$('#' + id).remove();
	});
};

var editComment = function (id) {
	$('#' + id + '-actions').hide(1);
	var targetComment = $('#' + id + '-content');
	targetComment.replaceWith($('\
<div id="' + id + '-content" style="margin-top: 10px;" class="ui small action input">\
  <input id="' + id + '-content-input" type="text" value="' + targetComment.text() + '">\
  <input style="display:none" id="' + id + '-content-input-tmp" type="text" value="' + targetComment.text() + '">\
  <button class="ui green button" onclick="confirmEditComment(\'' + id + '\')">Confirm</button>\
  <button class="ui red button" onclick="cancelEditComment(\'' + id + '\')">Cancel</button>\
</div>'));
};

var confirmEditComment = function (id) {
	var targetComment = $('#' + id + '-content');
	var newCommentContent = $('#' + id + '-content-input').val();
	U({
		filter: {
			comments: {
				$elemMatch: {
					_id: id
				}
			}
		},
		updateOp: {
			$set: {
				'comments.$.content': newCommentContent
			}
		}
	}, function (data) {
		console.log(data);
		targetComment.replaceWith($('<div id="' + id + '-content" class="text">' + newCommentContent + '</div>'));
		$('#' + id + '-actions').show(1);
	});
};
var cancelEditComment = function (id) {
	var targetComment = $('#' + id + '-content');
	targetComment.replaceWith($('<div id="' + id + '-content" class="text">' + $('#' + id + '-content-input-tmp').val() + '</div>'));
	$('#' + id + '-actions').show(1);
};
