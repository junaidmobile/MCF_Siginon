//document.addEventListener("deviceready", SetTodayDate, false);

(function () {
    document.addEventListener("deviceready", SetTodayDate, false);
})();

var GHAExportFlightserviceURL = window.localStorage.getItem("GHAExportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var FlightSeqNo;
var SegId;
var ULDseqNo;
var FltStatus;
var Status;
var ActNop;
var ActWt;
var ActVol;
var ULDType;
var SEQ_NO = "";
var html;
var ActNopOffload;
var ActWtOffload;
var ActVolOffload;
var OffLoadUldSeq;
var OffLoadDate;
var OffShipNo;



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

function setEnglish() {
    $('#lblUnitization').text("Unitization");

}

function setGerman() {
    $('#lblFlightNo').text("Flug Nr.");
    $('#lblFlightDt').text("Flug Datum");
    $('#btnGet').val("Anruf");
    $('#lblOffPoint').text("Abladestation");

    $('#lblULDType').text("ULD Typ/Nr./Airl. Code");
    $('#btnAddULD').val("ULD Hinzufügen");
    //$('#lblBulkScaleWt').text("");  //Bulk Scale Wt.
    $('#lblStartDateTime').text("Anfang /hh/mm");  //Start Date/hh/mm
    $('#lblEndDateTime').text("Ende /hh/mm");  //End Date/hh/mm
    $('#lblHeightWeight').text("Höhe/Gewicht");  //Height/Weight
    $('#lblHeightWeightTare').text("Tara Gewicht");  //Tare Wt/Scale Wt
    $('#lblContour').text("Kontour");  //Contour
    $('#lblDestination').text("Empfangsstation");  //Destination
    $('#lblChkIntact').text("Intakt");  //Intact
    $('#btnViewGrid').val("AWB Anzeigen");  //View AWB
    $('#btnULDAccessory').val("ULD Equipment");  //ULD Accessory    
    $('#btnBuild').val("AWB Hinzufügen");  //Add AWB


    $('#lblULDNoAWBDetails').text("ULD Nr.");  //ULD No.
    $('#lblAWBScanAWBDetails').text("AWB Scan");  //Scan AWB
    $('#lblAWBNoAWBDetails').text("AWB Nr.");  //AWB No.
    $('#lblLocationAWBDetails').text("Stellplatz/Sendungs Nr."); //Location/Shipment No.
    $('#lblPkgsAWBDetails').text("Stückzahl");  //Packages
    $('#lblGrWtAWBDetails').text("Brutto Gewicht");  //Gross Wt.
    $('#lblVolumeAWBDetails').text("Volumen"); //Volume
    $('#lblSHCAWBDetails').text("SHC"); //SHC
    $('#lblUNNos').text("UN Nr."); //UN No.
    $('#btnSave').val("Senden"); //Submit
    $('#btnExit').val("Zurück"); //Back
    $('#lblAWBNoOffload').text("AWB Nr."); //AWB No.
    $('#lblULDNoOffload').text("ULD"); //ULD/Bulk
    $('#lblPiecesOffload').text("Stückzahl"); //Pieces
    $('#txtOffWt').text("Gewicht"); //Weight
    $('#lblVolumeOffload').text("Volumen"); //Volume
    $('#txtOffloc').text("Stellplatz"); //Location
    $('#ddlReason').text("Grund"); //Reason
    $('#txtOffRmk').text("Bemerkungen"); //Remarks
    $('#btnOffSave').val("Senden"); //Submit
    $('#btnOffExit').val("Zurück"); //Back
    $('#lblULDNoAccessories').text("ULD Nr."); //ULD No.
    $('#lblMaterialType').text("Material Type"); //Material Type
    $('#lblNoOfUnitsAccessories').text("Anzahl der Einheiten"); //No.of Units.
    $('#btnSave').val("Senden"); //Submit
    $('#btnExitAddAWB').val("Zurück"); //Back
    $('#btnExitULDAssesory').val("Zurück"); //Back
    $('#btnExitAwbGrid').val("Zurück"); //Back
    $('#lblULD').text("ULD's"); //ULD's
    $('#btnExitAwbGrid').val("Zurück"); //Back    
    $('#btnSave2').val("Senden"); //Submit

    $('#lblMode').text("Modus");  //Mode
    $('#optManifest').text("Manifestiert");  //Manifest
    $('#optNotreceived').text("Gebucht, aber nicht erhalten");  //Notreceived
    $('#optbooknrcvd').text("Gebucht und erhalten");  //booknrcvd
}

function setRussian() {
    $('#lblFlightNo').text("номер рейса");
    $('#lblFlightDt').text("дата рейса");
    $('#btnGet').val("поиск");
    $('#lblOffPoint').text("аэропорт разгрузки");

    $('#lblULDType').text("ULD тип/номер/код ак");
    $('#btnAddULD').val("добавить ULD");
    //$('#lblBulkScaleWt').text("");  //Bulk Scale Wt.
    $('#lblStartDateTime').text("начало/hh/mm");  //Start Date/hh/mm
    $('#lblEndDateTime').text("конец/hh/mm");  //End Date/hh/mm
    $('#lblHeightWeight').text("высота/вес");  //Height/Weight
    $('#lblHeightWeightTare').text("вес тары");  //Tare Wt/Scale Wt
    $('#lblContour').text("контур");  //Contour
    $('#lblDestination').text("аэропорт назначения");  //Destination
    $('#lblChkIntact').text("транзитная единица");  //Intact
    $('#btnViewGrid').val("показать AWB");  //View AWB
    $('#btnULDAccessory').val("аксессуар ULD");  //ULD Accessory    
    $('#btnBuild').val("добавить AWB");  //Add AWB


    $('#lblULDNoAWBDetails').text("номер ULD");  //ULD No.
    $('#lblAWBScanAWBDetails').text("сканирование AWB");  //Scan AWB
    $('#lblAWBNoAWBDetails').text("номер авианакладной");  //AWB No.
    $('#lblLocationAWBDetails').text("код места"); //Location/Shipment No.
    $('#lblPkgsAWBDetails').text("количество");  //Packages
    $('#lblGrWtAWBDetails').text("вес брутто");  //Gross Wt.
    $('#lblVolumeAWBDetails').text("объём"); //Volume
    $('#lblSHCAWBDetails').text("IMP код"); //SHC
    $('#lblUNNos').text("номер UN"); //UN No.
    $('#btnSave').val("отправить"); //Submit
    $('#btnExit').val("назад"); //Back
    $('#lblAWBNoOffload').text("номер авианакладной"); //AWB No.
    $('#lblULDNoOffload').text("ULD"); //ULD/Bulk
    $('#lblPiecesOffload').text("количество"); //Pieces
    $('#txtOffWt').text("вес"); //Weight
    $('#lblVolumeOffload').text("объём"); //Volume
    $('#txtOffloc').text("добавить место"); //Location
    $('#ddlReason').text("причина"); //Reason
    $('#txtOffRmk').text("замечание"); //Remarks
    $('#btnOffSave').val("отправить"); //Submit
    $('#btnOffExit').val("назад"); //Back
    $('#lblULDNoAccessories').text("номер ULD"); //ULD No.
    $('#lblMaterialType').text("Material Type"); //Material Type
    $('#lblNoOfUnitsAccessories').text("количество единиц"); //No.of Units.
    $('#btnSave').val("отправить"); //Submit
    $('#btnExitAddAWB').val("назад"); //Back
    $('#btnExitULDAssesory').val("назад"); //Back
    $('#btnExitAwbGrid').val("назад"); //Back
    $('#lblULD').text("ULD`s"); //ULD's
    $('#btnExitAwbGrid').val("назад"); //Back 
    $('#btnSave2').val("отправить"); //Submit

    $('#lblMode').text("Режим");  //Mode
    $('#optManifest').text("Проявляется");  //Manifest
    $('#optNotreceived').text("Забронировано, но не получено");  //Notreceived
    $('#optbooknrcvd').text("Забронировано и получено");  //booknrcvd
}

function setTurkish() {
    $('#lblFlightNo').text("uçuş No.");
    $('#lblFlightDt').text("uçuş tarih");
    $('#btnGet').val("aramak");
    $('#lblOffPoint').text("Boşatma noktasi");

    $('#lblULDType').text("ULD Tipi/Numarasi/Havayolu");
    $('#btnAddULD').val("ULD eklemek");
    //$('#lblBulkScaleWt').text("");  //Bulk Scale Wt.
    $('#lblStartDateTime').text("başlangıç/hh/mm");  //Start Date/hh/mm
    $('#lblEndDateTime').text("bitiş tarihi/hh/mm");  //End Date/hh/mm
    $('#lblHeightWeight').text("yükseklik/genişlik");  //Height/Weight
    $('#lblHeightWeightTare').text("Dara ağırlığı");  //Tare Wt/Scale Wt
    $('#lblContour').text("Kontour");  //Contour
    $('#lblDestination').text("Variş Noktasi");  //Destination
    $('#lblChkIntact').text("bozulmamış");  //Intact
    $('#btnViewGrid').val("AWB göstermek");  //View AWB
    $('#btnULDAccessory').val("ULD aksesuar");  //ULD Accessory    
    $('#btnBuild').val("AWB eklemek");  //Add AWB


    $('#lblULDNoAWBDetails').text("ULD No.");  //ULD No.
    $('#lblAWBScanAWBDetails').text("AWB taramak");  //Scan AWB
    $('#lblAWBNoAWBDetails').text("AWB No.");  //AWB No.
    $('#lblLocationAWBDetails').text("konum kodu"); //Location/Shipment No.
    $('#lblPkgsAWBDetails').text("Paket Sayisi");  //Packages
    $('#lblGrWtAWBDetails').text("brüt ağırlık");  //Gross Wt.
    $('#lblVolumeAWBDetails').text("hacim"); //Volume
    $('#lblSHCAWBDetails').text("Özel Elleçleme Kodlari"); //SHC
    $('#lblUNNos').text("UN numarasi"); //UN No.
    $('#btnSave').val("göndermek"); //Submit
    $('#btnExit').val("geri"); //Back
    $('#lblAWBNoOffload').text("AWB No."); //AWB No.
    $('#lblULDNoOffload').text("ULD"); //ULD/Bulk
    $('#lblPiecesOffload').text("Paket Sayisi"); //Pieces
    $('#txtOffWt').text("Agirlik"); //Weight
    $('#lblVolumeOffload').text("hacim"); //Volume
    $('#txtOffloc').text("yer"); //Location
    $('#ddlReason').text("neden"); //Reason
    $('#txtOffRmk').text("düşünce"); //Remarks
    $('#btnOffSave').val("göndermek"); //Submit
    $('#btnOffExit').val("geri"); //Back
    $('#lblULDNoAccessories').text("ULD No."); //ULD No.
    $('#lblMaterialType').text("Material Tipi"); //Material Type
    $('#lblNoOfUnitsAccessories').text("birim sayısı"); //No.of Units.
    $('#btnSave').val("göndermek"); //Submit
    $('#btnExitAddAWB').val("geri"); //Back
    $('#btnExitULDAssesory').val("geri"); //Back
    $('#btnExitAwbGrid').val("geri"); //Back
    $('#lblULD').text("ULD`s"); //ULD's
    $('#btnExitAwbGrid').val("geri"); //Back 
    $('#btnClear2').val("temiz");
    $('#btnSave2').val("göndermek"); //Submit

    $('#lblMode').text("kip");  //Mode
    $('#optManifest').text("tecelli");  //Manifest
    $('#optNotreceived').text("Rezervasyonu Alınan Ama Alınmamış");  //Notreceived
    $('#optbooknrcvd').text("Rezervasyon ve Alınan");  //booknrcvd
}

function SetTodayDate() {

    var TodayDt = Date.now();
    var formattedDate = new Date(TodayDt);
    var d = formattedDate.getDate();
    if (d.toString().length < Number(2))
        d = '0' + d;
    var m = formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    if (m.toString().length < Number(2))
        m = '0' + m;
    var y = formattedDate.getFullYear();

    var TodayDate = y + "-" + m + "-" + d;
    $('#txtFlightDate').val(TodayDate);
    OffLoadDate = TodayDate;
}

function GetOffPointForFlight() {

    $('#txtTareWt').empty();
    $('#txtScaleWt').empty();
    $('#ddlOffPoint').empty();
    $('#ddlAWBGridULD').empty();
    $('#txtULDType').val('');
    $('#txtULDNumber').val('');
    $('#txtOwner').val('');
    $('#ddlULD').empty();
    $('#txtStartDateTime').val('');
    $('#txtStartTimeFrom').val('');
    $('#txtStartTimeTo').val('');
    $('#txtEndDateTime').val('');
    $('#txtEndTimeFrom').val('');
    $('#txtEndTimeTo').val('');
    $('#txtHeight').val('');
    $('#txtGrossWt').val('');
    $('#txtDestination').val('');
    $('#ddlContur').empty();
    $('#txtStartDateTime').removeAttr("disabled");
    $('#txtStartTimeFrom').removeAttr("disabled");
    $('#txtStartTimeTo').removeAttr("disabled");
    $('#txtEndDateTime').removeAttr("disabled");
    $('#txtEndTimeFrom').removeAttr("disabled");
    $('#txtEndTimeTo').removeAttr("disabled");
    $('#txtDestination').removeAttr("disabled");
    $('#txtHeight').removeAttr("disabled");
    $('#ddlContur').removeAttr("disabled");

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();

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

    var inputXML = '<Root><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><Offpoint></Offpoint><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetExportFlightDetails",
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

                $(xmlDoc).find('Table').each(function () {

                    var Status;
                    var Message;
                    Status = $(this).find('Status').text();
                    Message = $(this).find('StrMessage').text();

                    if (Status == "S") {

                        $(xmlDoc).find('Table1').each(function () {

                            FlightSeqNo = $(this).find('FltSeqNo').text();
                            FltStatus = $(this).find('FltStatus').text();
                        });

                        $(xmlDoc).find('Table2').each(function (index) {

                            var RouteId;
                            var OffPointCity;

                            RouteId = $(this).find('RouteID').text();
                            OffPointCity = $(this).find('FLIGHT_AIRPORT_CITY').text();

                            var newOption = $('<option></option>');
                            newOption.val(RouteId).text(OffPointCity);
                            newOption.appendTo('#ddlOffPoint');
                            // if (index == 0) {
                            //     GetULDs(OffPointCity);
                            // }
                        });

                        $(xmlDoc).find('Table3').each(function (index) {

                            var ULDId;
                            var ULDNo;
                            var ULDType;

                            ULDId = $(this).find('ULD_SEQUENCE_NUMBER').text();
                            ULDNo = $(this).find('ULDBULKNO').text();
                            ULDType = $(this).find('Type').text();

                            if (index == 0) {
                                var newOption = $('<option></option>');
                                newOption.val(0).text('Select');
                                newOption.appendTo('#ddlULD');

                            }

                            var newOption = $('<option></option>');
                            newOption.val(ULDId + "-" + ULDType).text(ULDNo);
                            newOption.appendTo('#ddlULD');

                            //if (index == 0) {
                            //    var newOption = $('<option></option>');
                            //    newOption.val(0).text('Select');
                            //    newOption.appendTo('#ddlAWBGridULD');
                            //}

                            var newOption = $('<option></option>');
                            newOption.val(ULDId + "-" + ULDType).text(ULDNo);
                            newOption.appendTo('#ddlAWBGridULD');
                        });



                        $(xmlDoc).find('Table4').each(function (index) {

                            var ContCode;

                            ContCode = $(this).find('ContCode').text();
                            if (index == 0) {
                                var newOption = $('<option></option>');
                                newOption.val(0).text('Select');
                                newOption.appendTo('#ddlContur');
                            }

                            var newOption = $('<option></option>');
                            newOption.val(ContCode).text(ContCode);
                            newOption.appendTo('#ddlContur');
                        });
                    }
                    else {
                        $.alert(Message);
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

function GetULDs(offPonit) {

    $('#ddlULD').empty();
    $('#txtHeight').val('');
    $('#txtGrossWt').val('');
    $('#txtULDType').val("");
    $('#txtULDNumber').val("");
    $('#txtOwner').val("");
    // $('#txtContour').val('');
    $('#txtDestination').val('');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();

    var inputXML = '<Root><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><Offpoint>' + offPonit + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetExportFlightDetails",
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
                    FltStatus = $(this).find('FltStatus').text();
                });

                $(xmlDoc).find('Table3').each(function (index) {

                    var ULDId;
                    var ULDNo, ULDType;

                    ULDId = $(this).find('ULD_SEQUENCE_NUMBER').text();
                    ULDNo = $(this).find('ULDBULKNO').text();
                    ULDType = $(this).find('Type').text();
                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlULD');

                    }

                    // var newOption = $('<option></option>');
                    // newOption.val(ULDId).text(ULDNo);
                    // newOption.appendTo('#ddlULD');

                    var newOption = $('<option></option>');
                    newOption.val(ULDId + "-" + ULDType).text(ULDNo);
                    newOption.appendTo('#ddlULD');

                    //if (index == 0) {
                    //    var newOption = $('<option></option>');
                    //    newOption.val(0).text('Select');
                    //    newOption.appendTo('#ddlAWBGridULD');
                    //}

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULDNo);
                    newOption.appendTo('#ddlAWBGridULD');
                });



                $(xmlDoc).find('Table4').each(function (index) {

                    var ContCode;

                    ContCode = $(this).find('ContCode').text();
                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlContur');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(ContCode).text(ContCode);
                    newOption.appendTo('#ddlContur');
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

function AddULD() {

    if (FltStatus == "C") {
        errmsg = "Flight is closed. Cannot perform this operation";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightPrefix').val() == "" || $('#txtFlightNo').val() == "") {
        errmsg = "Please enter valid Flight No.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightDate').val() == "") {
        errmsg = "Please enter Flight Date";
        $.alert(errmsg);
        return;
    }

    if ($('#txtULDType').val() == "" || $('#txtULDNumber').val() == "") {
        errmsg = "Please enter ULD Type and No.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtOwner').val() == "") {
        lnv.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to add Trolley?',
            confirmHandler: function () {

                var height;

                if ($('#txtHeight').val() == "")
                    height = '0';
                else
                    height = $('#txtHeight').val();

                var connectionStatus = navigator.onLine ? 'online' : 'offline'
                var errmsg = "";

                var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDType>' + $('#txtULDType').val().toUpperCase() + '</ULDType><ULDNo>' + $('#txtULDNumber').val() + '</ULDNo><ULDOwner>' + $('#txtOwner').val().toUpperCase() + '</ULDOwner><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';
                //<Root><FlightSeqNo>226</FlightSeqNo><ULDType>AKF</ULDType><ULDNo>12456</ULDNo><ULDOwner>AI</ULDOwner><Offpoint>DEL</Offpoint><AirportCity>FRA</AirportCity><UserId>252</UserId></Root>
                //var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDType>' + $('#txtULDType').val().toUpperCase() + '</ULDType><ULDNo>' + $('#txtULDNumber').val() + '</ULDNo><ULDOwner>' + $('#txtOwner').val().toUpperCase() + '</ULDOwner><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId><UHeight>' + height + '</UHeight><UConCode>' + $('#txtContour').val() + '</UConCode><SWeight>' + $('#txtGrossWt').val() + '</SWeight><UDest>' + $('#txtDestination').val() + '</UDest></Root>';


                if (errmsg == "" && connectionStatus == "online") {
                    $.ajax({
                        type: "POST",
                        url: GHAExportFlightserviceURL + "UnitizationSaveULDDetails",
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
                                if ($(this).find('Status').text() == 'E') {
                                    $.alert($(this).find('Message').text());
                                }
                                else if ($(this).find('Status').text() == 'S') {
                                    $.alert($(this).find('Message').text());

                                    GetULDs($('#ddlOffPoint').find('option:selected').text());

                                    $('#txtULDType').val("");
                                    $('#txtULDNumber').val("");
                                    $('#txtOwner').val("");
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
            },
            cancelHandler: function () {

                if ($('#txtOwner').val() == "") {
                    errmsg = "Please enter ULD Owner";
                    $.alert(errmsg);
                    return;
                }
            }
        })
    }
    else {
        if ($('#txtOwner').val() == "") {
            errmsg = "Please enter ULD Owner";
            $.alert(errmsg);
            return;
        }

        var height;

        if ($('#txtHeight').val() == "")
            height = '0';
        else
            height = $('#txtHeight').val();

        var connectionStatus = navigator.onLine ? 'online' : 'offline'
        var errmsg = "";

        var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDType>' + $('#txtULDType').val().toUpperCase() + '</ULDType><ULDNo>' + $('#txtULDNumber').val() + '</ULDNo><ULDOwner>' + $('#txtOwner').val().toUpperCase() + '</ULDOwner><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';
        //<Root><FlightSeqNo>226</FlightSeqNo><ULDType>AKF</ULDType><ULDNo>12456</ULDNo><ULDOwner>AI</ULDOwner><Offpoint>DEL</Offpoint><AirportCity>FRA</AirportCity><UserId>252</UserId></Root>
        //var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDType>' + $('#txtULDType').val().toUpperCase() + '</ULDType><ULDNo>' + $('#txtULDNumber').val() + '</ULDNo><ULDOwner>' + $('#txtOwner').val().toUpperCase() + '</ULDOwner><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId><UHeight>' + height + '</UHeight><UConCode>' + $('#txtContour').val() + '</UConCode><SWeight>' + $('#txtGrossWt').val() + '</SWeight><UDest>' + $('#txtDestination').val() + '</UDest></Root>';


        if (errmsg == "" && connectionStatus == "online") {
            $.ajax({
                type: "POST",
                url: GHAExportFlightserviceURL + "UnitizationSaveULDDetails",
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
                        if ($(this).find('Status').text() == 'E') {
                            $.alert($(this).find('Message').text());
                        }
                        else if ($(this).find('Status').text() == 'S') {
                            $.alert($(this).find('Message').text());
                            GetULDs($('#ddlOffPoint').find('option:selected').text());

                            $('#txtULDType').val("");
                            $('#txtULDNumber').val("");
                            $('#txtOwner').val("");
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
}

function SaveDateTimeForULD() {

    //if ($('#ddlOffPoint').find('option:selected').text() == "Select") {
    //    errmsg = "Please select ULD";
    //    $.alert(errmsg);
    //    return;
    //}
    if (FltStatus == "C") {
        errmsg = "Flight is closed. Cannot perform this operation";
        $.alert(errmsg);
        return;
    }

    if (ULDType == "T") {
        SaveTrolleyForULD();
    }
    else if (ULDType == "U") {

        if ($('#txtGrossWt').val() == "" || parseFloat($('#txtGrossWt').val()) <= 0) {
            errmsg = "Please enter Weight";
            $.alert(errmsg);
            return;
        }



        //if ($('#txtContour').val() == "") {
        //    errmsg = "Please enter Contour";
        //    $.alert(errmsg);
        //    return;
        //}
        if ($('#ddlULD').prop('disabled') && $('#ddlContur').val() == "0") {
            errmsg = "Please select Contour";
            $.alert(errmsg);
            return;
        }

        var ddlULDValueSelected = $('#ddlULD').find('option:selected').text();

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) === 0;
            };
        }
        if (ddlULDValueSelected.startsWith("P") && $('#ddlContur').val() == "0") {
            errmsg = "Please select Contour";
            $.alert(errmsg);
            return;
        }

        if (($('#txtHeight').val() == "" || parseInt($('#txtHeight').val()) <= 0) && $('#ddlContur').val() != "0") {
            errmsg = "Please enter Height";
            $.alert(errmsg);
            return;
        }

        //if ($('#txtDestination').val() == "") {
        //    errmsg = "Please enter Destination";
        //    $.alert(errmsg);
        //    return;
        //}

        //if ($('#txtStartDateTime').val() == "" || $('#txtStartTimeFrom').val() == "" || $('#txtStartTimeTo').val() == "") {
        //    errmsg = "Please enter Start Date/hh/mm";
        //    $.alert(errmsg);
        //    return;
        //}

        //if ($('#txtEndDateTime').val() == "" || $('#txtEndTimeFrom').val() == "" || $('#txtEndTimeTo').val() == "") {
        //    errmsg = "Please enter End Date/hh/mm";
        //    $.alert(errmsg);
        //    return;
        //}
        var BuiltStrtHrs;
        if ($('#txtStartTimeFrom').val() == "")
            BuiltStrtHrs = '0';
        else
            BuiltStrtHrs = $('#txtStartTimeFrom').val();

        var BuiltStrtMin;
        if ($('#txtStartTimeTo').val() == "")
            BuiltStrtMin = '0';
        else
            BuiltStrtMin = $('#txtStartTimeTo').val();

        var BuiltEndHrs;
        if ($('#txtEndTimeFrom').val() == "")
            BuiltEndHrs = '0';
        else
            BuiltEndHrs = $('#txtEndTimeFrom').val();

        var BuildEndMin;
        if ($('#txtEndTimeTo').val() == "")
            BuildEndMin = '0';
        else
            BuildEndMin = $('#txtEndTimeTo').val();


        var height;

        if ($('#txtHeight').val() == "")
            height = '0';
        else
            height = $('#txtHeight').val();


        var StartDate = "";
        if ($('#txtStartDateTime').val().length > 0) {
            var formattedDate = new Date($('#txtStartDateTime').val());
            var d = formattedDate.getDate();
            if (d.toString().length < Number(2))
                d = '0' + d;
            var m = formattedDate.getMonth();
            m += 1;  // JavaScript months are 0-11
            if (m.toString().length < Number(2))
                m = '0' + m;
            var y = formattedDate.getFullYear();

            StartDate = m + "/" + d + "/" + y;
        }
        var EndDate = "";
        if ($('#txtEndDateTime').val().length > 0) {
            var formattedDate = new Date($('#txtEndDateTime').val());
            var d = formattedDate.getDate();
            if (d.toString().length < Number(2))
                d = '0' + d;
            var m = formattedDate.getMonth();
            m += 1;  // JavaScript months are 0-11
            if (m.toString().length < Number(2))
                m = '0' + m;
            var y = formattedDate.getFullYear();

            EndDate = m + "/" + d + "/" + y;
        }
        //var ConditionCode="";
        var intact = '1';

        if (document.getElementById('chkIntact').checked) {
            intact = 'true';
        } else {
            intact = 'false';
        }

        var connectionStatus = navigator.onLine ? 'online' : 'offline'
        var errmsg = "";

        //var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + $('#ddlULD').find('option:selected').val() + '</ULDSeqNo><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><BuiltUpStart>' + StartDate + '</BuiltUpStart><BuiltUpStartTime>' + $('#txtStartTimeFrom').val() + ':' + $('#txtStartTimeTo').val() + '</BuiltUpStartTime><BuiltUpEnd>' + EndDate + '</BuiltUpEnd><BuiltUpEndTime>' + $('#txtEndTimeFrom').val() + ':' + $('#txtEndTimeTo').val() + '</BuiltUpEndTime><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

        var ULDNoType = $('#ddlULD').find('option:selected').val().split("-");
        var seqNoDdl = ULDNoType[0];
        if (errmsg == "" && connectionStatus == "online") {
            $.ajax({
                type: "POST",
                url: GHAExportFlightserviceURL + "PDASaveULDBuiltUpDetails",
                data: JSON.stringify({
                    'intMode': "0", 'strULDNo': $('#ddlULD').find('option:selected').text(), 'strULDSeqNo': seqNoDdl,
                    'blnIntact': intact, 'strScaleWt': $('#txtGrossWt').val(), 'strOnwardDestination': $('#txtDestination').val(),
                    'strConditionCode': "", 'strContourCode': $('#ddlContur').find('option:selected').val(), 'strULDHeight': height,
                    'BuiltStrtDate': StartDate, 'BuiltStrtHrs': BuiltStrtHrs, 'BuiltStrtMin': BuiltStrtMin, 'BuiltEndDate': EndDate, 'BuiltEndHrs': BuiltEndHrs, 'BuildEndMin': BuildEndMin,
                    'strFlightSeqNo': FlightSeqNo, 'strRoutePoint': $('#ddlOffPoint').find('option:selected').text(), 'strAirportCity': AirportCity, 'strUserID': UserId, 'CompanyCode': window.localStorage.getItem("companyCode")

                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                //        beforeSend: function doStuff() {
                //            //$('.dialog-background').css('display', 'block');
                //            $('body').mLoading({
                //                text: "Please Wait..",
                //            });
                //        },
                //        success: function (response) {
                //            $("body").mLoading('hide');

                //            response = response.d;
                //            var xmlDoc = $.parseXML(response);

                //            $(xmlDoc).find('Table').each(function () {

                //                $.alert($(this).find('StrMessage').text());
                //            });
                //        },
                //        error: function (msg) {
                //            $("body").mLoading('hide');
                //            $.alert('Some error occurred while saving data');
                //        }
                //    });
                //    return false;
                //}
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
                    //$.alert('Data saved successfully');
                    ShowULDDetails();
                    $("body").mLoading('hide');
                    $.alert(response.d);
                },
                error: function (msg) {
                    //$("body").mLoading('hide');
                    //$.alert('Some error occurred while saving data');
                    HideLoader();
                    var r = jQuery.parseJSON(msg.responseText);
                    alert("Message: " + r.Message);
                }
            });
            return false;
        }
    }
}

function SaveTrolleyForULD() {
    if ($('#txtTareWt').val() == "") {
        errmsg = "Please enter Tare Wt.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtScaleWt').val() == "") {
        errmsg = "Please enter Scale Wt.";
        $.alert(errmsg);
        return;
    }


    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var ULDNoType = $('#ddlULD').find('option:selected').val().split("-");
    var seqNoDdl = ULDNoType[0];
    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><TrolleySeqNo>' + seqNoDdl + '</TrolleySeqNo><TareWt>' + $('#txtTareWt').val() + '</TareWt><ScaleWt>' + $('#txtScaleWt').val() + '</ScaleWt><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "UpdateTrolleyDetails",
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
                ////$.alert(response.d);
                ////window.location.reload();
                //$.alert('Data saved successfully');
                //response = response.d;
                //var xmlDoc = $.parseXML(response);

                //$(xmlDoc).find('Table').each(function () {
                //    //if ($(this).find('StrMessage').text() == 'No record found.')
                //    //    $.alert($(this).find('StrMessage').text());
                //    var msg = $(this).find('FltSeqNo').text();
                //});
                // 
                $("body").mLoading('hide');
                var parser, xmlDoc;
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(response.d, "text/xml");
                var msg = xmlDoc.getElementsByTagName("strOutput")[0].childNodes[0].nodeValue;
                $.alert(msg);
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

function ShowAddAWBGrid() {

    if (FltStatus == "C") {
        errmsg = "Flight is closed. Cannot perform this operation";
        $.alert(errmsg);
        return;
    }

    if ($('#ddlULD').find('option:selected').text() == 'Select') {
        errmsg = "Please select ULD";
        $.alert(errmsg);
        return;
    }

    if (Status == "C") {
        errmsg = "Bulk/ULD is closed. Cannot perform operation";
        $.alert(errmsg);
        return;
    }

    $('#txtFlightPrefix').attr("disabled", "disabled");
    $('#txtFlightNo').attr("disabled", "disabled");
    $('#txtFlightDate').attr("disabled", "disabled");
    $('#ddlOffPoint').attr("disabled", "disabled");
    $('#btnGet').attr("disabled", "disabled");
    $('#txtFlightNo').blur();


    $('#txtULDNo').val($('#ddlULD').find('option:selected').text());
    $("#divULDDetails").hide();
    $("#divAddULDAccessories").hide();
    $("#divDisplayAWBGrid").hide();
    $("#divAddAWBDetails").show();
    $('#txtScanCode').focus();

}

function ShowULDGrid() {
    $('#txtFlightPrefix').removeAttr("disabled");
    $('#txtFlightNo').removeAttr("disabled");
    $('#txtFlightDate').removeAttr("disabled");
    $('#ddlOffPoint').removeAttr("disabled");
    $('#btnGet').removeAttr("disabled");

    $("#divAddAWBDetails").hide();
    $("#divAddULDAccessories").hide();
    $("#divULDDetails").show();
    $("#divDisplayAWBGrid").hide();
    $("#divOffloadDetails").hide();

    $('#txtScanCode').val('');
    $('#txtAWBPrefix').val('');
    $('#txtAWBNo').val('');
    $('#ddlShipmentNo').empty();
    $('#txtPackages').val('');
    $('#txtAWBGrossWt').val('');
    $('#txtVolume').val('');
    $('#txtLocation').val('');
    $('#txtRemarks').val('');
}

function ShowAddULDAccesoryGrid() {

    if ($('#ddlULD').find('option:selected').text() == 'Select') {
        errmsg = "Please select ULD";
        $.alert(errmsg);
        return;
    }
    else {
        $('#txtFlightPrefix').attr("disabled", "disabled");
        $('#txtFlightNo').attr("disabled", "disabled");
        $('#txtFlightDate').attr("disabled", "disabled");
        $('#ddlOffPoint').attr("disabled", "disabled");
        $('#btnGet').attr("disabled", "disabled");

        $('#txtAccessoryULDNo').val($('#ddlULD').find('option:selected').text());
        $('#txtNoUnits').val('1');
        $("#divAddAWBDetails").hide();
        $("#divAddULDAccessories").show();
        $("#divULDDetails").hide();
        $("#divDisplayAWBGrid").hide();
        $("#divOffloadDetails").hide();

        GetMaterialList();
    }
}

function ShowULDGridFromULDAccessory() {
    $('#txtFlightPrefix').removeAttr("disabled");
    $('#txtFlightNo').removeAttr("disabled");
    $('#txtFlightDate').removeAttr("disabled");
    $('#ddlOffPoint').removeAttr("disabled");
    $('#btnGet').removeAttr("disabled");

    $("#divAddAWBDetails").hide();
    $("#divAddULDAccessories").hide();
    $("#divULDDetails").show();
    $("#divDisplayAWBGrid").hide();
    $("#divOffloadDetails").hide();

    $('#ddlMaterialType').empty();
    $('#txtNoUnits').val('');
    $('#txtAccessoryULDNo').val('');
}

function DisplayAWBinGrid() {

    if ($('#ddlULD').find('option:selected').text() == 'Select') {
        errmsg = "Please select ULD";
        $.alert(errmsg);
        return;
    }

    $('#txtFlightPrefix').attr("disabled", "disabled");
    $('#txtFlightNo').attr("disabled", "disabled");
    $('#txtFlightDate').attr("disabled", "disabled");
    $('#ddlOffPoint').attr("disabled", "disabled");
    $('#btnGet').attr("disabled", "disabled");
    $('#txtFlightNo').blur();
    // var ULDNoType = $('#ddlULD').find('option:selected').val().split("-");
    // var seqNoDdl = ULDNoType[0];
    // $('#ddlAWBGridULD').val(seqNoDdl)

    $('#ddlAWBGridULD').val($('#ddlULD').find('option:selected').val())

    $("#divULDDetails").hide();
    $("#divAddULDAccessories").hide();
    $("#divAddAWBDetails").hide();
    $("#divDisplayAWBGrid").show();
    $("#divOffloadDetails").hide();

    GetAvailableAWBgrid()

}

function DisplayULDFromAWBGrid() {

    $('#txtFlightPrefix').removeAttr("disabled");
    $('#txtFlightNo').removeAttr("disabled");
    $('#txtFlightDate').removeAttr("disabled");
    $('#ddlOffPoint').removeAttr("disabled");
    $('#btnGet').removeAttr("disabled");

    $("#divAddAWBDetails").hide();
    $("#divAddULDAccessories").hide();
    $("#divULDDetails").show();
    $("#divDisplayAWBGrid").hide();
    $("#divOffloadDetails").hide();
}

function GetMaterialList() {
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var ULDNoType = $('#ddlAWBGridULD').find('option:selected').val().split("-");
    var seqNoDdl = ULDNoType[0];
    var inputXML = '<Root><MATERIAL_FOR>U</MATERIAL_FOR><Module>E</Module><ULDSeqNo>' + seqNoDdl + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID><ALCode>' + FlightPrefix + '</ALCode></Root>';
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
                var newOption = $('<option></option>');
                newOption.val(0).text('Select');
                newOption.appendTo('#ddlMaterialType');
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

function ShowBulkWtField() {

    //if ($('#ddlULD').find('option:selected').text() == 'Bulk') 
    //    $("#divBulkScaleWt").show();
    //else
    //    $("#divBulkScaleWt").hide();
}


function clearFields() {
    $('#txtStartDateTime').val('');
    $('#txtEndDateTime').val('');
    $('#txtStartTimeFrom').val('');
    $('#txtStartTimeTo').val('');
    $('#txtEndTimeFrom').val('');
    $('#txtEndTimeTo').val('');
    $('#txtHeight').val('');
    $('#txtGrossWt').val('');
    $('#txtDestination').val('');
    // $('#ddlContur').empty();
    $("#ddlContur option[value='']").attr('selected', true)

}

function ShowULDDetails() {
    clearFields();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";
    var ULDNoType = $('#ddlULD').find('option:selected').val().split("-");
    var seqNoDdl = ULDNoType[0];
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "UnitizationGetULDDetails",
            data: JSON.stringify({
                'FlightSeqNo': FlightSeqNo, 'RoutePoint': $('#ddlOffPoint').find('option:selected').text(), 'ULDSeqNo': seqNoDdl, 'AirportCity': AirportCity, 'ULDNo': $('#ddlULD').find('option:selected').text(),
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //beforeSend: function doStuff() {
            //    $('body').mLoading({
            //        text: "Loading..",
            //    });
            //},
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);
                $('#ddlContur').empty();
                var newOption = $('<option></option>');
                newOption.val(0).text('Select');
                newOption.appendTo('#ddlContur');
                $(xmlDoc).find('Table').each(function () {
                    if ($(this).find('StrMessage').text() == 'No record found.')
                        $.alert($(this).find('StrMessage').text());
                });

                $(xmlDoc).find('Table').each(function (index) {

                    if ($(this).find('Type').text() == 'U') {

                        $('#txtTareWt').val('');
                        $('#txtScaleWt').val('');
                        $('#txtStartDateTime').removeAttr("disabled");
                        $('#txtStartTimeFrom').removeAttr("disabled");
                        $('#txtStartTimeTo').removeAttr("disabled");
                        $('#txtEndDateTime').removeAttr("disabled");
                        $('#txtEndTimeFrom').removeAttr("disabled");
                        $('#txtEndTimeTo').removeAttr("disabled");
                        $('#txtDestination').removeAttr("disabled");
                        $('#ddlContur').removeAttr("disabled");

                        $("#divTrolleyHeightWt").hide();
                        $("#divULDHeightWt").show();

                        ULDType = $(this).find('Type').text();
                        var newOption = $('<option></option>');
                        //newOption.val(0).text($(this).find('ShipNo').text());
                        //newOption.appendTo('#ddlShipmentNo');  IsIntact  

                        if ($('#ddlULD').find('option:selected').text() == "Bulk") {
                            $('#txtHeight').attr("disabled", "disabled");
                            $('#ddlContur').attr("disabled", "disabled");
                        }
                        else {
                            $('#txtHeight').removeAttr("disabled");
                            $('#ddlContur').removeAttr("disabled");
                        }

                        $('#txtGrossWt').val($(this).find('ScaleWeight').text());
                        $('#txtHeight').val($(this).find('ULD_HEIGHT').text());
                        //$('#txtContour').val($(this).find('ContourCode').text());

                        if ($(this).find('ContourCode').text() != "") {
                            var ContCode = $(this).find('ContourCode').text();
                            var newOption = $('<option></option>');
                            newOption.val(ContCode).text(ContCode);
                            newOption.appendTo('#ddlContur');
                            $("#ddlContur option[value=" + ContCode + "]").attr('selected', true)
                            // $('#ddlContur').val();
                        }
                        // else {
                        //     // $('#ddlContur').val(0);
                        //     var newOption = $('<option></option>');
                        //     newOption.val(0).text('Select');
                        //     newOption.appendTo('#ddlContur');
                        // }

                        $('#txtDestination').val($(this).find('Destination').text());
                        //$('#txtContour').val($(this).find('ContourCode').text());

                        if ($(this).find('IsIntact').text() == "Y") {
                            $('#chkIntact').prop('checked', true);
                        }
                        else { $('#chkIntact').prop('checked', false); }


                        if ($(this).find('UldBuiltUpStart').text().length > 0) {
                            //var formattedDate = new Date($(this).find('UldBuiltUpStart').text());
                            //var d = formattedDate.getDate();
                            //if (d.toString().length < Number(2))
                            //    d = '0' + d;
                            //var m = formattedDate.getMonth();
                            //m += 1;  // JavaScript months are 0-11
                            //if (m.toString().length < Number(2))
                            //    m = '0' + m;
                            //var y = formattedDate.getFullYear();

                            ////var StartDate = d + "-" + m + "-" + y;
                            var StartDate = $(this).find('UldBuiltUpStart').text();

                            //$('#txtStartDateTime').val(StartDate);
                            document.getElementById('txtStartDateTime').value = StartDate;
                        }

                        var StartTime = $(this).find('UldBuiltUpStartTime').text();
                        $('#txtStartTimeFrom').val(StartTime.substr(0, 2));
                        $('#txtStartTimeTo').val(StartTime.substr(3, 2));

                        var EndTime = $(this).find('UldBuiltUpEndTime').text();
                        $('#txtEndTimeFrom').val(EndTime.substr(0, 2));
                        $('#txtEndTimeTo').val(EndTime.substr(3, 2));


                        if ($(this).find('UldBuiltUpEnd').text().length > 0) {
                            //var formattedDate = new Date($(this).find('UldBuiltUpEnd').text());
                            //var d = formattedDate.getDate();
                            //if (d.toString().length < Number(2))
                            //    d = '0' + d;
                            //var m = formattedDate.getMonth();
                            //m += 1;  // JavaScript months are 0-11
                            //if (m.toString().length < Number(2))
                            //    m = '0' + m;
                            //var y = formattedDate.getFullYear();
                            //var StartDate = y + "-" + m + "-" + d;
                            var EndDate = $(this).find('UldBuiltUpEnd').text();

                            $('#txtEndDateTime').val(EndDate);
                        }

                        Status = $(this).find('STATUS').text();

                    }
                    else if ($(this).find('Type').text() == 'T') {
                        ULDType = $(this).find('Type').text();
                        $('#txtHeight').val('');
                        $('#txtGrossWt').val('');
                        $('#txtStartDateTime').attr("disabled", "disabled");
                        $('#txtStartTimeFrom').attr("disabled", "disabled");
                        $('#txtStartTimeTo').attr("disabled", "disabled");
                        $('#txtEndDateTime').attr("disabled", "disabled");
                        $('#txtEndTimeFrom').attr("disabled", "disabled");
                        $('#txtEndTimeTo').attr("disabled", "disabled");
                        $('#txtDestination').attr("disabled", "disabled");
                        $('#ddlContur').attr("disabled", "disabled");

                        $("#divTrolleyHeightWt").show();
                        $("#divULDHeightWt").hide();

                        $('#txtTareWt').val($(this).find('Tare_Weight').text());
                        $('#txtScaleWt').val($(this).find('Scale_Weight').text());
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

function GetShipmentInfoForAWB(AWBNo) {

    $('#ddlShipmentNo').empty();
    $('#txtLocation').val("");
    $('#txtRemarks').val("");
    $('#txtPackages').val("");
    $('#txtAWBGrossWt').val("");
    $('#txtVolume').val("");
    $('#ddlSHCCode').empty();
    $('#ddlUNNos').empty();
    $('#txtSHCCode').val("");
    $('#txtUNNos').val("");

    var MAWBPrefix = $('#txtAWBPrefix').val();
    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBPrefix.length != '3' || MAWBNo.length != '8') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    $('#ddlShipmentNo').empty();

    var inputXML = '<Root><flightSeqNo>' + FlightSeqNo + '</flightSeqNo><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><AWBPrefix>' + MAWBPrefix + '</AWBPrefix><AWBNo>' + MAWBNo + '</AWBNo><ShipNo>0</ShipNo></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "UnitizationPendingAWBDetails",
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

                $(xmlDoc).find('Table').each(function () {
                    if ($(this).find('Status').text() == 'E') {
                        $.alert($(this).find('StrMessage').text());
                        $('#txtScanCode').focus();
                    }
                    else if ($(this).find('Status').text() == 'S') {
                        $(xmlDoc).find('Table1').each(function (index) {

                            $('#txtPackages').val($(this).find('NOP').text());
                            ActNop = $(this).find('NOP').text();
                            $('#txtAWBGrossWt').val($(this).find('WEIGHT_KG').text());
                            ActWt = $(this).find('WEIGHT_KG').text();
                            $('#txtVolume').val($(this).find('VOLUME').text());
                            ActVol = $(this).find('VOLUME').text();
                            $('#txtPriorityCode').val($(this).find('PrioCode').text());
                            $('#txtLocation').val($(this).find('Loc').text());
                            $('#txtRemarks').val($(this).find('Remarks').text());
                            $('#btnClearAll').focus();

                        });
                        $(xmlDoc).find('Table2').each(function (index) {

                            var SHCs;
                            SHCs = $(this).find('SHCs').text();

                            if (index == 0) {
                                var newOption = $('<option></option>');
                                newOption.val(0).text('Select');
                                newOption.appendTo('#ddlSHCCode');
                            }

                            var newOption = $('<option></option>');
                            newOption.val(SHCs).text(SHCs);
                            newOption.appendTo('#ddlSHCCode');
                        });

                        $(xmlDoc).find('Table3').each(function (index) {

                            var UNNos;
                            var UNSeqNo;
                            UNNos = $(this).find('UNNos').text();
                            UNSeqNo = $(this).find('UNSeqNo').text();

                            if (index == 0) {
                                var newOption = $('<option></option>');
                                newOption.val(0).text('Select');
                                newOption.appendTo('#ddlUNNos');
                            }

                            var newOption = $('<option></option>');
                            newOption.val(UNSeqNo).text(UNNos);
                            newOption.appendTo('#ddlUNNos');
                        });

                        $(xmlDoc).find('Table4').each(function (index) {

                            var newOption = $('<option></option>');
                            newOption.val(0).text($(this).find('ShipNo').text());
                            newOption.appendTo('#ddlShipmentNo');
                        });
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

function GetShipmentDetails() {

    $('#txtLocation').val("");
    $('#txtRemarks').val("");
    $('#txtPackages').val("");
    $('#txtAWBGrossWt').val("");
    $('#txtVolume').val("");
    $('#ddlSHCCode').empty();
    $('#ddlUNNos').empty();
    $('#txtSHCCode').val("");
    $('#txtUNNos').val("");

    var MAWBPrefix = $('#txtAWBPrefix').val();
    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBPrefix.length != '3' || MAWBNo.length != '8') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";



    var inputXML = '<Root><flightSeqNo>' + FlightSeqNo + '</flightSeqNo><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><AWBPrefix>' + MAWBPrefix + '</AWBPrefix><AWBNo>' + MAWBNo + '</AWBNo><ShipNo>' + $('#ddlShipmentNo').find('option:selected').text() + '</ShipNo></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "UnitizationPendingAWBDetails",
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

                $(xmlDoc).find('Table').each(function () {
                    if ($(this).find('StrMessage').text() == 'No record found.')
                        $.alert($(this).find('StrMessage').text());
                });

                $(xmlDoc).find('Table1').each(function (index) {

                    //var newOption = $('<option></option>');
                    //newOption.val(0).text($(this).find('ShipNo').text());
                    //newOption.appendTo('#ddlShipmentNo');

                    $('#txtPackages').val($(this).find('NOP').text());
                    ActNop = $(this).find('NOP').text();
                    $('#txtAWBGrossWt').val($(this).find('WEIGHT_KG').text());
                    ActWt = $(this).find('WEIGHT_KG').text();
                    $('#txtVolume').val($(this).find('VOLUME').text());
                    ActVol = $(this).find('VOLUME').text();
                    $('#txtPriorityCode').val($(this).find('PrioCode').text());
                    $('#txtLocation').val($(this).find('Loc').text());
                    $('#txtRemarks').val($(this).find('Remarks').text());

                });
                $(xmlDoc).find('Table2').each(function (index) {

                    var SHCs;
                    SHCs = $(this).find('SHCs').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlSHCCode');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(SHCs).text(SHCs);
                    newOption.appendTo('#ddlSHCCode');
                });

                $(xmlDoc).find('Table3').each(function (index) {

                    var UNNos;
                    var UNSeqNo;
                    UNNos = $(this).find('UNNos').text();
                    UNSeqNo = $(this).find('UNSeqNo').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlUNNos');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(UNSeqNo).text(UNNos);
                    newOption.appendTo('#ddlUNNos');
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

function GetMaterialUsed() {
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    $('#txtNoUnits').val('');
    $('#txtNoUnits').focus();
    var ULDNoType = $('#ddlULD').find('option:selected').val().split("-");
    var seqNoDdl = ULDNoType[0];
    var inputXML = '<Root><MATERIAL_FOR>U</MATERIAL_FOR><MATERIAL_ID>' + $('#ddlMaterialType').find('option:selected').val() + '</MATERIAL_ID><Module>E</Module><ULDSeqNo>' + seqNoDdl + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';
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

    var ULDNoType = $('#ddlULD').find('option:selected').val().split("-");
    var seqNoDdl = ULDNoType[0];
    var inputXML = '<Root><SEQ_NO>' + SEQ_NO + '</SEQ_NO><MATERIAL_FOR>U</MATERIAL_FOR><MATERIAL_ID>' + $('#ddlMaterialType').find('option:selected').val() + '</MATERIAL_ID><MATERIAL_UNIT>' + $('#txtNoUnits').val() + '</MATERIAL_UNIT><Module>E</Module><ULDSeqNo>' + seqNoDdl + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';

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

function GetSHCCode() {
    var SHCCode;
    if ($('#txtSHCCode').val() == "") {
        SHCCode = "";
    }
    else {
        SHCCode = $('#txtSHCCode').val();
    }
    if ($('#ddlSHCCode').find('option:selected').text() == "Select") {
        SHCCode = "";
    }
    else {
        if (SHCCode == "") {
            SHCCode = $('#ddlSHCCode').find('option:selected').text();;
        }
        else {
            if (SHCCode.split(',').indexOf($('#ddlSHCCode').find('option:selected').val()) !== -1) {
                //SHCCode = SHCCode + "," + $('#ddlSHCCode').find('option:selected').text();
                SHCCode = SHCCode;
            }
            else {
                //SHCCode = SHCCode;
                SHCCode = SHCCode + "," + $('#ddlSHCCode').find('option:selected').text();
            }
        }
    }
    $('#txtSHCCode').val(SHCCode);
}

function GetUNNos() {

    var UNSeqNo;

    if ($('#txtUNNos').val() == "") {
        UNSeqNo = "";
    }
    else {
        UNSeqNo = $('#txtUNNos').val();
    }

    if ($('#ddlUNNos').find('option:selected').text() == "Select") {
        UNSeqNo = "";
    }
    else {
        if (UNSeqNo == "") {
            UNSeqNo = $('#ddlUNNos').find('option:selected').val();
        }
        else {
            if (UNSeqNo.split(',').indexOf($('#ddlUNNos').find('option:selected').val()) !== -1) {
                UNSeqNo = UNSeqNo;
            }
            else {

                UNSeqNo = UNSeqNo + "," + $('#ddlUNNos').find('option:selected').val();
            }
        }
    }
    $('#txtUNNos').val(UNSeqNo);
}

function SaveAWBforULDDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBPrefix = $('#txtAWBPrefix').val();
    var AWBNo = $('#txtAWBNo').val();
    var ShipmentNo = $('#ddlShipmentNo').find('option:selected').text();
    var Packages = $('#txtPackages').val();
    var GrossWt = $('#txtAWBGrossWt').val();
    var GrossWtUnit = $('#ddlGrossWtUnit').find('option:selected').text();
    var Volume = $('#txtVolume').val();
    var ULDNo = $('#txtULDNo').val().replace(/\s/g, "");

    // ddlULD
    var ULDNoType = $('#ddlULD').find('option:selected').val().split("-");
    // var ULDNos = ULDNoType[0].replace(/\s/g, "");
    var ULDType = ULDNoType[1];
    //var SHCCode = [];
    //$.each($("input[name='multicheck']:checked"), function () {
    //    SHCCode.push($(this).val());
    //});
    var strUNNos = "";

    if (AWBPrefix == "" || AWBNo == "" || Packages == "" || GrossWt == "" || Volume == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;

    }

    if (ShipmentNo == "Select" || ShipmentNo == "") {

        errmsg = "Shipment number not found</br>";
        $.alert(errmsg);
        return;

    }

    if ($('#txtFlightDate').val().length > 0) {
        var formattedDate = new Date($('#txtFlightDate').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11  txtUNNos
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        var flightDate = m + "/" + d + "/" + y;
    }

    // ,'UType':T
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "EXPLoadShipment",
            data: JSON.stringify({
                'strFlightNo': $('#txtFlightPrefix').val() + $('#txtFlightNo').val(), 'strFlightDate': flightDate, 'strULDNo': ULDNo,
                'strAWBNo': AWBPrefix + AWBNo, 'strShipmentNo': ShipmentNo, 'strPkgs': Packages,
                'strGrossWt': GrossWt, 'strWtUnit': GrossWtUnit, 'strVolume': Volume,
                'strAirportCity': AirportCity, 'strUserID': window.localStorage.getItem("UserID"), 'CompanyCode': window.localStorage.getItem("companyCode"), 'OffPoint': $('#ddlOffPoint').find('option:selected').text(),
                'SHCs': $('#txtSHCCode').val(), 'UNNos': $('#txtUNNos').val(), 'UType': ULDType, 'ULDSeqNo': ULDNoType[0]
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

                if (response != null && response != "" && response != "<NewDataSet />") {

                    $(xmlDoc).find('Table').each(function (index) {
                        var Status;
                        var strmsg;
                        Status = $(this).find('Status').text();
                        strmsg = $(this).find('StrMessage').text();


                        $.alert(strmsg);
                    });
                    //$.alert('Details saved successfully');
                    //window.location.reload();

                    $('#txtScanCode').val("");
                    $('#txtScanCode').focus();
                    $('#txtAWBPrefix').val("");
                    $('#txtAWBNo').val("");
                    $('#txtPriorityCode').val("");
                    $('#ddlShipmentNo').empty();
                    $('#txtLocation').val("");
                    $('#txtPackages').val("");
                    $('#txtAWBGrossWt').val("");
                    $('#txtVolume').val("");
                    $('#ddlSHCCode').empty();
                    $('#ddlUNNos').empty();
                    $('#txtSHCCode').val("");
                    $('#txtUNNos').val("");
                    $('#txtRemarks').val("");
                }
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

function clearAllULDDetails() {

    $('#txtFlightPrefix').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#ddlOffPoint').empty();
    $('#txtULDType').val('');
    $('#txtULDNumber').val('');
    $('#txtOwner').val('');
    $('#ddlULD').empty();
    $('#txtStartDateTime').val('');
    $('#txtStartTimeFrom').val('');
    $('#txtStartTimeTo').val('');
    $('#txtEndDateTime').val('');
    $('#txtEndTimeFrom').val('');
    $('#txtEndTimeTo').val('');
    $('#txtHeight').val('');
    $('#txtGrossWt').val('');
    $('#ddlContur').empty();
    $('#txtDestination').val('');
    $('#chkIntact').prop('checked', false);
}

//function ValidateAWB() { 
//    var ScanCode = $('#txtScanCode').val();
//    ScanCode = ScanCode.replace(/\s+/g, '');
//    ScanCode = ScanCode.replace("-", "").replace("–", "");

//    $('#txtAWBPrefix').val(ScanCode.substr(0, 3));
//    $('#txtAWBNo').val(ScanCode.substr(3, 8));

//    GetShipmentInfoForAWB($('#txtAWBPrefix').val() + $('#txtAWBNo').val());

//}


function openScanner() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {

            barCodeResule = result.text;
            if (result.text != "") {
                $('#txtScanULD').val(barCodeResule);
                ValidateULD();
            }

        },
        function (error) {
            // alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats: "CODE_128,QR_CODE,PDF_417,QR_CODE,DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,PDF417,RSS_EXPANDED", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true, // iOS
            disableSuccessBeep: false // iOS
        }
    );
}

function ValidateULD() {
    var ScanULD = $('#txtScanULD').val();
    ScanULD = ScanULD.replace(/\s+/g, '');
    ScanULD = ScanULD.replace("-", "").replace("–", "");

    if (ScanULD.length >= 10) {

        $('#txtULDType').val(ScanULD.substr(0, 3));
        $('#txtULDNumber').val(ScanULD.substr(3, 5));
        $('#txtOwner').val(ScanULD.substr(8, 2));
    }

}

function ChkAndValidate() {

    var ScanCode = $('#txtScanCode').val();
    ScanCode = ScanCode.replace(/\s+/g, '');
    ScanCode = ScanCode.replace("-", "").replace("–", "");

    if (ScanCode.length >= 11) {

        //var ScanCode = $('#txtScanCode').val();
        //ScanCode = ScanCode.replace(/\s+/g, '');
        //ScanCode = ScanCode.replace("-", "").replace("–", "");

        $('#txtAWBPrefix').val(ScanCode.substr(0, 3));
        $('#txtAWBNo').val(ScanCode.substr(3, 8));
        $('#txtScanCode').val('');

        GetShipmentInfoForAWB($('#txtAWBPrefix').val() + $('#txtAWBNo').val());
    }
}

function CalculateWtVol() {

    var currNOP = $('#txtPackages').val();
    var currWt = $('#txtAWBGrossWt').val();
    var currVol = $('#txtVolume').val();

    //var ActWt = (parseFloat((ActNop / currNOP) * currWt)).toFixed(3);  //changed formula as interchanging ActNop & currnop causes increase in Gross Wt.  
    //var ActWt = (parseFloat((currNOP / ActNop) * currWt)).toFixed(3);
    var NewWt = (parseFloat((currNOP / ActNop) * ActWt)).toFixed(3);
    //$('#' + uxWtID).val(ActWt);

    //var ActVol = parseFloat((ActNop / currNOP) * currVol).toFixed(3); //changed formula as interchanging ActNop & currnop causes increase in Gross Volume.
    var NewVol = parseFloat((currNOP / ActNop) * ActVol).toFixed(3);
    //$('#' + uxVolID).val(ActVol);

    $('#txtAWBGrossWt').val(NewWt);
    $('#txtVolume').val(NewVol);
}

function MovetoNext(current, nextFieldID) {
    if (current.value.length >= current.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

function alertDismissed() {
}

function ClearAWBDetails() {
    $('#txtScanCode').val('');
    $('#txtAWBPrefix').val('');
    $('#txtAWBNo').val('');
    $('#ddlShipmentNo').empty();
    $('#txtPackages').val('');
    $('#txtAWBGrossWt').val('');
    $('#txtVolume').val('');
    $('#txtLocation').val('');
    $('#txtRemarks').val('');
    $('#txtScanCode').focus();
}


function GetGridDetailsByMode() {

    if ($('#ddlManifestMode').find('option:selected').val() != 0) {
        $("#divbooked").hide();
    }
    else {
        $("#divbooked").show();
    }

    if ($('#ddlManifestMode').find('option:selected').val() == 1 || $('#ddlManifestMode').find('option:selected').val() == 2) {
        $('#ddlAWBGridULD').attr("disabled", "disabled");
    } else {
        $('#ddlAWBGridULD').removeAttr("disabled");
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var locPieces;
    var ULDNoType = $('#ddlAWBGridULD').find('option:selected').val().split("-");
    var seqNoDdl = ULDNoType[0];
    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + seqNoDdl + '</ULDSeqNo><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId><ULDNo>' + $('#ddlAWBGridULD').find('option:selected').text() + '</ULDNo><Mode>' + $('#ddlManifestMode').find('option:selected').val() + '</Mode></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetManifestedAWBs",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                $('#divShowGrid').empty();
                $("body").mLoading('hide');
                var str = response.d;


                if (str != null && str != "") {

                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";

                    if ($('#ddlManifestMode').find('option:selected').val() == 0) {
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%;' align='center'font-weight:'bold'>AWB</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pcs.</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Wt.</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Offload</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; display:none;' align='center'font-weight:'bold'>HideShipNo</th>";
                    }
                    else {
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%;' align='center'font-weight:'bold'>AWB</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:10%;' align='center'font-weight:'bold'>Pcs.</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:15%;' align='center'font-weight:'bold'>Wt.</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>SHCs</th>";
                    }
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {


                        var AWBNo;
                        var Pieces;
                        var Weight;
                        var OffShipNo;
                        var SHCs = " ";

                        AWBNo = $(this).find('AWBNo').text();
                        AWBNo = AWBNo.replace(' ', '');
                        AWBNo = AWBNo.replace(/\s+/g, '');
                        Pieces = $(this).find('NOP').text();
                        Weight = $(this).find('WEIGHT_KG').text();
                        OffShipNo = $(this).find('ShipNo').text();

                        if ($('#ddlManifestMode').find('option:selected').val() != 0) {
                            SHCs = $(this).find('SHCs').text();
                        }

                        AddTableLocation(index, AWBNo, Pieces, Weight, OffShipNo, SHCs);
                    });

                    html += "</tbody></table>";


                    $('#divShowGrid').append(html);

                }
                else {
                    errmsg = 'AWB does not exists';
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

function GetAvailableAWBgrid() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var locPieces;
    var ULDNoType = $('#ddlAWBGridULD').find('option:selected').val().split("-");
    var seqNoDdl = ULDNoType[0];
    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + seqNoDdl + '</ULDSeqNo><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId><UType>' + ULDNoType[1] + '</UType><Mode>' + $('#ddlManifestMode').find('option:selected').val() + '</Mode></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetManifestedAWBs",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                $('#divShowGrid').empty();
                $("body").mLoading('hide');
                var str = response.d;


                if (str != null && str != "") {

                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:30%;' align='center'font-weight:'bold'>AWB</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pieces</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Weight</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%' align='center'font-weight:'bold'>Offload</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; display:none;' align='center'font-weight:'bold'>HideShipNo</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {


                        var AWBNo;
                        var Pieces;
                        var Weight;
                        var OffShipNo;

                        AWBNo = $(this).find('AWBNo').text();
                        AWBNo = AWBNo.replace(' ', '');
                        AWBNo = AWBNo.replace(/\s+/g, '');
                        Pieces = $(this).find('NOP').text();
                        Weight = $(this).find('WEIGHT_KG').text();
                        OffShipNo = $(this).find('ShipNo').text();
                        Status = $(this).find('Status').text();

                        AddTableLocation(index, AWBNo, Pieces, Weight, OffShipNo);
                    });

                    html += "</tbody></table>";


                    $('#divShowGrid').append(html);

                }
                else {
                    errmsg = 'AWB does not exists';
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

function AddTableLocation(index, AWBNo, Pieces, Weight, OffShipNo, SHCs) {
    html += "<tr>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + AWBNo + "</td>";
    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtAWB_" + index + " class=form-control type=text style=text-align:right; value=" + AWBNo + " disabled></td>";

    html += "<td height='30'  style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtPcs_" + index + " class=form-control type=text style=text-align:right; value=" + Pieces + " disabled></td>";

    html += "<td height='30'  style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtWt_" + index + " class=form-control type=text style=text-align:right; value=" + Weight + " disabled></td>";


    if ($('#ddlManifestMode').find('option:selected').val() == 0) {
        html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'> <img id=imgMove_" + index + " src='images/Move.png' onclick='ShowOffload(" + index + ");'></td>";
        html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px; display:none;'align='center'><input id=txtHideShipNo_" + index + " class=form-control type=number style=text-align:right; value=" + OffShipNo + "></td>";
    }
    else {
        html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><input id=txtWt_" + index + " class=form-control type=text style=text-align:right; disabled value=" + SHCs + " ></td>";
    }
    html += "</tr>";

}

function ShowOffload(id) {

    if (FltStatus == "C") {
        errmsg = "Flight is closed. Cannot perform this operation";
        $.alert(errmsg);
        return;
    }

    if (Status == "C") {
        errmsg = "Cannot offload AWB, as ULD is closed";
        $.alert(errmsg);
        return;
    }

    $('#txtFlightPrefix').attr("disabled", "disabled");
    $('#txtFlightNo').attr("disabled", "disabled");
    $('#txtFlightDate').attr("disabled", "disabled");
    $('#ddlOffPoint').attr("disabled", "disabled");
    $('#btnGet').attr("disabled", "disabled");


    $('#txtULDNo').val($('#ddlULD').find('option:selected').text());
    $("#divULDDetails").hide();
    $("#divAddULDAccessories").hide();
    $("#divDisplayAWBGrid").hide();
    $("#divAddAWBDetails").hide();
    $("#divFlightDetails").hide();
    $("#divOffloadDetails").show();
    $('#txtScanCode').focus();

    var AWbOffload = $('#txtAWB_' + id).val();
    var OffloadShipNo = $('#txtHideShipNo_' + id).val();

    GetOffLoadDetails(AWbOffload, OffloadShipNo);

    //$('#txtOffAWB').val($('#txtAWB_' + id).val()); 

}

function DisplayAWBGridFromOffLoad() {

    if ($('#ddlULD').find('option:selected').text() == 'Select') {
        errmsg = "Please select ULD";
        $.alert(errmsg);
        return;
    }

    $('#txtFlightPrefix').attr("disabled", "disabled");
    $('#txtFlightNo').attr("disabled", "disabled");
    $('#txtFlightDate').attr("disabled", "disabled");
    $('#ddlOffPoint').attr("disabled", "disabled");
    $('#btnGet').attr("disabled", "disabled");
    $('#txtFlightNo').blur();

    $('#txtOffAWB').val('');
    $('#txtOffULD').val('');
    $('#txtOffPcs').val('');
    $('#txtOffVolume').val('');
    $('#txtOffGrWt').val('');
    $('#ddlReason').empty();
    $('#ddlOffSHCCode').empty();
    $('#ddlOffUNNos').empty();
    $('#txtOffloc').val('');
    $('#txtOffRmk').val('');
    // var ULDNoType = $('#ddlULD').find('option:selected').val().split("-");
    // var seqNoDdl = ULDNoType[0];
    // $('#ddlAWBGridULD').val($('#ddlULD').find('option:selected').text())
    //$('#txtULDNo').val($('#ddlULD').find('option:selected').text());
    $("#divULDDetails").hide();
    $("#divAddULDAccessories").hide();
    $("#divAddAWBDetails").hide();
    $("#divFlightDetails").show();
    $("#divDisplayAWBGrid").show();
    $("#divOffloadDetails").hide();
    $("#divchkbox").hide();

    GetAvailableAWBgrid()

}

function GetOffLoadDetails(AWbOffload, OffloadShipNo) {
    var OffSHCs = "";
    var OffUNNos = "";
    var OffUNSeqNo = "";

    $('#txtOffSHCCode').val('');
    $('#txtOffUNNos').val('');

    $("#chkIsFill").prop('checked', false);

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var ULDNoType = $('#ddlAWBGridULD').find('option:selected').val().split("-");
    var seqNoDdl = ULDNoType[0];

    //var inputXML = '<Root><FlightSeqNo>2409</FlightSeqNo><UlDSeqNo>0</UlDSeqNo><AWBPREFIX>098</AWBPREFIX><AWBNO>20180724</AWBNO><SHIPNO>2</SHIPNO><UserId>252</UserId><AirportCity>OSL</AirportCity><CompanyId>3</CompanyId></Root>';
    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><UlDSeqNo>' + seqNoDdl + '</UlDSeqNo><AWBPREFIX>' + AWbOffload.substr(0, 3) + '</AWBPREFIX><AWBNO>' + AWbOffload.substr(3, 8) + '</AWBNO><SHIPNO>' + OffloadShipNo + '</SHIPNO><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity><CompanyId>' + window.localStorage.getItem("companyCode") + '</CompanyId></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "HHTGetOffloadDetails",
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

                    $('#txtOffAWB').val($(this).find('EXPORT_SHIPMENT_AWB_PREFIX').text() + $(this).find('EXPORT_SHIPMENT_AWB_NUMBER').text());
                    $('#txtOffULD').val($(this).find('Uld').text());
                    $('#txtOffPcs').val($(this).find('NOP').text());
                    $('#txtOffVolume').val($(this).find('VOLUME').text());
                    $('#txtOffGrWt').val($(this).find('WEIGHT_KG').text());

                    ActNopOffload = $(this).find('NOP').text();
                    ActWtOffload = $(this).find('WEIGHT_KG').text();
                    ActVolOffload = $(this).find('VOLUME').text();
                    OffLoadUldSeq = $(this).find('ULD_SEQUENCE_NUMBER').text();
                    OffShipNo = $(this).find('EXPORT_SHIPMENT_SHIPMENT_NO').text();

                });

                $(xmlDoc).find('Table2').each(function (index) {


                    OffSHCs = $(this).find('SHCs').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlOffSHCCode');
                    }
                    var aaraySHCs = OffSHCs.split(",");

                    for (var i = 0; i < aaraySHCs.length; i++) {
                        $('<option/>').val(aaraySHCs[i]).html(aaraySHCs[i]).appendTo('#ddlOffSHCCode');
                    }

                    //var newOption = $('<option></option>');
                    //newOption.val(OffSHCs).text(OffSHCs);
                    //newOption.appendTo('#ddlOffSHCCode');
                });

                $(xmlDoc).find('Table1').each(function (index) {


                    OffUNNos = $(this).find('UNNumber_A').text();
                    OffUNSeqNo = $(this).find('Seq_no').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlOffUNNos');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(OffUNSeqNo).text(OffUNNos);
                    newOption.appendTo('#ddlOffUNNos');

                    if (OffUNNos == "") {
                        $("#divchkbox").hide();
                        $("#chkIsFill").prop('checked', false);
                    }
                    else {
                        $("#divchkbox").show();
                        $("#chkIsFill").prop('checked', true);
                    }
                });

                $(xmlDoc).find('Table3').each(function (index) {

                    var RId;
                    var RDesc;

                    RId = $(this).find('RDInd').text();
                    RDesc = $(this).find('RDesc').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlReason');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(RId).text(RDesc);
                    newOption.appendTo('#ddlReason');

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

function GetOffLoadSHCCode() {
    var OffLoadSHCCode;
    if ($('#txtOffSHCCode').val() == "") {
        OffLoadSHCCode = "";
    }
    else {
        OffLoadSHCCode = $('#txtOffSHCCode').val();
    }
    if ($('#ddlOffSHCCode').find('option:selected').text() == "Select") {
        OffLoadSHCCode = "";
    }
    else {
        if (OffLoadSHCCode == "") {
            OffLoadSHCCode = $('#ddlOffSHCCode').find('option:selected').text();;
        }
        else {
            if (OffLoadSHCCode.split(',').indexOf($('#ddlOffSHCCode').find('option:selected').val()) !== -1) {
                //SHCCode = SHCCode + "," + $('#ddlSHCCode').find('option:selected').text();
                OffLoadSHCCode = OffLoadSHCCode;
            }
            else {
                //SHCCode = SHCCode;
                OffLoadSHCCode = OffLoadSHCCode + "," + $('#ddlOffSHCCode').find('option:selected').text();
            }
        }
    }
    $('#txtOffSHCCode').val(OffLoadSHCCode);
}

function GetOffLoadUNNos() {

    var OffLoadUNSeqNo;

    if ($('#txtOffUNNos').val() == "") {
        OffLoadUNSeqNo = "";
    }
    else {
        OffLoadUNSeqNo = $('#txtOffUNNos').val();
    }

    if ($('#ddlOffUNNos').find('option:selected').text() == "Select") {
        OffLoadUNSeqNo = "";
    }
    else {
        if (OffLoadUNSeqNo == "") {
            OffLoadUNSeqNo = $('#ddlOffUNNos').find('option:selected').val();
        }
        else {
            if (OffLoadUNSeqNo.split(',').indexOf($('#ddlOffUNNos').find('option:selected').val()) !== -1) {
                // OffLoadUNSeqNo = UNSeqNo;
            }
            else {

                OffLoadUNSeqNo = OffLoadUNSeqNo + "," + $('#ddlOffUNNos').find('option:selected').val();
            }
        }
    }
    $('#txtOffUNNos').val(OffLoadUNSeqNo);
}

function CalculateWtVolforOffload() {

    var currNOP = $('#txtOffPcs').val();
    //var ActWt = (parseFloat((ActNop / currNOP) * currWt)).toFixed(3);  //changed formula as interchanging ActNop & currnop causes increase in Gross Wt.  
    var NewWt = (parseFloat((currNOP / ActNopOffload) * ActWtOffload)).toFixed(3);
    var NewVol = (parseFloat((currNOP / ActNopOffload) * ActVolOffload)).toFixed(3);

    $('#txtOffGrWt').val(NewWt);
    $('#txtOffVolume').val(NewVol);
}

function SaveOffloadDetails() {

    var OffloadAWBPrefix = $('#txtOffAWB').val();
    var OffLoadPcs = $('#txtOffPcs').val();
    var OffLoadGrossWt = $('#txtOffGrWt').val();
    var OffLoadVolume = $('#txtOffVolume').val();
    var OffselectedSHCs = $('#txtOffSHCCode').val();
    var OffselectedUNNos = $('#txtOffUNNos').val();

    if (OffLoadPcs == "" || parseFloat(OffLoadPcs) <= 0) {
        errmsg = "Please enter valid Pieces.";
        $.alert(errmsg);
        return;
    }

    if (OffLoadGrossWt == "" || parseFloat(OffLoadGrossWt) <= 0) {
        errmsg = "Please enter valid gross weight.";
        $.alert(errmsg);
        return;
    }

    if (OffLoadVolume == "" || parseFloat(OffLoadVolume) <= 0) {
        errmsg = "Please enter valid volume.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtOffloc').val() == "") {
        errmsg = "Please enter location.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtOffRmk').val() == "") {
        errmsg = "Please enter remarks.";
        $.alert(errmsg);
        return;
    }

    // if (($('#ddlOffSHCCode option').length) > 0) {
    //     if (($('#ddlOffSHCCode').find('option:selected').text() == "Select") || ($('#ddlOffSHCCode').find('option:selected').text() == "")) {
    //         errmsg = "Please select SHC code";
    //         $.alert(errmsg);
    //         return;
    //     }
    // }

    if (($('#ddlOffUNNos option').length) > 0) {
        if (($('#ddlOffUNNos').find('option:selected').text() == "Select") || ($('#ddlOffUNNos').find('option:selected').text() == "")) {
            errmsg = "Please select UN No.";
            $.alert(errmsg);
            return;
        }
    }

    var isFill = 'false';

    if (document.getElementById('chkIsFill').checked) {
        isFill = 'true';
    } else {
        isFill = 'false';
    }



    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var inputXML = '<ROOT><AWBData AWBPREF="' + OffloadAWBPrefix.substr(0, 3) + '" AWBNUMBER="' + OffloadAWBPrefix.substr(3, 8) + '" SHIPNO="' + OffShipNo + '" NOP="' + OffLoadPcs + '" Weight="' + OffLoadGrossWt + '" Vol="' + OffLoadVolume + '" IsFull="' + isFill + '" SHCs="' + OffselectedSHCs + '" UNNumbers="' + OffselectedUNNos + '" /></ROOT>';
    //var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><TrolleySeqNo>' + $('#ddlULD').find('option:selected').val() + '</TrolleySeqNo><TareWt>' + $('#txtTareWt').val() + '</TareWt><ScaleWt>' + $('#txtScaleWt').val() + '</ScaleWt><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';
    var todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "HHTOffloadAWB",
            data: JSON.stringify({
                'cargoXML': inputXML, 'FlightSeqNo': FlightSeqNo, 'AirportCity': AirportCity, 'Location': $('#txtOffloc').val(), 'ShedCode': window.localStorage.getItem("SHED_CODE"),
                'UserID': window.localStorage.getItem("UserID"), 'CompCode': window.localStorage.getItem("companyCode"), 'Reason': $('#ddlReason').find('option:selected').val(), 'Remarks': $('#txtOffRmk').val(), 'Priority': "1",
                'OffloadDate': todayDate, 'uldSeqNo': OffLoadUldSeq,
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

                $(xmlDoc).find('Table1').each(function () {
                    if ($(this).find('Status').text() == 'S') {
                        $.alert($(this).find('Message').text());
                        DisplayAWBGridFromOffLoad();
                    }
                    if ($(this).find('Status').text() == 'E') {
                        $.alert($(this).find('Message').text());
                    }
                });

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

function getDate() {
    var today = new Date();
    document.getElementById("txtFlightDate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}