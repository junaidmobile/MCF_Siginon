
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");

(function () {
    document.addEventListener('deviceready', AddLocation, false);
}
)();

var TotPackages;
var OldLocationPieces;

function GetShipmentLocation() {

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();

    if (AWBNo == '') {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if (AWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }



    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetShipmentLocationDetails_PDA",
            data: JSON.stringify({ 'pi_strMAWBNo': AWBNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                $("body").mLoading('hide');
                var str = response.d;
                if (str != null && str != "") {


                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {
                        //debugger;
                        if (index == 0) {
                            $('#txtCommodity').val($(this).find('CommodityDesc').text());
                            $('#txtTotalPkg').val($(this).find('LocPieces').text());
                            $('#txtLocation_0').val($(this).find('LocCode').text());
                            $('#txtArea_0').val($(this).find('Area').text());
                            $('#txtTerminal_0').val($(this).find('Shed').text());
                            TotPackages = $(this).find('LocPieces').text();
                        }
                    });

                }
                else {
                    errmsg = 'Shipment does not exists';
                    $.alert(errmsg);
                }

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
    }
    else if (connectionStatus == "offline") {
        $("body").mLoading('hide');
        $.alert('No Internet Connection!');
    }
    else if (errmsg != "") {
        $("body").mLoading('hide');
        $.alert(errmsg);
    }
    else {
        $("body").mLoading('hide');
    }
}

function SaveShipmentLocation() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var TotalPIECESno = $('#txtTotalPkg').val();
    var Location = $('#txtLocation_0').val();
    var Area = $('#txtArea_0').val();
    var Terminal = $('#txtTerminal_0').val();
    var BinnPckgs = $('#txtBinnPkgs_0').val();


    if (AWBNo == "" || TotalPIECESno == "" || Location == "" || Area == "" || Terminal == "" || BinnPckgs == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;

    }

    OldLocationPieces = TotalPIECESno.substr(((TotalPIECESno.length - 1) / 2) + 1);
    if (Number(BinnPckgs) > Number(OldLocationPieces)) {
        errmsg = "Binn packages cannot be more than total packages.</br>";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "CreateShipmentLocation_PDA",
            data: JSON.stringify({
                'pi_strAWBNo': AWBNo, 'pi_strTerminal': Terminal, 'pi_strArea': Area,
                'pi_strLoc': Location, 'pi_strLocPieces': BinnPckgs, 'pi_strCreatedby': window.localStorage.getItem("UserName"),
                'pi_bitIsPalletWiseScan': 'false', 'pi_strEuroPalletNo': '',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Please Wait..",
                });
            },
            success: function (response) {
                $("body").mLoading('hide');
                $.alert(response.d);
                //window.location.reload();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function clearALL() {
    $('#txtAWBNo').val('');
    $('#txtCommodity').val('');
    $('#txtTotalPkg').val('');
    $('#txtLocation_0').val('');
    $('#txtArea_0').val('');
    $('#txtTerminal_0').val('');
    $('#txtBinnPkgs_0').val('');

}

function clearBeforePopulate() {    
    $('#txtLocation_0').val('');
    $('#txtArea_0').val('');
    $('#txtTerminal_0').val('');
    $('#txtBinnPkgs_0').val('');

}


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
    //str += '<span class="glyphicon glyphicon-remove-circle" style="float: right;color:red;" onclick="RemoveLocation(' + LocCount + ');"></span>'
    str += '</a>'
    str += '</div>'
    str += '</div>'
    str += '<div class="forms">'
    str += '<div class="form-body">'
    str += '<div class="row form-group" style="margin-bottom: 0px;">'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-left: 0px;">'
    str += '<label id="lblLocation_' + LocCount + '" for="txtLocation_' + LocCount + '" class="control-label">Location</label>'
    str += '<font color="red">*</font>'
    //str += '<select class="form-control" id="ddlLocation_' + LocCount + '">'
    str += '<input id="txtLocation_' + LocCount + '" class="form-control" type="text" maxlength="20">'
    //str += '<option value="0">Select</option>'
    //str += '</select>'
    str += '</div>'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-right: 0px;">'
    str += '<label id="lblArea_' + LocCount + '" for="txtArea_' + LocCount + '" class="control-label">Area</label>'
    str += '<font color="red">*</font>'
    str += '<input id="txtArea_' + LocCount + '" class="form-control" type="text" maxlength="20">'
    str += '</div>'
    str += '</div>'
    str += '<div class="row form-group" style="margin-bottom: 0px;">'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-left: 0px;">'
    str += '<label id="lblTerminal_' + LocCount + '" for="txtTerminal_" class="control-label">Terminal</label>'
    str += '<font color="red">*</font>'
    str += '<input id="txtTerminal_' + LocCount + '" class="form-control" type="text" maxlength="20">'
    str += '</div>'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-right: 0px;">'
    str += '<label id="lblBinnPkgs_' + LocCount + '" for="txtBinnPkgs_" class="control-label">Binn Pkgs</label>'
    str += '<font color="red">*</font>'
    str += '<input id="txtBinnPkgs_' + LocCount + '" class="form-control" type="number" style="text-align:right;" max="9999999">'
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