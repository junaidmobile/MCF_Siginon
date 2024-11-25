//document.addEventListener("deviceready", GetCommodityList, false);
var CargoWorksServiceURL = window.localStorage.getItem("CargoWorksServiceURL");
//var serializer = new JavaScriptSerializer();

//serializer.MaxJsonLength = Int32.MaxValue;

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

function NumberOnlytxtPkgAWB() {
    $("#txtPkgAWB").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
}

function NumberOnlytxtPkgRCV() {
    $("#txtPkgRCV").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
}

function setEnglish() {
    $('#lblUnitization').text("Unitization");

}

function setGerman() {
    $('#lblAWBNo').text("AWB Nr.");
    $('#lblOrigin').text("Abgangsstation");
    $('#lblDestination').text("Empfangsstation");
    $('#lblOffloadPoint').text("Ausladen Point");
    $('#lblPkgAWB').text("Stückzahl AWB");
    $('#lblPckgsRCV').text("Stückzahl RCV");
    $('#lblGrWtAWB').text("Brutto Gewicht AWB");
    $('#lblGrWtRCV').text("Brutto Gewicht RCV");
    $('#lblCommodity').text("Ware");
    $('#btnModify').val("Senden");
}

function setRussian() {
    $('#lblAWBNo').text("номер авианакладной");
    $('#lblOrigin').text("аэропорт отправления");
    $('#lblDestination').text("аэропорт назначения");
    $('#lblOffloadPoint').text("разгружать");
    $('#lblAWBPkgs').text("количество AWB");
    $('#lblPckgsRCV').text("количество RCV");
    $('#lblGrWtAWB').text("вес брутто AWB");
    $('#lblGrWtRCV').text("вес брутто RCV");
    $('#lblCommodity').text("товар");
    $('#btnModify').val("отправить");
}

function setTurkish() {
    $('#lblAWBNo').text("AWB No.");
    $('#lblOrigin').text("Menşei");
    $('#lblDestination').text("Variş Noktasi");
    $('#lblOffloadPoint').text("satmak");
    $('#lblAWBPkgs').text("Paket Sayisi AWB");
    $('#lblPckgsRCV').text("Paket Sayisi RCV");
    $('#lblGrWtAWB').text("brüt ağırlık AWB");
    $('#lblGrWtRCV').text("brüt ağırlık RCV");
    $('#lblCommodity').text("emtia");
    $('#btnExcLanded').val("çikiş");
    $('#btnClear').val("temiz");
    $('#btnModify').val("отправить");
}


function GetCommodityList() {
    $.ajax({
        type: 'POST',
        //url: "http://113.193.225.52:8080/GalaxyService/GalaxyService.asmx/GetCommodityList",//113.193.225.52:8080
        url: CargoWorksServiceURL + "GetCommodityList",
        data: JSON.stringify({ 'chrCycle': 'E' }),
        contentType: "application/json; charset=utf-8",
        Content: serializer.Serialize(data),
        dataType: "json",
        success: function (response) {
            var str = response.d;
            if (str == "<NewDataSet />") {
                alert("Please enter valid credentials");
            }
            else {
                var xmlDoc = $.parseXML(response.d);
                var xml = $(xmlDoc);
                var DrpNewsCategory = xml.find("Table");
                for (var i = 0; i < DrpNewsCategory.length; i++) {
                    var val = $(DrpNewsCategory[i]).find('SR_NO').text();
                    var text = $(DrpNewsCategory[i]).find('COMMODITY_TYPE').text();

                    //$('#ddlCommodity').append($('<option></option>').val(val).html(text));
                }
            }

        },
        error: function (msg) {
            var r = jQuery.parseJSON(msg.responseText);
            alert("Message: " + r.Message);
        }
    });
}

function SaveAWB() {

    var AWBNo = $('#txtAWBNo').val();
    var origin = $('#txtOrigin').val();
    var destination = $('#txtDestination').val();
    var offloadpoint = $('#txtOffloadPoint').val();
    var AWBpkg = $('#txtPkgAWB').val();
    var AWBGrWt = $('#txtGrWtAWB').val();
    var RCVPkg = $('#txtPkgRCV').val();
    var RCVGrWt = $('#txtGrWtRCV').val();
    //var ddlUnit = $('#ddlUnit').val();
    var Commodity =  escapeXml($('#txtCommodity').val());


    //if ($('#ddlCommodity').find('option:selected').text() == 'Select') {

    //    var CommodityText = "";
    //}
    //else
    //{
    //    var CommodityText = $("#ddlCommodity option:selected").text();
    //}
    var ErrorMsg = "";

    if (AWBNo == null || AWBNo == "") {
        ErrorMsg = ErrorMsg + "Please enter AWB No.<br/>";
        //$("#txtAWBNo").css("background-color", "#ffcccc");

    }

    if (AWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    if (origin == null || origin == "") {
        errmsg = "Please enter valid Origin.";
        $.alert(errmsg);
        return;
    }

    if (destination == null || destination == "") {
        errmsg = "Please enter valid Destination.";
        $.alert(errmsg);
        return;
    }

    if (offloadpoint == null || offloadpoint == "") {
        errmsg = "Please enter valid Offload Point.";
        $.alert(errmsg);
        return;
    }

    if (origin == destination) {
        ErrorMsg = ErrorMsg + "Origin & Destination cannot be same.<br/>";
    }

    if (AWBpkg == null || AWBpkg == "") {
        ErrorMsg = ErrorMsg + "Please enter No. of Pkgs.<br/>";
        //$("#txtPkgAWB").css("background-color", "#ffcccc");
    }

    if (RCVPkg == null || RCVPkg == "") {
        ErrorMsg = ErrorMsg + "Please enter No. of Pkgs received.<br/>";
        //$("#txtPkgAWB").css("background-color", "#ffcccc");
    }

    if (AWBGrWt == null || AWBGrWt == "") {
        ErrorMsg = ErrorMsg + "Please enter Gross Wt.<br/>";
        //$("#txtGrWtAWB").css("background-color", "#ffcccc");
    }

    if (RCVGrWt == null || RCVGrWt == "") {
        ErrorMsg = ErrorMsg + "Please enter Gross Wt. received.<br/>";
        //$("#txtGrWtAWB").css("background-color", "#ffcccc");
    }

    if (ErrorMsg.length > 0) {
        HideLoader();
        $.alert(ErrorMsg);
    }
    else {
        //alert(window.localStorage.getItem("companyCode"));
        var strAWBDetails = "";
        strAWBDetails = strAWBDetails + "<AWBDtl>";
        strAWBDetails = strAWBDetails + "<AWB AWBNo='";
        strAWBDetails = strAWBDetails + AWBNo.trim();
        strAWBDetails = strAWBDetails + "' HAWBNo='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' TAWBPkgs='";
        strAWBDetails = strAWBDetails + AWBpkg.trim();
        strAWBDetails = strAWBDetails + "' TAWBGwt ='";
        strAWBDetails = strAWBDetails + AWBGrWt.trim();
        strAWBDetails = strAWBDetails + "' SExpPkgs='";
        strAWBDetails = strAWBDetails + AWBpkg.trim();
        strAWBDetails = strAWBDetails + "' SExpGwt ='";
        strAWBDetails = strAWBDetails + AWBGrWt.trim();
        strAWBDetails = strAWBDetails + "' SRcvPkgs='";
        strAWBDetails = strAWBDetails + RCVPkg.trim();
        strAWBDetails = strAWBDetails + "' SRcvGwt ='";
        strAWBDetails = strAWBDetails + RCVGrWt.trim();
        strAWBDetails = strAWBDetails + "' IsMaster='";
        strAWBDetails = strAWBDetails + "1";
        strAWBDetails = strAWBDetails + "' FltNo ='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' FltDate='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' Origin ='";
        strAWBDetails = strAWBDetails + origin.trim();
        strAWBDetails = strAWBDetails + "' Dest ='";
        strAWBDetails = strAWBDetails + destination.trim();
        strAWBDetails = strAWBDetails + "' OffPt ='";
        strAWBDetails = strAWBDetails + offloadpoint.trim();
        strAWBDetails = strAWBDetails + "' ULDNo ='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' Com ='";
        strAWBDetails = strAWBDetails + Commodity;
        strAWBDetails = strAWBDetails + "' Descr ='";
        strAWBDetails = strAWBDetails + Commodity;
        strAWBDetails = strAWBDetails + "'/>";
        strAWBDetails = strAWBDetails + "</AWBDtl>";
        var companycode = window.localStorage.getItem("companyCode");
        var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
        var ShedCode = window.localStorage.getItem("SHED_CODE");
        var UserId = window.localStorage.getItem("UserID");
        $.ajax({
            type: 'POST',
            //url: "http://113.193.225.52:8080/GalaxyService/GalaxyService.asmx/PDAExpCreateAWB",//113.193.225.52:8080
            url: CargoWorksServiceURL + "PDAExpCreateAWB",
            data: JSON.stringify({ 'strAWBDetails': strAWBDetails, 'strComapnyCode': companycode, 'strAirportCity': AirportCity, 'strShedCode': "E", 'strUserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var str = response.d;
                $.alert(str);
                // $.alert('Data saved successfully.');
            },
            error: function (msg) {
                var r = jQuery.parseJSON(msg.responseText);
                alert("Message: " + r.Message);
                //$.alert('Details saved successfully');
            }
        });
    }
}

function clearALL() {
    $('#txtAWBNo').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtOffloadPoint').val('');
    $('#txtPkgAWB').val('');
    $('#txtGrWtAWB').val('');
    $('#txtPkgRCV').val('');
    $('#txtGrWtRCV').val('');
    $('#txtCommodity').val('');
    //$('#ddlCommodity').val('0');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

