
var GHAExportFlightserviceURL = window.localStorage.getItem("GHAExportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");

var totalPieces = 0;
var totalWT = 0;
var totalPiecesRows = 0;
var totalWTRows = 0;

//(function () {
//    document.addEventListener('deviceready', AddLocation, false);
//}
//)();


$(function () {

    var language = window.localStorage.getItem("Language");
    // console.log("here is page");
    // alert("page is here");

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

});

function onlyNumbersTwoDigits(txt) {
    var val = txt.value;
    var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
    var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
    if (re.test(val)) {
        //do something here
    } else {
        val = re1.exec(val);
        if (val) {
            txt.value = val[0];
        } else {
            txt.value = "";
        }
    }
}

function setEnglish() {
    $('#lblUnitization').text("Unitization");

}

function setGerman() {
    $('#btnClearAll').val("Clear");
    $('#lblAWBNo').text("AWB Nr.");
    $('#lblHAWB').text("HAWB Nr.");
    $('#lblShipmntNo').text("Sendungs Nr.");
    $('#lblShipNpr').text("Sendung Stückzahl");
    $('#lblShipWt').text("Sendung Gewicht");
    $('#lblAddLocation').val("Hinzufügen Stellplatz");
    $('#btnModify').val("Senden");
}

function setRussian() {
    $('#btnClearAll').val("Clear");
    $('#lblAWBNo').text("номер авианакладной");
    $('#lblHAWB').text("номер HAWB");
    $('#lblShipmntNo').text("номер партии");
    $('#lblShipNpr').text("количество партии");
    $('#lblShipWt').text("вес партии");
    $('#lblAddLocation').val("добавить место");
    $('#btnModify').val("отправить");
}

function setTurkish() {
    $('#btnClearAll').val("temiz");
    $('#lblAWBNo').text("AWB No.");
    $('#lblHAWB').text("HAWB No.");
    $('#lblShipmntNo').text("gösteri Nr.");
    $('#lblShipNpr').text("gösteri sayi");
    $('#lblShipWt').text("gösteri ağırlık");
    $('#lblAddLocation').val("konum eklemek");
    $('#btnExcLanded').val("çikiş");
    $('#btnModify').val("göndermek");
}

function GetHAWBDetails() {

    var AWBid = $('#txtAWBNo').val();

    if (AWBid == "") {
        //errmsg = "Please enter valid Flight No.";
        //$.alert(errmsg);
        return;
    }

    if (AWBid.length < '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "GetHouseNo",
            data: JSON.stringify({
                'strAWBNo': AWBid, 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strCycle': 'I',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                $('#ddlHAWBNo').empty();

                $(xmlDoc).find('Table').each(function (index) {

                    var HAWBId;
                    var HAWBNo;

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('').text('Select');
                        newOption.appendTo('#ddlHAWBNo');

                        $('#txtPckgsEXP').val($(this).find('TOT_NPX').text());
                        $('#txtGrossWtEXP').val($(this).find('TOT_WGHT_EXP_KG').text());
                    }

                    HAWBId = $(this).find('HOUSE_SEQUENCE_NUMBER').text();
                    HAWBNo = $(this).find('HOUSE_NUMBER').text();

                    var newOption = $('<option></option>');
                    newOption.val(HAWBId).text(HAWBNo);
                    newOption.appendTo('#ddlHAWBNo');

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

function GetFlightDetailsForAWB() {

    var AWBid = $('#txtAWBNo').val();
    var HAWBid;

    if ($('#ddlHAWB').find('option:selected').text() == 'Select')
        HAWBid = '0';
    else
        HAWBid = $('#ddlHAWB').val() == null ? 0 : HAWBid = $('#ddlHAWB').val();

    if (AWBid == "") {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if (AWBid.length < '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "GetFlightNoForAWB",
            data: JSON.stringify({
                'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strCycle': 'I', 'strAWBNo': AWBid, 'strHAWBNo': HAWBid,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                $('#ddlFlightNo').empty();

                $(xmlDoc).find('Table').each(function (index) {

                    var FlightId;
                    var FlightNo;
                    FlightId = $(this).find('FlightNo').text();
                    FlightNo = $(this).find('FlightNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(FlightId).text(FlightNo);
                    newOption.appendTo('#ddlFlightNo');

                    if (index == 0) {
                        $('#txtFlightDate').val($(this).find('FlightDt').text());
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

function GetULDDetailsForAWB() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var date = new Date($('#txtFlightDate').val());
    var newDate = date.toString('yy-MM-dd');

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "GetULDNumbers",
            data: JSON.stringify({
                'strFlightNumber': $('#ddlFlightNo').val(), 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strFlightDate': newDate, 'strCycle': 'I',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);


                $(xmlDoc).find('Table').each(function (index) {

                    var ULDId;
                    var ULDNo;
                    ULDId = $(this).find('ULDNO').text();
                    ULDNo = $(this).find('ULDNO').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULDNo);
                    newOption.appendTo('#ddlULDNo');

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

function GetShipmentDetailsForAWB() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "GetShipmentNo",
            data: JSON.stringify({
                'strAWBNo': $('#txtAWBNo').val(), 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strCycle': 'I',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);


                $(xmlDoc).find('Table').each(function (index) {

                    var ShipmentId;
                    var ShipmentNo;
                    ShipmentId = $(this).find('shipment_number').text();
                    ShipmentNo = $(this).find('shipment_number').text();

                    var newOption = $('<option></option>');
                    newOption.val(ShipmentId).text(ShipmentNo);
                    newOption.appendTo('#ddlShipmntNo');

                    if (index == 0) {
                        $('#txtPckgsEXP').val('NPX');
                        $('#txtPckgsRCV').val('NPR');
                        $('#txtGrossWtEXP').val('WEIGHT_EXP_KG');
                        $('#txtGrossWtRCV').val('WEIGHT_REC_KG');
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

function clearDetails() {
    // $('#txtAWBPrefix').val('');
    // $('#txtAWBNo').val('');
    $('#ddlHAWB').val(0);
    //$('#ddlHAWB').empty();
    $('#ddlShipmntNo').val(0);
    //$('#ddlShipmntNo').empty();
    $('#txtShipNp').val('');
    $('#txtShipWt').val('');
    $('#divShowGrid').empty();
    $('#txtScanCode').focus();
}

function SaveDetails() {

    // alert("SaveDetails start");

    var HouseSeqNo;
    var ShpNum;

    if ($('#ddlHAWB').find('option:selected').text() == 'Select')
        HouseSeqNo = '0';
    else
        HouseSeqNo = $('#ddlHAWB').val();

    if ($('#ddlShipmntNo').find('option:selected').text() == 'Select') {
        ShpNum = '0';
    }
    else
        ShpNum = $('#ddlShipmntNo').val();



    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var blnLocChange;

    var AWBNo = $('#txtAWBNo').val();
    var FlightNo = $('#ddlFlightNo').val();
    var ULDNo = $('#ddlULDNo').val();
    var HAWBNo = $('#ddlHAWB').val();
    var ShipmentNo = $('#ddlShipmntNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var PckgsRCV = $('#txtPckgsRCV').val();
    var LocCode = $('#txtLocCode').val();


    if (ShipmentNo == 0) {
        errmsg = "Please select valid Shipment No.";
        $.alert(errmsg);
        return;
    }

    // HAWBNoLength = $('#ddlHAWB').find("option").length;
    // if (HouseSeqNo == 0 && HAWBNoLength > 1) {
    //     errmsg = "Please select valid House No.";
    //     $.alert(errmsg);
    //     return;
    // }



    if (AWBNo == "" || FlightDate == "" || PckgsRCV == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;
    }



    totalPiecesRows = 0;
    totalWTRows = 0;

    // alert(totalPieces);
    // alert(totalWT);

    var allOKAY = true;


    $.each(saveTableLocation, function (i, d) {
        var locCtrlName = "#txtLocLoca_" + i.toString()
        var pcsCtrlName = "#txtLocPcs_" + i.toString();
        var wtCtrlName = "#txtLocWt_" + i.toString();

        if ($(locCtrlName).val() == "") {
            errmsg = "Please enter Location in all rows.</br>";
            allOKAY = false;
            $.alert(errmsg);
            return;
        }

        if ($(pcsCtrlName).val() == "") {
            errmsg = "Please enter Pieces in all rows.</br>";
            $.alert(errmsg);
            allOKAY = false;
            return;
        }

        if ($(wtCtrlName).val() == "") {
            errmsg = "Please enter Weight in all rows.</br>";
            $.alert(errmsg);
            allOKAY = false;
            return;
        }


        // saveTableLocation[i]['LOC'] = $(locCtrlName).val();
        // saveTableLocation[i]['NPR'] = Number($(pcsCtrlName).val());
        // saveTableLocation[i]['WTREC'] = parseFloat($(wtCtrlName).val());
    });

    if (allOKAY == false)
        return;

    $.each(saveTableLocation, function (i, d) {




        var locCtrlName = "#txtLocLoca_" + i.toString()
        var pcsCtrlName = "#txtLocPcs_" + i.toString();
        var wtCtrlName = "#txtLocWt_" + i.toString();

        // alert($(pcsCtrlName).val());
        // alert($(wtCtrlName).val());

        saveTableLocation[i]['LOC'] = $(locCtrlName).val();
        saveTableLocation[i]['NPR'] = Number($(pcsCtrlName).val());
        saveTableLocation[i]['WTREC'] = parseFloat($(wtCtrlName).val());
    });


    $.each(saveTableLocation, function (i, d) {
        totalPiecesRows = totalPiecesRows + Number(saveTableLocation[i]['NPR']);
        totalWTRows = totalWTRows + parseFloat(saveTableLocation[i]['WTREC']);
    });

    // alert(totalPiecesRows);
    // alert(totalWTRows);

    if (totalPieces != totalPiecesRows) {
        errmsg = "Sum of entered pieces should match Shipment Pkgs.";
        $.alert(errmsg);
        return;
    }

    if (totalWT != totalWTRows) {
        errmsg = "Sum of entered weight should match Shipment Wt.";
        $.alert(errmsg);
        return;
    }


    var valueArr = saveTableLocation.map(function (item) { return item.LOC });
    var isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
    });
    if (isDuplicate == true) {
        errmsg = "Same location already entered ";
        $.alert(errmsg);
        return;
    }
    // alert("isDuplicate = " + isDuplicate);

    // return;

    // alert("SaveDetails before errmsg");

    // var LocCode = GetLocation();

    // if (LocCode.indexOf("cannot be") >= 0) {
    //     $.alert(LocCode);
    //     return;
    // }

    //   return;


    if (errmsg == "" && connectionStatus == "online") {


        var xmlSave = "";

        $.each(saveTableLocation, function (i, d) {
            xmlSave = xmlSave + '<LD SEQNo ="' + saveTableLocation[i]['SEQNo'] + '"'
                + ' LOC = "' + saveTableLocation[i]['LOC'] + '"'
                + ' NPR = "' + saveTableLocation[i]['NPR'] + '"'
                + ' WTREC = "' + saveTableLocation[i]['WTREC'] + '"'
                + ' NOTES = " "  />'

        })

        // alert(JSON.stringify({
        //     'AwbPrefix': $('#txtAWBPrefix').val(), 'AwbNumber': $('#txtAWBNo').val(),
        //     'ShipmentNo': ShpNum, 'FltSeqNo': '0', 'NPR': $('#txtShipNp').val(), 'Wt': $('#txtShipWt').val(),
        //     'XML': xmlSave, 'userId': UserId, 'AirportCity': AirportCity, 'CompanyCode': CompanyCode,
        // }));

        //return;

        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "HHTSaveExpLocation",
            data: JSON.stringify({
                'AwbPrefix': $('#txtAWBPrefix').val(), 'AwbNumber': $('#txtAWBNo').val(),
                'ShipmentNo': ShpNum, 'FltSeqNo': '0', 'NPR': $('#txtShipNp').val(), 'Wt': $('#txtShipWt').val(),
                'XML': xmlSave, 'userId': UserId, 'AirportCity': AirportCity, 'CompanyCode': CompanyCode,
            }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Please Wait..",
                });
            },
            success: function (response) {
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table1').each(function () {
                    if ($(this).find('Status').text() == 'E') {
                        $.alert($(this).find('Message').text());

                    }
                    else if ($(this).find('Status').text() == 'S') {
                        $.alert($(this).find('Message').text());
                       // clearALL();
                    }
                })
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
    //$('#txtIGMNo').val('');
    //$('#txtIGMYear').val('');
    //$('#txtFlightPrefix').val('');
    //$('#txtFlightNo').val('');
    //$('#txtFlightDate').val('');
    //$('#txtTotCnts').val('');
    //$('#txtManiPieces').val('');
    //$('#txtReceivePieces').val('');
    //$('#txtManiGrWt').val('');
    //$('#txtReceiveGrWt').val('');
    //$('#txtShortPieces').val('');
    //$('#txtExcessPieces').val('');
    //$('#txtDamagePieces').val('');
    $('#txtAWBPrefix').val('');
    $('#txtAWBNo').val('');
    $('#ddlHAWB').val(0);
    //$('#ddlHAWB').empty();

    //$('#ddlShipmntNo').empty();
    $('#txtShipNp').val('');
    $('#txtShipWt').val('');
    $('#divShowGrid').empty();
    $('#txtScanCode').focus();
    $('#ddlShipmntNo').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlShipmntNo');
    $('#ddlShipmntNo').val(0);
    //  <option value="0">Select</option>
}

function MovetoNext(current, nextFieldID) {
    if (current.value.length >= current.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}

function ChkAndValidate() {

    var ScanCode = $('#txtScanCode').val();
    ScanCode = ScanCode.replace(/\s+/g, '');
    ScanCode = ScanCode.replace("-", "").replace("–", "");

    if (ScanCode.length >= 11) {

        $('#txtAWBPrefix').val(ScanCode.substr(0, 3));
        $('#txtAWBNo').val(ScanCode.substr(3, 8));
        $('#txtScanCode').val('');
        GetShipmentInfoForAWB($('#txtAWBPrefix').val() + $('#txtAWBNo').val());
    }
}

function GetShipmentInfoForAWB(AWBNo) {

    var MAWBPrefix = $('#txtAWBPrefix').val();
    var MAWBNo = $('#txtAWBNo').val();
    var HAWBid = 0;
    var ShipmentNo = 1;
    var ReceivedShipNo;

    // if ($('#ddlHAWB').find('option:selected').text() == 'Select')
    //     HAWBid = '0';
    // else
    //     HAWBid = $('#ddlHAWB').val() == null ? 0 : HAWBid = $('#ddlHAWB').val();

    // if ($('#ddlShipmntNo').find('option:selected').text() == 'Select') {
    //     $('#ddlShipmntNo').empty();
    //     ShipmentNo = '0';
    // }
    // else
    //     if ($('#ddlShipmntNo').val() != null) {
    //         ShipmentNo = $('#ddlShipmntNo').val();
    //     }
    //     else {
    //         ShipmentNo = '0';
    //     }


    if (MAWBPrefix.length != '3' || MAWBNo.length != '8') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }



    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    $('#ddlShipmentNo').empty();

    //     InputXML
    // <ROOT><AIRLINE_PREFIX>002</AIRLINE_PREFIX><AWB_NUMBER>44444444</AWB_NUMBER>
    // <SHIPMENT_NO>2</SHIPMENT_NO><FLIGHT_SEQ_NO>0</FLIGHT_SEQ_NO><SHPNPR>5</SHPNPR> 
    // <SHPWT>100</SHPWT><UserId>252</UserId><AIRPORT_CITY>FRA</AIRPORT_CITY><CompanyCode>3</CompanyCode></ROOT>

    // InputLocXML
    // <LOCDET><LD SEQNo="180177" LOC="556-IMP-AFL-1" NPR="1" WTREC="60" NOTES="s2n3w60" />
    // <LD SEQNo="180178" LOC="577-CLD-098-1" NPR="4" WTREC="40" NOTES="s3 n2w40" /></LOCDET>


    var inputXML = '<Root><AWBPref>' + MAWBPrefix + '</AWBPref><AWBNo>' + MAWBNo + '</AWBNo><HouseSeqNo>'
        + HAWBid + '</HouseSeqNo><ShipNo>' + ShipmentNo + '</ShipNo><UserId>' + UserId + '</UserId><AirportCity>'
        + AirportCity + '</AirportCity></Root>';
    console.log(JSON.stringify({ 'InputXML': inputXML }));

    if (errmsg == "" && connectionStatus == "online") {
        clearDetails();
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "HHTGetExpLocationDetails",
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
                var xmlDoc =
                    $.parseXML(response);
                var houseSeqNo, ReceivedShipNoOption, HAWBOption;

                saveTableLocation = [];
                if (response != null && response != "" && response != "<NewDataSet />") {






                    $(xmlDoc).find('Table').each(function (index) {
                        $('#ddlHAWB').empty();
                        $('#ddlHAWB').empty();
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlHAWB');
                        $('#ddlShipmntNo').empty();
                        $('#divShowGrid').empty();
                        var str = response;
                        if (str != null && str != "") {


                            // html = '';

                            // html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                            // html += "<thead><tr>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Move</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; display:none;' align='center'font-weight:'bold'>Location</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Pieces</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%; display:none;' align='center'font-weight:'bold'>HidePcs</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%' align='center'font-weight:'bold'>Weight</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%; display:none;' align='center'font-weight:'bold'>HideWeight</th>";
                            // html += "</tr></thead>";
                            // html += "<tbody>";

                            //var xmlDoc = $.parseXML(str);

                            //    $(xmlDoc).find('Table').each(function () {

                            var LocationSeq;
                            var Location;
                            var Pieces;
                            var Weight;
                            // var houseSeqNo, ReceivedShipNoOption, HAWBOption;


                            totalPieces = Number($(this).find('TOTAL_NPR').text());
                            totalWT = parseFloat($(this).find('WtRec').text());


                            ReceivedShipNo = $(this).find('SHIPMENT_NUMBER').text();
                            // houseSeqNo = $(this).find('HOUSE_SEQ_NO').text();
                            LocationSeq = $(this).find('SeqNo').text();
                            Location = $(this).find('LocCode').text();
                            Pieces = $(this).find('NOP').text();
                            Weight = $(this).find('Weight').text();
                            $('#txtShipNp').val($(this).find('TOTAL_NPR').text());
                            $('#txtShipWt').val($(this).find('WtRec').text());
                            // // $('#ddlShipmntNo').val(ReceivedShipNo);
                            // var newOption = $('<option></option>');
                            // if (ReceivedShipNo == 0) {
                            //     // newOption.val(0).text('Select');
                            //     // newOption.appendTo('#ddlShipmntNo');
                            // } else {
                            //     newOption.val(ReceivedShipNo).text(ReceivedShipNo);
                            //     newOption.appendTo('#ddlShipmntNo');
                            // }

                            // var newOption1 = $('<option></option>');
                            // if (houseSeqNo == 0) {
                            //     // newOption1.val(0).text('Select');
                            //     // newOption1.appendTo('#ddlHAWB');
                            // } else {
                            //     newOption1.val(houseSeqNo).text(houseSeqNo);
                            //     newOption1.appendTo('#ddlHAWB');
                            // }
                            // $('#ddlHAWB').val(houseSeqNo);
                            //   AddTableLocation(index, LocationSeq, Location, Pieces, Weight);

                            // // <LD SEQNo="180177" LOC="556-IMP-AFL-1" NPR="3" WTREC="60" NOTES="s2n3w60" />
                            //  alert("pushing data into table");
                            saveTableLocation.push({
                                "index": index,
                                "SEQNo": LocationSeq,
                                "LOC": Location,
                                "NPR": Pieces,
                                "WTREC": Weight,
                                "NOTES": ""
                            });

                            //  buildTableData();

                            //   });


                            //  buildTableData();



                        }
                        $('#btnClearAll').focus();
                    });

                    if (parseInt(houseSeqNo) > 0) {
                        $(xmlDoc).find('Table1').each(function (index) {

                            if ($(this).find('HOUSE_SEQ_NO') == 0) {
                                var HAWB;
                                var HAWBSeqNo;
                                HAWB = $(this).find('HOUSE_NUMBER').text();
                                HAWBSeqNo = $(this).find('HOUSE_SEQUENCE_NUMBER').text();


                                var newOption = $('<option></option>');
                                newOption.val(HAWBSeqNo).text(HAWB);
                                newOption.appendTo('#ddlHAWB');

                                if (index == 0) {
                                    $('#ddlHAWB').val(HAWBSeqNo);
                                }
                            } else {
                                var HAWB;
                                var HAWBSeqNo;
                                HAWB = $(this).find('HOUSE_NUMBER').text();
                                HAWBSeqNo = $(this).find('HOUSE_SEQUENCE_NUMBER').text();



                                var newOption = $('<option></option>');
                                newOption.val(HAWBSeqNo).text(HAWB);
                                newOption.appendTo('#ddlHAWB');

                                if (index == 0) {
                                    $('#ddlHAWB').val(HAWBSeqNo);
                                }
                            }



                        });

                        $(xmlDoc).find('Table2').each(function (index) {


                            var ShipNo;
                            ShipNo = $(this).find('ShipNo').text();

                            if (index == 0) {
                                var newOption = $('<option></option>');
                                newOption.val(0).text('Select');
                                newOption.appendTo('#ddlShipmntNo');
                            }

                            var newOption = $('<option></option>');
                            newOption.val(ShipNo).text(ShipNo);
                            newOption.appendTo('#ddlShipmntNo');

                            $('#ddlShipmntNo').val(ReceivedShipNo);

                        });
                    } else {
                        $(xmlDoc).find('Table1').each(function (index) {


                            var ShipNo;
                            ShipNo = $(this).find('ShipNo').text();

                            if (index == 0) {
                                var newOption = $('<option></option>');
                                newOption.val(0).text('Select');
                                newOption.appendTo('#ddlShipmntNo');
                            }

                            var newOption = $('<option></option>');
                            newOption.val(ShipNo).text(ShipNo);
                            newOption.appendTo('#ddlShipmntNo');

                            $('#ddlShipmntNo').val(ReceivedShipNo);

                        });
                    }

                    buildTableData();
                }
                else {
                    $('#txtAWBPrefix').val('');
                    $('#txtAWBNo').val('');
                    $('#ddlHAWB').val(0);
                    //$('#ddlHAWB').empty();
                    $('#ddlShipmntNo').val(0);
                    //$('#ddlShipmntNo').empty();
                    $('#txtShipNp').val('');
                    $('#txtShipWt').val('');
                    $('#divShowGrid').empty();
                    $.alert('No record found');
                }


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


function GetShipmentInfoForAWBandHAWB(AWBNo) {

    var MAWBPrefix = $('#txtAWBPrefix').val();
    var MAWBNo = $('#txtAWBNo').val();
    var HAWBid;
    var ShipmentNo;
    var ReceivedShipNo, HAWBNoLength;



    if ($('#ddlHAWB').find('option:selected').text() == 'Select')
        HAWBid = '0';
    else
        HAWBid = $('#ddlHAWB').val() == null ? 0 : HAWBid = $('#ddlHAWB').val();

    HAWBNoLength = $('#ddlHAWB').find("option").length;
    if (HAWBid == 0 && HAWBNoLength > 1) {
        errmsg = "Please select valid House No.";
        $.alert(errmsg);
        return;
    }

    if ($('#ddlShipmntNo').find('option:selected').text() == 'Select') {
        // $('#ddlShipmntNo').empty();
        ShipmentNo = '0';
    }
    else
        if ($('#ddlShipmntNo').val() != null) {
            ShipmentNo = $('#ddlShipmntNo').val();
        }
        else {
            ShipmentNo = '0';
        }

    if (ShipmentNo == 0) {
        errmsg = "Please select valid Shipment No.";
        $.alert(errmsg);
        return;
    }


    if (MAWBPrefix.length != '3' || MAWBNo.length != '8') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    if (HAWBid > 0) {
        $('#ddlShipmntNo').empty();
    }



    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    // $('#ddlShipmentNo').empty();

    var inputXML = '<Root><AWBPref>' + MAWBPrefix + '</AWBPref><AWBNo>' + MAWBNo + '</AWBNo><HouseSeqNo>' + HAWBid + '</HouseSeqNo><ShipNo>' + ShipmentNo + '</ShipNo><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "HHTGetExpLocationDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                saveTableLocation = [];
                //debugger;
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc =
                    $.parseXML(response);

                if (response != null && response != "" && response != "<NewDataSet />") {

                    $(xmlDoc).find('Table').each(function (index) {
                        // $('#ddlShipmntNo').empty();
                        $('#divShowGrid').empty();
                        var str = response;
                        if (str != null && str != "") {


                            // html = '';

                            // html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                            // html += "<thead><tr>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Move</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; display:none;' align='center'font-weight:'bold'>Location</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Pieces</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%; display:none;' align='center'font-weight:'bold'>HidePcs</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%' align='center'font-weight:'bold'>Weight</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%; display:none;' align='center'font-weight:'bold'>HideWeight</th>";
                            // html += "</tr></thead>";
                            // html += "<tbody>";

                            //  var xmlDoc = $.parseXML(str);

                            // $(xmlDoc).find('Table').each(function () {

                            var LocationSeq;
                            var Location;
                            var Pieces;
                            var Weight;

                            ReceivedShipNo = $(this).find('SHIPMENT_NUMBER').text();

                            LocationSeq = $(this).find('SeqNo').text();
                            Location = $(this).find('LocCode').text();
                            Pieces = $(this).find('NOP').text();
                            Weight = $(this).find('Weight').text();

                            $('#txtShipNp').val($(this).find('TOTAL_NPR').text());
                            $('#txtShipWt').val($(this).find('WtRec').text());

                            totalPieces = Number($(this).find('TOTAL_NPR').text());
                            totalWT = parseFloat($(this).find('WtRec').text());


                            // alert(totalPieces);
                            // alert(totalWT);



                            //AddTableLocation(index, LocationSeq, Location, Pieces, Weight);

                            saveTableLocation.push({
                                "index": index,
                                "SEQNo": LocationSeq,
                                "LOC": Location,
                                "NPR": Pieces,
                                "WTREC": Weight,
                                "NOTES": ""
                            });

                            //buildTableData();
                            // });

                            // html += "</tbody></table>";


                            // $('#divShowGrid').append(html);

                        }
                        $('#btnClearAll').focus();
                    });

                    // $(xmlDoc).find('Table1').each(function (index) {


                    //     var HAWB;
                    //     var HAWBSeqNo;
                    //     HAWB = $(this).find('HOUSE_NUMBER').text();
                    //     HAWBSeqNo = $(this).find('HOUSE_SEQUENCE_NUMBER').text();


                    //     var newOption = $('<option></option>');
                    //     newOption.val(HAWBSeqNo).text(HAWB);
                    //     newOption.appendTo('#ddlHAWB');

                    //     if (index == 0) {
                    //         $('#ddlHAWB').val(HAWBSeqNo);
                    //     }

                    // });

                    // $(xmlDoc).find('Table1').each(function (index) {



                    //     var ShipNo;
                    //     ShipNo = $(this).find('ShipNo').text();

                    //     if (index == 0) {
                    //         var newOption = $('<option></option>');
                    //         newOption.val(0).text('Select');
                    //         newOption.appendTo('#ddlShipmntNo');
                    //     }

                    //     var newOption = $('<option></option>');
                    //     newOption.val(ShipNo).text(ShipNo);
                    //     newOption.appendTo('#ddlShipmntNo');

                    //     $('#ddlShipmntNo').val(ReceivedShipNo);

                    // });
                    buildTableData();

                }

                else {
                    $('#txtAWBPrefix').val('');
                    $('#txtAWBNo').val('');
                    $('#ddlHAWB').val(0);
                    //$('#ddlHAWB').empty();
                    $('#ddlShipmntNo').val(0);
                    //$('#ddlShipmntNo').empty();
                    $('#txtShipNp').val('');
                    $('#txtShipWt').val('');
                    $('#divShowGrid').empty();
                    $.alert('No record found');
                }


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

function buildTableData() {

    totalPiecesRows = 0;
    totalWTRows = 0;

    $('#divShowGrid').empty();
    // // "index": index,
    // xmlSave = xmlSave + '<LD SEQNo ="' + saveTableLocation[i]['SEQNo'] + '"'
    //     + ' LOC = "' + saveTableLocation[i]['LOC'] + '"'
    //     + ' NPR = "' + saveTableLocation[i]['NPR'] + '"'
    //     + ' WTREC = "' + saveTableLocation[i]['WTREC'] + '"'
    //     + ' NOTES = " "  />'

    // alert("buildTableData called here saveTableLocation length is = " + saveTableLocation.length.toString());
    html = '';

    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
    html += "<thead><tr>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:15%' align='center'font-weight:'bold'>Move</th>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; display:none;' align='center'font-weight:'bold'>Location</th>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Pieces</th>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:10%; display:none;' align='center'font-weight:'bold'>HidePcs</th>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%' align='center'font-weight:'bold'>Weight</th>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:10%; display:none;' align='center'font-weight:'bold'>HideWeight</th>";
    html += "</tr></thead>";
    html += "<tbody>";
    $.each(saveTableLocation, function (i, d) {
        html += "<tr>";
        html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'> <img id=imgMove_" + saveTableLocation[i]['index'] + " src='images/Move.png' onclick='MoveToLocation(" + saveTableLocation[i]['index'] + ");'></td>";
        html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocLoca_" + saveTableLocation[i]['index'] + " class=form-control type=text style=text-align:right; value=" + saveTableLocation[i]['LOC'] + "></td>";
        html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtLocSeq_" + saveTableLocation[i]['index'] + " class=form-control type=text style=text-align:right; value=" + saveTableLocation[i]['SEQNo'] + "></td>";

        html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocPcs_" + saveTableLocation[i]['index'] + " class=form-control type=number style=text-align:right; value=" + saveTableLocation[i]['NPR'] + "  onKeyPress='if(this.value.length==10) return false;' onchange='CalculateWtVol(" + saveTableLocation[i]['index'] + ");'></td>";
        html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtHideLocPcs_" + saveTableLocation[i]['index'] + " class=form-control type=number style=text-align:right; value=" + saveTableLocation[i]['NPR'] + " onkeyup=onlyNumbersTwoDigits(this) ></td>";

        html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocWt_" + saveTableLocation[i]['index'] + " class=form-control type=number style=text-align:right; value=" + saveTableLocation[i]['WTREC'] + " onKeyPress='if(this.value.length==10) return false;' onkeyup=onlyNumbersTwoDigits(this) maxlength=10></td>";
        html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtHideLocWt_" + saveTableLocation[i]['index'] + " class=form-control type=number style=text-align:right; value=" + saveTableLocation[i]['WTREC'] + " onkeyup=onlyNumbersTwoDigits(this)  ></td>";
        html += "</tr>";

        totalPiecesRows = totalPiecesRows + Number(saveTableLocation[i]['NPR']);
        totalWTRows = totalWTRows + parseFloat(saveTableLocation[i]['WTREC']);


        // totalPieces = Number($(this).find('TOTAL_NPR').text());
        //                     totalWT = parseFloat($(this).find('WtRec').text());

    });

    // alert(totalPiecesRows);
    // alert(totalWTRows);

    html += "</tbody></table>";
    $('#divShowGrid').append(html);



}

function AddTableLocation(index, LocationSeq, Location, Pieces, Weight) {


    html += "<tr>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'> <img id=imgMove_" + index + " src='images/Move.png' onclick='MoveToLocation(" + index + ");'></td>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocLoca_" + index + " class=form-control type=text style=text-align:right; value=" + Location + "></td>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtLocSeq_" + index + " class=form-control type=text style=text-align:right; value=" + LocationSeq + "></td>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Location + "</td>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Pieces + "</td>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocPcs_" + index + " class=form-control type=number style=text-align:right; value=" + Pieces + "  onkeyup=onlyNumbersTwoDigits(this) maxlength=10  onchange='CalculateWtVol(" + index + ");'></td>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtHideLocPcs_" + index + " class=form-control type=number style=text-align:right; value=" + Pieces + "  onkeyup=onlyNumbersTwoDigits(this) maxlength=10 ></td>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Weight + "</td>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocWt_" + index + " class=form-control type=number style=text-align:right; value=" + Weight + "  onkeyup=onlyNumbersTwoDigits(this) maxlength=10 ></td>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtHideLocWt_" + index + " class=form-control type=number style=text-align:right; value=" + Weight + "  onkeyup=onlyNumbersTwoDigits(this) maxlength=10 ></td>";
    html += "</tr>";

}

function AddLocation() {
    //  alert();
    var latestIndex = saveTableLocation.length;
    saveTableLocation.push({
        "index": latestIndex,
        "SEQNo": "",
        "LOC": "",
        "NPR": "",
        "WTREC": "",
        "NOTES": ""
    });

    buildTableData();
    $('#txtLocLoca_' + latestIndex).focus();
}


function AddLocationOLD() {
    //var LocCont = $('#divShowGrid').length;
    //var no = '0';
    var no = document.getElementById("tblNews").getElementsByTagName("tr").length;
    var LocCont = no + 1;
    //var LocCount;
    //    if ($('#divShowGrid > *').length > 0) {
    //        no = parseInt($('#divShowGrid').children().last().attr('id').split('_')[1]) + 1;
    //    }
    //    if (no != undefined || no != '') {
    //        LocCount = no;
    //    }




    var str = "";
    str += "<tr>";

    str += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><img id=imgMove_" + LocCont + " src='images/Move.png' onclick='MoveToLocation(" + LocCont + ");'></td>";
    str += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocLoca_" + LocCont + " class=form-control type=text style=text-align:right; value='' ></td>";
    str += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtLocSeq_" + LocCont + " class=form-control type=text style=text-align:right; value='0'></td>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Location + "</td>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Pieces + "</td>";
    str += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocPcs_" + LocCont + "  class=form-control type=number style=text-align:right; value='' onchange='CalculateWtVol(" + LocCont + ");'></td>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Weight + "</td>";
    str += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocWt_" + LocCont + "  class=form-control type=number style=text-align:right; value=''></td>";
    str += "</tr>";

    $('#tblNews').append(str);
    $('#txtLocLoca_' + LocCont).focus();

}

function CalculateWtVol(id) {

    //var ActNop = $('#txtHideLocPcs_' + id).val();
    //var ActWt = $('#txtHideLocWt_' + id).val();
    var ActNop = $('#txtShipNp').val();
    var ActWt = $('#txtShipWt').val();
    var currNOP = $('#txtLocPcs_' + id).val();
    //var currWt = $('#txtAWBGrossWt').val();

    //var ActWt = (parseFloat((ActNop / currNOP) * currWt)).toFixed(3);  //changed formula as interchanging ActNop & currnop causes increase in Gross Wt.  
    //var ActWt = (parseFloat((currNOP / ActNop) * currWt)).toFixed(3);
    var NewWt = (parseFloat((currNOP / ActNop) * ActWt)).toFixed(3);
    //$('#' + uxWtID).val(ActWt);

    $('#txtLocWt_' + id).val(NewWt);
    //$('#txtVolume').val(NewVol);
}

function GetLocation() {
    var LocationError = "";
    //var LocXml = '<Root>';
    var xml = "";
    $('#tblNews tbody tr').each(function (i, tr) {

        var LocSeq = $(this).find('[id*="txtLocSeq_"]');

        var Loca = $(this).find('[id*="txtLocLoca_"]');
        if (Loca.val() == "") {
            LocationError = 'Location cannot be blank.';
            //$.alert('Location cannot be blank.');
            return LocationError;
        }

        var Pcs = $(this).find('[id*="txtLocPcs_"]');
        if (Pcs.val() == "" || parseInt(Pcs.val()) <= 0) {
            LocationError = 'Pieces cannot be zero or empty.';
            return LocationError;
        }

        var Weight = $(this).find('[id*="txtLocWt_"]');
        if (Weight.val() == "" || parseFloat(Weight.val()) <= 0) {
            LocationError = 'Weight cannot be zero or empty.';
            return LocationError;
        }


        //xml = '<LD SEQNo=' + LocSeq.val() + 'LOC=' + Loca.val() + 'NPR' + Pcs.val() + 'WTREC' + Weight.val() + '/>';


        if (xml == "") {
            xml = '<LD SEQNo="' + LocSeq.val() + '" LOC="' + Loca.val() + '" NPR="' + Pcs.val() + '" WTREC="' + Weight.val() + '"/>';
        }
        else {
            xml = xml + '<LD SEQNo="' + LocSeq.val() + '" LOC="' + Loca.val() + '" NPR="' + Pcs.val() + '" WTREC="' + Weight.val() + '"/>';
        }

    });
    //return xml;
    if (LocationError != "") {
        return LocationError;
    }
    else {
        var LocXml = '<ROOT>' + xml + '</ROOT>'
        return LocXml;
    }
}

function MoveToLocation(id) {
    $('#txtLocLoca_' + id).val('');
    $('#txtLocLoca_' + id).focus();
}






