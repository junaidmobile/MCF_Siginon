
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
    $('#lblShipmentStatus').text("Sendungsstatus");
    $('#lblDocUpload').text("Dokument hochladen");
    $('#lblDelivery').text("Auslagerung");
    $('#lblShipmentArrival').text("Sendungs Ankunft");
    $('#lblCreateAWB').text("Erstelle AWB");
    $('#lblAWBLocation').text("AWB Stellplatz"); 
    $('#lblRecordDamage').text("Schaden aufnehmen");

}

function setRussian() {
    $('#lblShipmentStatus').text("отгрузка статус");
    $('#lblDocUpload').text("загрузить документ");
    $('#lblDelivery').text("выдача со склада");
    $('#lblShipmentArrival').text("время приёма товара");
    $('#lblCreateAWB').text("Создайте AWB");
    $('#lblAWBLocation').text("AWB место");
    $('#lblRecordDamage').text("наносить ущерб");

}

function setTurkish() {
    $('#lblShipmentStatus').text("gönderi durum");
    $('#lblDocUpload').text("doküman indirme");
    $('#lblDelivery').text("dış kaynak");
    $('#lblShipmentArrival').text("Gönderi variş");
    $('#lblCreateAWB').text("yaratmak AWB");
    $('#lblAWBLocation').text("AWB konum");
    $('#lblRecordDamage').text("Haasar Kaydi");

}



function RedirectPage(pagename) {
    window.location.href = pagename;
}