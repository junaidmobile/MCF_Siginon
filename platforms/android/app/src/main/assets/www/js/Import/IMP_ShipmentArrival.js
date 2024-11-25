
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var GHAExportFlightserviceURL = window.localStorage.getItem("GHAExportFlightserviceURL");
var ImportService = window.localStorage.getItem("ImportService");

//URL for Live 
//var ImportService = 'http://10.22.2.71:8080/CARGOWORKS/services/hhtexpservices.asmx/';

//URL for Cargoworks - UAT  
//var ImportService = 'http://52.172.1.88/cwehht/services/ImportService.asmx/';

//URL for WGH - UAT
//var ImportService = 'http://13.73.167.211/wgh_uat/services/ImportService.asmx/';

//URL for WGH - Live
//var ImportService = 'http://13.73.167.211/WGH/services/ImportService.asmx/';

var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");
var FlightSeqNo;
var SEQ_NO = "";
var ActNop;
var ActWt;

var FoundActPcs;
var FoundActWt;

var DamageHouseSeqNo = "";
var DamageShipNo = ""

$(function () {
    document.getElementById("navhdrName").innerHTML = "Shipment Arrival"

    document.getElementById("cameraTakePicture").addEventListener
        ("click", cameraTakePicture);

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
    // getDate();

});

function setEnglish() {
    //$('#lblUnitization').text("Unitization");

}

function setGerman() {
    $('#lblFlightNo').text("Flug Nr.");
    $('#lblFlightDate').text("Flug Datum");
    $('#btnGetDetail').text("Details");
    $('#lblULDNo').text("ULD Nr.");
    $('#lblAwbNo').text("AWB Nr.");
    $('#lblDamagePkgs').text("Stückzahl");
    $('#lblDamageWt').text("Gewicht");
    $('#lblSHC').text("Spezial Handling Code");
    $('#btnULDAccessory').val("ULD Equipment");
    $('#btnModify').val("Senden");
    $('#chkDamage').val("Beschädigung vorhanden");

    $('#lblULDAccessories').text("ULD Nr.");
    $('#lblNoOfUnitsAccessories').text("Anzahl der Einheiten");
    $('#btnSave').val("Senden");
    $('#btnExit').val("Zurrück");

    $('#lblULDFoundCargo').text("ULD Nr.");
    $('#lblAwbNoFoundCargo').text("AWB Nr.");
    $('#lblPkgsFoundCargo').text("Stückzahl");
    $('#lblWeightFoundCargo').text("Gewicht");
    $('#lblOriginFoundCargo').text("Abgangsstation");
    $('#lblDestFoundCargo').text("Empfangsstation");
    $('#lblLocFoundCargo').text("Stellplatz");
    $('#btnSave').val("Senden");
    $('#btnExit').val("Zurrück");

    $('#lblDamAWB').text("AWB Nr.");
    $('#lblDamPcs').text("Stückzahl");
    $('#lblDamWt').text("Gewicht");
    $('#lblTypPackaging').text("Art der Verpackung");
    $('#lblTypContainer').text("Art der Umverpackung");
    $('#lblTypPackMaterial').text("Art des Verpackungsmaterials");
    $('#lblTypPackDamage').text("Art der Verpackungsbeschädigung");
    $('#lblTypDamageContent').text("Art der Inhaltsbeschädigung");
    $('#lblAaparentDamage').text("Begründung der Beschädigung");
    $('#lblFurtherHandle').text("Weitere Abfertigung");
    $('#lblDamfirstnotice').text("Zeitpunkt der Schadensfeststellung");
    $('#lblMarksLabels').text("Packstückmarkierungen");
    $('#lblTheftSigns').text("Anzeichen von Diebstahl");
    $('#lblRemarks').text("Bemerkungen");
    $('#lblUploadDoc').text("Hochladen des Dokuments");
    $('#cameraTakePicture').val("Hochladen");
    $('#btnDamExit').val("zurück");
    $('#btnDamSave').val("Senden");

}

function setRussian() {
    $('#lblFlightNo').text("номер рейса");
    $('#lblFlightDate').text("дата рейса");
    $('#btnGetDetail').text("поиск");
    $('#lblULDNo').text("номер ULD");
    $('#lblAwbNo').text("номер авианакладной");
    $('#lblDamagePkgs').text("количество");
    $('#lblDamageWt').text("вес");
    $('#lblSHC').text("IMP код");
    $('#btnULDAccessory').val("ULD Equipment");
    $('#btnModify').val("отправить");
    $('#btnGetDetail').val("детали");

    $('#lblULDAccessories').text("номер ULD");
    $('#lblNoOfUnitsAccessories').text("количество единиц");
    $('#btnSave').val("отправить");
    $('#btnExit').val("выход");

    $('#lblULDFoundCargo').text("номер ULD");
    $('#lblAwbNoFoundCargo').text("номер авианакладной");
    $('#lblPkgsFoundCargo').text("количество");
    $('#lblWeightFoundCargo').text("вес");
    $('#lblOriginFoundCargo').text("аэропорт отправления");
    $('#lblDestFoundCargo').text("аэропорт назначения");
    $('#lblLocFoundCargo').text("добавить место");

    $('#lblDamAWB').text("номер авианакладной");
    $('#lblDamPcs').text("количество");
    $('#lblDamWt').text("вес");
    $('#lblTypPackaging').text("вид упаковки");
    $('#lblTypContainer').text("вид контейнера");
    $('#lblTypPackMaterial').text("вид упаковочного материала");
    $('#lblTypPackDamage').text("вид упаковочного материала");
    $('#lblTypDamageContent').text("Описание повреждения содержимого ");
    $('#lblAaparentDamage').text("Причины порчи груза");
    $('#lblFurtherHandle').text("дальнейшая обработка");
    $('#lblDamfirstnotice').text("время обнаружения недостачи груза");
    $('#lblMarksLabels').text("маркировки");
    $('#lblTheftSigns').text("Подозрение на кражу ");
    $('#lblRemarks').text("дополнительная информация");
    $('#lblUploadDoc').text("загрузить документ");
    $('#cameraTakePicture').val("загрузить");
    $('#btnDamExit').val("назад");
    $('#btnDamSave').val("отправить");
}

function setTurkish() {
    $('#lblFlightNo').text("uçuş No.");
    $('#lblFlightDate').text("uçuş tarih");
    $('#btnGetDetail').text("aramak");
    //$('#lblULDNo').text("");
    //$('#lblAwbNo').text("");
    $('#lblDamagePkgs').text("Paket Sayisi");
    $('#lblDamageWt').text("ağırlık");
    $('#lblSHC').text("Özel Elleçleme Kodlari");
    $('#btnULDAccessory').val("ULD Ekipmanlari");
    $('#btnModify').val("göndermek");
    $('#btnGetDetail').val("ayrıntılar");
    $('#btnFoundCargo').val("Bulunan Kargo");
    $('#btnExcLanded').val("çikiş");

    //$('#lblULDAccessories').text("");
    $('#lblNoOfUnitsAccessories').text("birim sayısı");
    $('#btnSave').val("göndermek");
    $('#btnExit').val("çikiş");

    //$('#lblULDFoundCargo').text("");
    //$('#lblAwbNoFoundCargo').text("");
    $('#lblPkgsFoundCargo').text("Paket Sayisi");
    $('#lblWeightFoundCargo').text("ağırlık");
    $('#lblOriginFoundCargo').text("Menşei");
    $('#lblDestFoundCargo').text("Variş Noktasi");
    $('#lblLocFoundCargo').text("yer");

    //$('#lblAwbNo').text("AWB Numarasi");    
    //$('#lblFlightNo').text("Ucus Numarasi");
    //$('#lblHAWB').text("Ucus Numarasi");
    $('#lblDamPcs').text("Paket Adedi");
    $('#lblDamWt').text("Agirlik");
    $('#lblTypPackaging').text("Paket Tipi");
    $('#lblTypContainer').text("Kontaeynir Tipi");
    $('#lblTypPackMaterial').text("Paket Malzeme Tipi ");
    $('#lblTypPackDamage').text("Ambalajin Hasar türü");
    $('#lblTypDamageContent').text("Hasarli Icerik türü");
    $('#lblAaparentDamage').text("Hasar Sebei");
    $('#lblFurtherHandle').text("Ileri Ellecleme");
    $('#lblDamfirstnotice').text("Ilk Ihbar ");
    $('#lblMarksLabels').text("Isaretlemeler ve Etiketler");
    $('#lblTheftSigns').text("Hirsizlik Belirtisi");
    $('#lblRemarks').text("Uyarilar");
    $('#lblUploadDoc').text("Evraklarin Sisteme Yüklemek");
    $('#cameraTakePicture').val("Sisteme Yüklemek");
    $('#btnDamExit').val("Geri");
    $('#btnDamSave').val("Teslim Etmek");
}

function cameraTakePicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        //quality: 100,
        //encodingType: 0,
        //targetWidth: 500,
        //targetHeight: 500,
        //destinationType: Camera.DestinationType.DATA_URL
        quality: 100,
        encodingType: Camera.EncodingType.JPEG,
        //allowEdit: true,
        //correctOrientation: true,
        targetWidth: 250,
        targetHeight: 250,
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        //var image = document.getElementById('myImage');
        //var data = "data:image/jpeg;base64," + imageData;
        SaveUploadFile(imageData);
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function SaveUploadFile(imageData) {

    var MAWBPrefix = $('#txtAWBPrefixDam').val();
    var MAWBNo = $('#txtAWBNoDam').val();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if (imageData == "") {

        errmsg = "Some error occurred.</br>Please try again.";
        $.alert(errmsg);
        return;

    }


    inputxml = '<Root><FileName>TLogo</FileName><FileExtention>jpg</FileExtention><Description>' + $('#txtDamRemarks').val() + '</Description><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><AWBPrefix>' + MAWBPrefix + '</AWBPrefix><Type>I</Type><AWBNo>' + MAWBNo + '</AWBNo><ULDId>0</ULDId><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';


    //inputxml = '<Root><FileName>TLogo</FileName><FileExtention>jpg</FileExtention><Description>' + $('#txtDescription').val() + '</Description><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UShipRowId>' + UShipRowId + '</UShipRowId><Type>I</Type><UAWBRowId>' + UAWBRowId + '</UAWBRowId><ULDId>-1</ULDId><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "SaveFileUploadDetails",
            data: JSON.stringify({
                'InputXML': inputxml, 'InputImage': imageData,
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

function GetULDDetails() {

    var inputxml = "";

    $('#txtPkgs').val('');
    $('#txtWt').val('');

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

                $('#ddlULDNo').empty();

                $(xmlDoc).find('Table').each(function (index) {

                    var ULDId;
                    var ULD;
                    var IsNotRec;
                    if (index == 0) {
                        ULDSeqNo = ULDId;
                        var newOption = $('<option></option>');
                        newOption.val('').text('Select');
                        newOption.appendTo('#ddlULDNo');
                    }

                    FlightSeqNo = $(this).find('FltSeqNo').text();
                    ULDId = $(this).find('Value').text();
                    ULD = $(this).find('ULDNO').text();
                    IsNotRec = $(this).find('IsNotRec').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULD);
                    newOption.appendTo('#ddlULDNo');
                    document.getElementById("ddlULDNo").selectedIndex = "1";
                    GetAWBDetails($('#ddlULDNo').find('option:selected').text())
                    if (IsNotRec != "1") {
                        newOption.css('color', 'blue')
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


function GetAWBDetails(UldNo) {

    var ULDSeqNumber = '', ULDSeq;
    if ($('#ddlULDNo').find('option:selected').val() != undefined) {
        ULDSeq = $('#ddlULDNo').find('option:selected').val().split("_");
        ULDSeqNumber = $('#ddlULDNo').find('option:selected').val().split("_")[0];
    }

    $('#txtPkgs').val('');
    $('#txtWt').val('');
    $('#txtSHC').val('');
    $('#txtRemarks').val('');

    var UldNumber;

    if (UldNo == 'I')
        UldNumber = "";
    else if (UldNo.trim() == 'BULK')
        UldNumber = "";
    else
        UldNumber = UldNo;

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

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';  GetAWBNumbersI


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            //url: GHAImportFlightserviceURL + "GetAWBNumbers",
            url: GHAImportFlightserviceURL + "GetAWBNumbersI",
            data: JSON.stringify({
                'strFlightNumber': FullFlightNo, 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strFlightDate': FlightDate, 'chrCycle': 'I', 'strULDNo': UldNumber.trim(),
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                $('#ddlAWBNo').empty();

                $(xmlDoc).find('Table').each(function (index) {

                    var ShipNo;
                    var AWBNo;
                    var Isnorec;
                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('').text('Select');
                        newOption.appendTo('#ddlAWBNo'); ShipNo
                    }

                    //AWBId = $(this).find('MAWB_IND').text(); 
                    ShipNo = $(this).find('ShipNo').text();
                    AWBNo = $(this).find('AWBNo').text();
                    Isnorec = $(this).find('IsNotRec').text();

                    var newOption = $('<option></option>');
                    newOption.val(ShipNo).text(AWBNo);
                    newOption.appendTo('#ddlAWBNo');
                    if (Isnorec != "1") {
                        newOption.css('color', 'blue')
                    }

                });

                if (UldNo != "I") {
                    if (ULDSeq[1].toString() == "Y") {
                        lnv.confirm({
                            title: 'Confirm',
                            content: 'Selected ULD is BUP. Do want to receive the ULD ?',
                            confirmHandler: function () {

                                var connectionStatus = navigator.onLine ? 'online' : 'offline'
                                var errmsg = "";

                                var FlightPrefix = $('#txtFlightPrefix').val();
                                var FlightNo = $('#txtFlightNo').val();
                                var FlightDate = $('#txtFlightDate').val();
                                var Pckgs = $('#txtPkgs').val();
                                var Wt = $('#txtWt').val();

                                var strWtUnit = 'KG';
                                var AWBno;
                                var AWBPREFIX
                                var AWBNumber
                                var HAWBSeqNo = '0';

                                if ($('#ddlAWBNo').find('option:selected').text() == 'Select') {
                                    AWBno = '0';
                                    AWBPREFIX = '0';
                                    AWBNumber = '0';
                                }
                                else {
                                    AWBno = $('#ddlAWBNo').find('option:selected').text();
                                    AWBPREFIX = AWBno.substr(0, 3);
                                    AWBNumber = AWBno.substr(3, 8);
                                }

                                if ($('#txtFlightDate').val().length > 0) {
                                    var formattedDate = new Date($('#txtFlightDate').val());
                                    var d = formattedDate.getDate();
                                    if (d.toString().length < Number(2))
                                        d = '0' + d;
                                    var m = formattedDate.getMonth();
                                    var MonthName = GetMonthName(m);

                                    m += 1;  // JavaScript months are 0-11
                                    if (m.toString().length < Number(2))
                                        m = '0' + m;
                                    var y = formattedDate.getFullYear();

                                    FlightDate = d + "-" + MonthName.substr(0, 3) + "-" + y;
                                }

                                var ULDSeqNumber = '', ULDSeq;
                                if ($('#ddlULDNo').find('option:selected').val() != undefined) {
                                    ULDSeq = $('#ddlULDNo').find('option:selected').val().split("_");
                                    ULDSeqNumber = $('#ddlULDNo').find('option:selected').val().split("_")[0];
                                }


                                var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNumber + '</UlDSeqNo><AWBPREFIX>0</AWBPREFIX><AWBNO>0</AWBNO><SHIPNO>0</SHIPNO><HouseSeqNo>0</HouseSeqNo><NPR>0</NPR><RecWeight>0</RecWeight><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity><IsInTact>Y</IsInTact></Root>';
                                //var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><UlDSeqNo>' + $('#ddlULDNo').find('option:selected').val() + '</UlDSeqNo><AWBPREFIX>' + AWBPREFIX + '</AWBPREFIX><AWBNO>' + AWBNumber + '</AWBNO><SHIPNO>' + $('#ddlAWBNo').find('option:selected').val() + '</SHIPNO><HouseSeqNo>' + HAWBSeqNo + '</HouseSeqNo><NPR>' + Pckgs + '</NPR><RecWeight>' + Wt + '</RecWeight><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

                                //start --  commented for testing of damage
                                if (errmsg == "" && connectionStatus == "online") {
                                    $.ajax({
                                        type: "POST",
                                        //url: GHAImportFlightserviceURL + "IMPCreateInCheckManifest",
                                        url: GHAImportFlightserviceURL + "ReceiveAWBImport",
                                        //data: JSON.stringify({
                                        //    'strFlightNo': FlightPrefix+FlightNo, 'strFlightDate': FlightDate, 'strULDNo': $('#ddlULDNo').find('option:selected').text(),
                                        //    'strAWBNo': AWBno, 'strHAWBNo': $('#ddlHAWBNo').val(), 'strPkgs': Pckgs,
                                        //    'strGrossWt': Wt, 'strWtUnit': 'Kg', 'strDamageDesc': '',
                                        //    'strDamageCode': '', 'strAirportCity': AirportCity, 'strUserID': UserId, 'CompanyCode': CompanyCode, 'strShed': SHEDCODE
                                        //}),
                                        data: JSON.stringify({ 'InputXML': inputXML }),
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        success: function (response) {
                                            response = response.d;
                                            var xmlDoc = $.parseXML(response);
                                            $(xmlDoc).find('Table').each(function () {
                                                var msg;
                                                msg = $(this).find('StrMessage').text();
                                                $.alert(msg);
                                            })
                                        },
                                        error: function (msg) {
                                            $("body").mLoading('hide');
                                            $.alert('Some error occurred while saving data');
                                        }
                                    });
                                    return false;
                                }
                                //end --  commented for testing of damage
                            },
                            cancelHandler: function () {

                            }
                        })
                    }
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


function GetHAWBDetails(AWBid) {

    $('#txtPkgs').val('');
    $('#txtWt').val('');
    $('#txtSHC').val('');
    $('#txtRemarks').val('');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if ($('#ddlAWBNo').find('option:selected').text() == 'Select')
        return;

    var ULDSeqNumber = '', ULDSeq;
    if ($('#ddlULDNo').find('option:selected').val() != undefined) {
        ULDSeq = $('#ddlULDNo').find('option:selected').val().split("_");
        ULDSeqNumber = $('#ddlULDNo').find('option:selected').val().split("_")[0];
    }


    var inputXML = '<Root><AWBNo>' + AWBid + '</AWBNo><ShipNo>' + $('#ddlAWBNo').find('option:selected').val() + '</ShipNo><HouseSeqNo>0</HouseSeqNo><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + ULDSeqNumber + '</ULDSeqNo><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';
    //var inputXML = '<Root><AWBNo>' + AWBid + '</AWBNo><ShipNo>' + $('#ddlAWBNo').find('option:selected').val() + '</ShipNo><HouseSeqNo>0</HouseSeqNo><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + $('#ddlULDNo').find('option:selected').val() + '</ULDSeqNo><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetShipmentDetailsHHT",
            //data: JSON.stringify({
            //    'strAWBNo': AWBid, 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strCycle': 'I',
            //}),
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                //$('#ddlHAWBNo').empty();

                $(xmlDoc).find('Table').each(function (index) {

                    //var HAWBId;
                    //var HAWBNo;

                    //if ($(this).find('HOUSE_SEQUENCE_NUMBER').text() != 0) {
                    //    HAWBId = $(this).find('HOUSE_SEQUENCE_NUMBER').text();
                    //    HAWBNo = $(this).find('HOUSE_NUMBER').text();

                    //    var newOption = $('<option></option>');
                    //    newOption.val(HAWBId).text(HAWBNo);
                    //    newOption.appendTo('#ddlHAWBNo');
                    //}
                    if (index == 0) {
                        $('#txtPkgs').val($(this).find('Pcs').text());
                        ActNop = $(this).find('Pcs').text();
                        $('#txtWt').val($(this).find('Wt').text());
                        ActWt = $(this).find('Wt').text();
                        $('#txtSHC').val($(this).find('SHCs').text());
                        $('#txtRemarks').val($(this).find('Remarks').text());
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

function SaveDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var Pckgs = $('#txtPkgs').val();
    var Wt = $('#txtWt').val();

    var strWtUnit = 'KG';
    var AWBno;
    var AWBPREFIX
    var AWBNumber
    var HAWBSeqNo = '0';

    if ($('#ddlAWBNo').find('option:selected').text() == 'Select') {
        AWBno = '0';
        AWBPREFIX = '0';
        AWBNumber = '0';
    }
    else {
        AWBno = $('#ddlAWBNo').find('option:selected').text();
        AWBPREFIX = AWBno.substr(0, 3);
        AWBNumber = AWBno.substr(3, 8);
    }

    //if (($('#ddlHAWBNo').find('option:selected').text() == 'Select') || ($('#ddlHAWBNo').find('option:selected').text() == "")){
    //    HAWBSeqNo = '0';
    //}
    //else {
    //    HAWBSeqNo = $('#ddlHAWBNo').find('option:selected').val();
    //}

    if (FlightPrefix == "" || FlightNo == "" || FlightDate == "" || Pckgs == "" || Wt == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightDate').val().length > 0) {
        var formattedDate = new Date($('#txtFlightDate').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        var MonthName = GetMonthName(m);

        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        FlightDate = d + "-" + MonthName.substr(0, 3) + "-" + y;
    }

    var ULDSeqNumber = '', ULDSeq;
    if ($('#ddlULDNo').find('option:selected').val() != undefined) {
        ULDSeq = $('#ddlULDNo').find('option:selected').val().split("_");
        ULDSeqNumber = $('#ddlULDNo').find('option:selected').val().split("_")[0];
    }


    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNumber + '</UlDSeqNo><AWBPREFIX>' + AWBPREFIX + '</AWBPREFIX><AWBNO>' + AWBNumber + '</AWBNO><SHIPNO>' + $('#ddlAWBNo').find('option:selected').val() + '</SHIPNO><HouseSeqNo>' + HAWBSeqNo + '</HouseSeqNo><NPR>' + Pckgs + '</NPR><RecWeight>' + Wt + '</RecWeight><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
    //var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><UlDSeqNo>' + $('#ddlULDNo').find('option:selected').val() + '</UlDSeqNo><AWBPREFIX>' + AWBPREFIX + '</AWBPREFIX><AWBNO>' + AWBNumber + '</AWBNO><SHIPNO>' + $('#ddlAWBNo').find('option:selected').val() + '</SHIPNO><HouseSeqNo>' + HAWBSeqNo + '</HouseSeqNo><NPR>' + Pckgs + '</NPR><RecWeight>' + Wt + '</RecWeight><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    //start --  commented for testing of damage
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            //url: GHAImportFlightserviceURL + "IMPCreateInCheckManifest",
            url: GHAImportFlightserviceURL + "ReceiveAWBImport",
            //data: JSON.stringify({
            //    'strFlightNo': FlightPrefix+FlightNo, 'strFlightDate': FlightDate, 'strULDNo': $('#ddlULDNo').find('option:selected').text(),
            //    'strAWBNo': AWBno, 'strHAWBNo': $('#ddlHAWBNo').val(), 'strPkgs': Pckgs,
            //    'strGrossWt': Wt, 'strWtUnit': 'Kg', 'strDamageDesc': '',
            //    'strDamageCode': '', 'strAirportCity': AirportCity, 'strUserID': UserId, 'CompanyCode': CompanyCode, 'strShed': SHEDCODE
            //}),
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

                var xmlDoc = $.parseXML(response.d);
                $(xmlDoc).find('Table').each(function () {
                    var msg;
                    msg = $(this).find('StrMessage').text();
                    $.alert(msg);
                })

                $('#ddlAWBNo').find('option:selected').css('color', 'blue');

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        //return false;
    }
    //end --  commented for testing of damage

    if (document.getElementById('chkDamage').checked) {

        var BindShipNo = $('#ddlAWBNo').find('option:selected').val()
        $("#divFlightDetails").hide();
        $("#divULDDetails").hide();
        $("#divDamagedCargo").show();

        BindMultiDropDown(AWBPREFIX, AWBNumber, HAWBSeqNo, BindShipNo);

    }
}

function BindMultiDropDown(AWBPREFIX, AWBNumber, HAWBSeqNo, BindShipNo) {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><AWBPref>' + AWBPREFIX + '</AWBPref><AWBNo>' + AWBNumber + '</AWBNo><HouseSeqNo></HouseSeqNo><ShipNo>' + BindShipNo + '</ShipNo><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><Module>Imports</Module><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><AirportCity>' + AirportCity + '</AirportCity><Save_From>A</Save_From></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            //url: GHAImportFlightserviceURL + "IMPCreateInCheckManifest",
            url: GHAImportFlightserviceURL + "HHTGetDamageDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                $('#divDamageShowGrid').empty();
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table').each(function () {

                    DamageShipNo = $(this).find('ShipNo').text();
                    DamageHouseSeqNo = $(this).find('HSeqNo').text();
                    $('#txtAWBPrefixDam').val($(this).find('AWBPref').text());
                    $('#txtAWBNoDam').val($(this).find('AWBNo').text());
                    $('#txtDamPackages').val($(this).find('NPR').text());
                    $('#txtDamWeight').val($(this).find('WtRec').text());
                });


                $("#packagingtype").empty();
                $("#containertype").empty();
                $("#material").empty();
                $("#damagetype").empty();
                $("#damagecontent").empty();
                $("#damagecause").empty();
                $("#handling").empty();
                $("#damagenotice").empty();
                $("#markslabels").empty();

                $(xmlDoc).find('Table1').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    //$("#packagingtype").append('<option value=option5>Option 5</option>');
                    if (isSelected == "Y") {
                        $("#packagingtype").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        //$("#packagingtype option[value='" + RId + "']").prop("selected", false);
                        //$("#packagingtype option[value='" + RId + "']:selected").prop("selected", false);
                        $("#packagingtype").append('<option value=' + RId + ' class="deselectopt">' + Desc + '</option>');
                    }
                    //$("#packagingtype").multiselect('refresh');
                });

                //BindDamagePackaging();


                $(xmlDoc).find('Table2').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#containertype").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#containertype").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#containertype").multiselect('refresh');
                });
                //BindDamageContainerType();


                $(xmlDoc).find('Table3').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#material").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#material").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#material").multiselect('refresh');
                });
                //BindDamageMaterial();


                $(xmlDoc).find('Table6').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#damagetype").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#damagetype").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#damagetype").multiselect('refresh');
                });
                //BindDamageType();


                $(xmlDoc).find('Table7').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#damagecontent").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#damagecontent").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#damagecontent").multiselect('refresh');
                });
                //BindDamageContent();


                $(xmlDoc).find('Table9').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#damagecause").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#damagecause").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#damagecause").multiselect('refresh');
                });
                //BindDamageCause();  


                $(xmlDoc).find('Table10').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#handling").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#handling").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#handling").multiselect('refresh');
                });
                //BindDamageHandling();


                $(xmlDoc).find('Table8').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#damagenotice").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#damagenotice").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#damagenotice").multiselect('refresh');
                });
                //BindDamageNotice();


                $(xmlDoc).find('Table4').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#markslabels").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#markslabels").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#markslabels").multiselect('refresh');
                });

                $(xmlDoc).find('Table14').each(function () {
                    var signsoftheft = "";
                    $('#txtDamRemarks').val($(this).find('REMARKS').text());
                    signsoftheft = $(this).find('DAMAGE_EVIDENCE_PILFERAGE').text()

                    if (signsoftheft == "Y") {
                        $("#chkYes").prop('checked', true);
                        $("#chkNo").prop('checked', false);
                    }
                    else {
                        $("#chkYes").prop('checked', false);
                        $("#chkNo").prop('checked', true);
                    }
                });
                //BindDamageLabels();

                //$("#theftsign").append('<option value=Y>Yes</option>');
                //$("#theftsign").append('<option value=N>No</option>');
                //$("#theftsign").multiselect('refresh');
                //BindTheftSigns();

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });

    }
}

function BindDamagePackaging() {

    $('select[multiple].clspackagingtype').multiselect({
        columns: 1,
        placeholder: 'Select Packaging Type',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindDamageContainerType() {

    $('select[multiple].clscontainertype').multiselect({
        columns: 1,
        placeholder: 'Select Container Type',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindDamageMaterial() {

    $('select[multiple].clsmaterial').multiselect({
        columns: 1,
        placeholder: 'Select Material',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindDamageType() {

    $('select[multiple].clsdamagetype').multiselect({
        columns: 1,
        placeholder: 'Select Damage Type',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindDamageContent() {

    $('select[multiple].clsdamagecontent').multiselect({
        columns: 1,
        placeholder: 'Select Damage Content',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindDamageCause() {

    $('select[multiple].clsdamagecause').multiselect({
        columns: 1,
        placeholder: 'Select Damage caused by',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindDamageHandling() {

    $('select[multiple].clshandling').multiselect({
        columns: 1,
        placeholder: 'Select Further Handling',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindDamageNotice() {

    $('select[multiple].clsdamagenotice').multiselect({
        columns: 1,
        placeholder: 'Select Damage first noticed',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindDamageLabels() {

    $('select[multiple].clsmarkslabels').multiselect({
        columns: 1,
        placeholder: 'Select Marks and Labels',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function BindTheftSigns() {

    $('select[multiple].clstheftsign').multiselect({
        columns: 1,
        placeholder: 'Select Signs of theft',
        selectedOptions: 'selected',
        selectAll: true
    });
}

function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

function SaveDamageDetails() {
    var packagingtype = "";
    var containertype = "";
    var material = "";
    var damagetype = "";
    var damagecontent = "";
    var damagecause = "";
    var furtherhandling = "";
    var damagenotice = "";
    var marksnlabels = "";
    var signsoftheft = "";

    if (document.getElementById('chkYes').checked) {
        signsoftheft = 'Y';
    } else if (document.getElementById('chkNo').checked) {
        signsoftheft = 'N';
    }

    packagingtype = getSelectValues(document.getElementById('packagingtype'));
    containertype = getSelectValues(document.getElementById('containertype'));
    material = getSelectValues(document.getElementById('material'));
    damagetype = getSelectValues(document.getElementById('damagetype'));
    damagecontent = getSelectValues(document.getElementById('damagecontent'));
    damagecause = getSelectValues(document.getElementById('damagecause'));
    furtherhandling = getSelectValues(document.getElementById('handling'));
    damagenotice = getSelectValues(document.getElementById('damagenotice'));
    marksnlabels = getSelectValues(document.getElementById('markslabels'));
    //signsoftheft = getSelectValues(document.getElementById('theftsign'));

    //<ROOT><DamageData  AWBNo='65555125' HouseSeqNo='0' AwbPrefix='117' FlightSeqNumber='2315' ShipmentNo='1' AirportCity='OSL' CompanyCode='3' CreatedBy='252' ContainerMaterial='BAL,HOL,HOZ' ContainerType='' OuterPacking='AND,FOL' MarksLabels='DGR,GLA' InnerPacking='CRD,CSM' IsSufficient='Y' Container='' Containers='' DamageDiscovered='' SpaceForMissing='N' VerifiedInvoice='N' AparentCause='' WeatherCondation='' DamageRemarked='' EvidencePilferage='Y' Remarks='DS1' Salvage='' Disposition='' TypeDiscripency='DMG' TotalWTShippedAWB='0' TotalPcsShippedAWB='0' TotalWTActual='100' TotalPcsActual='10' TotalWTDifference='0' TotalPcsDifference='0' IndividualWTPerDoc='0' IndividualWTActChk='0' IndividualWTDifference='0'  Save_From='A' /></ROOT> ,''

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<ROOT><DamageData  AWBNo="' + $('#txtAWBNoDam').val() + '" HouseSeqNo="' + DamageHouseSeqNo + '" AwbPrefix="' + $('#txtAWBPrefixDam').val() + '" FlightSeqNumber="' + FlightSeqNo + '" ShipmentNo="' + DamageShipNo + '" AirportCity="' + AirportCity + '" CompanyCode="' + window.localStorage.getItem("companyCode") + '" CreatedBy="' + window.localStorage.getItem("UserID") + '" ContainerMaterial="' + packagingtype + '" ContainerType="' + containertype + '" OuterPacking="' + material + '" MarksLabels="' + marksnlabels + '" InnerPacking="" IsSufficient="Y" Container="' + damagetype + '" Containers="' + damagecontent + '" DamageDiscovered="' + damagenotice + '" SpaceForMissing="N" VerifiedInvoice="N" AparentCause="' + damagecause + '" WeatherCondation="" DamageRemarked="" EvidencePilferage="' + signsoftheft + '" Remarks="' + $('#txtDamRemarks').val() + '" Salvage="' + furtherhandling + '" Disposition="" TypeDiscripency="DMG" TotalWTShippedAWB="0" TotalPcsShippedAWB="0" TotalWTActual="' + $('#txtDamWeight').val() + '" TotalPcsActual="' + $('#txtDamPackages').val() + '" TotalWTDifference="0" TotalPcsDifference="0" IndividualWTPerDoc="0" IndividualWTActChk="0" IndividualWTDifference="0"  Save_From="A" /></ROOT>';
    //var inputXML = '<Root><SEQ_NO>' + SEQ_NO + '</SEQ_NO><MATERIAL_FOR>U</MATERIAL_FOR><MATERIAL_ID>' + $('#ddlMaterialType').find('option:selected').val() + '</MATERIAL_ID><MATERIAL_UNIT>' + $('#txtNoUnits').val() + '</MATERIAL_UNIT><Module>I</Module><ULDSeqNo>' + $('#ddlULDNo').find('option:selected').val() + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "HHTSaveDamageDetails",
            data: JSON.stringify({ 'DamageXML': inputXML, 'Mode': "Imports" }),
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
                    if ($(this).find('Status').text() == 'S') {
                        $.alert($(this).find('Message').text());
                    }
                    if ($(this).find('Status').text() == 'E') {
                        $.alert($(this).find('Message').text());
                    }
                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
                //$.alert('Details saved successfully');
            }
        });
        return false;
    }

}

function AddTableLocation(index, RId, RDes) {
    html += "<tr>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + AWBNo + "</td>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><div id='ctl00_cp_gS_ctl02_ddlUNN_sl' class='drpDwn4Code dd_chk_select' style='display:inline-block;position:relative;'><div id='caption'>Select</div><div id='ctl00_cp_gS_ctl02_ddlUNN_dv' class='dd_chk_drop' style='position: absolute;'>";
    html += "<div id='checks'><span style='display:block;'></span><span id='ctl00_cp_gS_ctl02_ddlUNN'><input id='ctl00_cp_gS_ctl02_ddlUNN_" + index + " name='ctl00$cp$gS$ctl02$ddlUNN$" + index + "' value=" + RId + " type='checkbox'><label for='ctl00_cp_gS_ctl02_ddlUNN_" + index + "'>" + RDes + "</label></span></div></div></div></td>";
    //<input id=txtAWB_" + index + " class=form-control type=text style=text-align:right; value=" + AWBNo + " disabled></td>";
    html += "</tr>";

}

function ShowAddULDAccesoryGrid() {

    if ($('#ddlULDNo').find('option:selected').text() == 'Select') {
        errmsg = "Please select ULD";
        $.alert(errmsg);
        return;
    }
    else {
        $('#txtFlightPrefix').attr("disabled", "disabled");
        $('#txtFlightNo').attr("disabled", "disabled");
        $('#txtFlightDate').attr("disabled", "disabled");
        $('#btnGetDetail').attr("disabled", "disabled");

        $('#txtAccessoryULDNo').val($('#ddlULDNo').find('option:selected').text());
        $('#txtNoUnits').val('1');

        $("#divAddULDAccessories").show();
        $("#divULDDetails").hide();
        $("#divAddFoundCargo").hide();

        GetMaterialList();
    }
}

function ShowULDGridFromULDAccessory() {
    $('#txtFlightPrefix').removeAttr("disabled");
    $('#txtFlightNo').removeAttr("disabled");
    $('#txtFlightDate').removeAttr("disabled");
    $('#btnGetDetail').removeAttr("disabled");

    $("#divAddULDAccessories").hide();
    $("#divULDDetails").show();
    $("#divAddFoundCargo").hide();

    $('#ddlMaterialType').empty();
    $('#txtNoUnits').val('');
    $('#txtAccessoryULDNo').val('');
}

function ShowAddFoundCargoGrid() {

    if ($('#ddlULDNo').find('option:selected').text() == 'Select') {
        errmsg = "Please select ULD";
        $.alert(errmsg);
        return;
    }
    else {
        $('#txtFlightPrefix').attr("disabled", "disabled");
        $('#txtFlightNo').attr("disabled", "disabled");
        $('#txtFlightDate').attr("disabled", "disabled");
        $('#btnGetDetail').attr("disabled", "disabled");

        $('#txtULDNo_FC').val($('#ddlULDNo').find('option:selected').text());

        $("#divAddFoundCargo").show();
        $("#divULDDetails").hide();
        $("#divAddULDAccessories").hide();
    }
}

function ShowULDGridFromFoundCargo() {
    $('#txtFlightPrefix').removeAttr("disabled");
    $('#txtFlightNo').removeAttr("disabled");
    $('#txtFlightDate').removeAttr("disabled");
    $('#btnGetDetail').removeAttr("disabled");

    $("#divAddULDAccessories").hide();
    $("#divULDDetails").show();
    $("#divAddFoundCargo").hide();

    $('#txtAWBPrefix').val('');
    $('#txtAWBNo').val('');
    $('#txtScanCode').val('');
    $('#txtPackages').val('');
    $('#txtWeight_FC').val('');
    $('#txtLocation_FC').val('');
    $('#txtOrigin_FC').val('');
    $('#txtDestination_FC').val('')
}

function GetMaterialList() {
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var ULDSeqNumber = '', ULDSeq;
    if ($('#ddlULDNo').find('option:selected').val() != undefined) {
        ULDSeq = $('#ddlULDNo').find('option:selected').val().split("_");
        ULDSeqNumber = $('#ddlULDNo').find('option:selected').val().split("_")[0];
    }


    var inputXML = '<Root><MATERIAL_FOR>U</MATERIAL_FOR><Module>I</Module><ULDSeqNo>' + ULDSeqNumber + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID><ALCode>' + FlightPrefix + '</ALCode></Root>';
    //var inputXML = '<Root><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><Offpoint>' + offPonit + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetMaterialList",
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

                $(xmlDoc).find('Table').each(function (index) {

                    var Material_ID;
                    var Material_DESCRIPTION;

                    Material_ID = $(this).find('CHARGE_ID').text();
                    Material_DESCRIPTION = $(this).find('CHARGE_DESCRIPTION').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlMaterialType');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(Material_ID).text(Material_DESCRIPTION);
                    newOption.appendTo('#ddlMaterialType');
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
}

function GetMaterialUsed() {
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    $('#txtNoUnits').val('');
    $('#txtNoUnits').focus();

    var ULDSeqNumber = '', ULDSeq;
    if ($('#ddlULDNo').find('option:selected').val() != undefined) {
        ULDSeq = $('#ddlULDNo').find('option:selected').val().split("_");
        ULDSeqNumber = $('#ddlULDNo').find('option:selected').val().split("_")[0];
    }

    var inputXML = '<Root><MATERIAL_FOR>U</MATERIAL_FOR><MATERIAL_ID>' + $('#ddlMaterialType').find('option:selected').val() + '</MATERIAL_ID><Module>I</Module><ULDSeqNo>' + ULDSeqNumber + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';
    //var inputXML = '<Root><MATERIAL_FOR>U</MATERIAL_FOR><MATERIAL_ID>' + $('#ddlMaterialType').find('option:selected').val() + '</MATERIAL_ID><Module>I</Module><ULDSeqNo>' + $('#ddlULDNo').find('option:selected').val() + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';
    //var inputXML = '<Root><MATERIAL_FOR>U</MATERIAL_FOR><Module>E</Module><ULDSeqNo>' + $('#ddlULD').find('option:selected').val() + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';
    //var inputXML = '<Root><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><Offpoint>' + offPonit + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetMaterialUsed",
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

                $(xmlDoc).find('Table').each(function (index) {
                    var NoUNITS;

                    SEQ_NO = $(this).find('SeqNo').text();
                    NoUNITS = $(this).find('Unit').text();

                    $('#txtNoUnits').val(NoUNITS);
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
}

function SaveMaterialUsed() {

    if ($('#txtNoUnits').val() == "") {

        errmsg = "Please enter no of units.</br>";
        $.alert(errmsg);
        return;
    }

    if (SEQ_NO == "") {
        SEQ_NO = "0";
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var ULDSeqNumber = '', ULDSeq;
    if ($('#ddlULDNo').find('option:selected').val() != undefined) {
        ULDSeq = $('#ddlULDNo').find('option:selected').val().split("_");
        ULDSeqNumber = $('#ddlULDNo').find('option:selected').val().split("_")[0];
    }

    var inputXML = '<Root><SEQ_NO>' + SEQ_NO + '</SEQ_NO><MATERIAL_FOR>U</MATERIAL_FOR><MATERIAL_ID>' + $('#ddlMaterialType').find('option:selected').val() + '</MATERIAL_ID><MATERIAL_UNIT>' + $('#txtNoUnits').val() + '</MATERIAL_UNIT><Module>I</Module><ULDSeqNo>' + ULDSeqNumber + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';
    //var inputXML = '<Root><SEQ_NO>' + SEQ_NO + '</SEQ_NO><MATERIAL_FOR>U</MATERIAL_FOR><MATERIAL_ID>' + $('#ddlMaterialType').find('option:selected').val() + '</MATERIAL_ID><MATERIAL_UNIT>' + $('#txtNoUnits').val() + '</MATERIAL_UNIT><Module>I</Module><ULDSeqNo>' + $('#ddlULDNo').find('option:selected').val() + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "SaveMaterialUsed",
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
                $.alert('Details saved successfully');
                //window.location.reload();
                $('#txtNoUnits').val("");
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
                //$.alert('Details saved successfully');
            }
        });
        return false;
    }

}

function SaveFoundCargoDetails() {

    //if ($('#txtScanCode').val() == "") {

    //    errmsg = "Please scan AWB or enter AWB No.";
    //    $.alert(errmsg);
    //    return;
    //}

    var AWBPrefix = $('#txtAWBPrefix').val();
    var AWBNo = $('#txtAWBNo').val();
    var Packages = $('#txtPackages').val();
    var GrossWt = $('#txtWeight_FC').val();

    if (AWBPrefix == "" || AWBNo == "" || Packages == "" || GrossWt == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;

    }

    //if ($('#txtPackages').val() == "") {

    //    errmsg = "Please enter Packages";
    //    $.alert(errmsg);
    //    return;
    //}

    //if ($('#txtWeight_FC').val() == "") {

    //    errmsg = "Please enter Weight.";
    //    $.alert(errmsg);
    //    return;
    //}

    if ($('#txtLocation_FC').val() == "") {

        errmsg = "Please enter Location.";
        $.alert(errmsg);
        return;
    }


    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var ULDSeqNumber = '', ULDSeq;
    if ($('#ddlULDNo').find('option:selected').val() != undefined) {
        ULDSeq = $('#ddlULDNo').find('option:selected').val().split("_");
        ULDSeqNumber = $('#ddlULDNo').find('option:selected').val().split("_")[0];
    }


    var inputXML = '<Root><AWBPref>' + AWBPrefix + '</AWBPref><AWBNo>' + AWBNo + '</AWBNo><HouseNo></HouseNo><Pcs>' + $('#txtPackages').val() + '</Pcs><Wt>' + $('#txtWeight_FC').val() + '</Wt><Ori>' + $('#txtOrigin_FC').val() + '</Ori><Dest>' + $('#txtDestination_FC').val() + '</Dest><LocCode>' + $('#txtLocation_FC').val() + '</LocCode><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + ULDSeqNumber + '</ULDSeqNo><AirportCity>' + AirportCity + '</AirportCity><UserId>' + window.localStorage.getItem("UserID") + '</UserId><CompCode>' + window.localStorage.getItem("companyCode") + '</CompCode></Root>';
    //var inputXML = '<Root><AWBPref>' + AWBPrefix + '</AWBPref><AWBNo>' + AWBNo + '</AWBNo><HouseNo></HouseNo><Pcs>' + $('#txtPackages').val() + '</Pcs><Wt>' + $('#txtWeight_FC').val() + '</Wt><Ori>' + $('#txtOrigin_FC').val() + '</Ori><Dest>' + $('#txtDestination_FC').val() + '</Dest><LocCode>' + $('#txtLocation_FC').val() + '</LocCode><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + $('#ddlULDNo').find('option:selected').val() + '</ULDSeqNo><AirportCity>' + AirportCity + '</AirportCity><UserId>' + window.localStorage.getItem("UserID") + '</UserId><CompCode>' + window.localStorage.getItem("companyCode") + '</CompCode></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "HHTCreateFoundCargo",
            data: JSON.stringify({ 'InputXML': inputXML, 'AptCity': AirportCity, 'CompCode': window.localStorage.getItem("companyCode"), 'UserID': window.localStorage.getItem("UserID"), }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Please Wait..",
                });
            },
            success: function (response) {
                //$("body").mLoading('hide');
                //$.alert(response.d);
                //window.location.reload();
                //$('#txtNoUnits').val("");

                $("body").mLoading('hide');
                response = response.d;
                //$.alert(response.d);

                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table1').each(function () {
                    if ($(this).find('Column1').text() == 'S') {
                        $.alert($(this).find('Column2').text());
                        $('#txtAWBPrefix').val('');
                        $('#txtAWBNo').val('');
                        $('#txtPackages').val('');
                        $('#txtWeight_FC').val('');
                        $('#txtLocation_FC').val('');
                        $('#txtOrigin_FC').val('');
                        $('#txtDestination_FC').val('')
                    }
                    else if ($(this).find('Column1').text() == 'E') {
                        $.alert($(this).find('Column2').text());
                    }
                });
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
                //$.alert('Details saved successfully');
            }
        });
        return false;
    }
}

function ClearAWBDetails() {

    $('#txtAWBPrefix').val('');
    $('#txtAWBNo').val('');
    $('#txtPackages').val('');
    $('#txtWeight_FC').val('');
    $('#txtLocation_FC').val('');
    $('#txtOrigin_FC').val('');
    $('#txtDestination_FC').val('')
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
function GetMonthName(month_value) {

    var months = new Array(12);
    months[0] = "January";
    months[1] = "February";
    months[2] = "March";
    months[3] = "April";
    months[4] = "May";
    months[5] = "June";
    months[6] = "July";
    months[7] = "August";
    months[8] = "September";
    months[9] = "October";
    months[10] = "November";
    months[11] = "December";

    //var current_date = new Date();
    //month_value = current_date.getMonth();
    //day_value = current_date.getDate();
    //year_value = current_date.getFullYear();
    return months[month_value];
    //document.write("The current date is " + months[month_value] + " " +
    //day_value + ", " + year_value);
}

function CalculateWtVol() {

    var currNOP = $('#txtPkgs').val();
    var currWt = $('#txtWt').val();


    //var ActWt = (parseFloat((ActNop / currNOP) * currWt)).toFixed(3);  //changed formula as interchanging ActNop & currnop causes increase in Gross Wt.  
    var NewWt = (parseFloat((currNOP / ActNop) * ActWt)).toFixed(3);
    //$('#' + uxWtID).val(ActWt);

    $('#txtWt').val(NewWt);
}

function ChkAndValidate() {

    var ScanCode = $('#txtScanCode').val();
    ScanCode = ScanCode.replace(/\s+/g, '');
    ScanCode = ScanCode.replace("-", "").replace("–", "");

    if (ScanCode.length >= 11) {

        $('#txtAWBPrefix').val(ScanCode.substr(0, 3));
        $('#txtAWBNo').val(ScanCode.substr(3, 8));
        $('#txtScanCode').val('');

        GetAWBTotalWeight();
    }
}

function GetAWBTotalWeight() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: ImportService + "GetAWBDetailsFromDB",
            data: JSON.stringify({
                'awbprefix': $('#txtAWBPrefix').val(), 'awbno': $('#txtAWBNo').val(), 'AirportCity': window.localStorage.getItem("SHED_AIRPORT_CITY"),
                'CompanyCode': window.localStorage.getItem("companyCode")
            }),
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
                Result = response.d[0];

                // if (Result.hasOwnProperty('NOP')) {
                //     $("#txtPackages").val(Result.NOP);
                // }
                // if (Result.hasOwnProperty('Weight')) {
                //     $("#txtWeight_FC").val(Result.Weight);
                // }
                // if (Result.hasOwnProperty('Origin')) {
                //     $("#txtOrigin_FC").val(Result.Origin);
                // }
                // if (Result.hasOwnProperty('Destination')) {
                //     $("#txtDestination_FC").val(Result.Destination);
                // }
                // if (Result.hasOwnProperty('LOC_CODE')) {
                //     $("#txtLocation_FC").val(Result.LOC_CODE);
                // }

                //response = response.d;
                //alert(response.d);

                if (response.d.length > 0) {
                    var result = response.d[0];
                    if (response.d[0].Description.length > 0) {

                        FoundActPcs = (response.d[0].NPX);
                        FoundActWt = (response.d[0].WeightExpKG);
                    }
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

function CalculateWtforFoundCargo() {

    var currNOP = $('#txtPackages').val();


    //var ActWt = (parseFloat((ActNop / currNOP) * currWt)).toFixed(3);  //changed formula as interchanging ActNop & currnop causes increase in Gross Wt.  
    var NewWt = (parseFloat((currNOP / FoundActPcs) * FoundActWt)).toFixed(3);
    //$('#' + uxWtID).val(ActWt);

    $('#txtWeight_FC').val(NewWt);
}

function ShowULDGridFromDamageCargo() {
    //$('#txtFlightPrefix').removeAttr("disabled");
    //$('#txtFlightNo').removeAttr("disabled");
    //$('#txtFlightDate').removeAttr("disabled");
    //$('#btnGetDetail').removeAttr("disabled");

    $("#divAddULDAccessories").hide();
    $("#divAddFoundCargo").hide();
    $("#divDamagedCargo").hide();
    $("#divFlightDetails").show();
    $("#divULDDetails").show();

}

function getDate() {
    var today = new Date();
    document.getElementById("txtFlightDate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}



