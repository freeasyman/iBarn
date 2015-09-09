var file = file || {};
file.setName = function() {
    id = $('#fileId').val();
    name = $('#newName').val();
    if ($.trim(name) == '') {
        file.error($('#newName'));
        return;
    }
    if (!id) {
        $('#myModal2').modal('hide');
        alert('请选择资源');
        return;
    }
    $.ajax({
        url : 'index.php?a=setName',
        type : 'POST',
        data : {
            id : $('#fileId').val(),
            name : name,
            aname : $('#aname').val()
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(ret) {
            if (ret.code == 1) {
                if (Cookies.get('show') != 'block') {
                    $('#sa_' + id).text(ret.data);
                } else {
                    $('#ba_' + id + ' p').text(ret.data);
                }
                $('#myModal2').modal('hide');
            } else {
                alert(ret.data);
            }
        }
    });
}

file.addFolder = function() {
    fname = $('#folderName').val();
    if ($.trim(fname) == '') {
        file.error($('#folderName'));
        return;
    }
    if (Cookies.get('show') == 'block') {
        type = 1;
    } else {
        type = 0;
    }
    $.ajax({
        url : 'index.php?a=addFolder',
        type : 'POST',
        data : {
            path : $('#path').val(),
            name : fname,
            type : type
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function (ret) {
            if (ret.code == 1) {
                if (!type) {
                    $('#fileList').after($("<div></div>").html(ret.data).text());
                    var ps = $(".listTableIn").position();
                    if (ps) {
                        $(".float_box").css("position", "absolute");
                        $(".float_box").css("right", ps.left); //距离左边距
                        $(".float_box").css("top", + 7); //距离上边距
                    }
                } else {
                    $('.listType').prepend($("<div></div>").html(ret.data).text());
                }
                $('#myModal5').modal('hide');
            } else {
                alert(ret.data);
            }
        }
    });
}

file.del = function() {
    var ids = new Array();
    var delid = $('#delid').val();
    if (delid) {
        idstr = delid;
        ids.push(delid);
    } else {
        if (Cookies.get('show') == 'block') {
            name = 'squaredCheckbox';
        } else {
            name = 'classLists';
        }
        $('input[name="' + name + '"]:checked').each(function(){
            ids.push($(this).val());
        });
        var idstr = ids.join(',');
        if (!idstr) {
            $('#myModal4').modal('hide');
            alert('请选择要删除的资源');
            return;
        }
    }
    $.ajax({
        url : 'index.php?a=delFileMap',
        type : 'POST',
        data : {
            ids : idstr
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(data) {
            if (data.code == 1) {
                if (name == 'classLists') {
                    li = 'li_';
                } else {
                    li = 'bli_';
                }
                $.each(ids, function(i, val) {
                    $('#' + li + val).remove();
                });
                $('#myModal4').modal('hide');
            } else {
                alert('删除失败，请重试');
            }
            $('#delid').val('');
        }
    });
}

file.realDel = function() {
    var ids = new Array();
    $('input[name="classLists"]:checked').each(function(){
        ids.push($(this).val());
    });
    var idstr = ids.join(',');
    if (!idstr) {
        $('#myModal1').modal('hide');
        alert('请选择要删除的资源');
        return;
    }
    $.ajax({
        url : 'index.php?a=delRecycle',
        type : 'POST',
        data : {
            ids : idstr
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(data) {
            if (data.code == 1) {
                $('#myModal1').modal('hide');
                $.each(ids, function(i, val) {
                    $('#li_' + val).remove();
                });
            } else {
                alert('删除失败，请重试');
            }
        }
    });
}

file.recover = function() {
    var ids = new Array();
    $('input[name="classLists"]:checked').each(function(){
        ids.push($(this).val());
    });
    var idstr = ids.join(',');
    if (!idstr) {
        alert('请选择要恢复的资源');
        return;
    }
    $.ajax({
        url : 'index.php?a=recover',
        type : 'POST',
        data : {
            ids : idstr
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(data) {
            if (data.code == 1) {
                $.each(ids, function(i, val) {
                    $('#li_' + val).remove();
                });
            } else {
                alert('还原失败，请重试');
            }
        }
    });
}

file.share = function() {
    id = $('#fileId').val();
    if (!id) {
        $('#myModal').modal('hide');
        alert('请选择要分享的资源');
        return;
    }
    $.ajax({
        url : 'index.php?m=share&a=shares',
        type : 'POST',
        data : {
            id : id,
            pwd : $('#inputPassword').val(),
            price : $('#price').val(),
            overTime : $('#inputDate').val()
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(data) {
            if (data.code == 1) {
                $('#myModal').modal('hide');
                $('input:checkbox[name="classLists"]').prop("checked", false);
                if ($("#a_" + id).length > 0) {
                    $("#a_" + id).prepend('<div class="shareFd"></div>');
                }
                if ($("#d_" + id).length > 0) {
                    $("#d_" + id).prepend('<div class="shareFdBig"></div>');
                }
            } else {
                alert(data.data);
            }
        }
    });
}

file.unShare = function() {
    var ids = new Array();
    $('input[name="classLists"]:checked').each(function(){
        ids.push($(this).val());
    });
    var idstr = ids.join(',');
    if (!idstr) {
        $('#myModal1').modal('hide');
        alert('请选择要取消分享的资源');
        return;
    }
    $.ajax({
        url : 'index.php?m=share&a=unShare',
        type : 'POST',
        data : {
            ids : idstr
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(data) {
            if (data.code == 1) {
                $('#myModal1').modal('hide');
                $.each(ids, function(i, val) {
                    $('#li_' + val).remove();
                });
            } else {
                alert('取消分享失败，请重试');
            }
        }
    });
}

file.collect = function() {
    var ids = new Array();
    id = $('#sid').val();
    if (id) {
        idstr = id;
        ids.push(id);
    } else {
        $('input[name="classLists"]:checked').each(function(){
            ids.push($(this).val());
        });
        var idstr = ids.join(',');
    }
    if (!idstr) {
        $('#myModal1').modal('hide');
        alert('请选择要收藏的资源');
        return;
    }
    $.ajax({
        url : 'index.php?m=collection&a=collect',
        type : 'POST',
        data : {
            ids : idstr
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(res) {
            if (res.code == 1) {
                $('#myModal1').modal('hide');
                $.each(ids, function(i, val) {
                    if ($("#a_" + val).length > 0) {
                        $("#a_" + val).prepend('<i class="icon-star starFd"></i>');
                    }
                });
            } else {
                alert(res.data);
            }
            $('#sid').val('');
        }
    });
}

file.unCollect = function() {
    var ids = new Array();
    $('input[name="classLists"]:checked').each(function(){
        ids.push($(this).val());
    });
    var idstr = ids.join(',');
    if (!idstr) {
        $('#myModal1').modal('hide');
        alert('请选择要取消收藏的资源');
        return;
    }
    $.ajax({
        url : 'index.php?m=collection&a=unCollect',
        type : 'POST',
        data : {
            ids : idstr
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(data) {
            if (data.code == 1) {
                $('#myModal1').modal('hide');
                $.each(ids, function(i, val) {
                    $('#li_' + val).remove();
                });
            } else {
                alert('取消收藏失败，请重试');
            }
        }
    });
}

file.trans = function() {
    var ids = new Array();
    var sid = $('#sid').val();
    if (sid) {
        ids.push(sid);
    } else {
        if (Cookies.get('show') == 'block') {
            name = 'squaredCheckbox';
        } else {
            name = 'classLists';
        }
        $('input[name="' + name + '"]:checked').each(function(){
            ids.push($(this).val());
        });
        var sid = ids.join(',');
        if (!sid) {
            $('#myModal3').modal('hide');
            alert('请选择要移动的资源');
            return;
        }
    }
    did = $('#dirId').val();
    if (did.trim() == '') {
        alert('请选择要转入的目录');
        return false;
    }
    $.ajax({
        url : 'index.php?a=move',
        type : 'POST',
        data : {
            smapId : sid,
            dmapId : did,
            dpath  : $('#dpath').val()
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(ret) {
            if (ret.code == 1) {
                if (sid != did && did != 0 || did == 0 && $('#path').val()) {
                    if (name == 'classLists') {
                        li = 'li_';
                    } else {
                        li = 'bli_';
                    }
                    $.each(ids, function(i, val) {
                        $('#' + li + val).remove();
                    });
                }
                $('#myModal3').modal('hide');
            } else if (ret.code == 3) {
                $('#myModal3').modal('hide');
            } else {
                alert(ret.data);
            }
            $('#sid').val('');
        }
    });
}

file.pwd = function() {
    mapId = $('#mapId').val();
    pwd = $('#pwd').val();
    if (!mapId || !pwd) {
        file.error($('#pwd'));
        return false;
    }
    $.ajax({
        url  : 'index.php?m=share&a=pwd',
        type : 'POST',
        data : {
            mapId : mapId,
            pwd   : pwd
        },
        dataType: 'json',
        timeout: 8000,
        error: function() {
            alert('提交超时，请重试');
        },
        success: function(res) {
            if (res.code == 1) {
                window.location.href = 'index.php?a=own&urlkey=' + res.data.urlkey;
            } else {
                alert(res.data);
            }
        }
    });
}

file.error = function(obj) {
    var oTimer = null;
    var i = 0;
    oTimer = setInterval(function() {
        i++;
        i == 5 ? clearInterval(oTimer) : (i % 2 == 0 ? obj.css("background-color", "#ffffff") : obj.css("background-color", "#ffd4d4"));
    }, 200);
}

file.check = function() {
    if ($.trim($('#search').val()).length < 1) {
        file.error($('#search'));
        return false;
    }
}