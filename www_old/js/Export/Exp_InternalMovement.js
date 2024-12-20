
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var TotPackages;
var OldLocationId;
var OldLocationPieces;

function GetShipmentDetailsForInternalMovement() {

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
            url: CMSserviceURL + "GetExpShipmentDetailsForInternalMovement_PDA",
            data: JSON.stringify({ 'pi_strAWBNo': AWBNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                var str = response.d;
                if (str != null && str != "") {


                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {
                        //debugger;
                        if (index == 0) {
                            $('#txtFromLocation').val($(this).find('LocationCode').text());
                            $('#txtTotalPkg').val($(this).find('LocPieces').text());
                            TotPackages = $(this).find('LocPieces').text();
                            OldLocationId = $(this).find('LocationId').text();
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

function SaveShipmentInternalMovement() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var FromLoc = $('#txtFromLocation').val();
    var TotalPIECESno = $('#txtTotalPkg').val();
    var MovePIECESno = $('#txtMovePackages').val();
    var NewLoc = $('#txtNewLocation').val();


    if (AWBNo == "" || FromLoc == "" || TotalPIECESno == "" || MovePIECESno == "" || NewLoc == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;

    }    

    OldLocationPieces = TotPackages.substr(((TotalPIECESno.length - 1) / 2) + 1);
    if (Number(MovePIECESno) > Number(OldLocationPieces)) {
        errmsg = "Move packages cannot be more than total packages.</br>";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "SaveExpShipmentInternalMovement_PDA",
            data: JSON.stringify({
                'pi_strAWBNo': AWBNo, 'pi_intOldLocId': OldLocationId, 'pi_intOldLocPieces': OldLocationPieces,
                'pi_strNewLoc': NewLoc, 'pi_intNewLocPieces': MovePIECESno, 'pi_strCreatedBy': window.localStorage.getItem("UserName"),
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
    $('#txtFromLocation').val('');
    $('#txtTotalPkg').val('');
    $('#txtMovePackages').val('');
    $('#txtNewLocation').val('');
}

function clearBeforePopulate() {   
    $('#txtFromLocation').val('');
    $('#txtTotalPkg').val('');
    $('#txtMovePackages').val('');
    $('#txtNewLocation').val('');
}


function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

