//document.addEventListener("deviceready", GetCommodityList, false);

var GHAExportFlightserviceURL = window.localStorage.getItem("GHAExportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var FlightSeqNo;


$(function () {

    var formattedDate = new Date();
    var d = formattedDate.getDate();
    if (d.toString().length < Number(2))
        d = '0' + d;
    var m = formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    if (m.toString().length < Number(2))
        m = '0' + m;
    var y = formattedDate.getFullYear();
    var date = y.toString() + m.toString() + d.toString();
    $('#txtGPNo1').val(date);

});

function GetGPStatus() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if ($('#txtGPNo1').val() == "" || $('#txtGPNo2').val() == "") {
        errmsg = "Please enter GP No.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtGPNo1').val().length != '8' || $('#txtGPNo2').val().length != '4') {
        errmsg = "Please enter valid GP No.";
        $.alert(errmsg);
        return;
    }

    var inputXML = '<Root><GatePassNo>' + $('#txtGPNo1').val() + $('#txtGPNo2').val() + '</GatePassNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetgatePassDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table1').each(function () {

                    $('#txtReleasedULD').val($(this).find('ULDCount').text());
                    $('#txtPendingULD').val($(this).find('PendingULD').text());
                    $('#txtReleasedAWB').val($(this).find('AWBCount').text());
                    $('#txtPendingAWB').val($(this).find('PendingAWB').text());
                });

            },
            error: function (msg) {
                //debugger;
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

function GetULDsToRelease() {

    $('#ddlULD').empty();

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><GPNo>' + $('#txtGPNo1').val() + $('#txtGPNo2').val() + '</GPNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "UnReleaseULDDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table1').each(function (index) {

                    var ULDId;
                    var ULDNo;

                    ULDId = $(this).find('ULDSeqNo').text();
                    ULDNo = $(this).find('ULD').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULDNo);
                    newOption.appendTo('#ddlULD');
                });

            },
            error: function (msg) {
                //debugger;
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

function GetBULKToRelease() {

    $('#ddlAWB').empty();

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><GPNo>' + $('#txtGPNo1').val() + $('#txtGPNo2').val() + '</GPNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "UnReleaseBULKDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table1').each(function (index) {

                    var AWBId;
                    var AWBNo;

                    AWBId = $(this).find('NOP').text();
                    AWBNo = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWBNo);
                    newOption.appendTo('#ddlAWB');

                    if (index == 0) {
                        $('#txtTotPkgs').val($(this).find('NOP').text());
                        FlightSeqNo = $(this).find('FltSeqNo').text();
                    }
                });

            },
            error: function (msg) {
                //debugger;
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

function ReleaseULD() {

    if ($('#ddlULD').find('option:selected').text() == "" || $('#ddlULD').find('option:selected').text() == "Select") {
        errmsg = "ULD not selected";
        $.alert(errmsg);
        return;
    }


    var ULDseqNo = $('#ddlULD').find('option:selected').val();

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><ULDSeqNo>' + ULDseqNo + '</ULDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "UpdateULDRelease",
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

function ReleaseBulkAWB() {

    if ($('#txtReleasePkgs').val() == "") {
        errmsg = "Please enter packages to release";
        $.alert(errmsg);
        return;
    }

    if (Number($('#txtReleasePkgs').val()) > Number($('#txtTotPkgs').val())) {
        errmsg = "Release pkgs cannot be more than total pkgs";
        $.alert(errmsg);
        return;
    }

    var AWBprefix = $('#ddlAWB').find('option:selected').text().substring(0, 3);
    var AWBNo = $('#ddlAWB').find('option:selected').text().substring(4);

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><AWBPre>' + AWBprefix + '</AWBPre><AWBNo>' + AWBNo + '</AWBNo><RPKG>' + $('#txtReleasePkgs').val() + '</RPKG><FltSeqNo>' + FlightSeqNo + '</FltSeqNo><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "UpdateBULKAWBRelease",
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

function ShowReleaseULDGrid() {

    if ($('#txtGPNo1').val() == "" || $('#txtGPNo2').val() == "") {
        errmsg = "Please enter GP No.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtGPNo1').val().length != '8' || $('#txtGPNo2').val().length != '4') {
        errmsg = "Please enter valid GP No.";
        $.alert(errmsg);
        return;
    }

    GetULDsToRelease();

    $("#divReleaseBulk").hide();
    $("#divReleaseULD").show();

}

function ShowReleaseBulkGrid() {

    if ($('#txtGPNo1').val() == "" || $('#txtGPNo2').val() == "") {
        errmsg = "Please enter GP No.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtGPNo1').val().length != '8' || $('#txtGPNo2').val().length != '4') {
        errmsg = "Please enter valid GP No.";
        $.alert(errmsg);
        return;

        $('#txtTotPkgs').val('');
        $('#txtReleasePkgs').val('');
    }

    GetBULKToRelease();

    $("#divReleaseULD").hide();
    $("#divReleaseBulk").show();
}

function ShowTotalPkgsForAWB(AWBid) {
    $('#txtTotPkgs').val(AWBid);
    $('#txtReleasePkgs').val('');
}

function clearAll() {

    $('#txtGPNo1').val('');
    $('#txtGPNo2').val('');
    $('#txtReleasedULD').val('');
    $('#txtPendingULD').val('');
    $('#txtReleasedAWB').val('');
    $('#txtPendingAWB').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function alertDismissed() {
}


