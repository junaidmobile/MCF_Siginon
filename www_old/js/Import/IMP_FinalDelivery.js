
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var HAWBId;
function CheckDeliveryDetails() {

    clearBeforePopulate();
    var GPNo = $('#txtGPDate').val();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    //var CompanyCode = window.localStorage.getItem("companyCode");
    //var CompanyCode = "2";

    var errmsg = "";
    if (GPNo == null || GPNo == "") {
        errmsg = "Enter GP No.</br>";
    }
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetImportsFinalDeliveryDetails_PDA",
            data: JSON.stringify({ 'pi_strGPNo': GPNo }),
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
                    //var arr = new Array();
                    //arr = str.split(",");
                    if ($(str).find('MAWBNO').text() != '') {
                        $('#txtAWBNo').val($(str).find('MAWBNO').text());
                        $('#txtHAWBNo').val($(str).find('HAWBNO').text());
                        $('#txtPieces').val($(str).find('DlvblPkgs').text());
                        $('#txtWeight').val($(str).find('DlvblGrWt').text());
                        $('#txtDeliveryTo').val($(str).find('DeliveredTo').text());
                        $('#txtDeliveryStatus').val($(str).find('DeliveryStatus').text());
                        HAWBId = $(str).find('HAWBId').text();
                    }
                    else {
                        errmsg = 'GP number does not exists';
                        $.alert(errmsg);
                        $('#txtGPDate').focus();
                        clearALL();
                    }
                }
                else {
                    errmsg = 'GP number does not exists';
                    $.alert(errmsg);
                    $('#txtGPDate').focus();
                    clearALL();
                }

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                //alert("Message: " + r.Message);
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

function SaveDeliveryDetails() {

    if ($('#txtDeliveryStatus').val() == 'Delivered') {
        $.alert('Shipment already delivered!');
        return;
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if ($('#txtGPDate').val() == "") {

        errmsg = "Please enter Gate Pass No.</br>";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {

        $.ajax({
            type: "POST",
            url: CMSserviceURL + "RecordGoodsDelivery_PDA",
            data: JSON.stringify({ 'pi_intHAWBid': HAWBId, 'pi_strGatePassNo': $('#txtGPDate').val(), 'pi_strUserName': $('#txtDeliveryTo').val() }),
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
                //var r = jQuery.parseJSON(msg.responseText);
                //alert("Message: " + r.Message);
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}


function clearALL() {
    $('#txtGPDate').val('');
    $('#txtAWBNo').val('');
    $('#txtHAWBNo').val('');
    $('#txtPieces').val('');
    $('#txtWeight').val('');
    $('#txtDeliveryTo').val('');
    $('#txtDeliveryStatus').val('');
}
function clearBeforePopulate() {    
    $('#txtAWBNo').val('');
    $('#txtHAWBNo').val('');
    $('#txtPieces').val('');
    $('#txtWeight').val('');
    $('#txtDeliveryTo').val('');
    $('#txtDeliveryStatus').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

