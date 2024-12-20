
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");

(function () {
    document.addEventListener("deviceready", OnPageLoad, false);
})();

var LocationId;
function OnPageLoad() {
    var Query = window.location.search;

    var ScanLocation = "";
    if ((Query.split('&')[0].split('=')[1]).toString() == "divGateIn") {
        ScanLocation = "Gate In";
        LocationId = 2;
    }
    else if ((Query.split('&')[0].split('=')[1]).toString() == "divDockIn") {
        ScanLocation = "Dock In";
        LocationId = 3;
    }
    else if ((Query.split('&')[0].split('=')[1]).toString() == "divDockOut") {
        ScanLocation = "Dock Out";
        LocationId = 4;
    }
    else if ((Query.split('&')[0].split('=')[1]).toString() == "divGateOut") {
        ScanLocation = "Gate Out";
        LocationId = 5;
    }
    $('#txtScanLoc').val(ScanLocation);
}

function GetLocationScanDetails() {

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var TokenNo = $('#txtTokenNo').val();

    if (TokenNo == '') {
        errmsg = "Please enter Token No.";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetExpVehicelTokenScanDetails_PDA",
            data: JSON.stringify({ 'pi_strTokenNo': TokenNo, 'pi_intLoc': LocationId }),
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
                        if (index == 0) {
                            $('#txtAWBNo').val($(this).find('AWBNo').text());
                            $('#txtTSPNo').val($(this).find('TSPNo').text());
                            $('#txtPieces').val($(this).find('TotPieces').text());
                            $('#txtWeight').val($(this).find('TotGrWt').text());
                            $('#txtVehicleNo').val($(this).find('VehicleNo').text());
                            $('#txtDriverName').val($(this).find('DriverName').text());
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

function SaveLocationScanDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var TotalPIECESno = $('#txtPieces').val();
    var Area = $('#txtZone').val();
    var Location = $('#txtLocation').val();

    if (Area == "") {
        Area = 'Area1';
    }

    if (Location == "") {
        Location = 'LOC1';
    }


    if (AWBNo == "" || TotalPIECESno == "") {

        errmsg = "Please enter all the required fields.</br> AWB No/Pieces/Zone/Location";
        $.alert(errmsg);
        return;

    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "CreateShipmentLocation_PDA",
            data: JSON.stringify({
                'pi_strAWBNo': AWBNo, 'pi_strTerminal': 'Terminal1', 'pi_strArea': Area,
                'pi_strLoc': Location, 'pi_strLocPieces': TotalPIECESno, 'pi_bitIsPalletWiseScan': 'true',
                'pi_strEuroPalletNo': '1234', 'pi_strCreatedby': window.localStorage.getItem("UserName")
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
                //$.alert('Details saved successfully');                
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
    $('#txtTokenNo').val('');
    $('#txtAWBNo').val('');
    $('#txtTSPNo').val('');
    $('#txtPieces').val('');
    $('#txtWeight').val('');
    $('#txtVehicleNo').val('');
    $('#txtDriverName').val('');
    $('#txtZone').val('');
    $('#txtGateNo').val('');
    $('#txtLocation').val('');
}

function clearBeforePopulate() {    
    $('#txtAWBNo').val('');
    $('#txtTSPNo').val('');
    $('#txtPieces').val('');
    $('#txtWeight').val('');
    $('#txtVehicleNo').val('');
    $('#txtDriverName').val('');
    $('#txtZone').val('');
    $('#txtGateNo').val('');
    $('#txtLocation').val('');
}