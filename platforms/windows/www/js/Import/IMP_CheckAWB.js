
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var flightSeqNo;
var ULDSeqNo;

$(function () {
    $('#txtFltNo').val(amplify.store("flightNo"));
    $('#txtFltDate').val(amplify.store("flightDate"));
    flightSeqNo = amplify.store("flightSeqNo");
    if (flightSeqNo != "") {
        GetULDDetails();
    }
});



function GetULDDetails() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table1').each(function (index) {

                    var ULDId;
                    var ULD;
                    ULDId = $(this).find('ULDId').text();
                    ULD = $(this).find('ULD').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULD);
                    newOption.appendTo('#ddlULDNo');

                    if (index == 0) {
                        ULDSeqNo = ULDId;
                    }

                    amplify.store("flightSeqNo", "")
                    amplify.store("flightNo", "")
                    amplify.store("flightDate", "")

                });

                $(xmlDoc).find('Table2').each(function () {

                    var AWBId;
                    var AWBNo;
                    AWBId = $(this).find('AWBID').text();
                    AWBNo = $(this).find('AWBPrefix').text() + '-' + $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWBNo);
                    newOption.appendTo('#ddlAWBNo');

                });

                $(xmlDoc).find('Table5').each(function () {

                    var AWBId;
                    var AWBNo;
                    DamageCode = $(this).find('DamageCode').text();
                    DamageType = $(this).find('DamageType').text();

                    var newOption = $('<option></option>');
                    newOption.val(DamageCode).text(DamageType);
                    newOption.appendTo('#ddlDamageType');

                });
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function GetAWBDetailsForULD(ULDid) {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    ULDSeqNo = ULDid;

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDid + '</UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                $(ddlAWBNo).empty();

                $(xmlDoc).find('Table2').each(function (index) {                    

                    var AWBId;
                    var AWBNo;
                    AWBId = $(this).find('AWBID').text();
                    AWBNo = $(this).find('AWBPrefix').text() + '-' + $(this).find('AWBNo').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlAWBNo');
                    }                   

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWBNo);
                    newOption.appendTo('#ddlAWBNo');

                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function UpdateAWBDetails() {

    if ($('#txtFltNo').val() == "") {
        //errmsg = "Please enter Arrived Pckgs";
        //$.alert(errmsg);
        return;
    }    

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNo + '</UlDSeqNo><AWBId>' + $('#ddlAWBNo').find('option:selected').val() + '</AWBId><HAWBId>' + $('#ddlHAWBNo').find('option:selected').val() + '</HAWBId><NPR>' + $('#txtArrivedPkgs').val() + '</NPR><DMGPsc></DMGPsc><DMGWt></DMGWt><DMGCode></DMGCode><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "SaveImportMaifestDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
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
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    $.alert($(this).find('StrMessage').text());
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

function GetHAWBDetails(AWBid) {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var UldId = $("#ddlULDNo option:selected").val();

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + UldId + '</UlDSeqNo><AWBId>' + AWBid + '</AWBId><HAWBId></HAWBId><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(ddlHAWBNo).empty();

                $(xmlDoc).find('Table3').each(function (index) {                   

                    var HAWBId;
                    var HAWBNo;
                    HAWBId = $(this).find('HAWBID').text();
                    HAWBNo = $(this).find('HouseNo').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('').text('Select');
                        newOption.appendTo('#ddlHAWBNo');
                    }                   

                    var newOption = $('<option></option>');
                    newOption.val(HAWBId).text(HAWBNo);
                    newOption.appendTo('#ddlHAWBNo');

                });

                $(xmlDoc).find('Table4').each(function () {

                    $('#txtMnifestedPkg').val($(this).find('NPX').text());
                    $('#txtArrivedPkgs').val($(this).find('NPR').text());
                    $('#txtDamagePkgs').val($(this).find('DmgPkgs').text());
                    $('#txtDamageWt').val($(this).find('DmgWt').text());

                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function clearALL() {
    $('#txtIGMNo').val('');
    $('#txtIGMYear').val('');
    $('#txtFlightPrefix').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#txtTotCnts').val('');
    $('#txtManiPieces').val('');
    $('#txtReceivePieces').val('');
    $('#txtManiGrWt').val('');
    $('#txtReceiveGrWt').val('');
    $('#txtShortPieces').val('');
    $('#txtExcessPieces').val('');
    $('#txtDamagePieces').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


