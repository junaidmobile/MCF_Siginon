//document.addEventListener("deviceready", GetCommodityList, false);

var GHAserviceURL = window.localStorage.getItem("GHAserviceURL");
var GHAExportFlightserviceURL = window.localStorage.getItem("GHAExportFlightserviceURL");

//function GetAutoShipmentStatus()
//{

//    var AWBNO = $('#txtAWBNo').val();
//    AWBNO = AWBNO.replace(/\s+/g, '');
//    AWBNO = AWBNO.replace("-", "").replace("–", "");

//    if (AWBNO.length >= 11) {
//        GetShipmentStatus();
//    }
    
//}

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
    $('#lblAWBNo').text("AWB Nr.");
    $('#lblAgentName').text("Spediteure");
    $('#lblConsigneeName').text("Empfänger");
    $('#lblDesc').text("Warenbeschreibung");
    $('#lblOrigin').text("Abgangsstation");
    $('#lblDestination').text("Empfangsstation");
    $('#lblSHC').text("Spezial Handling Code");
}

function setRussian() {
    $('#lblAWBNo').text("номер авианакладной");
    $('#lblAgentName').text("экспедитор");
    $('#lblConsigneeName').text("получатель");
    $('#lblDesc').text("наименование груза");
    $('#lblOrigin').text("аэропорт отправления");
    $('#lblDestination').text("аэропорт назначения");
    $('#lblSHC').text("IMP код");
    $('#btnClearAll').val("очистить");
    $('#btnExit').val("Iвыход");
}

function setTurkish() {
    $('#lblAWBNo').text("AWB No.");
    $('#lblAgentName').text("dağıtıcılar");
    $('#lblConsigneeName').text("alıcı");
    $('#lblDesc').text("açıklama");
    $('#lblOrigin').text("Menşei");
    $('#lblDestination').text("Variş Noktasi");
    $('#lblSHC').text("Özel Elleçleme Kodlari");
    $('#btnClearAll').val("temiz");
    $('#btnExit').val("çikiş");
}

function GetHAWBDetailsForMAWB() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAserviceURL + "GetHouseNo",
            data: JSON.stringify({
                'strAWBNo': MAWBNo, 'strAirportCity': window.localStorage.getItem("SHED_AIRPORT_CITY"),
                'CompanyCode': window.localStorage.getItem("companyCode"), 'strCycle': 'E'
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
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    var HAWBId;
                    var HAWBNos;

                    HAWBId = $(this).find('HOUSE_SEQUENCE_NUMBER').text();
                    HAWBNos = $(this).find('HOUSE_NUMBER').text();

                    var newOption = $('<option></option>');
                    newOption.val(HAWBId).text(HAWBNos);
                    newOption.appendTo('#ddlHAWB');
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

function GetShipmentStatus() {

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var HouseSeqNo = "";

    //if ($(('#ddlHAWB').val() == '0') || ('#ddlHAWB').text() == 'Select') {
    //    HouseSeqNo = "0";
    //}
    //else {
    //    HouseSeqNo = $('#ddlHAWB').val();
    //}

    var inputXML = '<Root><Module>E</Module><AWBPref>' + $('#txtAWBPrefix').val() + '</AWBPref><AWBNo>' + $('#txtAWBNo').val() + '</AWBNo><HouseSeqNo>' + HouseSeqNo + '</HouseSeqNo><AirportCity>' + window.localStorage.getItem("SHED_AIRPORT_CITY") + '</AirportCity><UserId>' + window.localStorage.getItem("UserID") + '</UserId><CompCode>' + window.localStorage.getItem("companyCode") + '</CompCode></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "HHTGetAWBStatus",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $('#divShowGrid').empty();
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                console.log(xmlDoc)
                var SuccessResult;
                $(xmlDoc).find('Table').each(function (index) {
                    if ($(this).find('Status').text() == 'E') {
                        SuccessResult = $(this).find('Status').text();
                        $.alert($(this).find('Message').text());
                        $('#txtScanCode').focus();
                    }
                    else if ($(this).find('Status').text() == 'S') {

                        SuccessResult = $(this).find('Column1').text();
                        $(xmlDoc).find('Table').each(function (index) {

                            $('#txtAgentName').val($(this).find('AgentName').text());
                            $('#txtConsigneeName').val($(this).find('ConsigneeName').text());
                            //AutoHeight($(this).find('ConsigneeName').text());
                            $('#txtDesc').val($(this).find('Description').text());
                            $('#txtOrigin').val($(this).find('Origin').text());
                            $('#txtDestination').val($(this).find('Destination').text());
                            $('#txtSHC').val($(this).find('SHC ').text());
                        });

                        //if (SuccessResult == 'S') {

                        html = '';

                        html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                        html += "<thead><tr>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:25%;' align='center'font-weight:'bold'>Flight Details</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:10%;' align='center'font-weight:'bold'>Pcs</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:20%;' align='center'font-weight:'bold'>Wt.</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px; width:45%;' align='center'font-weight:'bold'>Status</th>";
                        html += "</tr></thead>";
                        html += "<tbody>";


                        $(xmlDoc).find('Table1').each(function () {

                            var FlightDet;
                            var Pieces;
                            var Weight;
                            var Status;

                            FlightDet = $(this).find('FlightDet').text();
                            Pieces = $(this).find('Pcs').text();
                            Weight = $(this).find('Weight').text();
                            Status = $(this).find('Status').text();

                            AddTableLocation(FlightDet, Pieces, Weight, Status);

                        });

                        html += "</tbody></table>";
                        $('#divShowGrid').append(html);
                        // }

                        //$(xmlDoc).find('Table2').each(function () {

                        //    var HouseNo;
                        //    var HouseSeqNo;

                        //    HouseNo = $(this).find('HouseNo').text();
                        //    HouseSeqNo = $(this).find('HouseSeqNo').text();

                        //    var newOption = $('<option></option>');
                        //    newOption.val(HouseSeqNo).text(HouseNo);
                        //    newOption.appendTo('#ddlHAWB');

                        //    if (($('#ddlHAWB').text() != "") || ($('#ddlHAWB').val() != "0")) {
                        //        $('#ddlHAWB').val(HouseSeqNo);
                        //    }
                        //    else { $('#ddlHAWB').val(0); }

                        //});
                        $('#btnClearAll').focus();
                    }
                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
    }
}

function clearBeforePopulate() {
    $('#txtAgentName').val('');
    $('#txtConsigneeName').val('');
    $('#txtDesc').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtSHC').val('');
    $('#divShowGrid').empty();
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function alertDismissed() {
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

        GetShipmentStatus();
    }
}

function AddTableLocation(FlightDet, Pieces, Weight, Status) {

    html += "<tr>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + FlightDet + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Pieces + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Weight + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Status + "</td>";
    html += "</tr>";

}

function ClearAWBDetails() {
    $('#txtAWBPrefix').val('');
    $('#txtAWBNo').val('');
    $('#txtAgentName').val('');
    $('#txtConsigneeName').val('');
    $('#txtDesc').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtSHC').val('');
    $('#divShowGrid').empty();
}


