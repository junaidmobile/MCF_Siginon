var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var SelectedHawbId = 0;
var IGMno;

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
            url: CMSserviceURL + "GetHAWBNumbersForMAWBNumber_PDA",
            data: JSON.stringify({ 'pi_strUserName': MAWBNo }),
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

                    HAWBId = $(this).find('HAWBId').text();
                    HAWBNos = $(this).find('HAWBNo').text();

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



function GetMovementDetails() {

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $("#ddlHAWB option:selected").text();
    SelectedHawbId = $("#ddlHAWB option:selected").val();

    if (AWBNo == '') {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if ($('#ddlHAWB').val() == '0' && $('select#ddlHAWB option').length > 1) {
        errmsg = "Please select HAWB No.</br>";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetImportsInterbalMoventLocationDetails_PDA",
            data: JSON.stringify({ 'pi_strMAWBNo': AWBNo, 'pi_strHAWBNo': HAWBNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                var str = response.d;
                if (str != null && str != "") {
                    if ($(str).find('location').text() != '' && $(str).find('LocationPieces').text() != '') {                       

                        var xmlDoc = $.parseXML(str);

                        $(xmlDoc).find('Table').each(function (index) {
                            //debugger;
                            if (index == 0) {
                                $('#txtFromLoc').val($(this).find('location').text());
                                $('#txtTotPkgs').val($(this).find('LocationPieces').text());
                                IGMno = $(this).find('IGMNo').text();
                            }
                        });

                    }
                    else {
                        errmsg = 'Shipment not located';
                        $.alert(errmsg);
                    }
                }
                else {
                    errmsg = 'Shipment does not exists';
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

function SaveForwardDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FromLoc = $('#txtFromLoc').val();
    var TotalPIECESno = $('#txtTotPkgs').val();
    var MovePIECESno = $('#txtMovePkgs').val();
    var NewLoc = $('#txtNewLoc').val();


    if (FromLoc == "" || TotalPIECESno == "" || MovePIECESno == "" || NewLoc == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;

    }

    if (MovePIECESno > TotalPIECESno) {
        errmsg = "Move packages cannot be more than total packages.</br>";
        $.alert(errmsg);
        return;
    }

    if (IGMno == '') {
        errmsg = "IGM No. could not be found.</br>";
        $.alert(errmsg);
        return;
    }

    
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "SaveImpInternalMovementDetails_PDA",
            data: JSON.stringify({
                'pi_intHAWBid': SelectedHawbId, 'pi_intIGMNo': IGMno, 'pi_strFromLoc': FromLoc,
                'pi_intOldLocPieces': TotalPIECESno, 'pi_strNewLoc': NewLoc, 'pi_intNewLocPieces': MovePIECESno,
                'pi_strUserName': window.localStorage.getItem("UserName"),
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
                $.alert('Details saved successfully');
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
    $('#txtFromLoc').val('');
    $('#txtTotPkgs').val('');
    $('#txtMovePkgs').val('');
    $('#txtNewLoc').val('');
}

function clearBeforePopulate() {
    $('#txtFromLoc').val('');
    $('#txtTotPkgs').val('');
    $('#txtMovePkgs').val('');
    $('#txtNewLoc').val('');
}


function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

$(function () {
    $("#txtBCDate").datepicker({
        dateFormat: "dd/mm/yy"
    });
    $("#txtBCDate").datepicker().datepicker("setDate", new Date());
});
