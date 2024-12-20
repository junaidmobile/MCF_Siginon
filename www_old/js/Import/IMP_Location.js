
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");
//var piecesTtl;
var PiecesVal;
// WeightVal;
//(function () {
//    document.addEventListener('deviceready', AddLocation, false);
//}
//)();

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

});

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
            url: GHAImportFlightserviceURL + "GetHouseNo",
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
            url: GHAImportFlightserviceURL + "GetFlightNoForAWB",
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
            url: GHAImportFlightserviceURL + "GetULDNumbers",
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
            url: GHAImportFlightserviceURL + "GetShipmentNo",
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

    HAWBNoLength = $('#ddlHAWB').find("option").length;
    if (HouseSeqNo == 0 && HAWBNoLength > 1) {
        errmsg = "Please select valid House No.";
        $.alert(errmsg);
        return;
    }

    //if (document.getElementById('chkReceive').checked)
    //    blnLocChange = 'true';
    //else
    //    blnLocChange = 'false';


    if (AWBNo == "" || FlightDate == "" || PckgsRCV == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;
    }

    //if ($('#txtFlightDate').val().length > 0) {
    //    var formattedDate = new Date($('#txtFlightDate').val());
    //    var d = formattedDate.getDate();
    //    if (d.toString().length < Number(2))
    //        d = '0' + d;
    //    var m = formattedDate.getMonth();
    //    m += 1;  // JavaScript months are 0-11
    //    if (m.toString().length < Number(2))
    //        m = '0' + m;
    //    var y = formattedDate.getFullYear();

    //    FlightDate = d + "-" + m + "-" + y;
    //}

    var LocCode = GetLocation();

    if (LocCode.indexOf("cannot be") >= 0) {
        $.alert(LocCode);
        return;
    }


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "HHTSaveImpLocation",
            data: JSON.stringify({
                'AWBpref': $('#txtAWBPrefix').val(), 'AWBNo': $('#txtAWBNo').val(), 'houseSeqNo': HouseSeqNo,
                'ShipNo': ShpNum, 'FltSeqNo': '0', 'ShipNpr': $('#txtShipNp').val(), 'ShipWt': $('#txtShipWt').val(),
                'LocXml': LocCode, 'UserID': UserId, 'AptCity': AirportCity, 'CompanyCode': CompanyCode,
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
                //$.alert('Details saved successfully');
                //window.location.reload();
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table1').each(function () {
                    if ($(this).find('Status').text() == 'E') {
                        $.alert($(this).find('Message').text());

                    }
                    else if ($(this).find('Status').text() == 'S') {
                        $.alert($(this).find('Message').text());
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
    $('#ddlShipmntNo').val(0);
    //$('#ddlShipmntNo').empty();
    $('#txtShipNp').val('');
    $('#txtShipWt').val('');
    $('#divShowGrid').empty();
    $('#txtScanCode').focus();
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
    var ShipmentNo = 0;
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


    var inputXML = '<Root><AWBPref>' + MAWBPrefix + '</AWBPref><AWBNo>' + MAWBNo + '</AWBNo><HouseSeqNo>' + HAWBid + '</HouseSeqNo><ShipNo>' + ShipmentNo + '</ShipNo><Module>I</Module><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        clearDetails();
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "HHTGetLocationDetails",
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


                            html = '';

                            html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                            html += "<thead><tr>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:10%' align='center'font-weight:'bold'>Move</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:15%' align='center'font-weight:'bold'>Location</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; display:none;' align='center'font-weight:'bold'>Location</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:15%' align='center'font-weight:'bold'>Pieces</th>";
                            // html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%; display:none;' align='center'font-weight:'bold'>HidePcs</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:15%' align='center'font-weight:'bold'>Weight</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:10%;' align='center'font-weight:'bold'>Remove</th>";
                            html += "</tr></thead>";
                            html += "<tbody>";

                            var xmlDoc = $.parseXML(str);

                            $(xmlDoc).find('Table').each(function () {

                                var LocationSeq;
                                var Location;
                                var Pieces;
                                var Weight;
                                // var houseSeqNo, ReceivedShipNoOption, HAWBOption;


                                ReceivedShipNo = $(this).find('SHIPMENT_NUMBER').text();
                                houseSeqNo = $(this).find('HOUSE_SEQ_NO').text();
                                LocationSeq = $(this).find('SeqNo').text();
                                Location = $(this).find('LocCode').text();
                                Pieces = $(this).find('NOP').text();
                                Weight = $(this).find('Weight').text();
                                PiecesVal = Pieces;
                                $('#txtShipNp').val($(this).find('npr').text());
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
                                AddTableLocation(index, LocationSeq, Location, Pieces, Weight);
                            });

                            html += "</tbody></table>";


                            $('#divShowGrid').append(html);

                        }
                        $('#btnClearAll').focus();
                    });

                    if (parseInt(houseSeqNo) > 0) {
                        $(xmlDoc).find('Table1').each(function (index) {
                            //if ($('#ddlShipmntNo').find('option:selected').text() == 'Select')
                            //    {
                            //    $('#ddlShipmntNo').empty();
                            //}
                            if ($(this).find('HOUSE_SEQ_NO') == 0) {
                                var HAWB;
                                var HAWBSeqNo;
                                HAWB = $(this).find('HOUSE_NUMBER').text();
                                HAWBSeqNo = $(this).find('HOUSE_SEQUENCE_NUMBER').text();

                                //if (index == 0) {
                                //    var newOption = $('<option></option>');
                                //    newOption.val(0).text('Select');
                                //    newOption.appendTo('#ddlHAWB');
                                //}

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

                                //if (index == 0) {
                                //    var newOption = $('<option></option>');
                                //    newOption.val(0).text('Select');
                                //    newOption.appendTo('#ddlHAWB');
                                //}

                                var newOption = $('<option></option>');
                                newOption.val(HAWBSeqNo).text(HAWB);
                                newOption.appendTo('#ddlHAWB');

                                if (index == 0) {
                                    $('#ddlHAWB').val(HAWBSeqNo);
                                }
                            }



                        });

                        $(xmlDoc).find('Table2').each(function (index) {
                            //if ($('#ddlShipmntNo').find('option:selected').text() == 'Select')
                            //    {
                            //    $('#ddlShipmntNo').empty();
                            //}


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
                            //if ($('#ddlShipmntNo').find('option:selected').text() == 'Select')
                            //    {
                            //    $('#ddlShipmntNo').empty();
                            //}


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

    var inputXML = '<Root><AWBPref>' + MAWBPrefix + '</AWBPref><AWBNo>' + MAWBNo + '</AWBNo><HouseSeqNo>' + HAWBid + '</HouseSeqNo><ShipNo>' + ShipmentNo + '</ShipNo><Module>I</Module><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "HHTGetLocationDetails",
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

                if (response != null && response != "" && response != "<NewDataSet />") {

                    $(xmlDoc).find('Table').each(function (index) {
                        // $('#ddlShipmntNo').empty();
                        $('#divShowGrid').empty();
                        var str = response;
                        if (str != null && str != "") {


                            html = '';

                            html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                            html += "<thead><tr>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Move</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; display:none;' align='center'font-weight:'bold'>Location</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Pieces</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%; display:none;' align='center'font-weight:'bold'>HidePcs</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%' align='center'font-weight:'bold'>Weight</th>";
                            html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%; display:none;' align='center'font-weight:'bold'>HideWeight</th>";
                            html += "</tr></thead>";
                            html += "<tbody>";

                            var xmlDoc = $.parseXML(str);

                            $(xmlDoc).find('Table').each(function () {

                                var LocationSeq;
                                var Location;
                                var Pieces;
                                var Weight;

                                ReceivedShipNo = $(this).find('SHIPMENT_NUMBER').text();

                                LocationSeq = $(this).find('SeqNo').text();
                                Location = $(this).find('LocCode').text();
                                Pieces = $(this).find('NOP').text();
                                Weight = $(this).find('Weight').text();
                                $('#txtShipNp').val($(this).find('npr').text());
                                $('#txtShipWt').val($(this).find('WtRec').text());


                                AddTableLocation(index, LocationSeq, Location, Pieces, Weight);
                            });

                            html += "</tbody></table>";


                            $('#divShowGrid').append(html);

                        }
                        $('#btnClearAll').focus();
                    });

                    //$(xmlDoc).find('Table1').each(function (index) {
                    //    //if ($('#ddlShipmntNo').find('option:selected').text() == 'Select')
                    //    //    {
                    //    //    $('#ddlShipmntNo').empty();
                    //    //}


                    //    var HAWB;
                    //    var HAWBSeqNo;
                    //    HAWB = $(this).find('HOUSE_NUMBER').text();
                    //    HAWBSeqNo = $(this).find('HOUSE_SEQUENCE_NUMBER').text();

                    //    //if (index == 0) {
                    //    //    var newOption = $('<option></option>');
                    //    //    newOption.val(0).text('Select');
                    //    //    newOption.appendTo('#ddlHAWB');
                    //    //}

                    //    var newOption = $('<option></option>');
                    //    newOption.val(HAWBSeqNo).text(HAWB);
                    //    newOption.appendTo('#ddlHAWB');

                    //    if (index == 0) {
                    //        $('#ddlHAWB').val(HAWBSeqNo);
                    //    }

                    //});

                    $(xmlDoc).find('Table1').each(function (index) {
                        //if ($('#ddlShipmntNo').find('option:selected').text() == 'Select')
                        //    {
                        //    $('#ddlShipmntNo').empty();
                        //}


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

function AddTableLocation(index, LocationSeq, Location, Pieces, Weight) {
    var locPcsText = JSON.stringify("txtLocPcs_" + index);
    html += "<tr>";
    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'> <img id=imgMove_" + index + " src='images/Move.png' onclick='MoveToLocation(" + index + ");'></td>";
    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocLoca_" + index + " class=form-control type=text style=text-align:right; value=" + Location + "></td>";
    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtLocSeq_" + index + " class=form-control type=text style=text-align:right; value=" + LocationSeq + "></td>";

    //html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Location + "</td>";

    //html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Pieces + "</td>";
    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocPcs_" + index + " class=form-control type=number style=text-align:right; value=" + Pieces + ' ' + " onchange='CalculateWtVol(" + index + ");' onkeyup='NumberOnlytxtPkg(" + locPcsText + ");'</td>"
    // onkeyup='NumberOnlytxtPkg('" + locPcsText + "')'></td>";
    // "'"+text+"'"
    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtHideLocPcs_" + index + " class=form-control type=number style=text-align:right; value=" + Pieces + "></td>";

    //html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Weight + "</td>";
    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocWt_" + index + " class=form-control type=number style=text-align:right; value=" + Weight + "></td>";
    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtHideLocWt_" + index + " class=form-control type=number style=text-align:right; value=" + Weight + "></td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px;align=center;text-align: center'></td>";
    html += "</tr>";
    //<a class='delete' onclick ='remove($(this));'><img id=imgMove_" + index + " src='images/cancel.png'/> </a>
}


function AddLocation() {
    //var LocCont = $('#divShowGrid').length;
    //var no = '0';
    var no = document.getElementById("tblNews").getElementsByTagName("tr").length;
    var LocCont = no - 1;
    //var LocCount;
    //    if ($('#divShowGrid > *').length > 0) {
    //        no = parseInt($('#divShowGrid').children().last().attr('id').split('_')[1]) + 1;
    //    }
    //    if (no != undefined || no != '') {
    //        LocCount = no;
    //    }

    var str = "";
    str += "<tr>";

    str += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><img id=imgMove_" + LocCont + " src='images/Move.png' onclick='MoveToLocation(" + LocCont + ");'></td>";
    str += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocLoca_" + LocCont + " class=form-control type=text style=text-align:right; value='' ></td>";
    str += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtLocSeq_" + LocCont + " class=form-control type=text style=text-align:right; value='0'></td>";


    //html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Location + "</td>";

    //html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Pieces + "</td>";
    str += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocPcs_" + LocCont + "  class=form-control type=number style=text-align:right; value='' onchange='CalculateWtVol(" + LocCont + ");'></td>";

    //html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Weight + "</td>";
    str += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtLocWt_" + LocCont + "  class=form-control type=number style=text-align:right; value=''></td>";
    str += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px;align=center;text-align: center'><a class='delete' onclick ='remove($(this));'><img src='images/cancel.png'/></a></td>";
    str += "</tr>";

    $('#tblNews').append(str);
    $('#txtLocLoca_' + LocCont).focus();

    getPiecesTotalLocation(LocCont);
}

function remove(row) {
    row.closest('tr').remove();
}


function CalculateWtVol(id) {
    setWeight(id);
}

function setWeight(id) {
    var ActNop = $('#txtShipNp').val();
    var ActWt = $('#txtShipWt').val();
    var currNOP = $('#txtLocPcs_' + id).val();
    //var currWt = $('#txtAWBGrossWt').val();

    //var ActWt = (parseFloat((ActNop / currNOP) * currWt)).toFixed(3);  //changed formula as interchanging ActNop & currnop causes increase in Gross Wt.
    //var ActWt = (parseFloat((currNOP / ActNop) * currWt)).toFixed(3);
    var NewWt = (parseFloat((currNOP / ActNop) * ActWt)).toFixed(3);
    $('#txtLocWt_' + id).val(NewWt);

}
function getPiecesTotal(id) {
    setWeight(id);
    var t = document.getElementById("tblNews");
    var totalRows = t.rows.length - 2;
    $('#tblNews tbody tr').each(function (i, tr) {
        if (Number($('#txtLocPcs_' + id).val()) > Number(PiecesVal)) {
            $('#txtLocPcs_' + id).val("");
            $('#txtLocWt_' + id).val("");
            $.alert("Pieces value cannot be greater");
            return;
        } else {
            if (i != id) {
                var _txtLocPcs = (PiecesVal - Number($('#txtLocPcs_' + id).val()))
                var finalPcsVal = _txtLocPcs / totalRows;
                var getRemainingVal = (_txtLocPcs / totalRows) - Math.floor(finalPcsVal);
                console.log("Remaining Val ", getRemainingVal);
                $(this).find('[id*="txtLocPcs_"]').val(Math.floor(finalPcsVal));
                setWeight(i);
            } else {
                setWeight(i);
            }
        }

    });
}


function getPiecesTotalLocation(id) {
    //    setWeight(id);
    var totalPcs = getTotalPcs("tblNews");
    //    alert("total : " + totalPcs + "Pieces Val " + PiecesVal);
    if (totalPcs != PiecesVal && totalPcs <= PiecesVal) {
        $('#txtLocPcs_' + id).val(PiecesVal - totalPcs);
        setWeight(id);
    }
}

function getTotalPcs(tableId) {
    // returns an array for the values of all input elements in the last row of given table
    var t = document.getElementById(tableId);
    var a = []
    for (var i = 0; i < t.rows.length; i++) {
        var r = t.rows[i];
        var inputs = r.getElementsByTagName("input");
        var result = new Array(inputs.length);
        for (var j = 0; j < inputs.length; j++)
            result[j] = inputs[j].value; // not innerHTML or something
        a.push(result);
        // return result;
    }
    return getSumOfPieces(a);

}

function getSumOfPieces(array) {
    var split_objects = array.map(function (str) {
        return { pieces: str[2], weight: str[3] }
    });

    var add = 0;
    for (var i = 0; i < split_objects.length; i++) {
        var obj = split_objects[i];
        if (obj.pieces != undefined && obj.weight != undefined) {
            add += Number(obj.pieces)
        }
    }
    //    console.log("add", add)
    return add;
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






