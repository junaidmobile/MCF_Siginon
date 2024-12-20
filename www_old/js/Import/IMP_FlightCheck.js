//document.addEventListener("deviceready", GetCommodityList, false);

var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");


var flightSeqNo;
var flightNo;
var flightDate;

function NexttoULDDetails() {
    // set urs global variable here
    amplify.store("flightSeqNo", flightSeqNo)
    amplify.store("flightNo", flightNo)
    amplify.store("flightDate", flightDate)
    window.location.href = 'IMP_CheckAWB.html';
}


function GetFlightDetails() {

    var inputxml = "";
    var IGMNo = $('#txtIGMNo').val();
    var IGMYear = $("#txtIGMYear").val();
    var FlightPrefix = $("#txtFlightPrefix").val();
    var FlightNo = $("#txtFlightNo").val();
    var FlightDate;

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (IGMNo == "" || IGMYear == "") {
        if (FlightPrefix == "" || FlightNo == "" || $('#txtFlightDate').val() == "") {
            errmsg = "Please enter IGM No. & IGM Yr. or </br> Flight No. & Flight Date</br>";
            $.alert(errmsg);
            return;
        }

        if (IGMYear != "") {
            if (IGMYear.length < Number(4)) {
                errmsg = "Please enter valid IGM year";
                $.alert(errmsg);
                return;
            }
        }
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

        FlightDate = m + "/" + d + "/" + y;
    }

    if (IGMNo != "" && IGMYear != "") {
        inputxml = '<Root><IGMNO>' + IGMNo + '</IGMNO><IGMYear>' + IGMYear + '</IGMYear><FlightAirline></FlightAirline><FlightNo></FlightNo><FlightDate></FlightDate><AirportCity>' + AirportCity + '</AirportCity></Root>';
    }

    if (FlightPrefix != "" && FlightNo != "" && $("#txtFlightDate").val() != "") {
        inputxml = '<Root><IGMNO></IGMNO><IGMYear></IGMYear><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><AirportCity>' + AirportCity + '</AirportCity></Root>';
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportFlightDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
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
                var str = response.d

                var xmlDoc = $.parseXML(str);
                $(xmlDoc).find('Table1').each(function (index) {
                    if (index == 0) {
                        flightSeqNo = $(this).find('FlightSeqNo').text();
                        flightNo = $(this).find('FlightAirline').text() + $(this).find('FlightNo').text();
                        flightDate = $(this).find('FlightDate').text();
                        $('#txtFlightPrefix').val($(this).find('FlightAirline').text());
                        $('#txtFlightNo').val($(this).find('FlightNo').text());
                        $('#txtFlightDate').val($(this).find('FlightDate').text());
                        $('#txtTotCnts').val($(this).find('AWBCount').text());
                        $('#txtManiPieces').val($(this).find('NPX').text());
                        $('#txtReceivePieces').val($(this).find('NPR').text());
                        $('#txtManiGrWt').val($(this).find('WeightExp').text());
                        $('#txtReceiveGrWt').val($(this).find('WeightRec').text());
                        $('#txtShortPieces').val($(this).find('ShortLanded').text());
                        $('#txtExcessPieces').val($(this).find('ExcessLanded').text());
                        $('#txtDamagePieces').val($(this).find('DamagePkgs').text());
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

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


//function GetCommodityList() {
//    $.ajax({
//        type: 'POST',
//        url: WebServiceUrl + "GetCommodityList",//113.193.225.52:8080
//        data: JSON.stringify({}),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            var str = response.d;
//            if (str == "<NewDataSet />") {
//                alert("Please enter valid credentials");
//            }
//            else {
//                var xmlDoc = $.parseXML(response.d);
//                var xml = $(xmlDoc);
//                var DrpNewsCategory = xml.find("Table");
//                for (var i = 0; i < DrpNewsCategory.length; i++) {
//                    var val = $(DrpNewsCategory[i]).find('SR_NO').text();
//                    var text = $(DrpNewsCategory[i]).find('COMMODITY_TYPE').text();
//                    $('#ddlCommodity').append($('<option></option>').val(val).html(text));
//                }
//            }

//        },
//        error: function (msg) {
//            var r = jQuery.parseJSON(msg.responseText);
//            alert("Message: " + r.Message);
//        }
//    });
//}

