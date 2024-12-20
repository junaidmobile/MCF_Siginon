

var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");

//var GHAImportFlightserviceURL = "http://10.22.3.150/galaxy/services/hhtimpservices.asmx/";

var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");
var WDOid;
var WDOMode;
var TotPkgs = "";
var TotGrWT = "";
var SEQ_NO;
var ShipmentNo;
var ActNop;
var ActWt;
var LocationCnt;
var NPR;
var WT;
var HouseSeqNo = "";
var RNO;


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
    $('#lblRotationNo').text("Ticket");
    $('#lblWDO').text("WDO Nr.");
    $('#lblAWB').text("AWB Nr.");
    $('#lblHAWB').text("HAWB Nr.");
    $('#lblPcs').text("Stückzahl");
    $('#lblWt').text("Gewicht");
    $('#lblLocationCode').text("Stellplatz Code");
    $('#lblDeliver').text("Auslagern");
    $('#btnModify').val("Senden");

}

function setRussian() {
    $('#lblRotationNo').text("Ticket");
    $('#lblWDO').text("WDO Nr.");
    $('#lblAWB').text("номер авианакладной");
    $('#lblHAWB').text("номер HAWB");
    $('#lblPcs').text("количество");
    $('#lblWt').text("вес");
    $('#lblLocationCode').text("код места");
    $('#lblDeliver').text("выдать");
    $('#btnModify').val("отправить");
}

function setTurkish() {
    $('#lblRotationNo').text("Ticket");
    $('#lblWDO').text("WDO Nr.");
    $('#lblAWB').text("AWB No.");
    $('#lblHAWB').text("HAWB No.");
    $('#lblPcs').text("Paket Sayisi");
    $('#lblWt').text("ağırlık");
    $('#lblLocationCode').text("konum kodu");
    $('#lblDeliver').text("teslim");
    $('#btnExcLanded').val("çikiş");
    $('#btnModify').val("göndermek");
}


function ChkAndValidate() {

    var RotationNo = $('#txtWDONo').val();
    RotationNo = RotationNo.replace(/\s+/g, '');
    RotationNo = RotationNo.replace("-", "").replace("–", "");

    if (RotationNo.length >= 12) {

        GetWDOdetails();
    }
}

function GetWDOdetails() {

    //$('#txtWDONo').val('');
    $('#txtAWBNo').val('');
    $('#txtHAWBNo').val('');
    $('#txtLocation').val('');
    $('#txtPcs').val('');
    $('#txtWt').val('');

    var inputxml = '<Root><WDONo>' + $('#txtWDONo').val() + '</WDONo><RNo></RNo><CompanyCode>' + CompanyCode + '</CompanyCode><AirportCity>' + AirportCity + '</AirportCity></Root>';

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var RotationNo = $('#txtWDONo').val();

    if (RotationNo == "") {
        //errmsg = "Please enter valid Flight No.";
        //$.alert(errmsg);
        return;
    }


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            //url: GHAImportFlightserviceURL + "GetRNoDetails",  
            url: GHAImportFlightserviceURL + "HHTGetWDODetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                var str = Result;
                if (str != null && str != "" && str != "<NewDataSet />") {

                    $(xmlDoc).find('Table').each(function (index) {
                        WDOMode = $(this).find('Mode').text();
                        if (WDOMode == 'A') {
                            RNO = $(this).find('R_NO').text();
                            $('#lblddlAWB').text("AWB List");
                            $('#lblAWB').text("AWB No.");
                            $('#txtHAWBNo').show();
                            $('#lblHAWB').show();


                            WDOid = $(this).find('WDO_DT').text();
                            var WDONo = $(this).find('WDO_NO').text();
                            var AWBNo = $(this).find('AWB_PREFIX').text() + $(this).find('AWB_NUMBER').text();
                            var HAWBNo = $(this).find('HOUSE_NUMBER').text();
                            HouseSeqNo = $(this).find('HOUSE_SEQ_NO').text();
                            ShipmentNo = $(this).find('SHIPMENT_NUMBER').text();
                            var Location = $(this).find('WAREHOUSE_LOCATION_CODE').text();
                            NPR = $(this).find('NPR').text();
                            WT = $(this).find('WT').text();
                            var Packages = $(this).find('PKG_RECD').text();
                            var Weight_Rcd = $(this).find('WT_RECD').text();
                            ActNop = $(this).find('PKG_RECD').text();
                            ActWt = $(this).find('WT_RECD').text();
                            TotPkgs = $(this).find('TotWDOPcs').text();
                            TotGrWT = $(this).find('TotWDOWt').text();
                            LocationCnt = $(this).find('DistinctLocCnt').text();

                            $('#txtWDONo').val(WDONo);
                            $('#txtAWBNo').val(AWBNo);
                            $('#txtHAWBNo').val(HAWBNo);
                            $('#txtLocation').val(Location);
                            $('#txtPcs').val(Packages);
                            $('#txtWt').val(Weight_Rcd);
                        }
                        if (WDOMode == 'U') {
                            $('#lblddlAWB').text("ULD List");
                            $('#lblAWB').text("ULD No.");
                            $('#txtHAWBNo').hide();
                            $('#lblHAWB').hide();

                            WDOid = $(this).find('WDO_DT').text();
                            SEQ_NO = $(this).find('SEQUENCE_NUMBER').text();
                            var UldNo = $(this).find('UldNo').text();
                            var WareHouseLoc = $(this).find('WAREHOUSE_LOCATION_CODE').text();
                            var PKG_RECD = $(this).find('PKG_RECD').text();
                            var WT_RECD = $(this).find('WT_RECD').text();

                            $('#txtPcs').attr("disabled", "disabled");
                            $('#txtWt').attr("disabled", "disabled");
                            $('#txtAWBNo').val(UldNo);
                            $('#txtLocation').val(WareHouseLoc);
                            $('#txtPcs').val(PKG_RECD);
                            $('#txtWt').val(WT_RECD);
                        }
                    });

                    $(xmlDoc).find('Table1').each(function (index) {

                        if (WDOMode == 'A') {
                            var AWBNo;
                            AWBNo = $(this).find('AWBNo').text();

                            $('#ddlAWB').empty();
                            var newOption = $('<option></option>');
                            newOption.val(AWBNo).text(AWBNo);
                            newOption.appendTo('#ddlAWB');
                        }
                        if (WDOMode == 'U') {

                            var ULDNo;
                            ULDNo = $(this).find('ULDNo').text();
                            ULDValue = $(this).find('Value').text();

                            $('#ddlAWB').empty();
                            var newOption = $('<option></option>');
                            newOption.val(ULDValue).text(ULDNo);
                            newOption.appendTo('#ddlAWB');
                        }

                    });

                }
                else {
                    $.alert('No record found.');
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

function CalculateWtVol() {

    var currNOP = $('#txtPcs').val();
    var currWt = $('#txtWt').val();


    //var ActWt = (parseFloat((ActNop / currNOP) * currWt)).toFixed(3);  //changed formula as interchanging ActNop & currnop causes increase in Gross Wt.  
    var NewWt = (parseFloat((currNOP / ActNop) * ActWt)).toFixed(3);
    //$('#' + uxWtID).val(ActWt);

    $('#txtWt').val(NewWt);
}

function SaveDetails() {

    if (((parseInt(TotPkgs) + parseInt($('#txtPcs').val())) < parseInt(NPR)) && (LocationCnt > 1)) {
        lnv.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to deliver part shipment?',
            confirmHandler: function () {
                $("#divAddAWBDetails").show();
                $('#txtPcs').attr("disabled", "disabled");
                $('#txtWt').attr("disabled", "disabled");
                $('#btnExcLanded').attr("disabled", "disabled");
                $('#btnModify').attr("disabled", "disabled");

                $('#txtpartPcs').val((parseInt(NPR) - parseInt($('#txtPcs').val())));
                $('#txtpartWt').val((parseFloat(WT) - parseFloat($('#txtWt').val())).toFixed(3));
                $('#txtpartLocation').focus();

            },
            cancelHandler: function () {
            }
        })

    }
    else if ((parseInt(TotPkgs) + parseInt($('#txtPcs').val())) > parseInt(NPR)) {

        $.alert('No. of pieces cannot be greater than received pieces. (' + NPR + ')');

    }

    else {
        if ($('#txtWDONo').val() == "") {

            errmsg = "No information available for this Rotation No.";
            $.alert(errmsg);
            return;
        }

        var CustomRefNo = $('#txtCustomRefNo').val();
        var DelPcs = $('#txtPcs').val();
        var DelWt = $('#txtWt').val();

        if (DelPcs == "") {
            errmsg = "Please enter valid pieces";
            $.alert(errmsg);
            return;
        }

        if (DelWt == "") {
            errmsg = "Please enter valid weight";
            $.alert(errmsg);
            return;
        }

        var connectionStatus = navigator.onLine ? 'online' : 'offline'
        var errmsg = "";

        var RotationNo = $('#txtWDONo').val();
        var status;

        if (RotationNo == "") {
            errmsg = "Please enter rotation no.";
            $.alert(errmsg);
            return;
        }

        if (document.getElementById('rdoDeliver').checked) {
            status = 'R';
        }
        //if (document.getElementById('rdoOOW').checked) {
        //    status = 'O';
        //}
        //if (document.getElementById('rdoCR').checked) {
        //    status = 'C';
        //}

        var LocXML = "";
        var UldSeqNo = "";

        if ((parseInt(TotPkgs) + parseInt($('#txtPcs').val())) < parseInt(NPR) && (LocationCnt == 1)) {
            var loc = $('#txtLocation').val().split("/");
            LocXML = '<ROOT><LD LOC="' + loc[0] + '" shipNo="' + ShipmentNo + '" NPR="' + (parseInt(NPR) - parseInt($('#txtPcs').val())) + '" wtRec="' + (parseInt(WT) - parseInt($('#txtWt').val())).toFixed(3) + '" /></ROOT>';
        }
        else if ((parseInt(TotPkgs) + parseInt($('#txtPcs').val())) < parseInt(NPR) && (LocationCnt > 1)) {
            LocXML = '<ROOT><LD LOC="' + $('#txtpartLocation').val() + '" shipNo="' + ShipmentNo + '" NPR="' + $('#txtpartPcs').val() + '" wtRec="' + $('#txtpartWt').val() + '" /></ROOT>';
        }

        if (WDOMode == 'A') {
            var DLVXML = "";
            DLVXML = '<ROOT><DLVData RNo="' + RNO + '" AWBPref="' + $('#txtAWBNo').val().substr(0, 3) + '" AWBNo="' + $('#txtAWBNo').val().substr(3, 8) + '" HseqNo="' + HouseSeqNo + '" ShipNo="' + ShipmentNo + '" DlvPcs="' + DelPcs + '" DlvWt="' + DelWt + '" WDOId="' + WDOid + '" /></ROOT>'
            UldSeqNo = 0;
        }

        if (WDOMode == 'U') {

            var DLVXML = "";
            UldSeqNo = SEQ_NO;
        }

        if (errmsg == "" && connectionStatus == "online") {
            $.ajax({
                type: "POST",
                url: GHAImportFlightserviceURL + "UpdateRNoDetails",
                data: JSON.stringify({
                    'strWDOId': WDOid, 'strStatusKey': status, 'strCompanyCode': CompanyCode,
                    'strUserID': UserId, 'strWitnessedBy': UserId, 'strId': '',
                    'strCollectorsName': '', 'imgSignAgent': '', 'CustomRefNo': CustomRefNo,
                    'LocXML': LocXML, 'Dlvxml': DLVXML, 'UldSeqNo': UldSeqNo
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

}

function SavePartShipmentDetails() {

    if ($('#txtWDONo').val() == "") {

        errmsg = "No information available for this Rotation No.";
        $.alert(errmsg);
        return;
    }

    var CustomRefNo = $('#txtCustomRefNo').val();
    var DelPcs = $('#txtPcs').val();
    var DelWt = $('#txtWt').val();

    if (DelPcs == "") {
        errmsg = "Please enter valid pieces";
        $.alert(errmsg);
        return;
    }

    if (DelWt == "") {
        errmsg = "Please enter valid weight";
        $.alert(errmsg);
        return;
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var RotationNo = $('#txtWDONo').val();
    var status;

    if (RotationNo == "") {
        errmsg = "Please enter rotation no.";
        $.alert(errmsg);
        return;
    }

    if (document.getElementById('rdoDeliver').checked) {
        status = 'R';
    }
    //if (document.getElementById('rdoOOW').checked) {
    //    status = 'O';
    //}
    //if (document.getElementById('rdoCR').checked) {
    //    status = 'C';
    //}

    var LocXML = "";

    if ((parseInt(TotPkgs) + parseInt($('#txtPcs').val())) < parseInt(NPR) && (LocationCnt == 1)) {
        var loc = $('#txtLocation').val().split("/");
        LocXML = '<ROOT><LD LOC="' + loc[0] + '" shipNo="' + ShipmentNo + '" NPR="' + (parseInt(NPR) - parseInt($('#txtPcs').val())) + '" wtRec="' + (parseFloat(WT) - parseFloat($('#txtWt').val())) + '" /></ROOT>';
    }
    else if ((parseInt(TotPkgs) + parseInt($('#txtPcs').val())) < parseInt(NPR) && (LocationCnt > 1)) {
        LocXML = '<ROOT><LD LOC="' + $('#txtpartLocation').val() + '" shipNo="' + ShipmentNo + '" NPR="' + $('#txtpartPcs').val() + '" wtRec="' + $('#txtpartWt').val() + '" /></ROOT>';
    }
    if (WDOMode == 'A') {
        var DLVXML = "";
        DLVXML = '<ROOT><DLVData RNo="' + RNO + '" AWBPref="' + $('#txtAWBNo').val().substr(0, 3) + '" AWBNo="' + $('#txtAWBNo').val().substr(3, 8) + '" HseqNo="' + HouseSeqNo + '" ShipNo="' + ShipmentNo + '" DlvPcs="' + DelPcs + '" DlvWt="' + DelWt + '" WDOId="' + WDOid + '" /></ROOT>'
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "UpdateRNoDetails",
            data: JSON.stringify({
                'strWDOId': WDOid, 'strStatusKey': status, 'strCompanyCode': CompanyCode,
                'strUserID': UserId, 'strWitnessedBy': UserId, 'strId': '',
                'strCollectorsName': '', 'imgSignAgent': '', 'CustomRefNo': CustomRefNo,
                'LocXML': LocXML, 'Dlvxml': DLVXML, 'UldSeqNo': '0'
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

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


