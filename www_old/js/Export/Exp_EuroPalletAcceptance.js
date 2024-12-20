
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var AWBid;

var d = new Date(),
    n = d.getMonth() + 1,
    y = d.getFullYear()
t = d.getDate();

function GetShipmentDetailsForTDG() {

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

    if (n < Number(10))
        n = '0' + n;
    if (t < Number(10))
        t = '0' + t;


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetShipmentDetailsforTDGAcceptance_PDA",
            data: JSON.stringify({ 'pi_strNumber': AWBNo, 'pi_strMode': 'A' }),
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
                            AWBid = $(this).find('AWBId').text();
                            $('#txtSlotNo').val($(this).find('SlotNo').text());
                            $('#txtSlotTime').val($(this).find('SlotNo').text().slice(-4));
                            $('#txtFlightNo').val($(this).find('FlightNo').text());
                            $('#txtFlightDate').val($(this).find('FlightDt').text());
                            $('#txtDestination').val($(this).find('Destination').text());
                            $('#txtPackages').val($(this).find('Pieces').text());
                            $('#txtGrossWt').val($(this).find('GrWt').text());
                            $('#txtchrgWt').val($(this).find('ChWt').text());
                        }
                    });
                    $(xmlDoc).find('Table').each(function () {
                        if ($(this).find('OutMsg').text().length > Number(5)) {
                            $.alert($(this).find('OutMsg').text());
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

function SaveTDGDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var TotalPIECESno = $('#txtPackages').val();
    var GrossWt = $('#txtGrossWt').val();
    var ChargablWt = $('#txtchrgWt').val();
    var EuroPalletNo = $('#txtEuroPalletNo').val();
    var ReceivedPieces = $('#txtReceivedPkgs').val();


    if (TotalPIECESno == "" || GrossWt == "" || ChargablWt == "" || ReceivedPieces == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;

    }

    if (EuroPalletNo = "") {
        EuroPalletNo = '0';
    }


    var xml = "";
    xml = '<TDGInfo><TDGDetail ALRowId="' + AWBid + '" ScannedPkgs="' + ReceivedPieces + '" ScannedGrossWt="' + GrossWt + '" VolumetricWt="' + ChargablWt + '" EuroPalletNo="' + EuroPalletNo + '" IsPalletWiseScan="1" CreatedBy="' + window.localStorage.getItem("UserName") + '" Remarks="" TDGDate="' + n + "/" + t + "/" + y + '"/></TDGInfo>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "CreatePartTDGAcceptance_PDA",
            data: JSON.stringify({
                'pi_strTDGDetails': xml, 'pi_strMode': "false",
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
                var str = response.d

                var xmlDoc = $.parseXML(str);
                $(xmlDoc).find('Table').each(function (index) {
                    if (index == 0) {
                        if (($(this).find('OutMsg').text()).length < Number(5))
                            $.alert('Data saved successfully');
                        else
                            $.alert($(this).find('OutMsg').text());
                    }
                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function GetPendingPieces() {

    if (Number($('#txtReceivedPkgs').val()) > Number($('#txtPackages').val())) {
        $.alert("Received packages cannot be more than total packages.</br>");
        $('#txtPendingPkgs').val('');
        return;
    }
    var pendingPckgs = $('#txtPackages').val() - $('#txtReceivedPkgs').val();
    $('#txtPendingPkgs').val(pendingPckgs);

}

function clearALL() {
    $('#txtEuroPalletNo').val('');
    $('#txtAWBNo').val('');
    $('#txtSlotNo').val('');
    $('#txtSlotTime').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#txtPackages').val('');
    $('#txtGrossWt').val('');
    $('#txtchrgWt').val('');
    $('#txtReceivedPkgs').val('');
    $('#txtPendingPkgs').val('');
    $('#txtDestination').val('');
}

function clearBeforePopulate() {
    $('#txtEuroPalletNo').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#txtPackages').val('');
    $('#txtGrossWt').val('');
    $('#txtchrgWt').val('');
    $('#txtReceivedPkgs').val('');
    $('#txtPendingPkgs').val('');
    $('#txtDestination').val('');
}


function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

