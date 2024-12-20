//var WebServiceUrl = "http://10.22.3.205/GalaxyService/GalaxyService.asmx/";  //LOCAL PC
// var WebServiceUrl = "http://10.22.3.222/GalaxyMobAppService/GalaxyService.asmx/";  //Local 

// var WebServiceUrl = "http://52.76.76.33/galaxydemo/";
// var WebServiceUrl = "http://13.73.167.211/GalaxyUAT/";
// var WebServiceUrl = "http://13.73.167.211/Galaxy/"
// var WebServiceUrl = "http://galaxyuatweb.westeurope.cloudapp.azure.com/WGH_uat/";
// var WebServiceUrl = "http://galaxyuatweb.westeurope.cloudapp.azure.com/MitchellCott/";
// var WebServiceUrl = "http://13.94.153.22/NacTesting/";
//var WebServiceUrl = "http://10.22.2.71:8080/RFS/";

//var WebServiceUrl = "http://mitchellcotts.kalelogistics.in/Live/";

//var WebServiceUrl = "http://113.193.225.59:8080/nac2000/";
var WebServiceUrl = "http://mitchellcottsuat.kalelogistics.com/uat/";



document.addEventListener('backbutton', this.setBackButton.bind(this), false);

var language;
(function () {
    document.addEventListener("deviceready", LoadNavBar, false);


    language = window.localStorage.getItem("Language");


})();


$(function () {

    LoadNavBar();
});

function ShowHomePage() {
    window.location.href = "GalaxyHome.html";
}
function LoadNavBar() {
    $('#myNavbar').load("NavBar.html");
    if (window.location.pathname.split("/").pop() == "EXP_Dashboard.html") {
        if (language == 'English')
            $('#navhdrName').html("Export Dashboard");
        else if (language == 'German')
            $('#navhdrName').html("Instrumententafel");
        else if (language == 'Russian')
            $('#navhdrName').html("панель");
        else if (language == 'Turkish')
            $('#navhdrName').html("gösterge paneli");
    }
    else if (window.location.pathname.split("/").pop() == "EXP_DocumentUpload.html") {
        if (language == 'English')
            $('#navhdrName').html("Document Upload");
        else if (language == 'German')
            $('#navhdrName').html("Dokument hochladen");
        else if (language == 'Russian')
            $('#navhdrName').html("загрузить документ");
        else if (language == 'Turkish')
            $('#navhdrName').html("doküman indirme");
    }
    else if (window.location.pathname.split("/").pop() == "EXP_ExportQuery.html") {
        if (language == 'English')
            $('#navhdrName').html("Shipment Status");
        else if (language == 'German')
            $('#navhdrName').html("Sendungs Status");
        else if (language == 'Russian')
            $('#navhdrName').html("отгрузка статус");
        else if (language == 'Turkish')
            $('#navhdrName').html("gönderi durum");
    }
    else if (window.location.pathname.split("/").pop() == "EXP_Unitization.html") {
        if (language == 'English')
            $('#navhdrName').html("Unitization");
        else if (language == 'German')
            $('#navhdrName').html("ULD Aufbau");
        else if (language == 'Russian')
            $('#navhdrName').html("построить ULD");
        else if (language == 'Turkish')
            $('#navhdrName').html("ULD hazirlamak");
    }
    else if (window.location.pathname.split("/").pop() == "EXP_VCTAcceptance.html") {
        if (language == 'English')
            $('#navhdrName').html("VCT Acceptance");
        else if (language == 'German')
            $('#navhdrName').html("VCT Annahme");
        else if (language == 'Russian')
            $('#navhdrName').html("приём VCT");
        else if (language == 'Turkish')
            $('#navhdrName').html("VCT kabul");
    }
    else if (window.location.pathname.split("/").pop() == "EXP_AWBLocation.html") {
        if (language == 'English')
            $('#navhdrName').html("AWB Location");
        else if (language == 'German')
            $('#navhdrName').html("AWB Stellplatz");
        else if (language == 'Russian')
            $('#navhdrName').html("AWB место");
        else if (language == 'Turkish')
            $('#navhdrName').html("AWB konum");
    }
    else if (window.location.pathname.split("/").pop() == "EXP_CreateAWB.html") {
        if (language == 'English')
            $('#navhdrName').html("Create AWB");
        else if (language == 'German')
            $('#navhdrName').html("Erstelle AWB");
        else if (language == 'Russian')
            $('#navhdrName').html("Создайте AWB");
        else if (language == 'Turkish')
            $('#navhdrName').html("yaratmak AWB");
    }
    else if (window.location.pathname.split("/").pop() == "EXP_RecordDamage.html") {
        if (language == 'English')
            $('#navhdrName').html("Record Damage");
        else if (language == 'German')
            $('#navhdrName').html("Schaden aufnehmen");
        else if (language == 'Russian')
            $('#navhdrName').html("наносить ущерб");
        else if (language == 'Turkish')
            $('#navhdrName').html("Haasar Kaydi");
    }
    else if (window.location.pathname.split("/").pop() == "EXP_CargoAcceptance.html") {
        if (language == 'English')
            $('#navhdrName').html("Cargo Acceptance");
        else if (language == 'German')
            $('#navhdrName').html("Schaden aufnehmen");
        else if (language == 'Russian')
            $('#navhdrName').html("наносить ущерб");
        else if (language == 'Turkish')
            $('#navhdrName').html("Haasar Kaydi");
    }
    else if (window.location.pathname.split("/").pop() == "GalaxyHome.html") {
        if (language == 'English')
            $('#navhdrName').html("Dashboard");
        else if (language == 'German')
            $('#navhdrName').html("Instrumententafel");
        else if (language == 'Russian')
            $('#navhdrName').html("панель");
        else if (language == 'Turkish')
            $('#navhdrName').html("gösterge paneli");
    }



    else if (window.location.pathname.split("/").pop() == "IMP_Dashboard.html") {
        if (language == 'English')
            $('#navhdrName').html("Import Dashboard");
        else if (language == 'German')
            $('#navhdrName').html("Instrumententafel");
        else if (language == 'Russian')
            $('#navhdrName').html("панель");
        else if (language == 'Turkish')
            $('#navhdrName').html("gösterge paneli");
    }
    else if (window.location.pathname.split("/").pop() == "IMP_DocumentUpload.html") {
        if (language == 'English')
            $('#navhdrName').html("Document Upload");
        else if (language == 'German')
            $('#navhdrName').html("Dokument hochladen");
        else if (language == 'Russian')
            $('#navhdrName').html("загрузить документ");
        else if (language == 'Turkish')
            $('#navhdrName').html("doküman indirme");
    }
    else if (window.location.pathname.split("/").pop() == "IMP_ShipmentStatus.html") {
        if (language == 'English')
            $('#navhdrName').html("Shipment Status");
        else if (language == 'German')
            $('#navhdrName').html("Sendungsstatus");
        else if (language == 'Russian')
            $('#navhdrName').html("отгрузка статус");
        else if (language == 'Turkish')
            $('#navhdrName').html("gönderi durum");
    }
    else if (window.location.pathname.split("/").pop() == "IMP_WDOoperations.html") {
        if (language == 'English')
            $('#navhdrName').html("Delivery Screen");
        else if (language == 'German')
            $('#navhdrName').html("Auslagerung");
        else if (language == 'Russian')
            $('#navhdrName').html("выдача со склада");
        else if (language == 'Turkish')
            $('#navhdrName').html("dış kaynak");
    }
    else if (window.location.pathname.split("/").pop() == "IMP_RecordDamage.html") {
        if (language == 'English')
            $('#navhdrName').html("Record Damage");
        else if (language == 'German')
            $('#navhdrName').html("Schaden aufnehmen");
        else if (language == 'Russian')
            $('#navhdrName').html("наносить ущерб");
        else if (language == 'Turkish')
            $('#navhdrName').html("Haasar Kaydi");
    }
    else if (window.location.pathname.split("/").pop() == "IMP_ShipmentArrival.html") {
        if (language == 'English')
            $('#navhdrName').html("Shipment Arrival");
        else if (language == 'German')
            $('#navhdrName').html("Sendungs Ankunft");
        else if (language == 'Russian')
            $('#navhdrName').html("время приёма товара");
        else if (language == 'Turkish')
            $('#navhdrName').html("Gönderi variş");
    }
    else if (window.location.pathname.split("/").pop() == "IMP_CreateAWB.html") {
        if (language == 'English')
            $('#navhdrName').html("Create AWB");
        else if (language == 'German')
            $('#navhdrName').html("Erstelle AWB");
        else if (language == 'Russian')
            $('#navhdrName').html("Создайте AWB");
        else if (language == 'Turkish')
            $('#navhdrName').html("yaratmak AWB");
    }
    else if (window.location.pathname.split("/").pop() == "IMP_Location.html") {
        if (language == 'English')
            $('#navhdrName').html("AWB Location");
        else if (language == 'German')
            $('#navhdrName').html("AWB Stellplatz");
        else if (language == 'Russian')
            $('#navhdrName').html("AWB место");
        else if (language == 'Turkish')
            $('#navhdrName').html("AWB konum");
    }
}
function NumberOnly(e) {
    e.target.value = e.target.value.replace(/[^0-9\.]/g, '');
    return false;
}
function ChkMaxLength(txt, len) {
    if ($('#' + txt.id).val().length > parseInt(len)) {
        $('#' + txt.id).val($('#' + txt.id).val().substring(0, len));
    }
}

function NumberOnlytxtPkg(id) {
    $("#" + id).on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
}

function ChkMinLength(txt, len) {
    if ($('#' + txt.id).val().length < parseInt(len)) {
        $.alert('Min ' + len + ' characters required.');
        //$('#' + txt.id).focus();
    }
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}


function setBackButton(e) {
    e.preventDefault();
    handleBackClick();
}

function handleBackClick() {
    var path = window.location.pathname + "";
    // console.log("path ", path);
    // console.log("proto ", path.includes("GalaxyHome.html"));
    if (window.location.pathname == "/android_asset/www/GalaxyHome.html" || window.location.pathname == "/android_asset/www/Login.html") {
        navigator.app.exitApp();
    }
    else {
        window.history.back();
    }
}


//function scan() {
//    cordova.plugins.barcodeScanner.scan(
//      function (result) {
//          if (result.text != "") {
//              window.location.href = "ExportPassTracker.html";
//              sessionStorage.setItem("ContainerNo", result.text);
//          }
//      },
//      function (error) {
//          alert("Scanning failed: " + error);
//      }
//   );
//}

//navigator.camera.getPicture(onPhotoFileSuccess, onFail, {
//    quality: 100,
//    targetWidth: 500,
//    targetHeight: 500,
//    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
//    destinationType: Camera.DestinationType.FILE_URI
//});

