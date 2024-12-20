
var GHAserviceURL = window.localStorage.getItem("GHAserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var flightSeqNo;
var UAWBRowId;
var UShipRowId;

$(function () {
    document.getElementById("cameraTakePicture").disabled = true
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
});

function setEnglish() {
    $('#lblUnitization').text("Unitization");

}

function setGerman() {
    $('#lblAWBNo').text("AWB Nr.");
    $('#btnGetDetail').val("Suchen");
    $('#lblHAWB').text("HAWB Nr.");
    $('#lblFlightNo').text("Flug Nr.");
    $('#lblDescription').text("Warenbeschreibung");
    $('#cameraTakePicture').val("Hochladen");
}

function setRussian() {
    $('#lblAWBNo').text("номер авианакладной");
    $('#btnGetDetail').val("поиск");
    $('#lblHAWB').text("номер HAWB");
    $('#lblFlightNo').text("номер рейса");
    $('#lblDescription').text("наименование груза");
    $('#cameraTakePicture').val("загрузить");
    $('#btnClear').val("очистить");
}

function setTurkish() {
    $('#lblAWBNo').text("AWB No.");
    $('#btnGetDetail').val("aramak");
    $('#lblHAWB').text("HAWB No.");
    $('#lblFlightNo').text("uçuş No.");
    $('#lblDescription').text("açıklama");
    $('#cameraTakePicture').val("yüklemek");
    $('#btnClear').val("temiz");
    $('#btnUpload').val("çikiş");
}

function cameraTakePicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        encodingType: 0,
        targetWidth: 120,
        targetHeight: 120,
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

function GetHAWBDetailsForMAWB() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    inputxml = '<Root><AWBNo>' + MAWBNo + '</AWBNo><HouseNo></HouseNo><AirportCity>' + AirportCity + '</AirportCity><Type>E</Type></Root>';

    $('#ddlHAWB').empty();
    $('#ddlFlightNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAserviceURL + "GetFileUploadDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
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
                if (response == "<NewDataSet />") {
                    document.getElementById("cameraTakePicture").disabled = true;
                } else {
                    document.getElementById("cameraTakePicture").disabled = false;
                }
                $(xmlDoc).find('Table1').each(function (index) {

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlHAWB');
                    }

                    else {
                        var newOption = $('<option></option>');
                        newOption.val(0).text($(this).find('HouseNo').text());
                        newOption.appendTo('#ddlHAWB');
                    }
                });

                $(xmlDoc).find('Table2').each(function (index) {

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlFlightNo');

                        flightSeqNo = $(this).find('FlightSeqNo').text();
                        UAWBRowId = $(this).find('UAWBRowId').text();
                        UShipRowId = $(this).find('UShipRowId').text();
                    }

                    var newOption = $('<option></option>');
                    newOption.val(0).text($(this).find('Flight').text());
                    newOption.appendTo('#ddlFlightNo');
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

function SaveUploadFile(imageData) {
    var MAWBNo = $('#txtAWBNo').val();

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if (imageData == "") {

        errmsg = "Some error occurred.</br>Please try again.";
        $.alert(errmsg);
        return;

    }

    // inputxml = '<Root><FileName>TLogo</FileName><FileExtention>jpg</FileExtention><Description>' + $('#txtDescription').val() + '</Description><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UShipRowId>' + UShipRowId + '</UShipRowId><Type>I</Type><UAWBRowId>' + UAWBRowId + '</UAWBRowId><ULDId>-1</ULDId><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';

    inputxml = '<Root><FileName>TLogo</FileName><FileExtention>jpg</FileExtention><Description>' + $('#txtDescription').val() + '</Description><FlightSeqNo>0</FlightSeqNo><AWBPrefix>' + MAWBNo.substr(0, 3) + '</AWBPrefix><Type>E</Type><AWBNo>' + MAWBNo.substr(3, 8) + '</AWBNo><ULDId>-1</ULDId><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAserviceURL + "SaveFileUploadDetails",
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
                var parser, xmlDoc;
                $("body").mLoading('hide');
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(response.d, "text/xml");
                var msg = xmlDoc.getElementsByTagName("StrMessage")[0].childNodes[0].nodeValue;
                $.alert(msg);
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

function clearALL() {
    $('#txtAWBNo').val('');
    $('#ddlHAWB').empty();
    $('#ddlFlightNo').empty();
    $('#txtDescription').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


