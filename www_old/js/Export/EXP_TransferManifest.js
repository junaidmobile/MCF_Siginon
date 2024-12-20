

var CargoWorksServiceURL = window.localStorage.getItem("CargoWorksServiceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");
var DefaultAWB = "";


$(function () {
    document.getElementById("navhdrName").innerHTML = "Transfer Manifest"

});


function GetManifestDetails(AWBid) {

    var inputxml = "";
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><TransManNo>' + AWBid + '</TransManNo><AWBPref></AWBPref><AWBNo></AWBNo><CompanyCode>' + CompanyCode + '</CompanyCode><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHTGetTransferManifest",
            data: JSON.stringify({
                'InputXML': inputXML,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                $('#ddlAWB').empty();
                $(xmlDoc).find('Table').each(function (index) {

                    DefaultAWB = $(this).find('AWB_PREFIX').text() + $(this).find('AWB_NUMBER').text();

                    txtrecAirline = $(this).find('RecAirline').text();
                    txtpcs = $(this).find('nop').text();
                    txtwt = $(this).find('WEIGHT_KG').text();

                    $('#txtrecAirline').val(txtrecAirline);
                    $('#txtpcs').val(txtpcs);
                    $('#txtwt').val(txtwt);
                });

                $(xmlDoc).find('Table1').each(function (index) {

                    var AWB = '';
                    AWB = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWB).text(AWB);
                    newOption.appendTo('#ddlAWB');
                });

                $('#ddlAWB').val(DefaultAWB);
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

function GetManifestDetailsbyAWBID() {

    var ManifestNo = $('#txtAWBNo').val();
    var SelectedAWB = $('#ddlAWB').find('option:selected').text();

    var AWBPref = SelectedAWB.substring(0, 3);
    var AWBNo = SelectedAWB.substring(3, 11);

    var inputxml = "";
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><TransManNo>' + ManifestNo + '</TransManNo><AWBPref>' + AWBPref + '</AWBPref><AWBNo>' + AWBNo + '</AWBNo><CompanyCode>' + CompanyCode + '</CompanyCode><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHTGetTransferManifest",
            data: JSON.stringify({
                'InputXML': inputXML,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table').each(function (index) {

                    DefaultAWB = $(this).find('AWB_PREFIX').text() + $(this).find('AWB_NUMBER').text();

                    txtrecAirline = $(this).find('RecAirline').text();
                    txtpcs = $(this).find('nop').text();
                    txtwt = $(this).find('WEIGHT_KG').text();

                    $('#txtrecAirline').val(txtrecAirline);
                    $('#txtpcs').val(txtpcs);
                    $('#txtwt').val(txtwt);
                    $('#txtcollector').val('');

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


function SaveDetails() {

    var ManifestNo = "";
    ManifestNo = $('#txtAWBNo').val();
    var SelectedAWB = $('#ddlAWB').find('option:selected').text();

    var AWBPref = SelectedAWB.substring(0, 3);
    var AWBNo = SelectedAWB.substring(3, 11);

    var recAirline = $('#txtrecAirline').val();
    var nop = $('#txtpcs').val();
    var wt = $('#txtwt').val();
    var collector = "";
    collector = $('#txtcollector').val();

    if (ManifestNo == "") {
        errmsg = "Please enter Manifest No.";
        $.alert(errmsg);
        return;
    }

    if (collector == "") {
        errmsg = "Please enter Collector.";
        $.alert(errmsg);
        return;
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><TransferManNo>' + ManifestNo + '</TransferManNo><AWBPref>' + AWBPref + '</AWBPref><AWBNo>' + AWBNo + '</AWBNo><CollectedBy>' + collector + '</CollectedBy><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId><CompanyCode>' + CompanyCode + '</CompanyCode></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHTConfirmTransferManifest",
            data: JSON.stringify({
                'InputXML': inputXML,
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
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {
                    if ($(this).find('Status').text() == 'S') {
                        $.alert($(this).find('strOutput').text());
                    }
                    if ($(this).find('Status').text() == 'E') {
                        $.alert($(this).find('strOutput').text());
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