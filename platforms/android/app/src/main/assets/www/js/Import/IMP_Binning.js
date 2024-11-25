(function () {
    document.addEventListener('deviceready', AddLocation, false);
}
)();
function AddLocation() {
    console.log("Location Added");
    //var LocCont = $('#divAddLocation > *').length;
    var no = '0';
    var LocCount;
    if ($('#divAddLocation > *').length > 0) {
        no = parseInt($('#divAddLocation').children().last().attr('id').split('_')[1]) + 1;
    }
    if (no != undefined || no != '') {
        LocCount = no;
    }
    var str = "";
    str = '<div id="loc_' + LocCount + '" class="row panel panel-widget forms-panel form-grids widget-shadow" style="margin-top:5px;">'
    str += '<div class="row">'
    str += '<div class="col-xs-12">'
    str += '<a>'
    //str += '<button class="btn btn-success btn-xs" onclick="RemoveLocation(' + LocCount + ',event );" style="float:right;"><span class="glyphicon glyphicon-remove-circle" style="float: right;color:red;"></span></button>'
    str += '<span class="glyphicon glyphicon-remove-circle" style="float: right;color:red;" onclick="RemoveLocation(' + LocCount + ');"></span>'
    str += '</a>'
    str += '</div>'
    str += '</div>'
    str += '<div class="forms">'
    str += '<div class="form-body">'
    str += '<div class="row">'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-left: 0px;">'
    str += '<label id="lblLocation_' + LocCount + '" for="ddlLocation_' + LocCount + '" class="control-label">Location</label>'
    str += '<select class="form-control" id="ddlLocation_' + LocCount + '">'
    str += '<option value="0">Select</option>'
    str += '</select>'
    str += '</div>'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-left: 0px;">'
    str += '<label id="lblArea_' + LocCount + '" for="txtArea_' + LocCount + '" class="control-label">Area</label>'
    str += '<input id="txtArea_' + LocCount + '" class="form-control" type="text">'
    str += '</div>'
    str += '</div>'
    str += '<div class="row">'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-left: 0px;">'
    str += '<label id="lblTerminal_' + LocCount + '" for="txtTerminal_" class="control-label">Terminal</label>'
    str += '<input id="txtTerminal_' + LocCount + '" class="form-control" type="text">'
    str += '</div>'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-left: 0px;">'
    str += '<label id="lblBinnPkgs_' + LocCount + '" for="txtBinnPkgs_" class="control-label">Binn Pkgs</label>'
    str += '<input id="txtBinnPkgs_' + LocCount + '" class="form-control" type="text">'
    str += '</div>'
    str += '</div>'
    str += '</div>'
    str += '</div>'
    //$('#divAddLocation').append(str);
    //MSApp.execUnsafeLocalFunction(function () {
    //    $('#divAddLocation').append(str);
    //});
    if (typeof (MSApp) !== "undefined") {
        MSApp.execUnsafeLocalFunction(function () {
            $('#divAddLocation').append(str);
        });
    } else {
        $('#divAddLocation').append(str);
    }
}
function RemoveLocation(id) {
    //MSApp.execUnsafeLocalFunction(function () {
    //    $('#loc_' + id).remove();
    //});    
    if (typeof (MSApp) !== "undefined") {
        MSApp.execUnsafeLocalFunction(function () {
            lnv.confirm({
                title: 'Delete',
                content: 'Are you want to delete location??',
                confirmHandler: function () {
                    $('#loc_' + id).remove();
                },
                cancelHandler: function () {
                    // cancel callback
                }
            })
        });
    } else {
        lnv.confirm({
            title: 'Delete',
            content: 'Are you want to delete location??',
            confirmHandler: function () {
                $('#loc_' + id).remove();
            },
            cancelHandler: function () {
                // cancel callback
            }
        })
    }
}