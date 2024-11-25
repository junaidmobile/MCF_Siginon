
var CargoWorksServiceURL = window.localStorage.getItem("CargoWorksServiceURL");
//var CargoWorksServiceURL = "http://10.22.3.154/Galaxy/services/hhtexpservices.asmx/";

//var AirportCity = "FRA";
//var UserId = "252";
//var CompanyCode = "3";
//var SHEDCODE = "KS1";


var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");
var flightSeqNo;
var ULDSeqNo;
var XMLshipmentDt;
var ULD_MODE;


$(function () {

    $("#divULDNo").hide();
    $("#drULD").hide();
    $('#ddlULDNo').val('');

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
    $('#lblVCTNo').text("VCT Nr.");
    $('#lblAcceptance').text("VCT Annahme");
    $('#lblULDNo').text("ULD Nr.");
    $('#lblAwbNo').text("AWB Nr.");
    $('#lblShipmentNo').text("Sendungs Nr.");
    $('#lblPackages').text("Stückzahl");
    $('#lblGrWt').text("Brutto Gewicht");
    $('#lblLocation').text("Stellplatz");
    $('#lblTruckSealed').text("LKW Versiegelt");
    $('#lblTruckNotSealed').text("LKW nicht Versiegelt");
    $('#btnModify').val("Senden");
}

function setRussian() {
    $('#lblVCTNo').text("VCT No");
    $('#lblAcceptance').text("приём VCT");
    $('#lblULDNo').text("номер ULD");
    $('#lblAwbNo').text("номер авианакладной");
    $('#lblShipmentNo').text("номер партии");
    $('#lblPackages').text("количество");
    $('#lblGrWt').text("вес брутто");
    $('#lblLocation').text("добавить место");
    //$('#lblTruckSealed').text("");
    //$('#lblTruckNotSealed').text("");
    $('#btnModify').val("отправить");
}

function setTurkish() {
    $('#lblVCTNo').text("VCT No");
    $('#lblAcceptance').text("VCT kabul");
    $('#lblULDNo').text("ULD No.");
    $('#lblAwbNo').text("AWB No.");
    $('#lblShipmentNo').text("gösteri Nr.");
    $('#lblPackages').text("Paket Sayisi");
    $('#lblGrWt').text("brüt ağırlık");
    $('#lblLocation').text("yer");
    //$('#lblTruckSealed').text("");
    //$('#lblTruckNotSealed').text("");
    $('#btnExcLanded').val("çikiş");
    $('#btnModify').val("göndermek");
}

function MovetoNext(current, nextFieldID) {
    if (current.value.length >= current.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}


function GetAutoULDAWBDetails() {

    var VCTCode = $('#txtVCTNo').val();
    VCTCode = VCTCode.replace(/\s+/g, '');
    VCTCode = VCTCode.replace("-", "").replace("–", "");

    if (VCTCode.length >= 10) {

        //GetAWBDetailsforVCT();
        GetULDDetailsforVCT();
    }
}

function GetULDDetailsforVCT() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";
    var VCTNo = $('#txtVCTNo').val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    inputxml = '<Root><VCTNo>' + VCTNo + '</VCTNo><CompanyCode>3</CompanyCode><AirportCity>' + AirportCity + '</AirportCity></Root>';

    clearALLControls();
    $('#ddlULDNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHTGetVCTDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                var ULDId = "";
                var ULD = "";
                var AWB = "";
                var UldAccRel;


                $(xmlDoc).find('Table').each(function (index) {

                    ULDId = $(this).find('ULDSeqNo').text();
                    ULD = $(this).find('ULDNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULD);
                    newOption.appendTo('#ddlULDNo');

                    $('#ddlAcceptance').val("1");

                });

                $(xmlDoc).find('Table1').each(function (index) {
                    AWBId = $(this).find('AWBNo').text();
                    AWB = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWB);
                    newOption.appendTo('#ddlAWBNo');

                    if ((ULDId == "") && (ULD == "")) {
                        $('#ddlAcceptance').val("0");
                        $('#lblAcceptance').text("Acceptance");
                    }
                });

                $(xmlDoc).find('Table2').each(function (index) {

                    ULD_MODE = $(this).find('ULD_MODE').text();
                    UldAccRel = $(this).find('UldAccRel').text();

                    //if (ULD_MODE>0)
                    //{
                    //    //$('#ddlAcceptance').find('option:selected').val(1); 
                    //    $('#ddlAcceptance').val("1");
                    //}
                    if ((ULDId == "") && (AWB == "")) {
                        $('#ddlAcceptance').val("1");
                    }

                    if (ULDId == "") {
                        $("#drULD").hide();
                        $("#ddlULD").empty();
                    }
                    else if ((ULDId != "") && (UldAccRel == "A")) {
                        $("#drULD").show();
                        $("#ddlULD").empty();

                        var newOption = $('<option></option>');
                        newOption.val('').text('Select');
                        newOption.appendTo('#ddlULD');
                    }
                    else {
                        $("#drULD").hide();
                        $("#ddlULD").empty();
                    }

                    if (AWB != "") {
                        $("#drRadiobtn").show();
                    }
                    else {
                        $("#drRadiobtn").hide();
                    }

                    if (UldAccRel == "A") {
                        $('#lblAcceptance').text("Acceptance");
                    }
                    else if (UldAccRel == "R") {
                        //$('#ddlAcceptance').val("0");
                        $('#lblAcceptance').text("Release");
                    }

                    //var newOption = $('<option></option>');   
                    //newOption.val(ULDId).text(ULD);
                    //newOption.appendTo('#ddlULDNo');
                    if ((ULD_MODE > 0) && ($('#ddlAcceptance').val() == "1")) {
                        $("#divULDNo").show();
                        $("#divUldDrp").hide();
                    }
                    else {
                        $("#divULDNo").hide();
                        $("#divUldDrp").show();
                    }

                    if (($('#ddlAcceptance').val() == "1")) {
                        $("#ddlAWBNo").attr("disabled", "disabled");
                        $("#ddlShipmentNo").attr("disabled", "disabled");
                        $("#ddlGrossWtUnit").attr("disabled", "disabled");
                        $("#txtPackages").attr("disabled", "disabled");
                        $("#txtGrossWt").attr("disabled", "disabled");
                    }
                    else {
                        $("#ddlAWBNo").removeAttr("disabled", "disabled");
                        $("#ddlShipmentNo").removeAttr("disabled", "disabled");
                        $("#ddlGrossWtUnit").removeAttr("disabled", "disabled");
                        $("#txtPackages").removeAttr("disabled", "disabled");
                        $("#txtGrossWt").removeAttr("disabled", "disabled");
                    }

                    if ((UldAccRel == "R") && ($('#ddlAcceptance').val() == "1")) {
                        $("#txtLocation").attr("disabled", "disabled");
                        $("#chkSealed").attr("disabled", "disabled");
                        $("#chkNotSealed").attr("disabled", "disabled");
                    }
                    else {
                        $("#txtLocation").removeAttr("disabled", "disabled");
                        $("#chkSealed").removeAttr("disabled", "disabled");
                        $("#chkNotSealed").removeAttr("disabled", "disabled");
                    }

                });

                if (ULD_MODE == 0) {

                    $(xmlDoc).find('Table3').each(function (index) {

                        var ULDValue = "";
                        var ULDText = "";

                        ULDText = $(this).find('Text').text();
                        ULDValue = $(this).find('Value').text();

                        var newOption = $('<option></option>');
                        newOption.val(ULDValue).text(ULDText);
                        newOption.appendTo('#ddlULD');

                    });
                }
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

function GetAWBDetailsforVCT() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    $('#ddlAWBNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetVCTAWBDetail",
            data: JSON.stringify({
                'strVCTNo': $('#txtVCTNo').val(), 'strCompanyCode': CompanyCode, 'strAirportCity': AirportCity, 'strShedCode': SHEDCODE, 'strUserId': UserId,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table').each(function (index) {

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlAWBNo');
                    }
                    var ULDId;
                    var ULD;
                    AWBId = $(this).find('AWBNo').text();
                    AWB = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWB);
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

function GetAWBDetailsForULD(ULDid) {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    $('#ddlAWBNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetVCTULDAWBDetail",
            data: JSON.stringify({
                'strVCTNo': $('#txtVCTNo').val(), 'strULDSeqNo': ULDid, 'strCompanyCode': CompanyCode, 'strAirportCity': AirportCity, 'strShedCode': SHEDCODE, 'strUserId': UserId,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table').each(function (index) {

                    var AWBId;
                    var AWB;
                    AWBId = $(this).find('AWBNo').text();
                    AWB = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWB);
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

function GetShipmentDetails(AWBid) {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (AWBid == '0')
        return;

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    $('#ddlShipmentNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetShipmentNo",
            data: JSON.stringify({
                'strAWBNo': AWBid, 'CompanyCode': CompanyCode, 'strAirportCity': AirportCity, 'strCycle': 'E',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                XMLshipmentDt = Result;

                $(xmlDoc).find('Table').each(function (index) {

                    var ShpmentId;
                    var ShpmentNo;
                    var Remarks;
                    ShpmentId = $(this).find('SHIPMENT_NUMBER').text();
                    ShpmentNo = $(this).find('SHIPMENT_NUMBER').text();

                    var newOption = $('<option></option>');
                    newOption.val(ShpmentId).text(ShpmentNo);
                    newOption.appendTo('#ddlShipmentNo');

                    if (index == 0) {
                        Packages = $(this).find('NOP').text();
                        GrossWt = $(this).find('WEIGHT_KG').text();
                        Remarks = $(this).find('Remarks').text();

                        $('#txtPackages').val(Packages);
                        $('#txtGrossWt').val(GrossWt);
                        $('#txtRemarks').val(Remarks);
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

function GetShipmentRelatedDetails(ShipmentId) {

    var xml = $.parseXML(XMLshipmentDt);

    $(xml).find('Table').each(function (index) {

        var ShpmentNo;
        ShpmentNo = $(this).find('SHIPMENT_NUMBER').text();

        if (ShpmentNo == ShipmentId) {
            Packages = $(this).find('NOP').text();
            GrossWt = $(this).find('WEIGHT_KG').text();

            $('#txtPackages').val(Packages);
            $('#txtGrossWt').val(GrossWt);
            return;
        }

    });
}

function setDetailsOnSelected(selectedVal) {
    GetAWBDetailsforVCT();
    if (selectedVal == 0) {
        $("#ddlULDNo").attr("disabled", "disabled");
        $("#ddlULD").attr("disabled", "disabled");
        $("#ddlAWBNo").removeAttr("disabled", "disabled");
        $("#ddlShipmentNo").removeAttr("disabled", "disabled");
        $("#ddlGrossWtUnit").removeAttr("disabled", "disabled");
        $("#txtPackages").removeAttr("disabled", "disabled");
        $("#txtGrossWt").removeAttr("disabled", "disabled");
    } else {
        $("#ddlULDNo").removeAttr("disabled", "disabled");
        $("#ddlULD").removeAttr("disabled", "disabled");
        $("#ddlAWBNo").attr("disabled", "disabled");
        $("#ddlShipmentNo").attr("disabled", "disabled");
        $("#ddlGrossWtUnit").attr("disabled", "disabled");
        $("#txtPackages").attr("disabled", "disabled");
        $("#txtGrossWt").attr("disabled", "disabled");
    }
}


function SaveDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var AcceptanceText = $('#ddlAcceptance').find('option:selected').text();
    var AcceptanceType;
    var inputULD = "";
    var istruckSealed = 'false';

    if (document.getElementById('chkSealed').checked) {
        istruckSealed = 'true';
    } else if (document.getElementById('chkNotSealed').checked) {
        istruckSealed = 'false';
    }

    if (AcceptanceText == "AWB") {

        var strAWBNo = $('#ddlAWBNo').find('option:selected').text();
        var strPkgs = $('#txtPackages').val();
        var strGrossWt = $('#txtGrossWt').val();
        var strLocationCode = $('#txtLocation').val();
        var strShipmentNo = $('#ddlShipmentNo').find('option:selected').text();
        var strWtUnit = 'KG';
        AcceptanceType = "A";


        //if ((document.getElementById('chkSealed').checked = "false") && (document.getElementById('chkNotSealed').checked = "false")) {
        if ($('input[name=SealTruck]:checked').length == 0) {
            errmsg = "Please select truck sealed or not sealed.</br>";
            $.alert(errmsg);
            return;
        }

        if (strPkgs == "" || strGrossWt == "" || strLocationCode == "") {

            errmsg = "Please enter all the required fields.</br>";
            $.alert(errmsg);
            return;
        }

        if (strAWBNo.length != '11') {
            errmsg = "Please enter valid AWB No.";
            $.alert(errmsg);
            return;
        }
        var seqNo = ''
        if ($('#ddlULDNo').find('option:selected').val() != undefined) {
            // $('#ddlULDNo').val('')
            seqNo = $('#ddlULDNo').find('option:selected').val();
        }

        inputULD = '<ROOT><ULDData ULDSeqNo="' + seqNo + '" Loc="' + strLocationCode + '"/></ROOT>';

        var inputXML = '<ROOT><AWBData AWBNo="' + strAWBNo + '" ShipNo="' + strShipmentNo + '" Pcs="' + strPkgs + '" Weight="' + strGrossWt + '" WtUnit="' + strWtUnit + '" Loc="' + strLocationCode + '" IsRFM="1"/></ROOT>';
    }
    else if (AcceptanceText == "ULD") {


        var strLocationCode = $('#txtLocation').val();
        //var ULDOwner = $('#txtOwner').val();

        //if (ULDOwner.length() < 2)
        //{
        //    errmsg = "ULD Owner should be greater than or equal to 2 characters.";
        //    $.alert(errmsg);
        //    return;
        //}
        var ULDCondCode = $('#ddlULD').find('option:selected').val();

        if ($('#lblAcceptance').text() == "Acceptance") {
            if (strLocationCode == "") {

                errmsg = "Please enter location.</br>";
                $.alert(errmsg);
                return;
            }
        }

        AcceptanceType = "U";

        if ((ULD_MODE > 0) && ($('#ddlAcceptance').val() == "1")) {
            inputULD = '<ROOT><ULDData ULDSeqNo="0" ULDType="' + $('#txtULDType').val().toUpperCase() + '" ULDNumber="' + $('#txtULDNumber').val() + '" ULDOwner="' + $('#txtOwner').val().toUpperCase() + '" Loc="' + strLocationCode + '"/></ROOT>';
        }
        else {
            inputULD = '<ROOT><ULDData ULDSeqNo="' + $('#ddlULDNo').find('option:selected').val() + '" Loc="' + strLocationCode + '" ULDCondCode="' + ULDCondCode + '"/></ROOT>';
        }
        //var inputULD = '<ROOT><ULDData ULDSeqNo="' + $('#ddlULDNo').find('option:selected').val() + '" Loc="' + strLocationCode + '"/></ROOT>';
        var inputXML = '<ROOT></ROOT>';
    }


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "AcceptAWBVCT",
            //data: JSON.stringify({
            //    'strAWBNo': strAWBNo, 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode,
            //    'strPkgs': strPkgs, 'strGrossWt': strGrossWt, 'strLocationCode': strLocationCode,
            //    'strShipmentNo': strShipmentNo, 'strUserID': UserId, 'strLifeCycleStatus': 'E',
            //    'strWtUnit': strWtUnit, 'blnLocChange': 'false', 'intRecLoc': receive,
            //}),
            data: JSON.stringify({
                'AWBXml': inputXML, 'VCTNo': $('#txtVCTNo').val(), 'ULDxml': inputULD,
                'AcceptanceType': AcceptanceType, 'IsTruckSealed': istruckSealed, 'AptCity': AirportCity,
                'CompCode': CompanyCode, 'UserID': UserId, 'ShedCode': SHEDCODE
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
                ////$.alert(response.d);
                ////window.location.reload();
                //$.alert('Data saved successfully');
                //response = response.d;
                //var xmlDoc = $.parseXML(response);
                $('#txtLocation').val('');
                $('#txtULDType').val('');
                $('#txtULDNumber').val('');
                $('#txtOwner').val('');


                $("body").mLoading('hide');
                $.alert(response.d);
            },
            //error: function (msg) {
            //    $("body").mLoading('hide');
            //    $.alert('Some error occurred while saving data');
            //    //$.alert('Details saved successfully');
            //}
            error: function (msg) {
                HideLoader();
                var r = jQuery.parseJSON(msg.responseText);
                alert("Message: " + r.Message);
            }
        });
        return false;
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
    $('#txtRemarks').val('');
}

function clearALLControls() {
    $('#txtPackages').val('');
    $('#txtGrossWt').val('');
    $('#txtLocation').val('');
    $('#txtRemarks').val('');
    $('#ddlAWBNo').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlAWBNo');

    $('#ddlShipmentNo').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlShipmentNo');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}




