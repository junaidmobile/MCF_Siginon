
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var GHAExportFlightserviceURL = window.localStorage.getItem("GHAExportFlightserviceURL");
var ImportService = window.localStorage.getItem("ImportService");

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
var disabledBtn = false;

$(function () {
    document.getElementById("cameraTakePicture").disabled = true;

    document.getElementById("btnSubmit").disabled = true;

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

    BindMultiDropDown('111', '11111111', '0', '0');

});

function setEnglish() {
    //$('#lblUnitization').text("Unitization");

}

function setGerman() {
    $('#lblAwbNo').text("AWB Nr.");
    $('#lblPieces').text("Stückzahl");
    $('#lblWeight').text("Gewicht");
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
    $('#btnExit').val("Exit");
    $('#btnSubmit').val("Senden");

}

function setRussian() {
    $('#lblAwbNo').text("номер авианакладной");
    $('#lblPieces').text("количество");
    $('#lblWeight').text("вес");
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
    $('#btnExit').val("выход");
    $('#btnSubmit').val("отправить");
}

function setTurkish() {
    //$('#lblAwbNo').text("AWB Numarasi");    
    //$('#lblFlightNo').text("Ucus Numarasi");
    //$('#lblHAWB').text("Ucus Numarasi");
    $('#lblPieces').text("Paket Adedi");
    $('#lblWeight').text("Agirlik");
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
    $('#btnExit').val("Cikis");
    $('#btnSubmit').val("Teslim Etmek");
}


function BindMultiDropDown(AWBPREFIX, AWBNumber, HAWBSeqNo, BindShipNo) {

    FlightSeqNo = '0';

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";


    var inputXML = '<Root><AWBPref>' + AWBPREFIX + '</AWBPref><AWBNo>' + AWBNumber + '</AWBNo><HouseSeqNo></HouseSeqNo><ShipNo>' + BindShipNo + '</ShipNo><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><Module>Exports</Module><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><AirportCity>' + AirportCity + '</AirportCity><Save_From>A</Save_From></Root>';

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
                //BindDamageLabels();

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

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });

    }
}

function ChkAndValidate() {

    var ScanCode = $('#txtAWBNo').val();
    ScanCode = ScanCode.replace(/\s+/g, '');
    ScanCode = ScanCode.replace("-", "").replace("–", "");

    if (ScanCode.length >= 11) {

        GetAWBDetails();
    }
}

function GetAWBDetails() {

    $("#ddlFlightNo").empty();
    $("#ddlHAWB").empty();
    $('#txtPieces').val('');
    $('#txtWeight').val('');
    FlightSeqNo = '0';
    $("#packagingtype").empty();
    $("#containertype").empty();
    $("#material").empty();
    $("#damagetype").empty();
    $("#damagecontent").empty();
    $("#damagecause").empty();
    $("#handling").empty();
    $("#damagenotice").empty();
    $("#markslabels").empty();
    $('#txtDamRemarks').val('');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var BindShipNo = 0;
    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    var inputXML = '<Root><AWBPref>' + MAWBNo.substring(0, 3) + '</AWBPref><AWBNo>' + MAWBNo.substring(3, 11) + '</AWBNo><HouseSeqNo></HouseSeqNo><ShipNo>' + BindShipNo + '</ShipNo><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><Module>Exports</Module><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><AirportCity>' + AirportCity + '</AirportCity><Save_From>A</Save_From></Root>';

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
                document.getElementById("cameraTakePicture").disabled = true;
                document.getElementById("btnSubmit").disabled = true;
                // if (Result == "<NewDataSet />") {
                //     document.getElementById("cameraTakePicture").disabled = true;
                //     document.getElementById("btnSubmit").disabled = true;
                // } else {
                //     document.getElementById("cameraTakePicture").disabled = false;
                //     document.getElementById("btnSubmit").disabled = false;
                // }
                $(xmlDoc).find('Table').each(function () {
                    document.getElementById("cameraTakePicture").disabled = false;
                    document.getElementById("btnSubmit").disabled = false;
                    $('#txtPieces').val($(this).find('NPR').text());
                    $('#txtWeight').val($(this).find('WtRec').text());

                });

                $(xmlDoc).find('Table16').each(function () {

                    var flightNo;
                    var flightSeqNo;

                    flightNo = $(this).find('FltDet').text();
                    flightSeqNo = $(this).find('Value').text();

                    var newOption = $('<option></option>');
                    newOption.val(flightSeqNo).text(flightNo);
                    newOption.appendTo('#ddlFlightNo');
                });

                $(xmlDoc).find('Table17').each(function () {

                    var hAWBNo;
                    var hAWBSeqNo;

                    hAWBNo = $(this).find('HOUSE_NUMBER').text();
                    hAWBSeqNo = $(this).find('Value').text();

                    var newOption = $('<option></option>');
                    newOption.val(hAWBSeqNo).text(hAWBNo);
                    newOption.appendTo('#ddlHAWB');
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

                $(xmlDoc).find('Table5').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#innerPackingtype").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#innerPackingtype").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#damagetype").multiselect('refresh');
                });

                $(xmlDoc).find('Table13').each(function (index) {
                    var RId = $(this).find('RId').text();
                    var Desc = $(this).find('RDes').text();
                    var isSelected = $(this).find('IsSel').text();

                    if (isSelected == "Y") {
                        $("#wthrCndtntype").append('<option value=' + RId + ' selected=selected>' + Desc + '</option>');
                    }
                    else {
                        $("#wthrCndtntype").append('<option value=' + RId + '>' + Desc + '</option>');
                    }
                    //$("#damagetype").multiselect('refresh');
                });


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
                //BindDamageLabels();

                $(xmlDoc).find('Table14').each(function () {
                    var signsoftheft = "";
                    var spaceMissing = "";
                    var verifiedInvoice = "";
                    $('#txtDamRemarks').val($(this).find('REMARKS').text());
                    signsoftheft = $(this).find('DAMAGE_EVIDENCE_PILFERAGE').text();
                    spaceMissing = $(this).find('DAMAGE_SPACE_MISSING').text();
                    verifiedInvoice = $(this).find('DAMAGE_VERIFIED_INVOICE').text();
                    if (signsoftheft == "Y") {
                        $("#chkYes").prop('checked', true);
                        $("#chkNo").prop('checked', false);
                    }
                    else {
                        $("#chkYes").prop('checked', false);
                        $("#chkNo").prop('checked', true);
                    }

                    setPropertyCheckedById(spaceMissing, "Y", "missingYes", "missingNo");
                    setPropertyCheckedById(verifiedInvoice, "Y", "invoiceYes", "invoiceNo");
                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });

    }
}

function setPropertyCheckedById(value, valueToCheck, id1, id2) {
    value == valueToCheck ? $("#" + id1).prop('checked', true) && $("#" + id2).prop('checked', false) : $("#" + id1).prop('checked', false) && $("#" + id2).prop('checked', true)
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

    DamageHouseSeqNo = '0';
    FlightSeqNo = '0';

    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtPieces').val() == '') {
        errmsg = "Please enter pieces";
        $.alert(errmsg);
        return;
    }

    if ($('#txtWeight').val() == '') {
        errmsg = "Please enter weight";
        $.alert(errmsg);
        return;
    }

    //if ($('#ddlHAWB').find('option:selected').text() == '') {
    //    var tempFlightSeqNo = $('#ddlFlightNo').find('option:selected').val().split("_");

    //    FlightSeqNo = tempFlightSeqNo[0];
    //    DamageHouseSeqNo = '0';
    //    DamageShipNo = tempFlightSeqNo[1];
    //}
    //else {
    //    var tempFlightSeqNo = $('#ddlFlightNo').find('option:selected').val().split("_");
    //    var tempHawbSeqNo = $('#ddlHAWB').find('option:selected').val().split("_");

    //    FlightSeqNo = tempFlightSeqNo[0];
    //    DamageHouseSeqNo = tempHawbSeqNo[0];
    //    DamageShipNo = tempHawbSeqNo[1];
    //}



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

    var inputXML = '<ROOT><DamageData  AWBNo="' + MAWBNo.substring(3, 11) + '" HouseSeqNo="' + DamageHouseSeqNo + '" AwbPrefix="' + MAWBNo.substring(0, 3) + '" FlightSeqNumber="' + FlightSeqNo + '" ShipmentNo="' + DamageShipNo + '" AirportCity="' + AirportCity + '" CompanyCode="' + window.localStorage.getItem("companyCode") + '" CreatedBy="' + window.localStorage.getItem("UserID") + '" ContainerMaterial="' + packagingtype + '" ContainerType="' + containertype + '" OuterPacking="' + material + '" MarksLabels="' + marksnlabels + '" InnerPacking="" IsSufficient="Y" Container="' + damagetype + '" Containers="' + damagecontent + '" DamageDiscovered="' + damagenotice + '" SpaceForMissing="N" VerifiedInvoice="N" AparentCause="' + damagecause + '" WeatherCondation="" DamageRemarked="" EvidencePilferage="' + signsoftheft + '" Remarks="' + escapeXml($('#txtDamRemarks').val()) + '" Salvage="' + furtherhandling + '" Disposition="" TypeDiscripency="DMG" TotalWTShippedAWB="0" TotalPcsShippedAWB="0" TotalWTActual="' + $('#txtWeight').val() + '" TotalPcsActual="' + $('#txtPieces').val() + '" TotalWTDifference="0" TotalPcsDifference="0" IndividualWTPerDoc="0" IndividualWTActChk="0" IndividualWTDifference="0"  Save_From="' + $('#ddlDmgRecordedAt').find('option:selected').val() + '" /></ROOT>';
    //var inputXML = '<Root><SEQ_NO>' + SEQ_NO + '</SEQ_NO><MATERIAL_FOR>U</MATERIAL_FOR><MATERIAL_ID>' + $('#ddlMaterialType').find('option:selected').val() + '</MATERIAL_ID><MATERIAL_UNIT>' + $('#txtNoUnits').val() + '</MATERIAL_UNIT><Module>I</Module><ULDSeqNo>' + $('#ddlULDNo').find('option:selected').val() + '</ULDSeqNo><FLTSeqNo>' + FlightSeqNo + '</FLTSeqNo><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + window.localStorage.getItem("companyCode") + '</CompanyCode><UserID>' + window.localStorage.getItem("UserID") + '</UserID></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "HHTSaveDamageDetails",
            data: JSON.stringify({ 'DamageXML': inputXML, 'Mode': "Exports" }),
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
        targetWidth: 320,
        targetHeight: 480,
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

    var MAWBNo = $('#txtAWBNo').val();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if (imageData == "") {

        errmsg = "Some error occurred.</br>Please try again.";
        $.alert(errmsg);
        return;

    }


    inputxml = '<Root><FileName>TLogo</FileName><FileExtention>jpg</FileExtention><Description>' + $('#txtDamRemarks').val() + '</Description><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><AWBPrefix>' + MAWBNo.substr(0, 3) + '</AWBPrefix><Type>I</Type><AWBNo>' + MAWBNo.substr(3, 8) + '</AWBNo><ULDId>0</ULDId><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';


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
                var res = response.d
                var xmlDoc = $.parseXML(res);
                // $.alert(response.d);
                $(xmlDoc).find('Table').each(function () {
                    if ($(this).find('Status').text() == 'S') {
                        $.alert($(this).find('StrMessage').text());
                    }
                });
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


function AddTableLocation(index, RId, RDes) {
    html += "<tr>";

    //html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + AWBNo + "</td>";
    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'><div id='ctl00_cp_gS_ctl02_ddlUNN_sl' class='drpDwn4Code dd_chk_select' style='display:inline-block;position:relative;'><div id='caption'>Select</div><div id='ctl00_cp_gS_ctl02_ddlUNN_dv' class='dd_chk_drop' style='position: absolute;'>";
    html += "<div id='checks'><span style='display:block;'></span><span id='ctl00_cp_gS_ctl02_ddlUNN'><input id='ctl00_cp_gS_ctl02_ddlUNN_" + index + " name='ctl00$cp$gS$ctl02$ddlUNN$" + index + "' value=" + RId + " type='checkbox'><label for='ctl00_cp_gS_ctl02_ddlUNN_" + index + "'>" + RDes + "</label></span></div></div></div></td>";
    //<input id=txtAWB_" + index + " class=form-control type=text style=text-align:right; value=" + AWBNo + " disabled></td>";
    html += "</tr>";

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

// function blockSpecialChars(event) {
//     var str = event.target.value;
//     var result = str.replace(/\W|_/g, '');
//     $("#txtDamRemarks").val(result);
// }






