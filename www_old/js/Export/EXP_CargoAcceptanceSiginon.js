
var CargoWorksServiceURL = window.localStorage.getItem("CargoWorksServiceURL");
//var CargoWorksServiceURL = "http://10.22.3.154/Galaxy/services/hhtexpservices.asmx/";

//var AirportCity = "FRA";
//var UserId = "252";
//var CompanyCode = "3";
//var SHEDCODE = "KS1";


var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");
var flightSeqNo;
var ULDSeqNo;
var XMLshipmentDt;
var ULD_MODE;
var counter = 1;
var newTextBoxDiv = '';
var inputRowsforDim = "";
var radioValue;
var gridXMLforShow;
var DeviceMacAdd;
var UMOUnit = 'CMT';
var venderIDSelected;
$(function () {
    $('#VctNo input[type=radio]').change(function () {
        // alert($(this).val())

    });

    EnableDimensions();

    //a = 2286.99;
    //b = 180.26;
    //c = a - b;
    //alert(c)

    //$("input[@name='VctNo']").change(function () {
    //    clearALLControlsonButton();
    //});


    $('#chkVctNo').click(function () {
        var checked = $(this).attr('checked', true);
        if (checked) {
            clearALLControlsonButton();
        }

    });


    $('#chkAwbNo').click(function () {
        var checked = $(this).attr('checked', true);
        if (checked) {
            clearALLControlsonButton();
        }

    });

    $("#ddlUOM1").change(function () {

        UMOUnit = this.value;
        calculateAllRows();
    });

    //$("#ddlUOM1").trigger('change')

    $('#ddlscaleName').change(function () {

        _Value = $("option:selected", this).val();

        DeviceMacAdd = _Value.split(",")[0];
        venderIDSelected = _Value.split(",")[1];




    });


    $('#ddlEquipmentType').change(function () {

        $('#txtULDType').val('');
        $('#txtTareWt').val('');
        $('#txtReceivedNetWt').val('');

        _Value = $("option:selected", this).val();
        $('#txtULDType').val('');
        if (_Value != '0') {


            if (_Value == 'ULT') {

                $('#txtULDType').show();
                $('#ddlULDSK1').hide();
                $('#txtTareWt').val('');

            } else {

                $('#txtULDType').hide();
                $('#ddlULDSK1').show();
                HHT_CargoAcceptance_Equipment_SubTypeList(_Value);

            }
        }
        //  EquipmentType = _Value.split(",")[0];
        // venderIDSelected = _Value.split(",")[1];


    });



    $('#ddlULDSK1').change(function () {

        _Value = $("option:selected", this).val();

        $('#txtTareWt').val(_Value);

        $('#txtULDType').val('');

        //  $('#txtTareWt').focus();

        var receWt = parseFloat($('#txtReceivedGrossWt').val());
        var tare = parseFloat(_Value);

        var netWt = receWt - tare;

        if (netWt < 0) {
            // alert('Gross Wt. should be greater then tare wt')

            errmsg = "Gross Wt. should be greater then tare wt.</br>";
            $.alert(errmsg);
            return;
        }

        $('#txtReceivedNetWt').val(netWt);


    });



    //$('#ddlUOM1').val('CMT');

    $("#btnSave").attr("disabled", "disabled");

    var $input;
    var formElements = new Array();
    $("#addButton").click(function () {

        var firstTextBox = parseInt($("#Pieces1").val())
        $('#TextBoxesGroup').find('input').each(function (i, input) {
            $input = $(input);
            $input.css('background-color', $input.val() ? '#fff' : '#FFB6C1');
            formElements.push($input.val());
        });
        if ($input.val() == '') {
            $input.css('background-color', $input.val() ? '#fff' : '#FFB6C1');
            return;
        } else {
            dynamicTrCreate();
        }
    });


    GetScaleListDetails();

    $("#spanDiv").hide();
    $("#divULDNo").hide();
    $("#drULD").hide();
    $('#ddlULDNo').val('');




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


    var stringos = 'ECC~N,PER~N,GEN~N,DGR~Y,HEA~N,AVI~N,BUP~Y,EAW~N,EAP~Y';

    SHCSpanHtml(stringos);


});

function SHCSpanHtml(newSHC) {
    var spanStr = "<tr class=''>";
    var newSpanSHC = newSHC.split(',');
    var filtered = newSpanSHC.filter(function (el) {
        return el != "";
    });

    for (var n = 0; n < filtered.length; n++) {
        var blink = filtered[n].split('~');

        if (filtered[n].indexOf('~') > -1) {
            if (blink[1] == 'Y' && filtered[n] != '~Y') {
                spanStr += "<td class='blink_me'>" + blink[0] + "</td>";
                console.log(filtered[n])
            }
        }

        if (filtered[n].indexOf('~') > -1) {
            if (blink[1] == 'N' && filtered[n] != '~N') {
                spanStr += "<td class='foo'>" + blink[0] + "</td>";
                console.log(filtered[n])
            }
        }
    }
    spanStr += "</tr>";

    $("#SHCCodeGrid").html(spanStr);
    return spanStr;

}

function fetchTareWt(value) {

    if ($('#ddlEquipmentType').val() == '0') {
        $.alert('Please select equipment type. ');
        $('#txtTareWt').val('');
        return;
    }

    HHT_CargoAcceptance_Equipment_SubTypeList(value);
}


function calculateNetWtIFGrWtChange(wt) {

    if ($('#txtTareWt').val() != '') {
        var receWt = parseFloat(wt);
        var tare = parseFloat($('#txtTareWt').val());

        var netWt = receWt - tare;

        if (netWt < 0) {
            // alert('Gross Wt. should be greater then tare wt')

            errmsg = "Gross Wt. should be greater then tare wt.</br>";
            $.alert(errmsg);
            return;
        }

        $('#txtReceivedNetWt').val(netWt.toFixed(2));
    }

}

function calculateNEtWt(tareWt) {
    var receWt = parseFloat($('#txtReceivedGrossWt').val());
    var tare = parseFloat(tareWt);

    if (receWt < tare) {
        $.alert('Gross Wt. should be greater then net wt. ');
        $('#txtTareWt').val('');
        return;
    } else {

        var netWt = receWt - tare;
        $('#txtReceivedNetWt').val(netWt.toFixed(2));
    }

}


function setEnglish() {
    $('#lblUnitization').text("Unitization");

}

function removeRow(counter) {


    //if (counter == 1) {
    //    // alert("No more textbox to remove");
    //    return false;
    //}

    counter--;

    $("#TextBoxDiv" + counter).remove();
    inputRowsforDim = "";
}

function setGerman() {
    $('#lblVCTNo').text("VCT Nr.");
    $('#lblAcceptance').text("VCT Annahme");
    $('#lblULDNo').text("ULD Nr.");
    $('#lblAwbNo').text("AWB Nr.");
    $('#lblShipmentNo').text("Sendungs Nr.");
    $('#lblPackages').text("Stückzahl");
    $('#lblGrWt').text("Brutto Gewicht");
    $('#lblLocation').text("Stellplatz");
    $('#lblTruckSealed').text("LKW Versiegelt");
    $('#lblTruckNotSealed').text("LKW nicht Versiegelt");
    $('#btnModify').val("Senden");
}

function setRussian() {
    $('#lblVCTNo').text("VCT No");
    $('#lblAcceptance').text("приём VCT");
    $('#lblULDNo').text("номер ULD");
    $('#lblAwbNo').text("номер авианакладной");
    $('#lblShipmentNo').text("номер партии");
    $('#lblPackages').text("количество");
    $('#lblGrWt').text("вес брутто");
    $('#lblLocation').text("добавить место");
    //$('#lblTruckSealed').text("");
    //$('#lblTruckNotSealed').text("");
    $('#btnModify').val("отправить");
}

function setTurkish() {
    $('#lblVCTNo').text("VCT No");
    $('#lblAcceptance').text("VCT kabul");
    $('#lblULDNo').text("ULD No.");
    $('#lblAwbNo').text("AWB No.");
    $('#lblShipmentNo').text("gösteri Nr.");
    $('#lblPackages').text("Paket Sayisi");
    $('#lblGrWt').text("brüt ağırlık");
    $('#lblLocation').text("yer");
    //$('#lblTruckSealed').text("");
    //$('#lblTruckNotSealed').text("");
    $('#btnExcLanded').val("çikiş");
    $('#btnModify').val("göndermek");
}

function MovetoNext(current, nextFieldID) {
    if (current.value.length >= current.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}


function clearAllValuesfromDimention() {
    var $input;

    $('#TextBoxesGroup').find('input').each(function (i, input) {
        $(this).val('');
    });

    var dimentiontable = document.getElementById('dimentiontable')

    for (var x = 2; x < dimentiontable.rows.length;) {

        if (dimentiontable.rows[x].cells[5].innerHTML) {
            //    if (x > 2) {
            dimentiontable.deleteRow(x);
            //  }

        } else {
            x += 2;
        }
    }
}


function GetAutoULDAWBDetails() {

    $('#txtULDType').val('');
    $('#txtTareWt').val('');
    $('#txtReceivedNetWt').val('');
    $('#ddlULDSK1').empty();
    $('#ddlEquipmentType').val('0');

    if ($('#txtVCTNo').val() == '') {
        return;
    }

    var VCTCode = $('#txtVCTNo').val();
    VCTCode = VCTCode.replace(/\s+/g, '');
    VCTCode = VCTCode.replace("-", "").replace("–", "");

    radioValue = $("input[name='VctNo']:checked").val();
    if (radioValue == undefined) {
        if ($('#txtVCTNo').val() == '') {
            $.alert('Please choose one option before search.');
            $('#txtVCTNo').val('');
            return;
        }

    }
    if (radioValue == "vct") {
        GetULDDetailsforVCT();
    } else {
        GetULDDetailsforAWB();
    }

}



//connectWeightScale = function (e) {
//    // alert('on click fetch button')
//    if ($("#ddlscaleName").val() == '0') {
//        $.alert('Please select Weighing Scale.');
//        return;
//    }

//    //$('body').mLoading({
//    //    text: "Please Wait..",
//    //});
//    //  alert('MAC Address detect  =  ' + DeviceMacAdd)
//    // var device = e.target.getAttribute("deviceId");
//    bluetoothSerial.connect(DeviceMacAdd, onconnect);
//   // $("body").mLoading('hide');
//    //bluetoothSerial.read(function (data) {

//    //    var dataforshow = data.toString();
//    //    alert('before read')
//    //    document.getElementById('txtData').value = dataforshow;
//    //    alert('read success')
//    //});

//}



//onconnect = function () {
//    // alert('In BL connect');
//    //  alert('connection success');
//    try {

//        //bluetoothSerial.subscribeRawData(function (data) {

//        //    alert('read data');

//        //    var bytes = new Uint8Array(data);

//        //    var dataforshow = bytes.slice(-1);

//        //    alert(bytes.slice(-1));


//        //    // var dataforshow = data.split('+');
//        //    alert(dataforshow)

//        //    document.getElementById('txtReceivedGrossWt').value = dataforshow;
//        //    // $('#txtData').val(data);
//        //    alert('read success')
//        //});


//        bluetoothSerial.read(function (data) {

//            var dataforshow = data.split('kg');
//            //  alert(dataforshow);
//            //var lastWtRec = dataforshow[dataforshow.length - 1];
//            // alert(dataforshow[dataforshow.length - 2]);
//            var finalWt = dataforshow[dataforshow.length - 2].split(' ');
//            //  alert('with space == > ' + finalWt);

//            //alert('before space == > ' + finalWt[0]);

//            //alert(finalWt[1]);

//            //alert('1st place == > ' + finalWt[1]);
//            //alert('2 place == > ' + finalWt[2]);
//            alert('3 place == > ' + finalWt[3]);
//            //alert('4 place == > ' + finalWt[4]);

//            //if (finalWt[3] > 0) {

//            //     $("body").mLoading('hide');
//            //}

//            document.getElementById('txtReceivedGrossWt').value = finalWt[3];

//            alert($('#txtReceivedGrossWt').val());

//            //if ($('#txtReceivedGrossWt').val() != '') {
//            //    $("body").mLoading('hide');
//            //}
//        });
//    }
//    catch (e) {
//        $("body").mLoading('hide');
//        alert('Error while Reading');
//    }

//}

connectWeightScale = function (e) {
    //  alert('on click fetch button')
    if ($("#ddlscaleName").val() == '0') {
        $.alert('Please select Weighing Scale.');
        return;
    }
    // alert('MAC Address detect  =  ' + DeviceMacAdd);

    // setTimeout(function () { alert("Hello"); }, 3000);

    bluetoothSerial.disconnect();

    //  try {
    // alert('before connect');
    //  bluetoothSerial.connect(DeviceMacAdd, onconnect);
    $('body').mLoading({
        text: "Please Wait..",
    });


    bluetoothSerial.connect(DeviceMacAdd, connectSuccess);

    //  alert('after connect');

    //  alert('MAC Address detect after connect  =  ' + DeviceMacAdd);
    //}
    //catch (e) {
    //    // $("body").mLoading('hide');
    //  //  alert('Error while connecting, Please try again.');
    //}

    // var device = e.target.getAttribute("deviceId");


    //bluetoothSerial.read(function (data) {

    //    var dataforshow = data.toString();
    //    alert('before read')
    //    document.getElementById('txtData').value = dataforshow;
    //    alert('read success')
    //});
}

connectFailure = function () {

    alert('Connection fail, try again.');

}



connectSuccess = function () {
    $("body").mLoading('hide');
    alert('Device connected.');


    // alert('In BL connect');
    //   alert('connection success');
    try {

        //bluetoothSerial.subscribeRawData(function (data) {

        //    alert('read data');

        //    var bytes = new Uint8Array(data);

        //    var dataforshow = bytes.slice(-1);

        //    alert(bytes.slice(-1));


        //    // var dataforshow = data.split('+');
        //    alert(dataforshow)

        //    document.getElementById('txtReceivedGrossWt').value = dataforshow;
        //    // $('#txtData').val(data);
        //    alert('read success')
        //});

        //  alert('before read');

        if (venderIDSelected == 'A') {
            bluetoothSerial.read(function (data) {
                var dataforshow = data.split('kg');
                //  alert(dataforshow);
                // alert('in first block');
                //  alert(JSON.stringify(data))
                //var lastWtRec = dataforshow[dataforshow.length - 1];
                // alert(dataforshow[dataforshow.length - 2]);



                var finalWt = dataforshow[dataforshow.length - 2].split(' ');
                //alert('with space == > ' + finalWt);

                //alert('before space == > ' + finalWt[0]);

                //alert(finalWt[1]);

                //alert('position 3 == > ' + finalWt[3]);

                //alert('1st place == > ' + finalWt[1]);
                //alert('2 place == > ' + finalWt[2]);
                //alert('3 place == > ' + finalWt[3]);
                //alert('4 place == > ' + finalWt[4]);


                // document.getElementById('txtReceivedGrossWt').value = finalWt[3];

                if (finalWt[1] != "") {

                    document.getElementById('txtReceivedGrossWt').value = finalWt[1];

                } else if (finalWt[2] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWt[2];

                } else if (finalWt[3] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWt[3];

                } else if (finalWt[4] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWt[4];

                } else if (finalWt[5] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWt[5];

                }


                //  alert('textbox value ==> ' + $('#txtReceivedGrossWt').val());


                // $('#txtData').val(data);
            });
        } else if (venderIDSelected == 'B') {
            bluetoothSerial.read(function (data) {
                var dataforshowNewString = data.split(',');
                // alert(dataforshowNewString);
                //  alert(JSON.stringify(data))
                // alert('in second block')
                //var lastWtRec = dataforshowNewString[dataforshowNewString.length - 1];
                // alert(dataforshowNewString[dataforshowNewString.length - 2]);

                var finalWtNewString = dataforshowNewString[dataforshowNewString.length - 2].split(' ');
                //',,,,,,86'
                // var fnlReading = finalWtNewString.replace(/\,/g, "");
                // alert('before space == > ' + fnlReading[0]);
                //  alert('with space == > ' + finalWtNewString);

                // var res = finalWtNewString.replaceAll(',', '');

                // alert('result=>');

                // alert(res);
                //alert(finalWtNewString[1]);

                //alert('position 3 == > ' + finalWtNewString[3]);

                //alert('array start here');

                //alert('1st place == > ' + finalWtNewString[1]);
                //alert('2 place == > ' + finalWtNewString[2]);
                //alert('3 place == > ' + finalWtNewString[3]);
                //alert('4 place == > ' + finalWtNewString[4]);
                //alert('5 place == > ' + finalWtNewString[5]);
                //alert('6 place == > ' + finalWtNewString[6]);
                //alert('7 place == > ' + finalWtNewString[7]);
                //alert('8 place == > ' + finalWtNewString[8]);
                //alert('0 place == > ' + finalWtNewString[0]);


                // alert('array end here');


                //// $('#txtReceivedGrossWt').val(finalWtNewString);
                // document.getElementById('txtReceivedGrossWt').value = finalWtNewString;

                // var fnlReading = finalWtNewString.split(',');


                // alert('replacing  , with space');
                // alert(fnlReading);


                if (finalWtNewString[0] != "") {

                    document.getElementById('txtReceivedGrossWt').value = finalWtNewString[0];

                } else if (finalWtNewString[1] != "") {

                    document.getElementById('txtReceivedGrossWt').value = finalWtNewString[1];

                } else if (finalWtNewString[2] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWtNewString[2];

                } else if (finalWtNewString[3] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWtNewString[3];

                } else if (finalWtNewString[4] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWtNewString[4];

                } else if (finalWtNewString[5] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWtNewString[5];

                }
                else if (finalWtNewString[6] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWtNewString[6];

                }
                else if (finalWtNewString[7] != "") {
                    document.getElementById('txtReceivedGrossWt').value = finalWtNewString[7];

                }


                // $('#txtData').val(data);
            });
        } else if (venderIDSelected == 'S2') {
            bluetoothSerial.read(function (data) {
                // Code for Avert Tronix. / BWS Indicator.
                var dataSplit = data.split(' ');

                var fnReadingS2 = dataSplit[dataSplit.length - 1];

                document.getElementById('txtReceivedGrossWt').value = parseFloat(fnReadingS2);


            });
        } else if (venderIDSelected == 'S1') {
            bluetoothSerial.read(function (data) {
                // Code for Baykon / Flintec Indcators.
                var dataforshowNewString = data.split(' ');

                var fnReadingS1 = dataforshowNewString[dataforshowNewString.length - 6];

                document.getElementById('txtReceivedGrossWt').value = fnReadingS1;
            });
        }




    }
    catch (e) {
        alert('Error while Reading, please try again.');
    }

}





function dynamicTrCreate() {


    newTextBoxDiv = $(document.createElement('tr'))
        .attr("id", 'TextBoxDiv' + counter);

    newTextBoxDiv.after().html('<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" onchange="calculateAllRows();"  name="textpackges' + parseInt(counter + 1) + '" id="Pieces' + parseInt(counter + 1) + '" type="text" /></td>' +
        //'<td><select name="textpackges' + parseInt(counter + 1) + '" id="ddlUOM' + parseInt(counter + 1) + '"><option value="CMT">CM</option><option value="INH">IN</option></select></td>' +
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" onchange="calculateAllRows();" name="textpackges' + parseInt(counter + 1) + '" id="Length' + parseInt(counter + 1) + '"  type="text" /></td>' +
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" onchange="calculateAllRows();" name="textpackges' + parseInt(counter + 1) + '" id="Width' + parseInt(counter + 1) + '"  type="text" /></td>' +
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" onchange="calculateAllRows();" name="textpackges' + parseInt(counter + 1) + '" id="Height' + parseInt(counter + 1) + '"  type="text" /></td>' +
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" name="textpackges' + parseInt(counter + 1) + '" disabled id="Volume' + parseInt(counter + 1) + '"  type="text" /></td>' +
        '<td><button onclick="removeRow(' + parseInt(counter) + ');" type="button" id="btnAdd"  class="btn"><span class="glyphicon glyphicon-minus"></span></button></td>');


    newTextBoxDiv.appendTo("#TextBoxesGroup");
    counter++;

}

function calculateAllRows() {
    var dimentiontable = document.getElementById('dimentiontable')
    for (var rowid = 1; rowid < dimentiontable.rows.length; rowid++) {
        var pieces = dimentiontable.rows[rowid].children[0].children[0].value;

        var Length = dimentiontable.rows[rowid].children[1].children[0].value;
        var width = dimentiontable.rows[rowid].children[2].children[0].value;

        var height = dimentiontable.rows[rowid].children[3].children[0].value;

        if (parseFloat(pieces) != NaN && parseFloat(height) != NaN && parseFloat(Length) != NaN && parseFloat(width) != NaN) {
            if (UMOUnit == "CMT") {
                var Volume = (Length * width * height * pieces) / 1000000
            } else {
                var Volume = (Length * width * height * pieces) / 61012.81269
            }
        }
        else {
            var Volume = 0;
        }


        dimentiontable.rows[rowid].children[4].children[0].value = parseFloat(Volume).toFixed(2);
    }
}

//function calVolume(idCounter) {

//    var pieces = $('#Pieces' + idCounter).val();
//    //var unit = $('#ddlUOM' + idCounter).val();
//    var Length = $('#Length' + idCounter).val();
//    var width = $('#Width' + idCounter).val();
//    var height = $('#Height' + idCounter).val();

//    if (UMOUnit == "CMT") {
//        var Volume = (Length * width * height * pieces) / 1000000
//    } else {
//        var Volume = (Length * width * height * pieces) / 61012.81269
//    }
//    $('#Volume' + idCounter).val(parseFloat(Volume).toFixed(2));


//    inputRowsforDim += '<DIMData SeqNo="0" Length="' + Length + '" Width="' + width + '" Height="' + height + '" Pieces="' + pieces + '" Vol="' + Volume + '" VolCode="' + UMOUnit + '" />';
//}



function SaveDimDetails() {

    inputRowsforDim = '';
    var dimentiontable = document.getElementById('dimentiontable')
    for (var rowid = 1; rowid < dimentiontable.rows.length; rowid++) {
        var pieces = dimentiontable.rows[rowid].children[0].children[0].value;
        var Length = dimentiontable.rows[rowid].children[1].children[0].value;
        var width = dimentiontable.rows[rowid].children[2].children[0].value;

        var height = dimentiontable.rows[rowid].children[3].children[0].value;

        if (pieces == NaN || pieces == "0" || pieces == "") {
            //errmsg = "NoP should not blank or 0.</br>";
            //$.alert(errmsg);
            alert('Please enter valid NoP.');
            return;
        } else if (Length == NaN || Length == "0" || Length == "") {
            //errmsg = "Length should not blank or 0.</br>";
            //$.alert(errmsg);
            alert('Please enter valid Length.');
            return;
        } else if (height == NaN || height == "0" || height == "") {
            //errmsg = "Height should not blank or 0.</br>";
            //$.alert(errmsg);
            alert('Please enter valid Height.')
            return;
        } else if (width == NaN || width == "0" || width == "") {
            //errmsg = "Width should not blank or 0.</br>";
            //$.alert(errmsg);
            alert('Please enter valid Width.')
            return;
        }

        if (UMOUnit == "CMT") {
            var Volume = (Length * width * height * pieces) / 1000000
        } else {
            var Volume = (Length * width * height * pieces) / 61012.81269
        }


        var Volume = parseFloat(Volume).toFixed(2);
        dimentiontable.rows[rowid].children[4].children[0].value = Volume;
        inputRowsforDim += '<DIMData SeqNo="0" Length="' + Length + '" Width="' + width + '" Height="' + height + '" Pieces="' + pieces + '" Vol="' + Volume + '" VolCode="' + UMOUnit + '" />';

    }
    modal.style.display = "none";
    $("#btnSave").removeAttr("disabled", "disabled");
    //$('#Pieces1').val('').css("background-color", "white");
    //$('#ddlUOM1').val('CM');
    //$('#Length1').val('').css("background-color", "white");
    //$('#Width1').val('').css("background-color", "white");
    //$('#Volume1').val('').css("background-color", "white");
    //$('#Height1').val('').css("background-color", "white");

    //if (newTextBoxDiv != '') {
    //    newTextBoxDiv.html('');
    //}


}


function EnableDimensions() {
    DimensionsStatus = document.getElementById("chkDimensions").checked;

    if (DimensionsStatus == false) {
        $("#btnSave").removeAttr("disabled");
        $("#myBtnDimensions").removeAttr("disabled");
        $("#myBtnDimensionsduplicate").show();
        $("#myBtnDimensions").hide();
    }

    if (DimensionsStatus == true) {
        $("#btnSave").attr("disabled", "disabled");
        $("#myBtnDimensionsduplicate").hide();
        $("#myBtnDimensions").show();


    }
}


function GetULDDetailsforVCT() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    if ($('#txtVCTNo').val() == '') {
        return;
    }
    var errmsg = "";
    var VCTNo = $('#txtVCTNo').val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    // inputxml = '<Root><VCTNo>' + VCTNo + '</VCTNo><CompanyCode>3</CompanyCode><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = '<Root><DockNo>' + VCTNo + '</DockNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    //clearALLControls();
    $('#ddlULDNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_VCTSearch",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                console.log('get VCT list')
                console.log(xmlDoc)
                var ULDId = "";
                var ULD = "";
                var AWB = "";
                var UldAccRel;


                $(xmlDoc).find('Table').each(function (index) {


                    Status = $(this).find('Status').text();
                    msg = $(this).find('msg').text();


                    if (Status == 'E') {
                        errmsg = msg;
                        $.alert(errmsg);
                        return;
                    }

                    ULDId = $(this).find('ULDSeqNo').text();
                    ULD = $(this).find('ULDNo').text();

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlULDNo');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULD);
                    newOption.appendTo('#ddlULDNo');

                    $('#ddlULDNo option').filter(function () {
                        return ($(this).val().trim() == "" && $(this).text().trim() == "");
                    }).remove();

                    var a = new Array();
                    $("#ddlULDNo").children("option").each(function (x) {
                        test = false;
                        b = a[x] = $(this).text();
                        for (i = 0; i < a.length - 1; i++) {
                            if (b == a[i]) test = true;
                        }
                        if (test) $(this).remove();
                    });

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlAWBNo');
                    }

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlShipmentNo');
                    }

                    var opt = {};
                    $("#ddlAWBNo > option").each(function () {
                        if (opt[$(this).text()]) {
                            $(this).remove();
                        } else {
                            opt[$(this).text()] = $(this).val();
                        }
                    });
                    var opt = {};
                    $("#ddlShipmentNo > option").each(function () {
                        if (opt[$(this).text()]) {
                            $(this).remove();
                        } else {
                            opt[$(this).text()] = $(this).val();
                        }
                    });



                    $('#ddlAcceptance').val("1");

                });

                $(xmlDoc).find('Table1').each(function (index) {
                    IsDisableReceivedWt = $(this).find('IsDisableReceivedWt').text();

                    if (IsDisableReceivedWt == 'Y') {
                        $("#txtReceivedGrossWt").attr("disabled", "disabled");
                    } else {
                        $("#txtReceivedGrossWt").removeAttr("disabled", "disabled");
                    }

                });

                setDetailsOnSelected("1");
                $(xmlDoc).find('Table1').each(function (index) {
                    AWBId = $(this).find('AWBNo').text();
                    AWB = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWB);
                    newOption.appendTo('#ddlAWBNo');

                    if ((ULDId == "") && (ULD == "")) {
                        $('#ddlAcceptance').val("0");
                        $('#lblAcceptance').text("Acceptance");
                    }
                });

                $(xmlDoc).find('Table2').each(function (index) {

                    ULD_MODE = $(this).find('ULD_MODE').text();
                    UldAccRel = $(this).find('UldAccRel').text();

                    //if (ULD_MODE>0)
                    //{
                    //    //$('#ddlAcceptance').find('option:selected').val(1); 
                    //    $('#ddlAcceptance').val("1");
                    //}
                    if ((ULDId == "") && (AWB == "")) {
                        $('#ddlAcceptance').val("1");
                    }

                    if (ULDId == "") {
                        $("#drULD").hide();
                        $("#ddlULD").empty();
                    }
                    else if ((ULDId != "") && (UldAccRel == "A")) {
                        $("#drULD").show();
                        $("#ddlULD").empty();

                        var newOption = $('<option></option>');
                        newOption.val('').text('Select');
                        newOption.appendTo('#ddlULD');
                    }
                    else {
                        $("#drULD").hide();
                        $("#ddlULD").empty();
                    }

                    if (AWB != "") {
                        $("#drRadiobtn").show();
                    }
                    else {
                        $("#drRadiobtn").hide();
                    }

                    if (UldAccRel == "A") {
                        $('#lblAcceptance').text("Acceptance");
                    }
                    else if (UldAccRel == "R") {
                        //$('#ddlAcceptance').val("0");
                        $('#lblAcceptance').text("Release");
                    }

                    //var newOption = $('<option></option>');   
                    //newOption.val(ULDId).text(ULD);
                    //newOption.appendTo('#ddlULDNo');
                    if ((ULD_MODE > 0) && ($('#ddlAcceptance').val() == "1")) {
                        $("#divULDNo").show();
                        $("#divUldDrp").hide();
                    }
                    else {
                        $("#divULDNo").hide();
                        $("#divUldDrp").show();
                    }

                    if (($('#ddlAcceptance').val() == "1")) {
                        $("#ddlAWBNo").attr("disabled", "disabled");
                        $("#ddlShipmentNo").attr("disabled", "disabled");
                        $("#ddlGrossWtUnit").attr("disabled", "disabled");
                        $("#txtPackages").attr("disabled", "disabled");
                        $("#txtGrossWt").attr("disabled", "disabled");
                    }
                    else {
                        $("#ddlAWBNo").removeAttr("disabled", "disabled");
                        $("#ddlShipmentNo").removeAttr("disabled", "disabled");
                        $("#ddlGrossWtUnit").removeAttr("disabled", "disabled");
                        $("#txtPackages").removeAttr("disabled", "disabled");
                        $("#txtGrossWt").removeAttr("disabled", "disabled");
                    }

                    if ((UldAccRel == "R") && ($('#ddlAcceptance').val() == "1")) {
                        $("#txtLocation").attr("disabled", "disabled");
                        $("#chkSealed").attr("disabled", "disabled");
                        $("#chkNotSealed").attr("disabled", "disabled");
                    }
                    else {
                        $("#txtLocation").removeAttr("disabled", "disabled");
                        $("#chkSealed").removeAttr("disabled", "disabled");
                        $("#chkNotSealed").removeAttr("disabled", "disabled");
                    }

                });

                if (ULD_MODE == 0) {

                    $(xmlDoc).find('Table3').each(function (index) {

                        var ULDValue = "";
                        var ULDText = "";

                        ULDText = $(this).find('Text').text();
                        ULDValue = $(this).find('Value').text();

                        var newOption = $('<option></option>');
                        newOption.val(ULDValue).text(ULDText);
                        newOption.appendTo('#ddlULD');

                    });
                }

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

function GetULDDetailsforAWB() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";
    var VCTNo = $('#txtVCTNo').val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    // inputxml = '<Root><VCTNo>' + VCTNo + '</VCTNo><CompanyCode>3</CompanyCode><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = '<Root><AWBNo>' + VCTNo + '</AWBNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    // clearALLControls();
    $('#ddlULDNo').empty();
    $('#ddlShipmentNo').empty();
    $('#ddlAWBNo').empty();
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_AWBSearch",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log('by AWB No')
                console.log(xmlDoc)
                var ULDId = "";
                var ULD = "";
                var AWB = "";
                var UldAccRel;
                var ShpmentId;
                var ShpmentNo;
                var Remarks;

                //$(xmlDoc).find('Table').each(function (index) {

                //    ULDId = $(this).find('ULDSeqNo').text();
                //    ULD = $(this).find('ULDNo').text();

                //    var newOption = $('<option></option>');
                //    newOption.val(ULDId).text(ULD);
                //    newOption.appendTo('#ddlULDNo');

                //    $('#ddlAcceptance').val("1");

                //});

                $(xmlDoc).find('Table').each(function (index) {


                    Status = $(this).find('Status').text();
                    msg = $(this).find('msg').text();


                    if (Status == 'E') {
                        errmsg = msg;
                        $.alert(errmsg);
                        return;
                    }

                    ShpmentId = $(this).find('SHIPMENT_NUMBER').text();
                    ShpmentNo = $(this).find('SHIPMENT_NUMBER').text();
                    AWBNo = $(this).find('AWBNo').text();

                    //gridXMLforShow = '<Root><AWBNo>' + AWBNo + '</AWBNo><ShipmentNo>' + ShpmentNo + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                    //CargoAcceptance_GetAcceptedList(gridXMLforShow);

                    //if (index != 0) {
                    //    var newOptionAWBNo = $('<option></option>');
                    //    newOptionAWBNo.val(AWBNo).text(AWBNo);
                    //    newOptionAWBNo.appendTo('#ddlAWBNo');
                    //} else {
                    //    var newOptionAWBNo = $('<option></option>');
                    //    newOptionAWBNo.val($('#txtVCTNo').val()).text($('#txtVCTNo').val());
                    //    newOptionAWBNo.appendTo('#ddlAWBNo');
                    //}

                    //if (index == 0) {
                    //    var newOption = $('<option></option>');
                    //    newOption.val('0').text('Select');
                    //    newOption.appendTo('#ddlAWBNo');
                    //}

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlShipmentNo');
                    }

                    var newOptionAWBNo = $('<option></option>');
                    newOptionAWBNo.val($('#txtVCTNo').val()).text($('#txtVCTNo').val());
                    newOptionAWBNo.appendTo('#ddlAWBNo');

                    $('#ddlAWBNo option').filter(function () {
                        return ($(this).val().trim() == "" && $(this).text().trim() == "");
                    }).remove();

                    var a = new Array();
                    $("#ddlAWBNo").children("option").each(function (x) {
                        test = false;
                        b = a[x] = $(this).text();
                        for (i = 0; i < a.length - 1; i++) {
                            if (b == a[i]) test = true;
                        }
                        if (test) $(this).remove();
                    });


                    var newOption = $('<option></option>');
                    newOption.val(ShpmentId).text(ShpmentNo);
                    newOption.appendTo('#ddlShipmentNo');

                    $('#ddlShipmentNo option').filter(function () {
                        return ($(this).val().trim() == "" && $(this).text().trim() == "");
                    }).remove();

                    var a = new Array();
                    $("#ddlShipmentNo").children("option").each(function (x) {
                        test = false;
                        b = a[x] = $(this).text();
                        for (i = 0; i < a.length - 1; i++) {
                            if (b == a[i]) test = true;
                        }
                        if (test) $(this).remove();
                    });


                    //if (index == 0) {
                    //    AWBPackages = $(this).find('TOTAL_NPX').text();
                    //    AWBGrossWt = $(this).find('TOT_WGHT_EXP_KG').text();
                    //    ShipPackages = $(this).find('FBL_NPX').text();
                    //    ShipGrossWt = $(this).find('FBL_WEIGHT_EXP').text();
                    //    $('#txtPackages').val(AWBPackages);
                    //    $('#txtGrossWt').val(AWBGrossWt);
                    //    $('#shiptxtPackages').val(ShipPackages);
                    //    $('#shiptxtGrossWt').val(ShipGrossWt);
                    //    return;
                    //}




                });

                $(xmlDoc).find('Table1').each(function (index) {

                    IsDisableReceivedWt = $(this).find('IsDisableReceivedWt').text();

                    if (IsDisableReceivedWt == 'Y') {
                        $("#txtReceivedGrossWt").attr("disabled", "disabled");
                    } else {
                        $("#txtReceivedGrossWt").removeAttr("disabled", "disabled");
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


function GetAWBDetailsforVCT() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";
    var VCTNo = $('#txtVCTNo').val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = '<Root><DockNo>' + VCTNo + '</DockNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    $('#ddlAWBNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_VCTAWBSearch",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                var AWB;
                var SHIPMENT_NUMBER;
                console.log('awb and ship')
                console.log(xmlDoc)
                $(xmlDoc).find('Table').each(function (index) {
                    rbtVal = $("input[name='VctNo']:checked").val();
                    if (rbtVal == "vct") {
                        if (index == 0) {
                            var newOption = $('<option></option>');
                            newOption.val('0').text('Select');
                            newOption.appendTo('#ddlAWBNo');
                        }
                    }

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlShipmentNo');
                    }
                    var ULDId;
                    var ULD;
                    AWBId = $(this).find('AWBNo').text();
                    AWB = $(this).find('AWBNo').text();
                    SHIPMENT_NUMBER = $(this).find('SHIPMENT_NUMBER').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWB);
                    newOption.appendTo('#ddlAWBNo');


                    var newOptionShip = $('<option></option>');
                    newOptionShip.val(SHIPMENT_NUMBER).text(SHIPMENT_NUMBER);
                    newOptionShip.appendTo('#ddlShipmentNo');

                });

                // $('#ddlULDNo').trigger('change');
                $('#ddlAWBNo option').filter(function () {
                    return ($(this).val().trim() == "" && $(this).text().trim() == "");
                }).remove();

                var a = new Array();
                $("#ddlAWBNo").children("option").each(function (x) {
                    test = false;
                    b = a[x] = $(this).text();
                    for (i = 0; i < a.length - 1; i++) {
                        if (b == a[i]) test = true;
                    }
                    if (test) $(this).remove();
                });


                $('#ddlShipmentNo option').filter(function () {
                    return ($(this).val().trim() == "" && $(this).text().trim() == "");
                }).remove();

                var a = new Array();
                $("#ddlShipmentNo").children("option").each(function (x) {
                    test = false;
                    b = a[x] = $(this).text();
                    for (i = 0; i < a.length - 1; i++) {
                        if (b == a[i]) test = true;
                    }
                    if (test) $(this).remove();
                });

                gridXMLforShow = '<Root><AWBNo>' + AWB + '</AWBNo><ShipmentNo>' + SHIPMENT_NUMBER + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                CargoAcceptance_GetAcceptedList(gridXMLforShow);

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
function GetAWBDetailsforAWB() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";
    var VCTNo = $('#txtVCTNo').val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = '<Root><AWBNo>' + VCTNo + '</AWBNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    $('#ddlAWBNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_AWBSearch",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log('VCT With AWB')
                console.log(xmlDoc)
                $(xmlDoc).find('Table').each(function (index) {

                    //if (index == 0) {
                    //    var newOption = $('<option></option>');
                    //    newOption.val('0').text('Select');
                    //    newOption.appendTo('#ddlAWBNo');
                    //}

                    var ULDId;
                    var ULD;
                    AWBId = $(this).find('AWBNo').text();
                    AWB = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWB);
                    newOption.appendTo('#ddlAWBNo');
                    //$('#ddlAcceptance').val("0");
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

function GetAWBDetailsForULD(ULDid) {


    $('#txtTareWt').val('');
    $('#txtULDType').val('');
    $('#txtReceivedNetWt').val('');

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    inputxml = '<Root><DockNo>' + $('#txtVCTNo').val() + '</DockNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    $('#ddlAWBNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_VCTSearch",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;

                var xmlDoc = $.parseXML(Result);
                console.log('AWB')
                console.log(xmlDoc)
                $(xmlDoc).find('Table').each(function (index) {

                    var AWBId;
                    var AWB;
                    AWBId = $(this).find('AWBNo').text();
                    AWB = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWB);
                    newOption.appendTo('#ddlAWBNo');



                    SHIPMENT_NUMBER = $(this).find('SHIPMENT_NUMBER').text();

                    var newOption = $('<option></option>');
                    newOption.val(SHIPMENT_NUMBER).text(SHIPMENT_NUMBER);
                    newOption.appendTo('#ddlShipmentNo');


                    var hdnValue = $('#ddlULDNo').val().split('~');
                    gridXMLforShow = '<Root><AWBNo>' + hdnValue[1] + '</AWBNo><ShipmentNo>' + hdnValue[2] + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                    CargoAcceptance_GetAcceptedList(gridXMLforShow);

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
function GetShipmentDetails(AWBid) {

    var AWB = AWBid;
    var VCTCode = $('#txtVCTNo').val();
    VCTCode = VCTCode.replace(/\s+/g, '');
    VCTCode = VCTCode.replace("-", "").replace("–", "");

    var radioValue = $("input[name='VctNo']:checked").val();
    if (radioValue == "vct" && VCTCode.length == 12) {
        GetShipmentDetailsVCT(AWB);
    } else {
        GetShipmentDetailsAWB(AWB);
    }

}
function GetShipmentDetailsVCT(AWBid) {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var VCTNo = $('#txtVCTNo').val();
    var errmsg = "";

    if (AWBid == '0')
        return;

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    inputxml = '<Root><DockNo>' + VCTNo + '</DockNo><AWBNo>' + AWBid + '</AWBNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    $('#ddlShipmentNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_GETVCTAWB_Details",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                XMLshipmentDt = Result;
                console.log("GetShipmentDetails", xmlDoc)
                $(xmlDoc).find('Table').each(function (index) {

                    var ShpmentId;
                    var ShpmentNo;
                    var Remarks;
                    ShpmentId = $(this).find('SHIPMENT_NUMBER').text();
                    ShpmentNo = $(this).find('SHIPMENT_NUMBER').text();
                    AWBNo = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(ShpmentId).text(ShpmentNo);
                    newOption.appendTo('#ddlShipmentNo');


                    if (index == 0) {
                        AWBPackages = $(this).find('TOTAL_NPX').text();
                        AWBGrossWt = $(this).find('TOT_WGHT_EXP_KG').text();
                        ShipPackages = $(this).find('FBL_NPX').text();
                        ShipGrossWt = $(this).find('FBL_WEIGHT_EXP').text();
                        $('#txtPackages').val(AWBPackages);
                        $('#txtGrossWt').val(AWBGrossWt);
                        $('#shiptxtPackages').val(ShipPackages);
                        $('#shiptxtGrossWt').val(ShipGrossWt);

                        gridXMLforShow = '<Root><AWBNo>' + AWBNo + '</AWBNo><ShipmentNo>' + ShpmentNo + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                        return;
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
function GetShipmentDetailsAWB(AWBid) {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var VCTNo = $('#txtVCTNo').val();
    var errmsg = "";

    if (AWBid == '0')
        return;

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    inputxml = '<Root><AWBNo>' + VCTNo + '</AWBNo><AWBNo>' + AWBid + '</AWBNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    $('#ddlShipmentNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_AWBSearch",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;

                var xmlDoc = $.parseXML(Result);
                XMLshipmentDt = Result;
                //console.log("GetShipmentDetails", xmlDoc)

                var ShpmentId;
                var ShpmentNo;
                var Remarks;
                $(xmlDoc).find('Table').each(function (index) {


                    ShpmentId = $(this).find('SHIPMENT_NUMBER').text();
                    ShpmentNo = $(this).find('SHIPMENT_NUMBER').text();

                    var newOption = $('<option></option>');
                    newOption.val(ShpmentId).text(ShpmentNo);
                    newOption.appendTo('#ddlShipmentNo');

                    if (index == 0) {
                        AWBPackages = $(this).find('TOTAL_NPX').text();
                        AWBGrossWt = $(this).find('TOT_WGHT_EXP_KG').text();
                        ShipPackages = $(this).find('FBL_NPX').text();
                        ShipGrossWt = $(this).find('FBL_WEIGHT_EXP').text();
                        $('#txtPackages').val(AWBPackages);
                        $('#txtGrossWt').val(AWBGrossWt);
                        $('#shiptxtPackages').val(ShipPackages);
                        $('#shiptxtGrossWt').val(ShipGrossWt);
                        return;
                    }

                });
                gridXMLforShow = '<Root><AWBNo>' + AWBid + '</AWBNo><ShipmentNo>' + ShpmentNo + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                CargoAcceptance_GetAcceptedList(gridXMLforShow);
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
function GetShipmentRelatedDetails(ShipmentId) {
    var inputxml = "";
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var AwbId = $('#ddlAWBNo').val();
    var errmsg = "";

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    inputxml = '<Root><AWBNo>' + AwbId + '</AWBNo><ShipmentNo>' + ShipmentId + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>';



    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_GETAWBShipment_Details",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $('#txtReceivedPackages').val('');
                $('#txtReceivedGrossWt').val('');
                XMLshipmentDt = Result;
                var xml = $.parseXML(XMLshipmentDt);
                //console.log("GetShipmentRelatedDetails", xmlDoc)
                $(xml).find('Table').each(function (index) {

                    var ShpmentNo;
                    ShpmentNo = $(this).find('SHIPMENT_NUMBER').text();

                    if (ShpmentNo == ShipmentId) {
                        AWBPackages = $(this).find('TOTAL_NPX').text();
                        AWBGrossWt = $(this).find('TOT_WGHT_EXP_KG').text();
                        ShipPackages = $(this).find('FBL_NPX').text();
                        ShipGrossWt = $(this).find('FBL_WEIGHT_EXP').text();
                        $('#txtPackages').val(AWBPackages);
                        $('#txtGrossWt').val(AWBGrossWt);
                        $('#shiptxtPackages').val(ShipPackages);
                        $('#shiptxtGrossWt').val(ShipGrossWt);
                        //return;
                    }

                });

                clearAllValuesfromDimention();

                gridXMLforShow = '<Root><AWBNo>' + $('#ddlAWBNo').val() + '</AWBNo><ShipmentNo>' + $('#ddlShipmentNo').val() + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                CargoAcceptance_GetAcceptedList(gridXMLforShow);


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
// function GetShipmentRelatedDetails(ShipmentId) {

//     var xml = $.parseXML(XMLshipmentDt);
// console.log("GetShipmentRelatedDetails",xml)
//     $(xml).find('Table').each(function (index) {

//         var ShpmentNo;
//         ShpmentNo = $(this).find('SHIPMENT_NUMBER').text();

//         if (ShpmentNo == ShipmentId) {
//             Packages = $(this).find('NOP').text();
//             GrossWt = $(this).find('WEIGHT_KG').text();

//             $('#txtPackages').val(Packages);
//             $('#txtGrossWt').val(GrossWt);
//             return;
//         }

//     });
// }

function GetScaleListDetails() {

    $("#ddlEquipmentType").empty();
    $("#ddlscaleName").empty();

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";
    var VCTNo = $('#txtVCTNo').val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = '<Root><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_ScaleNameList",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {

                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log(xmlDoc)
                $(xmlDoc).find('Table').each(function (index) {

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlscaleName');
                    }


                    var ULDId;
                    var ULD;
                    MAC_ID = $(this).find('MAC_ID').text();
                    MachineName = $(this).find('MachineName').text();
                    VendorId = $(this).find('VendorId').text();

                    var newOption = $('<option></option>');
                    newOption.val(MAC_ID + ',' + VendorId).text(MachineName);
                    newOption.appendTo('#ddlscaleName');
                });


                $(xmlDoc).find('Table1').each(function (index) {

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlEquipmentType');
                    }


                    var REFERENCE_TABLE_NAME;
                    var ANALYSIS_REF_TABLE_IDENTIFIER;
                    REFERENCE_TABLE_NAME = $(this).find('REFERENCE_TABLE_NAME').text();
                    ANALYSIS_REF_TABLE_IDENTIFIER = $(this).find('ANALYSIS_REF_TABLE_IDENTIFIER').text();

                    var newOption = $('<option></option>');
                    newOption.val(ANALYSIS_REF_TABLE_IDENTIFIER).text(REFERENCE_TABLE_NAME);
                    newOption.appendTo('#ddlEquipmentType');
                });

                // $('#ddlscaleName').trigger('change')
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



function HHT_CargoAcceptance_Equipment_SubTypeList(EquipmentType) {
    $('#ddlULDSK1').empty();
    var inputxml = "";




    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";
    var VCTNo = $('#txtVCTNo').val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = '<Root><EquipmentType>' + EquipmentType + '</EquipmentType></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_Equipment_SubTypeList",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {

                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log(xmlDoc)

                $(xmlDoc).find('Table').each(function (index) {
                    if ($('#txtULDType').val() != '') {

                        var Status;
                        var msg;
                        Status = $(this).find('Status').text();
                        msg = $(this).find('msg').text();
                        if (Status == 'E') {
                            errmsg = msg;
                            $.alert(errmsg);
                            return;
                        }
                    }

                });


                $(xmlDoc).find('Table1').each(function (index) {

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val('0').text('Select');
                        newOption.appendTo('#ddlULDSK1');
                    }


                    var SubType;
                    var TareWt;
                    SubType = $(this).find('SubType').text();
                    TareWt = $(this).find('TareWt').text();

                    var newOption = $('<option></option>');
                    newOption.val(TareWt).text(SubType);
                    newOption.appendTo('#ddlULDSK1');

                    //if (SubType == 'AKE') {




                    //}

                    if ($('#ddlULDSK1').val() != '0') {


                        var receWt = parseFloat($('#txtReceivedGrossWt').val());
                        var tare = parseFloat(TareWt);

                        var netWt = receWt - tare;

                        if (netWt < 0) {
                            // alert('Gross Wt. should be greater then tare wt')

                            errmsg = "Gross Wt. should be greater then tare wt.</br>";
                            $.alert(errmsg);
                            return;
                        }



                        $('#txtTareWt').val(tare.toFixed(2));

                        $('#txtReceivedNetWt').val(netWt.toFixed(2));
                    }

                    if ($('#txtULDType').val() != '') {


                        var receWt = parseFloat($('#txtReceivedGrossWt').val());
                        var tare = parseFloat(TareWt);

                        var netWt = receWt - tare;

                        if (netWt < 0) {
                            // alert('Gross Wt. should be greater then tare wt')

                            errmsg = "Gross Wt. should be greater then tare wt.</br>";
                            $.alert(errmsg);
                            return;
                        }



                        $('#txtTareWt').val(tare.toFixed(2));

                        $('#txtReceivedNetWt').val(netWt.toFixed(2));
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






function setDetailsOnSelected(selectedVal) {

    $('#txtULDType').val('');
    $('#txtTareWt').val('');
    $('#txtReceivedNetWt').val('');
    $('#ddlULDSK1').empty();
    $('#ddlEquipmentType').val('0');

    var VCTCode = $('#txtVCTNo').val();
    VCTCode = VCTCode.replace(/\s+/g, '');
    VCTCode = VCTCode.replace("-", "").replace("–", "");

    radioValue = $("input[name='VctNo']:checked").val();

    if (radioValue == "vct") {

        GetAWBDetailsforVCT();


        if (selectedVal == 0) {

            $("#ddlULDNo").attr("disabled", "disabled");
            $("#ddlULD").attr("disabled", "disabled");
            $("#ddlGrossWtUnit").attr("disabled", "disabled");
            $("#txtPackages").attr("disabled", "disabled");
            $("#txtGrossWt").attr("disabled", "disabled");
            $("#ddlAWBNo").removeAttr("disabled", "disabled");
            $("#ddlShipmentNo").removeAttr("disabled", "disabled");
            $("#txtReceivedPackages").removeAttr("disabled", "disabled");
            $("#txtReceivedPackages").val('')
        } else {
            $("#ddlULDNo").removeAttr("disabled", "disabled");
            $("#ddlULD").removeAttr("disabled", "disabled");
            $("#ddlAWBNo").attr("disabled", "disabled");
            $("#ddlShipmentNo").attr("disabled", "disabled");
            $("#ddlGrossWtUnit").attr("disabled", "disabled");
            $("#txtPackages").attr("disabled", "disabled");
            $("#txtGrossWt").attr("disabled", "disabled");
            // $("#txtReceivedPackages").attr("disabled", "disabled");
            $("#txtReceivedPackages").val('1')
        }
    } else {
        GetAWBDetailsforAWB();
        if (selectedVal == 0) {
            $("#ddlULDNo").attr("disabled", "disabled");
            $("#ddlULD").attr("disabled", "disabled");
            $("#ddlGrossWtUnit").attr("disabled", "disabled");
            $("#txtPackages").attr("disabled", "disabled");
            $("#txtGrossWt").attr("disabled", "disabled");
            $("#ddlShipmentNo").removeAttr("disabled", "disabled");
        } else {
            $("#ddlULDNo").removeAttr("disabled", "disabled");
            $("#ddlULD").removeAttr("disabled", "disabled");
            $("#ddlAWBNo").attr("disabled", "disabled");
            // $("#ddlShipmentNo").attr("disabled", "disabled");
            $("#ddlGrossWtUnit").attr("disabled", "disabled");
            $("#txtPackages").attr("disabled", "disabled");
            $("#txtGrossWt").attr("disabled", "disabled");
        }
    }

}


//function clearBeforePopulate() {
//    //$('#txtPackages').val('');
//    //$('#txtGrossWt').val('');
//    $('#shiptxtPackages').val('');
//    $('#shiptxtGrossWt').val('');
//    $('#txtReceivedPackages').val('');
//    $('#txtReceivedGrossWt').val('');
//    newTextBoxDiv = '';
//}




function SaveDetails() {
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var AcceptanceText = $('#ddlAcceptance').find('option:selected').text();
    var AcceptanceType;
    var inputULD = "";
    var istruckSealed = 'false';
    var VCTNo;
    var strAWBNo = $('#ddlAWBNo').find('option:selected').text();
    var strPkgs = $("#txtReceivedPackages").val()
    var strGrossWt = $('#txtReceivedGrossWt').val();
    var strShipmentNo = $('#ddlShipmentNo').find('option:selected').text();
    var strWtUnit = 'KG';
    AcceptanceType = "A";
    if (radioValue == "vct") {
        if (AcceptanceText == "AWB") {


            //if ((document.getElementById('chkSealed').checked = "false") && (document.getElementById('chkNotSealed').checked = "false")) {

            if (strPkgs == "" || strGrossWt == "") {

                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            if (strAWBNo.length != '11') {
                errmsg = "Please enter valid AWB No.";
                $.alert(errmsg);
                return;
            }
            var seqNo = ''
            if ($('#ddlULDNo').find('option:selected').val() != undefined) {
                // $('#ddlULDNo').val('')
                seqNo = $('#ddlULDNo').find('option:selected').val();
            }

            if ($('#txtVCTNo').val() == "0") {

                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            if ($('#ddlEquipmentType').val() == "0") {

                errmsg = "Please select Equipment Type.</br>";
                $.alert(errmsg);
                return;
            }

            if ($('#ddlEquipmentType').val() == "ULT") {
                if ($('#txtULDType').val() == "") {
                    errmsg = "Please enter equipment type.</br>";
                    $.alert(errmsg);
                    return;
                }

            }

            //93312: Equipment type as Skid type and sub type as BULK, then unable to submit  this issue is occurred when Tare weight for the sub type is 0.

            //else {
            //    if ($('#ddlULDSK1').val() == "0") {
            //        errmsg = "Please select equipment sub type.</br>";
            //        $.alert(errmsg);
            //        return;
            //    }
            //}

            if ($('#txtReceivedNetWt').val() == "") {

                errmsg = "Please calculate net wt.</br>";
                $.alert(errmsg);
                return;
            }
            var netwt = parseInt($('#txtReceivedNetWt').val());
            if (netwt < 0) {

                errmsg = "Gross Wt. should be greater then net wt.</br>";
                $.alert(errmsg);
                return;
            }


            var subTypeField = '';
            if ($('#ddlEquipmentType').val() == 'ULT') {
                subTypeField = $('#txtULDType').val();
            } else {
                //subTypeField = $('#ddlULDSK1').val();
                subTypeField = $("#ddlULDSK1 option:selected").text();
            }




            var inputXML = '<ROOT><AWBData AWBNo="' + $('#ddlAWBNo').find('option:selected').val() + '" ShipNo="' + $('#ddlShipmentNo').find('option:selected').val() + '" Pcs="' + $('#txtReceivedPackages').val() + '" Weight="' + $('#txtReceivedGrossWt').val() + '" WtUnit="KG" TareWt="' + $('#txtTareWt').val() + '"  EquiType="' + $('#ddlEquipmentType').val() + '" EquiSubType="' + subTypeField + '" NetWt="' + $('#txtReceivedNetWt').val() + '"/></ROOT>';
            var inputULD = '';
            var dimline = '<ROOT>' + inputRowsforDim + '</ROOT>';
            VCTNo = $('#txtVCTNo').val();
        }
        else if (AcceptanceText == "ULD") {

            if (strPkgs == "" || strGrossWt == "") {

                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            var strAWBNo = $('#ddlAWBNo').find('option:selected').text();
            var strShipmentNo = $('#ddlShipmentNo').find('option:selected').text();
            var strWtUnit = 'KG';
            AcceptanceType = "U";
            var hdnValue = $('#ddlULDNo').val().split('~');


            if ($('#ddlEquipmentType').val() == "0") {

                errmsg = "Please select Equipment Type.</br>";
                $.alert(errmsg);
                return;
            }

            if ($('#ddlEquipmentType').val() == "ULT") {
                if ($('#txtULDType').val() == "") {
                    errmsg = "Please enter equipment type.</br>";
                    $.alert(errmsg);
                    return;
                }
            }

            //93312: Equipment type as Skid type and sub type as BULK, then unable to submit  this issue is occurred when Tare weight for the sub type is 0.

            //else {
            //    if ($('#ddlULDSK1').val() == "0") {
            //        errmsg = "Please select equipment sub type.</br>";
            //        $.alert(errmsg);
            //        return;
            //    }
            //}

            if ($('#txtReceivedNetWt').val() == "") {

                errmsg = "Please calculate net wt.</br>";
                $.alert(errmsg);
                return;
            }

            var netwt = parseInt($('#txtReceivedNetWt').val());
            if (netwt < 0) {

                errmsg = "Gross Wt. should be greater then net wt.</br>";
                $.alert(errmsg);
                return;
            }

            var subTypeField = '';
            if ($('#ddlEquipmentType').val() == 'ULT') {
                subTypeField = $('#txtULDType').val();
            } else {
                // subTypeField = $('#ddlULDSK1').val();
                subTypeField = $("#ddlULDSK1 option:selected").text();
            }

            var inputXML = '<ROOT><AWBData AWBNo="' + hdnValue[1] + '" ShipNo="' + hdnValue[2] + '" Pcs="' + 1 + '" Weight="' + $('#txtReceivedGrossWt').val() + '" WtUnit="KG" TareWt="' + $('#txtTareWt').val() + '"  EquiType="' + $('#ddlEquipmentType').val() + '" EquiSubType="' + subTypeField + '" NetWt="' + $('#txtReceivedNetWt').val() + '"/></ROOT>';
            var inputULD = '<ROOT><ULDData ULDSeqNo="' + hdnValue[0] + '"/></ROOT>';
            var dimline = '<ROOT>' + inputRowsforDim + '</ROOT>';
            VCTNo = $('#txtVCTNo').val();
        }
    } else {

        if (AcceptanceText == "AWB") {
            if (strPkgs == "" || strGrossWt == "") {

                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            var strAWBNo = $('#ddlAWBNo').find('option:selected').text();
            var strPkgs = $("#txtReceivedPackages").val()
            var strGrossWt = $('#txtReceivedGrossWt').val();
            var strShipmentNo = $('#ddlShipmentNo').find('option:selected').text();
            var strWtUnit = 'KG';
            AcceptanceType = "A";
            //if ((document.getElementById('chkSealed').checked = "false") && (document.getElementById('chkNotSealed').checked = "false")) {

            if (strPkgs == "" || strGrossWt == "") {

                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            //if (strAWBNo.length != '11') {
            //    errmsg = "Please enter valid AWB No.";
            //    $.alert(errmsg);
            //    return;
            //}
            //var seqNo = ''
            //if ($('#ddlULDNo').find('option:selected').val() != undefined) {
            //    // $('#ddlULDNo').val('')
            //    seqNo = $('#ddlULDNo').find('option:selected').val();
            //}

            if ($('#ddlEquipmentType').val() == "0") {

                errmsg = "Please select Equipment Type.</br>";
                $.alert(errmsg);
                return;
            }

            if ($('#ddlEquipmentType').val() == "ULT") {
                if ($('#txtULDType').val() == "") {
                    errmsg = "Please enter equipment type.</br>";
                    $.alert(errmsg);
                    $('#txtULDType').focus();
                    return;
                }

            }
            //93312: Equipment type as Skid type and sub type as BULK, then unable to submit  this issue is occurred when Tare weight for the sub type is 0.

            //else {
            //    if ($('#ddlULDSK1').val() == "0") {
            //        errmsg = "Please select equipment sub type.</br>";
            //        $.alert(errmsg);
            //        return;
            //    }
            //}

            if ($('#txtReceivedNetWt').val() == "") {

                errmsg = "Please calculate net wt.</br>";
                $.alert(errmsg);
                return;
            }

            var netwt = parseInt($('#txtReceivedNetWt').val());
            if (netwt < 0) {

                errmsg = "Gross Wt. should be greater then net wt.</br>";
                $.alert(errmsg);
                return;
            }


            var subTypeField = '';
            if ($('#ddlEquipmentType').val() == 'ULT') {
                subTypeField = $('#txtULDType').val();
            } else {
                // subTypeField = $('#ddlULDSK1').val();
                subTypeField = $("#ddlULDSK1 option:selected").text();
            }

            var inputXML = '<ROOT><AWBData AWBNo="' + $('#ddlAWBNo').find('option:selected').val() + '" ShipNo="' + $('#ddlShipmentNo').find('option:selected').val() + '" Pcs="' + $('#txtReceivedPackages').val() + '" Weight="' + $('#txtReceivedGrossWt').val() + '" WtUnit="KG" TareWt="' + $('#txtTareWt').val() + '"  EquiType="' + $('#ddlEquipmentType').val() + '" EquiSubType="' + subTypeField + '" NetWt="' + $('#txtReceivedNetWt').val() + '" /></ROOT>';
            var inputULD = '';
            var dimline = '<ROOT>' + inputRowsforDim + '</ROOT>';
            VCTNo = '';
        }
        else if (AcceptanceText == "ULD") {
            if (strPkgs == "" || strGrossWt == "") {

                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            var strAWBNo = $('#ddlAWBNo').find('option:selected').text();
            var strShipmentNo = $('#ddlShipmentNo').find('option:selected').text();
            var strWtUnit = 'KG';
            AcceptanceType = "U";

            var hdnValue = $('#ddlULDNo').val().split('~');

            var subTypeField = '';
            if ($('#ddlEquipmentType').val() == 'ULT') {
                subTypeField = $('#txtULDType').val();
            } else {
                //  subTypeField = $('#ddlULDSK1').val();
                subTypeField = $("#ddlULDSK1 option:selected").text();
            }

            var inputXML = '<ROOT><AWBData AWBNo="' + hdnValue[1] + '" ShipNo="' + hdnValue[2] + '" Pcs="' + 1 + '" Weight="' + $('#txtReceivedGrossWt').val() + '" WtUnit="KG" TareWt="' + $('#txtTareWt').val() + '"  EquiType="' + $('#ddlEquipmentType').val() + '" EquiSubType="' + subTypeField + '" NetWt="' + $('#txtReceivedNetWt').val() + '"/></ROOT>';
            //TareWt="' + $('#txtTareWt').val() + '"  EquiType="' + $('#ddlEquipmentType').val() + '" EquiSubType="' + subTypeField + '" NetWt="' + $('#txtReceivedNetWt').val() + '"
            var inputULD = '<ROOT><ULDData ULDSeqNo="' + hdnValue[0] + '"/></ROOT>';
            var dimline = '<ROOT>' + inputRowsforDim + '</ROOT>';
            VCTNo = '';
        }
    }

    //if (IsDisableReceivedWt == 'Y') {
    //    $("#txtReceivedGrossWt").attr("disabled", "disabled");
    //} else {
    //    $("#txtReceivedGrossWt").removeAttr("disabled", "disabled");
    //}


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_SaveDetails",
            data: JSON.stringify({
                'AWBXml': inputXML, 'VCTNo': VCTNo, 'ULDxml': inputULD,
                'AcceptanceType': AcceptanceType, 'DimLinexml': dimline, 'AptCity': AirportCity,
                'CompCode': CompanyCode, 'UserID': UserId, 'ShedCode': SHEDCODE
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
                var str = response.d;
                // console.log(response.d);
                if (str != null && str != "" && str != "<NewDataSet />") {
                    var xmlDoc = $.parseXML(str);
                    _xmlDocTable = xmlDoc;
                    $(xmlDoc).find('Table').each(function (index) {
                        Status = $(this).find('Status').text();
                        StrMessage = $(this).find('msg').text();
                        if (Status == 'E') {
                            $("body").mLoading('hide');
                            $.alert(StrMessage);
                            newTextBoxDiv = '';
                        } else if (Status == 'S') {
                            $("body").mLoading('hide');
                            $.alert(StrMessage);
                            $('#txtReceivedPackages').val('');
                            $('#txtReceivedGrossWt').val('');
                            clearAllValuesfromDimention();
                            if (radioValue == "vct") {
                                if (AcceptanceText == "AWB") {

                                    awbClear();

                                    gridXMLforShow = '<Root><AWBNo>' + $('#ddlAWBNo').val() + '</AWBNo><ShipmentNo>' + $('#ddlShipmentNo').val() + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                                    CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                } else {
                                    var hdnValue = $('#ddlULDNo').val().split('~');
                                    gridXMLforShow = '<Root><AWBNo>' + hdnValue[1] + '</AWBNo><ShipmentNo>' + hdnValue[2] + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'
                                    CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                }

                            } else {
                                if (AcceptanceText == "AWB") {
                                    gridXMLforShow = '<Root><AWBNo>' + $('#ddlAWBNo').val() + '</AWBNo><ShipmentNo>' + $('#ddlShipmentNo').val() + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                                    CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                } else {
                                    var hdnValue = $('#ddlULDNo').val().split('~');
                                    gridXMLforShow = '<Root><AWBNo>' + hdnValue[1] + '</AWBNo><ShipmentNo>' + hdnValue[2] + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'
                                    CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                }
                            }



                            $('#txtTareWt').val('');
                            $('#txtULDType').val('');
                            $('#txtReceivedNetWt').val('');


                            $('#ddlULDSK1').empty();
                            var newOption = $('<option></option>');
                            newOption.val('').text('Select');
                            newOption.appendTo('#ddlULDSK1');

                            GetScaleListDetails();


                            newTextBoxDiv = '';
                        } else {
                            $("body").mLoading('hide');
                            $.alert(StrMessage);
                        }

                    });
                } else {
                    $("body").mLoading('hide');
                }

            },
            error: function (msg) {
                HideLoader();
                var r = jQuery.parseJSON(msg.responseText);
                alert("Message: " + r.Message);
            }
        });
        return false;
    }
}


function CargoAcceptance_GetAcceptedList(gridXMLforShow) {

    console.log(gridXMLforShow)

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_GetAcceptedList",
            data: JSON.stringify({
                'InputXML': gridXMLforShow,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                $('#divShowGrid').html('');
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log('Gird data')
                console.log(xmlDoc)

                // var Statustbl2;
                var Status;


                //$(xmlDoc).find('Table2').each(function (index) {
                //    Statustbl2 = $(this).find('Status').text();

                //});

                html = '';
                html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                html += "<thead><tr>";
                html += "<th style='background-color:rgb(208, 225, 244);'>NOP</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>Gr Wt.</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>Tare Wt.</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>Net Wt.</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>User</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>Date & Time</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>Delete</th>";
                html += "</tr></thead>";
                html += "<tbody>";

                $(xmlDoc).find('Table').each(function (index) {

                    Status = $(this).find('Status').text();
                    // Status = $(this).find('Status').text();

                    var RowId;
                    var NOP;
                    var WEIGHT;
                    var USER;
                    var DATETIME;
                    var IsActive;
                    var AWB_PREFIX;
                    var AWB_NUMBER;
                    var CHARGEABLE_WEIGHT;
                    var DN_TOTAL_NPR;
                    var DN_TOT_WGHT_REC_KG;
                    var SHIP_REVD_NPR;
                    var SHIP_REVD_WGHT;



                    RowId = $(this).find('RowId').text();
                    NOP = $(this).find('NOP').text();
                    WEIGHT = $(this).find('WEIGHT').text();
                    USER = $(this).find('USER').text();
                    DATETIME = $(this).find('DATETIME').text();
                    IsActive = $(this).find('IsActive').text();
                    AWB_PREFIX = $(this).find('AWB_PREFIX').text();
                    AWB_NUMBER = $(this).find('AWB_NUMBER').text();

                    CHARGEABLE_WEIGHT = $(this).find('CHARGEABLE_WEIGHT').text();

                    DN_TOTAL_NPR = $(this).find('DN_TOTAL_NPR').text();
                    DN_TOT_WGHT_REC_KG = $(this).find('DN_TOT_WGHT_REC_KG').text();
                    SHIP_REVD_NPR = $(this).find('SHIP_REVD_NPR').text();
                    SHIP_REVD_WGHT = $(this).find('SHIP_REVD_WGHT').text();
                    Tare_x0020_Wt = $(this).find('Tare_x0020_Wt').text();
                    Net_x0020_Wt = $(this).find('Net_x0020_Wt').text();




                    // scalDetailTable(RowId, NOP, WEIGHT, USER, DATETIME);
                    $("#tableShowwithDta").show();
                    html += "<tr>";
                    html += "<td style='padding: 2px;' align='right'>" + NOP + "</td>";
                    html += "<td style='padding: 2px;' align='right'>" + WEIGHT + "</td>";
                    html += "<td style='padding: 2px;' align='right'>" + parseFloat(Tare_x0020_Wt).toFixed(2) + "</td>";
                    html += "<td style='padding: 2px;' align='right'>" + parseFloat(Net_x0020_Wt).toFixed(2) + "</td>";
                    html += "<td align='center'>" + USER + "</td>";
                    html += "<td align='center'>" + DATETIME + "</td>";
                    html += "<td  onclick='delerteRecordFromGrid(" + RowId + ")' align='center'><span class='glyphicon glyphicon-trash'></span></button></td>";

                    html += "</tr>";

                });

                $(xmlDoc).find('Table1').each(function (index) {

                    DN_TOTAL_NPR = $(this).find('DN_TOTAL_NPR').text();
                    DN_TOT_WGHT_REC_KG = $(this).find('DN_TOT_WGHT_REC_KG').text();
                    CHARGEABLE_WEIGHT = $(this).find('CHARGEABLE_WEIGHT').text();
                    SHIP_REVD_NPR = $(this).find('SHIP_REVD_NPR').text();
                    SHIP_REVD_WGHT = $(this).find('SHIP_REVD_WGHT').text();

                    var awbwt = parseFloat(CHARGEABLE_WEIGHT).toFixed(2);

                    var shipwt = parseFloat(SHIP_REVD_WGHT).toFixed(2);

                    $('#DN_TOTAL_NPR').text(DN_TOTAL_NPR);
                    $('#DN_TOT_WGHT_REC_KG').text(DN_TOT_WGHT_REC_KG);
                    $('#CHARGEABLE_WEIGHT').text(awbwt);
                    $('#SHIP_REVD_NPR').text(SHIP_REVD_NPR);
                    $('#SHIP_REVD_WGHT').text(SHIP_REVD_WGHT)


                });

                if (Status == 'E' || Status == undefined) {
                    html = '';
                    $("#spanDiv").hide();
                    $('#divShowGrid').html('');
                } else {
                    html += "</tbody></table>";
                    $('#divShowGrid').append(html);
                    $("#spanDiv").show();
                }


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

function delerteRecordFromGrid(RowId) {
    var result = confirm("Do you Want to delete record?");
    if (result) {
        CargoAcceptance_Delete_AcceptedListRow(RowId)
    }
}


function scalDetailTable(RowId, NOP, WEIGHT, USER, DATETIME) {

    //html += "<tr>";
    //html += "<td style='padding: 2px;' align='right'>" + NOP + "</td>";
    //html += "<td style='padding: 2px;' align='right'>" + WEIGHT + "</td>";
    //html += "<td align='center'>" + USER + "</td>";
    //html += "<td align='center'>" + DATETIME + "</td>";
    //html += "<td  onclick='CargoAcceptance_Delete_AcceptedListRow(" + RowId + ")' align='center'><span class='glyphicon glyphicon-trash'></span></button></td>";

    //html += "</tr>";

}

function CargoAcceptance_Delete_AcceptedListRow(RowId) {
    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";


    inputxml = '<Root><RowId>' + RowId + '</RowId><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_Delete_AcceptedListRow",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("body").mLoading('hide');
                var str = response.d;
                // console.log(response.d);
                if (str != null && str != "" && str != "<NewDataSet />") {
                    var xmlDoc = $.parseXML(str);
                    _xmlDocTable = xmlDoc;
                    $(xmlDoc).find('Table').each(function (index) {
                        Status = $(this).find('Status').text();
                        StrMessage = $(this).find('msg').text();
                        if (Status == 'E') {
                            $("body").mLoading('hide');
                            $.alert(StrMessage);
                        } else if (Status == 'S') {
                            var AcceptanceText = $('#ddlAcceptance').find('option:selected').text();
                            if (radioValue == "vct") {
                                if (AcceptanceText == "AWB") {

                                    gridXMLforShow = '<Root><AWBNo>' + $('#ddlAWBNo').val() + '</AWBNo><ShipmentNo>' + $('#ddlShipmentNo').val() + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                                    CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                } else {
                                    var hdnValue = $('#ddlULDNo').val().split('~');
                                    gridXMLforShow = '<Root><AWBNo>' + hdnValue[1] + '</AWBNo><ShipmentNo>' + hdnValue[2] + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'
                                    CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                }

                            } else {
                                if (AcceptanceText == "AWB") {
                                    gridXMLforShow = '<Root><AWBNo>' + $('#ddlAWBNo').val() + '</AWBNo><ShipmentNo>' + $('#ddlShipmentNo').val() + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'

                                    CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                } else {
                                    var hdnValue = $('#ddlULDNo').val().split('~');
                                    gridXMLforShow = '<Root><AWBNo>' + hdnValue[1] + '</AWBNo><ShipmentNo>' + hdnValue[2] + '</ShipmentNo><AirportCity>' + AirportCity + '</AirportCity></Root>'
                                    CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                }
                            }

                            $('#txtTareWt').val('');
                            $('#txtULDType').val('');
                            $('#txtReceivedNetWt').val('');


                            $('#ddlULDSK1').empty();
                            var newOption = $('<option></option>');
                            newOption.val('').text('Select');
                            newOption.appendTo('#ddlULDSK1');

                            GetScaleListDetails();

                            $("body").mLoading('hide');
                            $.alert(StrMessage);
                        } else {
                            $("body").mLoading('hide');
                            $.alert(StrMessage);
                        }

                    });
                }
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




function OpenDimensions() {

    //if ($('#txtVCTNo').val() == '') {
    //    $.alert('Please enter AWB No./VCT No.');
    //    return;
    //}
    if ($('#ddlAcceptance').val() == 1) {
        $("#addButton").attr("disabled", "disabled");
        // $("#Pieces1").attr("disabled", "disabled");
        $("#Pieces1").val('1');
    } else {
        $("#addButton").removeAttr("disabled", "disabled");
        //  $("#Pieces1").removeAttr("disabled", "disabled");
        //$("#Pieces1").val('');
    }

    //var dimentiontable = document.getElementById('dimentiontable');
    //dimentiontable = "";
    modal.style.display = "block";
}

function exitModal() {
    //$('#Pieces1').val('').css("background-color", "white");
    //$('#ddlUOM1').val('CM');
    //$('#Length1').val('').css("background-color", "white");
    //$('#Width1').val('').css("background-color", "white");
    //$('#Volume1').val('').css("background-color", "white");
    //$('#Height1').val('').css("background-color", "white");

    //if (newTextBoxDiv != '') {
    //    newTextBoxDiv.html('');
    //}
    modal.style.display = "none";
}

//function clearALL() {
//    $('#txtIGMNo').val('');
//    $('#txtIGMYear').val('');
//    $('#txtFlightPrefix').val('');
//    $('#txtFlightNo').val('');
//    $('#txtFlightDate').val('');
//    $('#txtTotCnts').val('');
//    $('#txtManiPieces').val('');
//    $('#txtReceivePieces').val('');
//    $('#txtManiGrWt').val('');
//    $('#txtReceiveGrWt').val('');
//    $('#txtShortPieces').val('');
//    $('#txtExcessPieces').val('');
//    $('#txtDamagePieces').val('');
//    $('#txtRemarks').val('');
//}

function awbClear() {
    //$('#shiptxtPackages').val('');
    //$('#shiptxtGrossWt').val('');
    $('#txtReceivedPackages').val('');
    $('#txtReceivedGrossWt').val('');
    //newTextBoxDiv.html('');
    $("#spanDiv").hide();
    $('#divShowGrid').html('');
}

function clearALLControlsonOnchangeVCT() {


    $('#txtPackages').val('');
    $('#txtGrossWt').val('');
    // $('#txtVCTNo').val('');


    $('#shiptxtPackages').val('');
    $('#shiptxtGrossWt').val('');
    $('#txtReceivedPackages').val('');
    $('#txtReceivedGrossWt').val('');
    // newTextBoxDiv.html('');
    removeRow();
    $('#DN_TOTAL_NPR').text('');
    $('#DN_TOT_WGHT_REC_KG').text('');
    $('#CHARGEABLE_WEIGHT').text('');
    $('#SHIP_REVD_NPR').text('');
    $('#SHIP_REVD_WGHT').text('')

    $('#divShowGrid').html('');

    $('#ddlULDNo').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlULDNo');

    $('#ddlAWBNo').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlAWBNo');

    $('#ddlShipmentNo').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlShipmentNo');

    $('#Pieces1').val('').css("background-color", "white");
    $('#ddlUOM1').val('CMT');
    $('#Length1').val('').css("background-color", "white");
    $('#Width1').val('').css("background-color", "white");
    $('#Volume1').val('').css("background-color", "white");
    $('#Height1').val('').css("background-color", "white");



    //$('#spanDiv').empty();
    //$('#tableShowwithDta').hide();

}

function clearALLControlsonButton() {


    $('#txtPackages').val('');
    $('#txtGrossWt').val('');
    $('#txtVCTNo').val('');


    $('#shiptxtPackages').val('');
    $('#shiptxtGrossWt').val('');
    $('#txtReceivedPackages').val('');
    $('#txtReceivedGrossWt').val('');
    // newTextBoxDiv.html('');
    removeRow();
    $('#DN_TOTAL_NPR').text('');
    $('#DN_TOT_WGHT_REC_KG').text('');
    $('#CHARGEABLE_WEIGHT').text('');
    $('#SHIP_REVD_NPR').text('');
    $('#SHIP_REVD_WGHT').text('')

    $('#divShowGrid').html('');

    $('#ddlULDNo').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlULDNo');

    $('#ddlAWBNo').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlAWBNo');

    $('#ddlShipmentNo').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlShipmentNo');

    $('#Pieces1').val('').css("background-color", "white");
    $('#ddlUOM1').val('CMT');
    $('#Length1').val('').css("background-color", "white");
    $('#Width1').val('').css("background-color", "white");
    $('#Volume1').val('').css("background-color", "white");
    $('#Height1').val('').css("background-color", "white");


    $('#txtChargeableWt').val('');

    //  $('#ddlEquipmentType').val('0');
    // $('#ddlULDSK1').val('0');


    $('#ddlULDSK1').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlULDSK1');

    $('#txtTareWt').val('');
    $('#txtULDType').val('');
    $('#txtReceivedNetWt').val('');

    $('#spanDiv').hide();
    $('#tableShowwithDta').hide();

}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}

function VehicleNumberValidation() {

    var patternVN = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$");
    var patternVN1 = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$");
    if (!patternVN1.test(this.objVT.vehicleNo))
        if (!patternVN.test(this.objVT.vehicleNo)) {
            this.objVT.vehicleNo = '';
            this.global.showAlert("Please enter valid format in Vehicle Number viz MH04BY3668 OR MH04Y3668.");
            return false;
        }

}


