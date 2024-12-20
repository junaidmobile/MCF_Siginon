
$(function () {

    var language = window.localStorage.getItem("Language");

    switch (language) {
        case "English":
            setEnglish();
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
    $('#lblUnitization').text("ULD Aufbau");
    $('#lblShipmentStatus').text("Sendungsstatus");
    $('#lblDocumentUpload').text("Dokument hochladen");
    $('#lblVCTAcceptance').text("VCT Annahme");
    $('#lblAWBLocation').text("AWB Stellplatz");
    $('#lblCreateAWB').text("Erstelle AWB");
    $('#lblRecordDamage').text("Schaden aufnehmen");
    
}

function setRussian() {
    $('#lblUnitization').text("построить ULD");
    $('#lblShipmentStatus').text("отгрузка статус");
    $('#lblDocumentUpload').text("загрузить документ");
    $('#lblVCTAcceptance').text("приём VCT");
    $('#lblAWBLocation').text("AWB место");
    $('#lblCreateAWB').text("Создайте AWB");
    $('#lblRecordDamage').text("наносить ущерб");
}

function setTurkish() {
    $('#lblUnitization').text("ULD hazirlamak");
    $('#lblShipmentStatus').text("gönderi durum");
    $('#lblDocumentUpload').text("doküman indirme");
    $('#lblVCTAcceptance').text("VCT kabul");
    $('#lblAWBLocation').text("AWB konum");
    $('#lblCreateAWB').text("yaratmak AWB");
    $('#lblRecordDamage').text("Haasar Kaydi");
}





function RedirectPage(pagename) {
    window.location.href = pagename;
}
//function LoadNavBar() {
//    $('#navbar').load("NavBar.html")
//}