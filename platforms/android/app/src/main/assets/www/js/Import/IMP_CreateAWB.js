
// document.addEventListener("deviceready", GetCommodityList, false);

var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");

$(function () {

    var language = window.localStorage.getItem("Language");

    switch (language) {
        case "English":
            //setEnglish();
            break;
        case "German":
            setGerman();
            break;
        case "Russian":
            setRussian();
            break;
        case "Turkish":
            setTurkish();
            break;
    }
    getDate();

});

GetCommodityList();

function setEnglish() {
    $('#lblUnitization').text("Unitization");

}

function setGerman() {
    $('#lblFlightNo').text("Flug Nr.");
    $('#lblFlightDt').text("Flug Datum");
    $('#btnGetDetail').val("Details");
    $('#lblULDNo').text("ULD Nr.");
    $('#lblAWBNo').text("AWB Nr.");
    $('#lblOrigin').text("Abgangsstation");
    $('#lblDestination').text("Empfangsstation");
    $('#lblOffloadPoint').text("Ausladen Point");
    $('#lblAWBPkgs').text("Stückzahl AWB");
    $('#lblPckgsRCV').text("Stückzahl RCV");
    $('#lblGrWtAWB').text("Brutto Gewicht AWB");
    $('#lblGrWtRCV').text("Brutto Gewicht RCV");
    $('#lblCommodity').text("Ware");
    $('#btnModify').val("Senden");

}

function setRussian() {
    $('#lblFlightNo').text("номер рейса");
    $('#lblFlightDt').text("дата рейса");
    $('#btnGetDetail').val("детали");
    $('#lblULDNo').text("номер ULD");
    $('#lblAWBNo').text("номер авианакладной");
    $('#lblOrigin').text("аэропорт отправления");
    $('#lblDestination').text("аэропорт назначения");
    $('#lblOffloadPoint').text("разгружать");
    $('#lblAWBPkgs').text("количество AWB");
    $('#lblPckgsRCV').text("количество RCV");
    $('#lblGrWtAWB').text("вес брутто AWB");
    $('#lblGrWtRCV').text("вес брутто RCV");
    $('#lblCommodity').text("товар");
    $('#btnModify').val("отправить");
}

function setTurkish() {
    $('#lblFlightNo').text("uçuş No.");
    $('#lblFlightDt').text("uçuş tarih");
    $('#btnGetDetail').val("ayrıntılar");
    $('#lblULDNo').text("ULD No.");
    $('#lblAWBNo').text("AWB No.");
    $('#lblOrigin').text("Menşei");
    $('#lblDestination').text("Variş Noktasi");
    $('#lblOffloadPoint').text("satmak");
    $('#lblAWBPkgs').text("Paket Sayisi AWB");
    $('#lblPckgsRCV').text("Paket Sayisi RCV");
    $('#lblGrWtAWB').text("brüt ağırlık AWB");
    $('#lblGrWtRCV').text("brüt ağırlık RCV");
    $('#lblCommodity').text("emtia");
    $('#btnExcLanded').val("çikiş");
    $('#btnClear').val("temiz");
    $('#btnModify').val("отправить");
}


function NumberOnlytxtPkgAWB() {
    $("#txtPkgAWB").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
}

function NumberOnlytxtPkgRCV() {
    $("#txtPkgRCV").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
}

function GetCommodityList() {
    $.ajax({
        type: 'POST',
        //url: "http://113.193.225.52:8080/GalaxyService/GalaxyService.asmx/GetCommodityList",//113.193.225.52:8080
        url: GHAImportFlightserviceURL + "GetCommodityList",
        data: JSON.stringify({ 'chrCycle': 'I' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var str = response.d;
            if (str == "<NewDataSet />") {
                alert("Please enter valid credentials");
            }
            else {
                var xmlDoc = $.parseXML(response.d);
                var xml = $(xmlDoc);
                var DrpNewsCategory = xml.find("Table");
                for (var i = 0; i < DrpNewsCategory.length; i++) {
                    var val = $(DrpNewsCategory[i]).find('SR_NO').text();
                    var text = $(DrpNewsCategory[i]).find('COMMODITY_TYPE').text();
                    $('#ddlCommodity').append($('<option></option>').val(val).html(text));
                }
            }

        },
        error: function (msg) {
            var r = jQuery.parseJSON(msg.responseText);
            alert("Message: " + r.Message);
        }
    });
}




function GetULDDetails() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var FullFlightNo = FlightPrefix + FlightNo;

    if (FlightPrefix == "" || FlightNo == "") {
        errmsg = "Please enter valid Flight No.";
        $.alert(errmsg);
        return;
    }

    if (FlightDate == "") {
        errmsg = "Please enter Flight Date";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightDate').val().length > 0) {
        var formattedDate = new Date($('#txtFlightDate').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        FlightDate = y + "-" + m + "-" + d;
    }

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetULDNumbers",
            data: JSON.stringify({
                'strFlightNumber': FullFlightNo, 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strFlightDate': FlightDate, 'chrCycle': 'I',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table').each(function (index) {

                    var ULDId;
                    var ULD;
                    ULDId = $(this).find('ULDNO').text();
                    ULD = $(this).find('ULDNO').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULD);
                    newOption.appendTo('#ddlULDNo');

                    if (index == 0) {
                        ULDSeqNo = ULDId;
                    }

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

function SaveAWB() {

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var FullFlightNo = FlightPrefix + FlightNo;

    if (FlightPrefix == "" || FlightNo == "") {
        errmsg = "Please enter valid Flight No.";
        $.alert(errmsg);
        return;
    }

    if (FlightDate == "") {
        errmsg = "Please enter Flight Date";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightDate').val().length > 0) {
        var formattedDate = new Date($('#txtFlightDate').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        FlightDate = d + "-" + m + "-" + y;
    }

    var AWBNo = $('#txtAWBNo').val();
    var origin = $('#txtOrigin').val();
    var destination = $('#txtDestination').val();
    var offloadpoint = $('#txtOffloadPoint').val();
    var AWBpkg = $('#txtPkgAWB').val();
    var AWBGrWt = $('#txtGrWtAWB').val();
    var RCVPkg = $('#txtPkgRCV').val();
    var RCVGrWt = $('#txtGrWtRCV').val();
    //var ddlUnit = $('#ddlUnit').val();
    var ddlCommodity = $('#ddlCommodity').val();
    var CommodityText = $("#ddlCommodity option:selected").text();
    var ErrorMsg = "";

    if (AWBNo == null || AWBNo == "") {
        ErrorMsg = ErrorMsg + "Please enter AWB No.<br/>";
        //$("#txtAWBNo").css("background-color", "#ffcccc");

    }

    if (AWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    if (AWBpkg == null || AWBpkg == "") {
        ErrorMsg = ErrorMsg + "Please enter No. of Pkgs.<br/>";
        //$("#txtPkgAWB").css("background-color", "#ffcccc");

    }
    if (AWBGrWt == null || AWBGrWt == "") {
        ErrorMsg = ErrorMsg + "Please enter Gross Wt.<br/>";
        //$("#txtGrWtAWB").css("background-color", "#ffcccc");

    }


    else {
        alert(window.localStorage.getItem("companyCode"));
        var strAWBDetails = "";
        strAWBDetails = strAWBDetails + "<AWBDtl>";
        strAWBDetails = strAWBDetails + "<AWB AWBNo='";
        strAWBDetails = strAWBDetails + AWBNo.trim();
        strAWBDetails = strAWBDetails + "' HAWBNo='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' TAWBPkgs='";
        strAWBDetails = strAWBDetails + AWBpkg.trim();
        strAWBDetails = strAWBDetails + "' TAWBGwt ='";
        strAWBDetails = strAWBDetails + AWBGrWt.trim();
        strAWBDetails = strAWBDetails + "' SExpPkgs='";
        strAWBDetails = strAWBDetails + AWBpkg.trim();
        strAWBDetails = strAWBDetails + "' SExpGwt ='";
        strAWBDetails = strAWBDetails + AWBGrWt.trim();
        strAWBDetails = strAWBDetails + "' SRcvPkgs='";
        strAWBDetails = strAWBDetails + RCVPkg.trim();
        strAWBDetails = strAWBDetails + "' SRcvGwt ='";
        strAWBDetails = strAWBDetails + RCVGrWt.trim();
        strAWBDetails = strAWBDetails + "' IsMaster='";
        strAWBDetails = strAWBDetails + "1";
        strAWBDetails = strAWBDetails + "' FltNo ='";
        strAWBDetails = strAWBDetails + FullFlightNo.trim();
        strAWBDetails = strAWBDetails + "' FltDate='";
        strAWBDetails = strAWBDetails + FlightDate.trim();
        strAWBDetails = strAWBDetails + "' Origin ='";
        strAWBDetails = strAWBDetails + origin.trim();
        strAWBDetails = strAWBDetails + "' Dest ='";
        strAWBDetails = strAWBDetails + destination.trim();
        strAWBDetails = strAWBDetails + "' OffPt ='";
        strAWBDetails = strAWBDetails + offloadpoint.trim();
        strAWBDetails = strAWBDetails + "' ULDNo ='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' Com ='";
        strAWBDetails = strAWBDetails + ddlCommodity;
        strAWBDetails = strAWBDetails + "' Descr ='";
        strAWBDetails = strAWBDetails + CommodityText.trim();
        strAWBDetails = strAWBDetails + "'/>";
        strAWBDetails = strAWBDetails + "</AWBDtl>";
        var companycode = window.localStorage.getItem("companyCode");
        var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
        var ShedCode = window.localStorage.getItem("SHED_CODE");
        var UserId = window.localStorage.getItem("UserID");
        $.ajax({
            type: 'POST',
            //url: "http://113.193.225.52:8080/GalaxyService/GalaxyService.asmx/PDAExpCreateAWB",//113.193.225.52:8080
            url: GHAImportFlightserviceURL + "PDAImpCreateAWB",
            data: JSON.stringify({ 'strAWBDetails': strAWBDetails, 'strComapnyCode': companycode, 'strAirportCity': AirportCity, 'strShedCode': "I", 'strUserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var str = response.d;
                $.alert(str);
            },
            error: function (msg) {
                var r = jQuery.parseJSON(msg.responseText);
                alert("Message: " + r.Message);
            }
        });
    }
}

function clearALL() {
    $('#txtFlightPrefix').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#txtAWBNo').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtOffloadPoint').val('');
    $('#txtPkgAWB').val('');
    $('#txtPkgRCV').val('');
    $('#txtGrWtAWB').val('');
    $('#txtGrWtRCV').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}

function getDate() {
    var today = new Date();
    document.getElementById("txtFlightDate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}



