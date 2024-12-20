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
var newTextBoxDiv = "";
var inputRowsforDim = "";
var radioValue;
var gridXMLforShow;
var DeviceMacAdd;
var UMOUnit = "CMT";
var agentCode = [];
var selectedAgentCode;
var venderIDSelected;
var passCustomerID;
var _XmlForSHCCode = ',';
var joinAllValuesWithComma = '';
var commodiyCode = [];
var AllSHCFinalSave;

$(function () {


    $("input").keyup(function () {
        var string = $(this).val();
        // var string = $('#txtOrigin').val();
        if (string.match(/[`!₹£•√Π÷×§∆€¥¢©®™✓π@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/)) {
            /*$('#txtOrigin').val('');*/
            $(this).val('');
            return true;    // Contains at least one special character or space
        } else {
            return false;
        }

    });

    $("#acceptedListTable").hide();
    CargoAcceptance_GetAgent();

    $("#ddlShipmentNo").on("change", function () {
        var selectedValue = $(this).val();
        HHT_ExpGet_CargoAcceptance_Ship_AWBDetails(selectedValue);
        // You can perform other actions with the selected value here
    });

    SetTodayDate();
    $("#VctNo input[type=radio]").change(function () {
        // alert($(this).val())
    });

    EnableDimensions();

    //a = 2286.99;
    //b = 180.26;
    //c = a - b;
    //alert(c)
    selectedRowHAWBNo = amplify.store("selectedRowHAWBNo");
    //$("input[@name='VctNo']").change(function () {
    //    clearALLControlsonButton();
    //});

    $("#chkVctNo").click(function () {
        var checked = $(this).attr("checked", true);
        if (checked) {
            clearALLControlsonButton();
        }
    });

    $("#chkAwbNo").click(function () {
        var checked = $(this).attr("checked", true);
        if (checked) {
            clearALLControlsonButton();
        }
    });

    $("#ddlUOM1").change(function () {
        UMOUnit = this.value;
        calculateAllRows();
    });

    //$("#ddlUOM1").trigger('change')

    $("#ddlscaleName").change(function () {
        _Value = $("option:selected", this).val();

        DeviceMacAdd = _Value.split(",")[0];
        venderIDSelected = _Value.split(",")[1];
    });

    $("#ddlEquipmentType").change(function () {
        $("#txtULDType").val("");
        $("#txtTareWt").val("");
        $("#txtReceivedNetWt").val("");

        _Value = $("option:selected", this).val();
        $("#txtULDType").val("");
        if (_Value != "0") {
            if (_Value == "ULT") {
                $("#txtULDType").show();
                $("#ddlULDSK1").hide();
                $("#txtTareWt").val("");
            } else {
                $("#txtULDType").hide();
                $("#ddlULDSK1").show();
                HHT_CargoAcceptance_Equipment_SubTypeList(_Value);
            }
        }
        //  EquipmentType = _Value.split(",")[0];
        // venderIDSelected = _Value.split(",")[1];
    });

    $("#ddlULDSK1").change(function () {
        _Value = $("option:selected", this).val();

        $("#txtTareWt").val(_Value);

        $("#txtULDType").val("");

        //  $('#txtTareWt').focus();

        var receWt = parseFloat($("#txtReceivedGrossWt").val());
        var tare = parseFloat(_Value);

        var netWt = receWt - tare;

        if (netWt < 0) {
            // alert('Gross Wt. should be greater then tare wt')

            errmsg = "Gross Wt. should be greater then tare wt.</br>";
            $.alert(errmsg);
            return;
        }

        $("#txtReceivedNetWt").val(netWt);
    });

    //$('#ddlUOM1').val('CMT');

    $("#btnSave").attr("disabled", "disabled");

    var $input;
    var formElements = new Array();
    $("#addButton").click(function () {
        var firstTextBox = parseInt($("#Pieces1").val());
        $("#TextBoxesGroup")
            .find("input")
            .each(function (i, input) {
                $input = $(input);
                $input.css("background-color", $input.val() ? "#fff" : "#FFB6C1");
                formElements.push($input.val());
            });
        if ($input.val() == "") {
            $input.css("background-color", $input.val() ? "#fff" : "#FFB6C1");
            return;
        } else {
            dynamicTrCreate();
        }
    });

    GetScaleListDetails();

    $("#spanDiv").hide();
    $("#divULDNo").hide();
    $("#drULD").hide();
    $("#ddlULDNo").val("");

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

    //var stringos = "ECC~N,PER~N,GEN~N,DGR~Y,HEA~N,AVI~N,BUP~Y,EAW~N,EAP~Y";

    //SHCSpanHtml(stringos);

    $("#btnOpenSHCModal").click(function () {
        $("#spnValdatemsg").text('');
        SHCCodePopupField();

    });

    $('#txtAWBNo').on('input', function () {
        if ($('#txtAWBNo').val().length == 0) {
            clearAll();
        }
    });

});




function onChangeComm(commID) {

    passCustomerID = commID;
}

//function SHCSpanHtml(newSHC) {
//    var spanStr = "<tr class=''>";
//    var newSpanSHC = newSHC.split(",");
//    var filtered = newSpanSHC.filter(function (el) {
//        return el != "";
//    });

//    for (var n = 0; n < filtered.length; n++) {
//        var blink = filtered[n].split("~");

//        if (filtered[n].indexOf("~") > -1) {
//            if (blink[1] == "Y" && filtered[n] != "~Y") {
//                spanStr += "<td class='blink_me clsSave'>" + blink[0] + "</td>";
//                console.log(filtered[n]);
//            }
//        }

//        if (filtered[n].indexOf("~") > -1) {
//            if (blink[1] == "N" && filtered[n] != "~N") {
//                spanStr += "<td class='foo clsSave'>" + blink[0] + "</td>";
//                console.log(filtered[n]);
//            }
//        }
//    }
//    spanStr += "</tr>";

//    $("#SHCCodeGrid").html(spanStr);
//    return spanStr;
//}

function fetchTareWt(value) {
    if ($("#ddlEquipmentType").val() == "0") {
        $.alert("Please select equipment type. ");
        $("#txtTareWt").val("");
        return;
    }

    HHT_CargoAcceptance_Equipment_SubTypeList(value);
}

function calculateNetWtIFGrWtChange(wt) {
    if ($("#txtTareWt").val() != "") {
        var receWt = parseFloat(wt);
        var tare = parseFloat($("#txtTareWt").val());

        var netWt = receWt - tare;

        if (netWt < 0) {
            // alert('Gross Wt. should be greater then tare wt')

            errmsg = "Gross Wt. should be greater then tare wt.</br>";
            $.alert(errmsg);
            return;
        }

        $("#txtReceivedNetWt").val(netWt.toFixed(2));
    }
}

function calculateNEtWt(tareWt) {
    var receWt = parseFloat($("#txtReceivedGrossWt").val());
    var tare = parseFloat(tareWt);

    if (receWt < tare) {
        $.alert("Gross Wt. should be greater then net wt. ");
        $("#txtTareWt").val("");
        return;
    } else {
        var netWt = receWt - tare;
        $("#txtReceivedNetWt").val(netWt.toFixed(2));
    }
}

function setEnglish() {
    $("#lblUnitization").text("Unitization");
}

function removeRow(counter) {
    //if (counter == 1) {
    //    // alert("No more textbox to remove");
    //    return false;
    //}

    $("#TextBoxDiv" + counter).remove();
    inputRowsforDim = "";

    counter--;
}

function setGerman() {
    $("#lblVCTNo").text("VCT Nr.");
    $("#lblAcceptance").text("VCT Annahme");
    $("#lblULDNo").text("ULD Nr.");
    $("#lblAwbNo").text("AWB Nr.");
    $("#lblShipmentNo").text("Sendungs Nr.");
    $("#lblPackages").text("Stückzahl");
    $("#lblGrWt").text("Brutto Gewicht");
    $("#lblLocation").text("Stellplatz");
    $("#lblTruckSealed").text("LKW Versiegelt");
    $("#lblTruckNotSealed").text("LKW nicht Versiegelt");
    $("#btnModify").val("Senden");
}

function setRussian() {
    $("#lblVCTNo").text("VCT No");
    $("#lblAcceptance").text("приём VCT");
    $("#lblULDNo").text("номер ULD");
    $("#lblAwbNo").text("номер авианакладной");
    $("#lblShipmentNo").text("номер партии");
    $("#lblPackages").text("количество");
    $("#lblGrWt").text("вес брутто");
    $("#lblLocation").text("добавить место");
    //$('#lblTruckSealed').text("");
    //$('#lblTruckNotSealed').text("");
    $("#btnModify").val("отправить");
}

function setTurkish() {
    $("#lblVCTNo").text("VCT No");
    $("#lblAcceptance").text("VCT kabul");
    $("#lblULDNo").text("ULD No.");
    $("#lblAwbNo").text("AWB No.");
    $("#lblShipmentNo").text("gösteri Nr.");
    $("#lblPackages").text("Paket Sayisi");
    $("#lblGrWt").text("brüt ağırlık");
    $("#lblLocation").text("yer");
    //$('#lblTruckSealed').text("");
    //$('#lblTruckNotSealed').text("");
    $("#btnExcLanded").val("çikiş");
    $("#btnModify").val("göndermek");
}

function MovetoNext(current, nextFieldID) {
    if (current.value.length >= current.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}

function clearAllValuesfromDimention() {
    var $input;

    $("#TextBoxesGroup")
        .find("input")
        .each(function (i, input) {
            $(this).val("");
        });

    var dimentiontable = document.getElementById("dimentiontable");

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
    $("#txtULDType").val("");
    $("#txtTareWt").val("");
    $("#txtReceivedNetWt").val("");
    $("#ddlULDSK1").empty();
    $("#ddlEquipmentType").val("0");

    if ($("#txtVCTNo").val() == "") {
        return;
    }

    var VCTCode = $("#txtVCTNo").val();
    VCTCode = VCTCode.replace(/\s+/g, "");
    VCTCode = VCTCode.replace("-", "").replace("–", "");

    radioValue = $("input[name='VctNo']:checked").val();
    if (radioValue == undefined) {
        if ($("#txtVCTNo").val() == "") {
            $.alert("Please choose one option before search.");
            $("#txtVCTNo").val("");
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
    if ($("#ddlscaleName").val() == "0") {
        $.alert("Please select Weighing Scale.");
        return;
    }
    // alert('MAC Address detect  =  ' + DeviceMacAdd);

    // setTimeout(function () { alert("Hello"); }, 3000);

    bluetoothSerial.disconnect();

    //  try {
    // alert('before connect');
    //  bluetoothSerial.connect(DeviceMacAdd, onconnect);
    $("body").mLoading({
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
};

connectFailure = function () {
    alert("Connection fail, try again.");
};

connectSuccess = function () {
    $("body").mLoading("hide");
    alert("Device connected.");

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

        if (venderIDSelected == "A") {
            bluetoothSerial.read(function (data) {
                var dataforshow = data.split("kg");
                //  alert(dataforshow);
                // alert('in first block');
                //  alert(JSON.stringify(data))
                //var lastWtRec = dataforshow[dataforshow.length - 1];
                // alert(dataforshow[dataforshow.length - 2]);

                var finalWt = dataforshow[dataforshow.length - 2].split(" ");
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
                    document.getElementById("txtReceivedGrossWt").value = finalWt[1];
                } else if (finalWt[2] != "") {
                    document.getElementById("txtReceivedGrossWt").value = finalWt[2];
                } else if (finalWt[3] != "") {
                    document.getElementById("txtReceivedGrossWt").value = finalWt[3];
                } else if (finalWt[4] != "") {
                    document.getElementById("txtReceivedGrossWt").value = finalWt[4];
                } else if (finalWt[5] != "") {
                    document.getElementById("txtReceivedGrossWt").value = finalWt[5];
                }

                //  alert('textbox value ==> ' + $('#txtReceivedGrossWt').val());

                // $('#txtData').val(data);
            });
        } else if (venderIDSelected == "B") {
            bluetoothSerial.read(function (data) {
                var dataforshowNewString = data.split(",");
                // alert(dataforshowNewString);
                //  alert(JSON.stringify(data))
                // alert('in second block')
                //var lastWtRec = dataforshowNewString[dataforshowNewString.length - 1];
                // alert(dataforshowNewString[dataforshowNewString.length - 2]);

                var finalWtNewString =
                    dataforshowNewString[dataforshowNewString.length - 2].split(" ");
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
                    document.getElementById("txtReceivedGrossWt").value =
                        finalWtNewString[0];
                } else if (finalWtNewString[1] != "") {
                    document.getElementById("txtReceivedGrossWt").value =
                        finalWtNewString[1];
                } else if (finalWtNewString[2] != "") {
                    document.getElementById("txtReceivedGrossWt").value =
                        finalWtNewString[2];
                } else if (finalWtNewString[3] != "") {
                    document.getElementById("txtReceivedGrossWt").value =
                        finalWtNewString[3];
                } else if (finalWtNewString[4] != "") {
                    document.getElementById("txtReceivedGrossWt").value =
                        finalWtNewString[4];
                } else if (finalWtNewString[5] != "") {
                    document.getElementById("txtReceivedGrossWt").value =
                        finalWtNewString[5];
                } else if (finalWtNewString[6] != "") {
                    document.getElementById("txtReceivedGrossWt").value =
                        finalWtNewString[6];
                } else if (finalWtNewString[7] != "") {
                    document.getElementById("txtReceivedGrossWt").value =
                        finalWtNewString[7];
                }

                // $('#txtData').val(data);
            });
        } else if (venderIDSelected == "S2") {
            bluetoothSerial.read(function (data) {
                // Code for Avert Tronix. / BWS Indicator.
                var dataSplit = data.split(" ");

                var fnReadingS2 = dataSplit[dataSplit.length - 1];

                document.getElementById("txtReceivedGrossWt").value =
                    parseFloat(fnReadingS2);
            });
        } else if (venderIDSelected == "S1") {
            bluetoothSerial.read(function (data) {
                // Code for Baykon / Flintec Indcators.
                var dataforshowNewString = data.split(" ");

                var fnReadingS1 = dataforshowNewString[dataforshowNewString.length - 6];

                document.getElementById("txtReceivedGrossWt").value = fnReadingS1;
            });
        }
    } catch (e) {
        alert("Error while Reading, please try again.");
    }
};

function dynamicTrCreate() {
    newTextBoxDiv = $(document.createElement("tr")).attr(
        "id",
        "TextBoxDiv" + counter
    );

    newTextBoxDiv.after().html(
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" onchange="calculateAllRows();"  name="textpackges' +
        parseInt(counter + 1) +
        '" id="Pieces' +
        parseInt(counter + 1) +
        '" type="text" /></td>' +
        //'<td><select name="textpackges' + parseInt(counter + 1) + '" id="ddlUOM' + parseInt(counter + 1) + '"><option value="CMT">CM</option><option value="INH">IN</option></select></td>' +
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" onchange="calculateAllRows();" name="textpackges' +
        parseInt(counter + 1) +
        '" id="Length' +
        parseInt(counter + 1) +
        '"  type="text" /></td>' +
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" onchange="calculateAllRows();" name="textpackges' +
        parseInt(counter + 1) +
        '" id="Width' +
        parseInt(counter + 1) +
        '"  type="text" /></td>' +
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" onchange="calculateAllRows();" name="textpackges' +
        parseInt(counter + 1) +
        '" id="Height' +
        parseInt(counter + 1) +
        '"  type="text" /></td>' +
        '<td><input onkeyup="NumberOnly(event);" class="textpackges text-right" name="textpackges' +
        parseInt(counter + 1) +
        '" disabled id="Volume' +
        parseInt(counter + 1) +
        '"  type="text" /></td>' +
        '<td><button onclick="removeRow(' +
        parseInt(counter) +
        ');" type="button" id="btnAdd"  class="btn"><span class="glyphicon glyphicon-minus"></span></button></td>'
    );

    newTextBoxDiv.appendTo("#TextBoxesGroup");
    counter++;
}

function calculateAllRows() {
    var dimentiontable = document.getElementById("dimentiontable");
    for (var rowid = 1; rowid < dimentiontable.rows.length; rowid++) {
        var pieces = dimentiontable.rows[rowid].children[0].children[0].value;

        var Length = dimentiontable.rows[rowid].children[1].children[0].value;
        var width = dimentiontable.rows[rowid].children[2].children[0].value;

        var height = dimentiontable.rows[rowid].children[3].children[0].value;

        if (
            parseFloat(pieces) != NaN &&
            parseFloat(height) != NaN &&
            parseFloat(Length) != NaN &&
            parseFloat(width) != NaN
        ) {
            if (UMOUnit == "CMT") {
                var Volume = (Length * width * height * pieces) / 1000000;
            } else {
                var Volume = (Length * width * height * pieces) / 61012.81269;
            }
        } else {
            var Volume = 0;
        }

        dimentiontable.rows[rowid].children[4].children[0].value =
            parseFloat(Volume).toFixed(2);
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
    inputRowsforDim = "";
    var dimentiontable = document.getElementById("dimentiontable");
    for (var rowid = 1; rowid < dimentiontable.rows.length; rowid++) {
        var pieces = dimentiontable.rows[rowid].children[0].children[0].value;
        var Length = dimentiontable.rows[rowid].children[1].children[0].value;
        var width = dimentiontable.rows[rowid].children[2].children[0].value;

        var height = dimentiontable.rows[rowid].children[3].children[0].value;

        if (pieces == NaN || pieces == "0" || pieces == "") {
            //errmsg = "NoP should not blank or 0.</br>";
            //$.alert(errmsg);
            alert("Please enter valid NoP.");
            return;
        } else if (Length == NaN || Length == "0" || Length == "") {
            //errmsg = "Length should not blank or 0.</br>";
            //$.alert(errmsg);
            alert("Please enter valid Length.");
            return;
        } else if (height == NaN || height == "0" || height == "") {
            //errmsg = "Height should not blank or 0.</br>";
            //$.alert(errmsg);
            alert("Please enter valid Height.");
            return;
        } else if (width == NaN || width == "0" || width == "") {
            //errmsg = "Width should not blank or 0.</br>";
            //$.alert(errmsg);
            alert("Please enter valid Width.");
            return;
        }

        if (UMOUnit == "CMT") {
            var Volume = (Length * width * height * pieces) / 1000000;
        } else {
            var Volume = (Length * width * height * pieces) / 61012.81269;
        }

        var Volume = parseFloat(Volume).toFixed(2);
        dimentiontable.rows[rowid].children[4].children[0].value = Volume;
        inputRowsforDim +=
            '<DIMData SeqNo="0" Length="' +
            Length +
            '" Width="' +
            width +
            '" Height="' +
            height +
            '" Pieces="' +
            pieces +
            '" Vol="' +
            Volume +
            '" VolCode="' +
            UMOUnit +
            '" />';
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

    var connectionStatus = navigator.onLine ? "online" : "offline";
    if ($("#txtVCTNo").val() == "") {
        return;
    }
    var errmsg = "";
    var VCTNo = $("#txtVCTNo").val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    // inputxml = '<Root><VCTNo>' + VCTNo + '</VCTNo><CompanyCode>3</CompanyCode><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml =
        "<Root><DockNo>" +
        VCTNo +
        "</DockNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    //clearALLControls();
    $("#ddlULDNo").empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_VCTSearch",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                console.log("get VCT list");
                console.log(xmlDoc);
                var ULDId = "";
                var ULD = "";
                var AWB = "";
                var UldAccRel;

                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        Status = $(this).find("Status").text();
                        msg = $(this).find("msg").text();

                        if (Status == "E") {
                            errmsg = msg;
                            $.alert(errmsg);
                            return;
                        }

                        ULDId = $(this).find("ULDSeqNo").text();
                        ULD = $(this).find("ULDNo").text();

                        if (index == 0) {
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlULDNo");
                        }

                        var newOption = $("<option></option>");
                        newOption.val(ULDId).text(ULD);
                        newOption.appendTo("#ddlULDNo");

                        $("#ddlULDNo option")
                            .filter(function () {
                                return (
                                    $(this).val().trim() == "" && $(this).text().trim() == ""
                                );
                            })
                            .remove();

                        var a = new Array();
                        $("#ddlULDNo")
                            .children("option")
                            .each(function (x) {
                                test = false;
                                b = a[x] = $(this).text();
                                for (i = 0; i < a.length - 1; i++) {
                                    if (b == a[i]) test = true;
                                }
                                if (test) $(this).remove();
                            });

                        if (index == 0) {
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlAWBNo");
                        }

                        if (index == 0) {
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlShipmentNo");
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

                        $("#ddlAcceptance").val("1");
                    });

                $(xmlDoc)
                    .find("Table1")
                    .each(function (index) {
                        IsDisableReceivedWt = $(this).find("IsDisableReceivedWt").text();

                        if (IsDisableReceivedWt == "Y") {
                            $("#txtReceivedGrossWt").attr("disabled", "disabled");
                        } else {
                            $("#txtReceivedGrossWt").removeAttr("disabled", "disabled");
                        }
                    });

                setDetailsOnSelected("1");
                $(xmlDoc)
                    .find("Table1")
                    .each(function (index) {
                        AWBId = $(this).find("AWBNo").text();
                        AWB = $(this).find("AWBNo").text();

                        var newOption = $("<option></option>");
                        newOption.val(AWBId).text(AWB);
                        newOption.appendTo("#ddlAWBNo");

                        if (ULDId == "" && ULD == "") {
                            $("#ddlAcceptance").val("0");
                            $("#lblAcceptance").text("Acceptance");
                        }
                    });

                $(xmlDoc)
                    .find("Table2")
                    .each(function (index) {
                        ULD_MODE = $(this).find("ULD_MODE").text();
                        UldAccRel = $(this).find("UldAccRel").text();

                        //if (ULD_MODE>0)
                        //{
                        //    //$('#ddlAcceptance').find('option:selected').val(1);
                        //    $('#ddlAcceptance').val("1");
                        //}
                        if (ULDId == "" && AWB == "") {
                            $("#ddlAcceptance").val("1");
                        }

                        if (ULDId == "") {
                            $("#drULD").hide();
                            $("#ddlULD").empty();
                        } else if (ULDId != "" && UldAccRel == "A") {
                            $("#drULD").show();
                            $("#ddlULD").empty();

                            var newOption = $("<option></option>");
                            newOption.val("").text("Select");
                            newOption.appendTo("#ddlULD");
                        } else {
                            $("#drULD").hide();
                            $("#ddlULD").empty();
                        }

                        if (AWB != "") {
                            $("#drRadiobtn").show();
                        } else {
                            $("#drRadiobtn").hide();
                        }

                        if (UldAccRel == "A") {
                            $("#lblAcceptance").text("Acceptance");
                        } else if (UldAccRel == "R") {
                            //$('#ddlAcceptance').val("0");
                            $("#lblAcceptance").text("Release");
                        }

                        //var newOption = $('<option></option>');
                        //newOption.val(ULDId).text(ULD);
                        //newOption.appendTo('#ddlULDNo');
                        if (ULD_MODE > 0 && $("#ddlAcceptance").val() == "1") {
                            $("#divULDNo").show();
                            $("#divUldDrp").hide();
                        } else {
                            $("#divULDNo").hide();
                            $("#divUldDrp").show();
                        }

                        if ($("#ddlAcceptance").val() == "1") {
                            $("#ddlAWBNo").attr("disabled", "disabled");
                            $("#ddlShipmentNo").attr("disabled", "disabled");
                            $("#ddlGrossWtUnit").attr("disabled", "disabled");
                            $("#txtPackages").attr("disabled", "disabled");
                            $("#txtGrossWt").attr("disabled", "disabled");
                        } else {
                            $("#ddlAWBNo").removeAttr("disabled", "disabled");
                            $("#ddlShipmentNo").removeAttr("disabled", "disabled");
                            $("#ddlGrossWtUnit").removeAttr("disabled", "disabled");
                            $("#txtPackages").removeAttr("disabled", "disabled");
                            $("#txtGrossWt").removeAttr("disabled", "disabled");
                        }

                        if (UldAccRel == "R" && $("#ddlAcceptance").val() == "1") {
                            $("#txtLocation").attr("disabled", "disabled");
                            $("#chkSealed").attr("disabled", "disabled");
                            $("#chkNotSealed").attr("disabled", "disabled");
                        } else {
                            $("#txtLocation").removeAttr("disabled", "disabled");
                            $("#chkSealed").removeAttr("disabled", "disabled");
                            $("#chkNotSealed").removeAttr("disabled", "disabled");
                        }
                    });

                if (ULD_MODE == 0) {
                    $(xmlDoc)
                        .find("Table3")
                        .each(function (index) {
                            var ULDValue = "";
                            var ULDText = "";

                            ULDText = $(this).find("Text").text();
                            ULDValue = $(this).find("Value").text();

                            var newOption = $("<option></option>");
                            newOption.val(ULDValue).text(ULDText);
                            newOption.appendTo("#ddlULD");
                        });
                }
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}
function GetULDDetailsforAWB() {
    var inputxml = "";

    var connectionStatus = navigator.onLine ? "online" : "offline";

    var errmsg = "";
    var VCTNo = $("#txtVCTNo").val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    // inputxml = '<Root><VCTNo>' + VCTNo + '</VCTNo><CompanyCode>3</CompanyCode><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml =
        "<Root><AWBNo>" +
        VCTNo +
        "</AWBNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    // clearALLControls();
    $("#ddlULDNo").empty();
    $("#ddlShipmentNo").empty();
    $("#ddlAWBNo").empty();
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_AWBSearch",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log("by AWB No");
                console.log(xmlDoc);
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

                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        Status = $(this).find("Status").text();
                        msg = $(this).find("msg").text();

                        if (Status == "E") {
                            errmsg = msg;
                            $.alert(errmsg);
                            return;
                        }

                        ShpmentId = $(this).find("SHIPMENT_NUMBER").text();
                        ShpmentNo = $(this).find("SHIPMENT_NUMBER").text();
                        AWBNo = $(this).find("AWBNo").text();

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
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlShipmentNo");
                        }

                        var newOptionAWBNo = $("<option></option>");
                        newOptionAWBNo.val($("#txtVCTNo").val()).text($("#txtVCTNo").val());
                        newOptionAWBNo.appendTo("#ddlAWBNo");

                        $("#ddlAWBNo option")
                            .filter(function () {
                                return (
                                    $(this).val().trim() == "" && $(this).text().trim() == ""
                                );
                            })
                            .remove();

                        var a = new Array();
                        $("#ddlAWBNo")
                            .children("option")
                            .each(function (x) {
                                test = false;
                                b = a[x] = $(this).text();
                                for (i = 0; i < a.length - 1; i++) {
                                    if (b == a[i]) test = true;
                                }
                                if (test) $(this).remove();
                            });

                        var newOption = $("<option></option>");
                        newOption.val(ShpmentId).text(ShpmentNo);
                        newOption.appendTo("#ddlShipmentNo");

                        $("#ddlShipmentNo option")
                            .filter(function () {
                                return (
                                    $(this).val().trim() == "" && $(this).text().trim() == ""
                                );
                            })
                            .remove();

                        var a = new Array();
                        $("#ddlShipmentNo")
                            .children("option")
                            .each(function (x) {
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

                $(xmlDoc)
                    .find("Table1")
                    .each(function (index) {
                        IsDisableReceivedWt = $(this).find("IsDisableReceivedWt").text();

                        if (IsDisableReceivedWt == "Y") {
                            $("#txtReceivedGrossWt").attr("disabled", "disabled");
                        } else {
                            $("#txtReceivedGrossWt").removeAttr("disabled", "disabled");
                        }
                    });
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}
function GetAWBDetailsforVCT() {
    var inputxml = "";

    var connectionStatus = navigator.onLine ? "online" : "offline";

    var errmsg = "";
    var VCTNo = $("#txtVCTNo").val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml =
        "<Root><DockNo>" +
        VCTNo +
        "</DockNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";
    $("#ddlAWBNo").empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_VCTAWBSearch",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                var AWB;
                var SHIPMENT_NUMBER;
                console.log("awb and ship");
                console.log(xmlDoc);
                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        rbtVal = $("input[name='VctNo']:checked").val();
                        if (rbtVal == "vct") {
                            if (index == 0) {
                                var newOption = $("<option></option>");
                                newOption.val("0").text("Select");
                                newOption.appendTo("#ddlAWBNo");
                            }
                        }

                        if (index == 0) {
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlShipmentNo");
                        }
                        var ULDId;
                        var ULD;
                        AWBId = $(this).find("AWBNo").text();
                        AWB = $(this).find("AWBNo").text();
                        SHIPMENT_NUMBER = $(this).find("SHIPMENT_NUMBER").text();

                        var newOption = $("<option></option>");
                        newOption.val(AWBId).text(AWB);
                        newOption.appendTo("#ddlAWBNo");

                        var newOptionShip = $("<option></option>");
                        newOptionShip.val(SHIPMENT_NUMBER).text(SHIPMENT_NUMBER);
                        newOptionShip.appendTo("#ddlShipmentNo");
                    });

                // $('#ddlULDNo').trigger('change');
                $("#ddlAWBNo option")
                    .filter(function () {
                        return $(this).val().trim() == "" && $(this).text().trim() == "";
                    })
                    .remove();

                var a = new Array();
                $("#ddlAWBNo")
                    .children("option")
                    .each(function (x) {
                        test = false;
                        b = a[x] = $(this).text();
                        for (i = 0; i < a.length - 1; i++) {
                            if (b == a[i]) test = true;
                        }
                        if (test) $(this).remove();
                    });

                $("#ddlShipmentNo option")
                    .filter(function () {
                        return $(this).val().trim() == "" && $(this).text().trim() == "";
                    })
                    .remove();

                var a = new Array();
                $("#ddlShipmentNo")
                    .children("option")
                    .each(function (x) {
                        test = false;
                        b = a[x] = $(this).text();
                        for (i = 0; i < a.length - 1; i++) {
                            if (b == a[i]) test = true;
                        }
                        if (test) $(this).remove();
                    });

                gridXMLforShow =
                    "<Root><AWBNo>" +
                    AWB +
                    "</AWBNo><ShipmentNo>" +
                    SHIPMENT_NUMBER +
                    "</ShipmentNo><AirportCity>" +
                    AirportCity +
                    "</AirportCity></Root>";

                CargoAcceptance_GetAcceptedList(gridXMLforShow);
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}
function GetAWBDetailsforAWB() {
    var inputxml = "";

    var connectionStatus = navigator.onLine ? "online" : "offline";

    var errmsg = "";
    var VCTNo = $("#txtVCTNo").val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml =
        "<Root><AWBNo>" +
        VCTNo +
        "</AWBNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";
    $("#ddlAWBNo").empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_AWBSearch",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log("VCT With AWB");
                console.log(xmlDoc);
                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        //if (index == 0) {
                        //    var newOption = $('<option></option>');
                        //    newOption.val('0').text('Select');
                        //    newOption.appendTo('#ddlAWBNo');
                        //}

                        var ULDId;
                        var ULD;
                        AWBId = $(this).find("AWBNo").text();
                        AWB = $(this).find("AWBNo").text();

                        var newOption = $("<option></option>");
                        newOption.val(AWBId).text(AWB);
                        newOption.appendTo("#ddlAWBNo");
                        //$('#ddlAcceptance').val("0");
                    });
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function GetAWBDetailsForULD(ULDid) {
    $("#txtTareWt").val("");
    $("#txtULDType").val("");
    $("#txtReceivedNetWt").val("");

    var inputxml = "";

    var connectionStatus = navigator.onLine ? "online" : "offline";

    var errmsg = "";

    inputxml =
        "<Root><DockNo>" +
        $("#txtVCTNo").val() +
        "</DockNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    $("#ddlAWBNo").empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_VCTSearch",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;

                var xmlDoc = $.parseXML(Result);
                console.log("AWB");
                console.log(xmlDoc);
                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        var AWBId;
                        var AWB;
                        AWBId = $(this).find("AWBNo").text();
                        AWB = $(this).find("AWBNo").text();

                        var newOption = $("<option></option>");
                        newOption.val(AWBId).text(AWB);
                        newOption.appendTo("#ddlAWBNo");

                        SHIPMENT_NUMBER = $(this).find("SHIPMENT_NUMBER").text();

                        var newOption = $("<option></option>");
                        newOption.val(SHIPMENT_NUMBER).text(SHIPMENT_NUMBER);
                        newOption.appendTo("#ddlShipmentNo");

                        var hdnValue = $("#ddlULDNo").val().split("~");
                        gridXMLforShow =
                            "<Root><AWBNo>" +
                            hdnValue[1] +
                            "</AWBNo><ShipmentNo>" +
                            hdnValue[2] +
                            "</ShipmentNo><AirportCity>" +
                            AirportCity +
                            "</AirportCity></Root>";

                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                    });
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}
function GetShipmentDetails(AWBid) {
    var AWB = AWBid;
    var VCTCode = $("#txtVCTNo").val();
    VCTCode = VCTCode.replace(/\s+/g, "");
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

    var connectionStatus = navigator.onLine ? "online" : "offline";
    var VCTNo = $("#txtVCTNo").val();
    var errmsg = "";

    if (AWBid == "0") return;

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    inputxml =
        "<Root><DockNo>" +
        VCTNo +
        "</DockNo><AWBNo>" +
        AWBid +
        "</AWBNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    $("#ddlShipmentNo").empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_GETVCTAWB_Details",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                XMLshipmentDt = Result;
                console.log("GetShipmentDetails", xmlDoc);
                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        var ShpmentId;
                        var ShpmentNo;
                        var Remarks;
                        ShpmentId = $(this).find("SHIPMENT_NUMBER").text();
                        ShpmentNo = $(this).find("SHIPMENT_NUMBER").text();
                        AWBNo = $(this).find("AWBNo").text();

                        var newOption = $("<option></option>");
                        newOption.val(ShpmentId).text(ShpmentNo);
                        newOption.appendTo("#ddlShipmentNo");

                        if (index == 0) {
                            AWBPackages = $(this).find("TOTAL_NPX").text();
                            AWBGrossWt = $(this).find("TOT_WGHT_EXP_KG").text();
                            ShipPackages = $(this).find("FBL_NPX").text();
                            ShipGrossWt = $(this).find("FBL_WEIGHT_EXP").text();
                            $("#txtPackages").val(AWBPackages);
                            $("#txtGrossWt").val(AWBGrossWt);
                            $("#shiptxtPackages").val(ShipPackages);
                            $("#shiptxtGrossWt").val(ShipGrossWt);

                            gridXMLforShow =
                                "<Root><AWBNo>" +
                                AWBNo +
                                "</AWBNo><ShipmentNo>" +
                                ShpmentNo +
                                "</ShipmentNo><AirportCity>" +
                                AirportCity +
                                "</AirportCity></Root>";

                            CargoAcceptance_GetAcceptedList(gridXMLforShow);
                            return;
                        }
                    });
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}
function GetShipmentDetailsAWB(AWBid) {
    var inputxml = "";

    var connectionStatus = navigator.onLine ? "online" : "offline";
    var VCTNo = $("#txtVCTNo").val();
    var errmsg = "";

    if (AWBid == "0") return;

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    inputxml =
        "<Root><AWBNo>" +
        VCTNo +
        "</AWBNo><AWBNo>" +
        AWBid +
        "</AWBNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    $("#ddlShipmentNo").empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_AWBSearch",
            data: JSON.stringify({
                InputXML: inputxml,
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
                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        ShpmentId = $(this).find("SHIPMENT_NUMBER").text();
                        ShpmentNo = $(this).find("SHIPMENT_NUMBER").text();

                        var newOption = $("<option></option>");
                        newOption.val(ShpmentId).text(ShpmentNo);
                        newOption.appendTo("#ddlShipmentNo");

                        if (index == 0) {
                            AWBPackages = $(this).find("TOTAL_NPX").text();
                            AWBGrossWt = $(this).find("TOT_WGHT_EXP_KG").text();
                            ShipPackages = $(this).find("FBL_NPX").text();
                            ShipGrossWt = $(this).find("FBL_WEIGHT_EXP").text();
                            $("#txtPackages").val(AWBPackages);
                            $("#txtGrossWt").val(AWBGrossWt);
                            $("#shiptxtPackages").val(ShipPackages);
                            $("#shiptxtGrossWt").val(ShipGrossWt);
                            return;
                        }
                    });
                gridXMLforShow =
                    "<Root><AWBNo>" +
                    AWBid +
                    "</AWBNo><ShipmentNo>" +
                    ShpmentNo +
                    "</ShipmentNo><AirportCity>" +
                    AirportCity +
                    "</AirportCity></Root>";

                CargoAcceptance_GetAcceptedList(gridXMLforShow);
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}
function GetShipmentRelatedDetails(ShipmentId) {
    var inputxml = "";
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var AwbId = $("#ddlAWBNo").val();
    var errmsg = "";

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';
    inputxml =
        "<Root><AWBNo>" +
        AwbId +
        "</AWBNo><ShipmentNo>" +
        ShipmentId +
        "</ShipmentNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_GETAWBShipment_Details",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $("#txtReceivedPackages").val("");
                $("#txtReceivedGrossWt").val("");
                XMLshipmentDt = Result;
                var xml = $.parseXML(XMLshipmentDt);
                //console.log("GetShipmentRelatedDetails", xmlDoc)
                $(xml)
                    .find("Table")
                    .each(function (index) {
                        var ShpmentNo;
                        ShpmentNo = $(this).find("SHIPMENT_NUMBER").text();

                        if (ShpmentNo == ShipmentId) {
                            AWBPackages = $(this).find("TOTAL_NPX").text();
                            AWBGrossWt = $(this).find("TOT_WGHT_EXP_KG").text();
                            ShipPackages = $(this).find("FBL_NPX").text();
                            ShipGrossWt = $(this).find("FBL_WEIGHT_EXP").text();
                            $("#txtPackages").val(AWBPackages);
                            $("#txtGrossWt").val(AWBGrossWt);
                            $("#shiptxtPackages").val(ShipPackages);
                            $("#shiptxtGrossWt").val(ShipGrossWt);
                            //return;
                        }
                    });

                clearAllValuesfromDimention();

                gridXMLforShow =
                    "<Root><AWBNo>" +
                    $("#ddlAWBNo").val() +
                    "</AWBNo><ShipmentNo>" +
                    $("#ddlShipmentNo").val() +
                    "</ShipmentNo><AirportCity>" +
                    AirportCity +
                    "</AirportCity></Root>";

                CargoAcceptance_GetAcceptedList(gridXMLforShow);
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
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

    var connectionStatus = navigator.onLine ? "online" : "offline";

    var errmsg = "";
    var VCTNo = $("#txtVCTNo").val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = "<Root><AirportCity>" + AirportCity + "</AirportCity></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_ScaleNameList",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log(xmlDoc);
                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        if (index == 0) {
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlscaleName");
                        }

                        var ULDId;
                        var ULD;
                        MAC_ID = $(this).find("MAC_ID").text();
                        MachineName = $(this).find("MachineName").text();
                        VendorId = $(this).find("VendorId").text();

                        var newOption = $("<option></option>");
                        newOption.val(MAC_ID + "," + VendorId).text(MachineName);
                        newOption.appendTo("#ddlscaleName");
                    });

                $(xmlDoc)
                    .find("Table1")
                    .each(function (index) {
                        if (index == 0) {
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlEquipmentType");
                        }

                        var REFERENCE_TABLE_NAME;
                        var ANALYSIS_REF_TABLE_IDENTIFIER;
                        REFERENCE_TABLE_NAME = $(this).find("REFERENCE_TABLE_NAME").text();
                        ANALYSIS_REF_TABLE_IDENTIFIER = $(this)
                            .find("ANALYSIS_REF_TABLE_IDENTIFIER")
                            .text();

                        var newOption = $("<option></option>");
                        newOption
                            .val(ANALYSIS_REF_TABLE_IDENTIFIER)
                            .text(REFERENCE_TABLE_NAME);
                        newOption.appendTo("#ddlEquipmentType");
                    });

                // $('#ddlscaleName').trigger('change')
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function HHT_CargoAcceptance_Equipment_SubTypeList(EquipmentType) {
    $("#ddlULDSK1").empty();
    var inputxml = "";

    var connectionStatus = navigator.onLine ? "online" : "offline";

    var errmsg = "";
    var VCTNo = $("#txtVCTNo").val();
    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml =
        "<Root><EquipmentType>" + EquipmentType + "</EquipmentType></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_Equipment_SubTypeList",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log(xmlDoc);

                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        if ($("#txtULDType").val() != "") {
                            var Status;
                            var msg;
                            Status = $(this).find("Status").text();
                            msg = $(this).find("msg").text();
                            if (Status == "E") {
                                errmsg = msg;
                                $.alert(errmsg);
                                return;
                            }
                        }
                    });

                $(xmlDoc)
                    .find("Table1")
                    .each(function (index) {
                        if (index == 0) {
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlULDSK1");
                        }

                        var SubType;
                        var TareWt;
                        SubType = $(this).find("SubType").text();
                        TareWt = $(this).find("TareWt").text();

                        var newOption = $("<option></option>");
                        newOption.val(TareWt).text(SubType);
                        newOption.appendTo("#ddlULDSK1");

                        //if (SubType == 'AKE') {

                        //}

                        if ($("#ddlULDSK1").val() != "0") {
                            var receWt = parseFloat($("#txtReceivedGrossWt").val());
                            var tare = parseFloat(TareWt);

                            var netWt = receWt - tare;

                            if (netWt < 0) {
                                // alert('Gross Wt. should be greater then tare wt')

                                errmsg = "Gross Wt. should be greater then tare wt.</br>";
                                $.alert(errmsg);
                                return;
                            }

                            $("#txtTareWt").val(tare.toFixed(2));

                            $("#txtReceivedNetWt").val(netWt.toFixed(2));
                        }

                        if ($("#txtULDType").val() != "") {
                            var receWt = parseFloat($("#txtReceivedGrossWt").val());
                            var tare = parseFloat(TareWt);

                            var netWt = receWt - tare;

                            if (netWt < 0) {
                                // alert('Gross Wt. should be greater then tare wt')

                                errmsg = "Gross Wt. should be greater then tare wt.</br>";
                                $.alert(errmsg);
                                return;
                            }

                            $("#txtTareWt").val(tare.toFixed(2));

                            $("#txtReceivedNetWt").val(netWt.toFixed(2));
                        }
                    });
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function setDetailsOnSelected(selectedVal) {
    $("#txtULDType").val("");
    $("#txtTareWt").val("");
    $("#txtReceivedNetWt").val("");
    $("#ddlULDSK1").empty();
    $("#ddlEquipmentType").val("0");

    var VCTCode = $("#txtVCTNo").val();
    VCTCode = VCTCode.replace(/\s+/g, "");
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
            $("#txtReceivedPackages").val("");
        } else {
            $("#ddlULDNo").removeAttr("disabled", "disabled");
            $("#ddlULD").removeAttr("disabled", "disabled");
            $("#ddlAWBNo").attr("disabled", "disabled");
            $("#ddlShipmentNo").attr("disabled", "disabled");
            $("#ddlGrossWtUnit").attr("disabled", "disabled");
            $("#txtPackages").attr("disabled", "disabled");
            $("#txtGrossWt").attr("disabled", "disabled");
            // $("#txtReceivedPackages").attr("disabled", "disabled");
            $("#txtReceivedPackages").val("1");
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
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";
    var AcceptanceText = $("#ddlAcceptance").find("option:selected").text();
    var AcceptanceType;
    var inputULD = "";
    var istruckSealed = "false";
    var VCTNo;
    var strAWBNo = $("#ddlAWBNo").find("option:selected").text();
    var strPkgs = $("#txtReceivedPackages").val();
    var strGrossWt = $("#txtReceivedGrossWt").val();
    var strShipmentNo = $("#ddlShipmentNo").find("option:selected").text();
    var strWtUnit = "KG";
    AcceptanceType = "A";
    if (radioValue == "vct") {
        if (AcceptanceText == "AWB") {
            //if ((document.getElementById('chkSealed').checked = "false") && (document.getElementById('chkNotSealed').checked = "false")) {

            if (strPkgs == "" || strGrossWt == "") {
                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            if (strAWBNo.length != "11") {
                errmsg = "Please enter valid AWB No.";
                $.alert(errmsg);
                return;
            }
            var seqNo = "";
            if ($("#ddlULDNo").find("option:selected").val() != undefined) {
                // $('#ddlULDNo').val('')
                seqNo = $("#ddlULDNo").find("option:selected").val();
            }

            if ($("#txtVCTNo").val() == "0") {
                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            if ($("#ddlEquipmentType").val() == "0") {
                errmsg = "Please select Equipment Type.</br>";
                $.alert(errmsg);
                return;
            }

            if ($("#ddlEquipmentType").val() == "ULT") {
                if ($("#txtULDType").val() == "") {
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

            if ($("#txtReceivedNetWt").val() == "") {
                errmsg = "Please calculate net wt.</br>";
                $.alert(errmsg);
                return;
            }
            var netwt = parseInt($("#txtReceivedNetWt").val());
            if (netwt < 0) {
                errmsg = "Gross Wt. should be greater then net wt.</br>";
                $.alert(errmsg);
                return;
            }

            var subTypeField = "";
            if ($("#ddlEquipmentType").val() == "ULT") {
                subTypeField = $("#txtULDType").val();
            } else {
                //subTypeField = $('#ddlULDSK1').val();
                subTypeField = $("#ddlULDSK1 option:selected").text();
            }

            var inputXML =
                '<ROOT><AWBData AWBNo="' +
                $("#ddlAWBNo").find("option:selected").val() +
                '" ShipNo="' +
                $("#ddlShipmentNo").find("option:selected").val() +
                '" Pcs="' +
                $("#txtReceivedPackages").val() +
                '" Weight="' +
                $("#txtReceivedGrossWt").val() +
                '" WtUnit="KG" TareWt="' +
                $("#txtTareWt").val() +
                '"  EquiType="' +
                $("#ddlEquipmentType").val() +
                '" EquiSubType="' +
                subTypeField +
                '" NetWt="' +
                $("#txtReceivedNetWt").val() +
                '"/></ROOT>';
            var inputULD = "";
            var dimline = "<ROOT>" + inputRowsforDim + "</ROOT>";
            VCTNo = $("#txtVCTNo").val();
        } else if (AcceptanceText == "ULD") {
            if (strPkgs == "" || strGrossWt == "") {
                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            var strAWBNo = $("#ddlAWBNo").find("option:selected").text();
            var strShipmentNo = $("#ddlShipmentNo").find("option:selected").text();
            var strWtUnit = "KG";
            AcceptanceType = "U";
            var hdnValue = $("#ddlULDNo").val().split("~");

            if ($("#ddlEquipmentType").val() == "0") {
                errmsg = "Please select Equipment Type.</br>";
                $.alert(errmsg);
                return;
            }

            if ($("#ddlEquipmentType").val() == "ULT") {
                if ($("#txtULDType").val() == "") {
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

            if ($("#txtReceivedNetWt").val() == "") {
                errmsg = "Please calculate net wt.</br>";
                $.alert(errmsg);
                return;
            }

            var netwt = parseInt($("#txtReceivedNetWt").val());
            if (netwt < 0) {
                errmsg = "Gross Wt. should be greater then net wt.</br>";
                $.alert(errmsg);
                return;
            }

            var subTypeField = "";
            if ($("#ddlEquipmentType").val() == "ULT") {
                subTypeField = $("#txtULDType").val();
            } else {
                // subTypeField = $('#ddlULDSK1').val();
                subTypeField = $("#ddlULDSK1 option:selected").text();
            }

            var inputXML =
                '<ROOT><AWBData AWBNo="' +
                hdnValue[1] +
                '" ShipNo="' +
                hdnValue[2] +
                '" Pcs="' +
                1 +
                '" Weight="' +
                $("#txtReceivedGrossWt").val() +
                '" WtUnit="KG" TareWt="' +
                $("#txtTareWt").val() +
                '"  EquiType="' +
                $("#ddlEquipmentType").val() +
                '" EquiSubType="' +
                subTypeField +
                '" NetWt="' +
                $("#txtReceivedNetWt").val() +
                '"/></ROOT>';
            var inputULD = '<ROOT><ULDData ULDSeqNo="' + hdnValue[0] + '"/></ROOT>';
            var dimline = "<ROOT>" + inputRowsforDim + "</ROOT>";
            VCTNo = $("#txtVCTNo").val();
        }
    } else {
        if (AcceptanceText == "AWB") {
            if (strPkgs == "" || strGrossWt == "") {
                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            var strAWBNo = $("#ddlAWBNo").find("option:selected").text();
            var strPkgs = $("#txtReceivedPackages").val();
            var strGrossWt = $("#txtReceivedGrossWt").val();
            var strShipmentNo = $("#ddlShipmentNo").find("option:selected").text();
            var strWtUnit = "KG";
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

            if ($("#ddlEquipmentType").val() == "0") {
                errmsg = "Please select Equipment Type.</br>";
                $.alert(errmsg);
                return;
            }

            if ($("#ddlEquipmentType").val() == "ULT") {
                if ($("#txtULDType").val() == "") {
                    errmsg = "Please enter equipment type.</br>";
                    $.alert(errmsg);
                    $("#txtULDType").focus();
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

            if ($("#txtReceivedNetWt").val() == "") {
                errmsg = "Please calculate net wt.</br>";
                $.alert(errmsg);
                return;
            }

            var netwt = parseInt($("#txtReceivedNetWt").val());
            if (netwt < 0) {
                errmsg = "Gross Wt. should be greater then net wt.</br>";
                $.alert(errmsg);
                return;
            }

            var subTypeField = "";
            if ($("#ddlEquipmentType").val() == "ULT") {
                subTypeField = $("#txtULDType").val();
            } else {
                // subTypeField = $('#ddlULDSK1').val();
                subTypeField = $("#ddlULDSK1 option:selected").text();
            }

            var inputXML =
                '<ROOT><AWBData AWBNo="' +
                $("#ddlAWBNo").find("option:selected").val() +
                '" ShipNo="' +
                $("#ddlShipmentNo").find("option:selected").val() +
                '" Pcs="' +
                $("#txtReceivedPackages").val() +
                '" Weight="' +
                $("#txtReceivedGrossWt").val() +
                '" WtUnit="KG" TareWt="' +
                $("#txtTareWt").val() +
                '"  EquiType="' +
                $("#ddlEquipmentType").val() +
                '" EquiSubType="' +
                subTypeField +
                '" NetWt="' +
                $("#txtReceivedNetWt").val() +
                '" /></ROOT>';
            var inputULD = "";
            var dimline = "<ROOT>" + inputRowsforDim + "</ROOT>";
            VCTNo = "";
        } else if (AcceptanceText == "ULD") {
            if (strPkgs == "" || strGrossWt == "") {
                errmsg = "Please enter all the required fields.</br>";
                $.alert(errmsg);
                return;
            }

            var strAWBNo = $("#ddlAWBNo").find("option:selected").text();
            var strShipmentNo = $("#ddlShipmentNo").find("option:selected").text();
            var strWtUnit = "KG";
            AcceptanceType = "U";

            var hdnValue = $("#ddlULDNo").val().split("~");

            var subTypeField = "";
            if ($("#ddlEquipmentType").val() == "ULT") {
                subTypeField = $("#txtULDType").val();
            } else {
                //  subTypeField = $('#ddlULDSK1').val();
                subTypeField = $("#ddlULDSK1 option:selected").text();
            }

            var inputXML =
                '<ROOT><AWBData AWBNo="' +
                hdnValue[1] +
                '" ShipNo="' +
                hdnValue[2] +
                '" Pcs="' +
                1 +
                '" Weight="' +
                $("#txtReceivedGrossWt").val() +
                '" WtUnit="KG" TareWt="' +
                $("#txtTareWt").val() +
                '"  EquiType="' +
                $("#ddlEquipmentType").val() +
                '" EquiSubType="' +
                subTypeField +
                '" NetWt="' +
                $("#txtReceivedNetWt").val() +
                '"/></ROOT>';
            //TareWt="' + $('#txtTareWt').val() + '"  EquiType="' + $('#ddlEquipmentType').val() + '" EquiSubType="' + subTypeField + '" NetWt="' + $('#txtReceivedNetWt').val() + '"
            var inputULD = '<ROOT><ULDData ULDSeqNo="' + hdnValue[0] + '"/></ROOT>';
            var dimline = "<ROOT>" + inputRowsforDim + "</ROOT>";
            VCTNo = "";
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
                AWBXml: inputXML,
                VCTNo: VCTNo,
                ULDxml: inputULD,
                AcceptanceType: AcceptanceType,
                DimLinexml: dimline,
                AptCity: AirportCity,
                CompCode: CompanyCode,
                UserID: UserId,
                ShedCode: SHEDCODE,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $("body").mLoading({
                    text: "Please Wait..",
                });
            },
            success: function (response) {
                $("body").mLoading("hide");
                var str = response.d;
                // console.log(response.d);
                if (str != null && str != "" && str != "<NewDataSet />") {
                    var xmlDoc = $.parseXML(str);
                    _xmlDocTable = xmlDoc;
                    $(xmlDoc)
                        .find("Table")
                        .each(function (index) {
                            Status = $(this).find("Status").text();
                            StrMessage = $(this).find("msg").text();
                            if (Status == "E") {
                                $("body").mLoading("hide");
                                $.alert(StrMessage);
                                newTextBoxDiv = "";
                            } else if (Status == "S") {
                                $("body").mLoading("hide");
                                $.alert(StrMessage);
                                $("#txtReceivedPackages").val("");
                                $("#txtReceivedGrossWt").val("");
                                clearAllValuesfromDimention();
                                if (radioValue == "vct") {
                                    if (AcceptanceText == "AWB") {
                                        awbClear();

                                        gridXMLforShow =
                                            "<Root><AWBNo>" +
                                            $("#ddlAWBNo").val() +
                                            "</AWBNo><ShipmentNo>" +
                                            $("#ddlShipmentNo").val() +
                                            "</ShipmentNo><AirportCity>" +
                                            AirportCity +
                                            "</AirportCity></Root>";

                                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                    } else {
                                        var hdnValue = $("#ddlULDNo").val().split("~");
                                        gridXMLforShow =
                                            "<Root><AWBNo>" +
                                            hdnValue[1] +
                                            "</AWBNo><ShipmentNo>" +
                                            hdnValue[2] +
                                            "</ShipmentNo><AirportCity>" +
                                            AirportCity +
                                            "</AirportCity></Root>";
                                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                    }
                                } else {
                                    if (AcceptanceText == "AWB") {
                                        gridXMLforShow =
                                            "<Root><AWBNo>" +
                                            $("#ddlAWBNo").val() +
                                            "</AWBNo><ShipmentNo>" +
                                            $("#ddlShipmentNo").val() +
                                            "</ShipmentNo><AirportCity>" +
                                            AirportCity +
                                            "</AirportCity></Root>";

                                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                    } else {
                                        var hdnValue = $("#ddlULDNo").val().split("~");
                                        gridXMLforShow =
                                            "<Root><AWBNo>" +
                                            hdnValue[1] +
                                            "</AWBNo><ShipmentNo>" +
                                            hdnValue[2] +
                                            "</ShipmentNo><AirportCity>" +
                                            AirportCity +
                                            "</AirportCity></Root>";
                                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                    }
                                }

                                $("#txtTareWt").val("");
                                $("#txtULDType").val("");
                                $("#txtReceivedNetWt").val("");

                                $("#ddlULDSK1").empty();
                                var newOption = $("<option></option>");
                                newOption.val("").text("Select");
                                newOption.appendTo("#ddlULDSK1");

                                GetScaleListDetails();

                                newTextBoxDiv = "";
                            } else {
                                $("body").mLoading("hide");
                                $.alert(StrMessage);
                            }
                        });
                } else {
                    $("body").mLoading("hide");
                }
            },
            error: function (msg) {
                HideLoader();
                var r = jQuery.parseJSON(msg.responseText);
                alert("Message: " + r.Message);
            },
        });
        return false;
    }
}

function CargoAcceptance_GetAcceptedList(gridXMLforShow) {
    console.log(gridXMLforShow);

    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_GetAcceptedList",
            data: JSON.stringify({
                InputXML: gridXMLforShow,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                $("#divShowGrid").html("");
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log("Gird data");
                console.log(xmlDoc);

                // var Statustbl2;
                var Status;

                //$(xmlDoc).find('Table2').each(function (index) {
                //    Statustbl2 = $(this).find('Status').text();

                //});

                html = "";
                html =
                    "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                html += "<thead><tr>";
                html += "<th style='background-color:rgb(208, 225, 244);'>NOP</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>Gr Wt.</th>";
                html +=
                    "<th style='background-color:rgb(208, 225, 244);'>Tare Wt.</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>Net Wt.</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>User</th>";
                html +=
                    "<th style='background-color:rgb(208, 225, 244);'>Date & Time</th>";
                html += "<th style='background-color:rgb(208, 225, 244);'>Delete</th>";
                html += "</tr></thead>";
                html += "<tbody>";

                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        Status = $(this).find("Status").text();
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

                        RowId = $(this).find("RowId").text();
                        NOP = $(this).find("NOP").text();
                        WEIGHT = $(this).find("WEIGHT").text();
                        USER = $(this).find("USER").text();
                        DATETIME = $(this).find("DATETIME").text();
                        IsActive = $(this).find("IsActive").text();
                        AWB_PREFIX = $(this).find("AWB_PREFIX").text();
                        AWB_NUMBER = $(this).find("AWB_NUMBER").text();

                        CHARGEABLE_WEIGHT = $(this).find("CHARGEABLE_WEIGHT").text();

                        DN_TOTAL_NPR = $(this).find("DN_TOTAL_NPR").text();
                        DN_TOT_WGHT_REC_KG = $(this).find("DN_TOT_WGHT_REC_KG").text();
                        SHIP_REVD_NPR = $(this).find("SHIP_REVD_NPR").text();
                        SHIP_REVD_WGHT = $(this).find("SHIP_REVD_WGHT").text();
                        Tare_x0020_Wt = $(this).find("Tare_x0020_Wt").text();
                        Net_x0020_Wt = $(this).find("Net_x0020_Wt").text();

                        // scalDetailTable(RowId, NOP, WEIGHT, USER, DATETIME);
                        $("#tableShowwithDta").show();
                        html += "<tr>";
                        html += "<td style='padding: 2px;' align='right'>" + NOP + "</td>";
                        html +=
                            "<td style='padding: 2px;' align='right'>" + WEIGHT + "</td>";
                        html +=
                            "<td style='padding: 2px;' align='right'>" +
                            parseFloat(Tare_x0020_Wt).toFixed(2) +
                            "</td>";
                        html +=
                            "<td style='padding: 2px;' align='right'>" +
                            parseFloat(Net_x0020_Wt).toFixed(2) +
                            "</td>";
                        html += "<td align='center'>" + USER + "</td>";
                        html += "<td align='center'>" + DATETIME + "</td>";
                        html +=
                            "<td  onclick='delerteRecordFromGrid(" +
                            RowId +
                            ")' align='center'><span class='glyphicon glyphicon-trash'></span></button></td>";

                        html += "</tr>";
                    });

                $(xmlDoc)
                    .find("Table1")
                    .each(function (index) {
                        DN_TOTAL_NPR = $(this).find("DN_TOTAL_NPR").text();
                        DN_TOT_WGHT_REC_KG = $(this).find("DN_TOT_WGHT_REC_KG").text();
                        CHARGEABLE_WEIGHT = $(this).find("CHARGEABLE_WEIGHT").text();
                        SHIP_REVD_NPR = $(this).find("SHIP_REVD_NPR").text();
                        SHIP_REVD_WGHT = $(this).find("SHIP_REVD_WGHT").text();

                        var awbwt = parseFloat(CHARGEABLE_WEIGHT).toFixed(2);

                        var shipwt = parseFloat(SHIP_REVD_WGHT).toFixed(2);

                        $("#DN_TOTAL_NPR").text(DN_TOTAL_NPR);
                        $("#DN_TOT_WGHT_REC_KG").text(DN_TOT_WGHT_REC_KG);
                        $("#CHARGEABLE_WEIGHT").text(awbwt);
                        $("#SHIP_REVD_NPR").text(SHIP_REVD_NPR);
                        $("#SHIP_REVD_WGHT").text(SHIP_REVD_WGHT);
                    });

                if (Status == "E" || Status == undefined) {
                    html = "";
                    $("#spanDiv").hide();
                    $("#divShowGrid").html("");
                } else {
                    html += "</tbody></table>";
                    $("#divShowGrid").append(html);
                    $("#spanDiv").show();
                }
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function delerteRecordFromGrid(RowId) {
    var result = confirm("Do you Want to delete record?");
    if (result) {
        CargoAcceptance_Delete_AcceptedListRow(RowId);
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

    var connectionStatus = navigator.onLine ? "online" : "offline";

    var errmsg = "";

    inputxml =
        "<Root><RowId>" +
        RowId +
        "</RowId><UserId>" +
        UserId +
        "</UserId><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "CargoAcceptance_Delete_AcceptedListRow",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("body").mLoading("hide");
                var str = response.d;
                // console.log(response.d);
                if (str != null && str != "" && str != "<NewDataSet />") {
                    var xmlDoc = $.parseXML(str);
                    _xmlDocTable = xmlDoc;
                    $(xmlDoc)
                        .find("Table")
                        .each(function (index) {
                            Status = $(this).find("Status").text();
                            StrMessage = $(this).find("msg").text();
                            if (Status == "E") {
                                $("body").mLoading("hide");
                                $.alert(StrMessage);
                            } else if (Status == "S") {
                                var AcceptanceText = $("#ddlAcceptance")
                                    .find("option:selected")
                                    .text();
                                if (radioValue == "vct") {
                                    if (AcceptanceText == "AWB") {
                                        gridXMLforShow =
                                            "<Root><AWBNo>" +
                                            $("#ddlAWBNo").val() +
                                            "</AWBNo><ShipmentNo>" +
                                            $("#ddlShipmentNo").val() +
                                            "</ShipmentNo><AirportCity>" +
                                            AirportCity +
                                            "</AirportCity></Root>";

                                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                    } else {
                                        var hdnValue = $("#ddlULDNo").val().split("~");
                                        gridXMLforShow =
                                            "<Root><AWBNo>" +
                                            hdnValue[1] +
                                            "</AWBNo><ShipmentNo>" +
                                            hdnValue[2] +
                                            "</ShipmentNo><AirportCity>" +
                                            AirportCity +
                                            "</AirportCity></Root>";
                                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                    }
                                } else {
                                    if (AcceptanceText == "AWB") {
                                        gridXMLforShow =
                                            "<Root><AWBNo>" +
                                            $("#ddlAWBNo").val() +
                                            "</AWBNo><ShipmentNo>" +
                                            $("#ddlShipmentNo").val() +
                                            "</ShipmentNo><AirportCity>" +
                                            AirportCity +
                                            "</AirportCity></Root>";

                                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                    } else {
                                        var hdnValue = $("#ddlULDNo").val().split("~");
                                        gridXMLforShow =
                                            "<Root><AWBNo>" +
                                            hdnValue[1] +
                                            "</AWBNo><ShipmentNo>" +
                                            hdnValue[2] +
                                            "</ShipmentNo><AirportCity>" +
                                            AirportCity +
                                            "</AirportCity></Root>";
                                        CargoAcceptance_GetAcceptedList(gridXMLforShow);
                                    }
                                }

                                $("#txtTareWt").val("");
                                $("#txtULDType").val("");
                                $("#txtReceivedNetWt").val("");

                                $("#ddlULDSK1").empty();
                                var newOption = $("<option></option>");
                                newOption.val("").text("Select");
                                newOption.appendTo("#ddlULDSK1");

                                GetScaleListDetails();

                                $("body").mLoading("hide");
                                $.alert(StrMessage);
                            } else {
                                $("body").mLoading("hide");
                                $.alert(StrMessage);
                            }
                        });
                }
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function OpenDimensions() {
    //if ($('#txtVCTNo').val() == '') {
    //    $.alert('Please enter AWB No./VCT No.');
    //    return;
    //}
    if ($("#ddlAcceptance").val() == 1) {
        $("#addButton").attr("disabled", "disabled");
        // $("#Pieces1").attr("disabled", "disabled");
        $("#Pieces1").val("1");
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

function awbClear() {
    //$('#shiptxtPackages').val('');
    //$('#shiptxtGrossWt').val('');
    $("#txtReceivedPackages").val("");
    $("#txtReceivedGrossWt").val("");
    //newTextBoxDiv.html('');
    $("#spanDiv").hide();
    $("#divShowGrid").html("");
}

function clearALLControlsonOnchangeVCT() {
    $("#txtPackages").val("");
    $("#txtGrossWt").val("");
    // $('#txtVCTNo').val('');

    $("#shiptxtPackages").val("");
    $("#shiptxtGrossWt").val("");
    $("#txtReceivedPackages").val("");
    $("#txtReceivedGrossWt").val("");
    // newTextBoxDiv.html('');
    removeRow();
    $("#DN_TOTAL_NPR").text("");
    $("#DN_TOT_WGHT_REC_KG").text("");
    $("#CHARGEABLE_WEIGHT").text("");
    $("#SHIP_REVD_NPR").text("");
    $("#SHIP_REVD_WGHT").text("");

    $("#divShowGrid").html("");

    $("#ddlULDNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlULDNo");

    $("#ddlAWBNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlAWBNo");

    $("#ddlShipmentNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlShipmentNo");

    $("#Pieces1").val("").css("background-color", "white");
    $("#ddlUOM1").val("CMT");
    $("#Length1").val("").css("background-color", "white");
    $("#Width1").val("").css("background-color", "white");
    $("#Volume1").val("").css("background-color", "white");
    $("#Height1").val("").css("background-color", "white");

    //$('#spanDiv').empty();
    //$('#tableShowwithDta').hide();
}

function clearALLControlsonButton() {
    $("#txtPackages").val("");
    $("#txtGrossWt").val("");
    $("#txtVCTNo").val("");

    $("#shiptxtPackages").val("");
    $("#shiptxtGrossWt").val("");
    $("#txtReceivedPackages").val("");
    $("#txtReceivedGrossWt").val("");
    // newTextBoxDiv.html('');
    removeRow();
    $("#DN_TOTAL_NPR").text("");
    $("#DN_TOT_WGHT_REC_KG").text("");
    $("#CHARGEABLE_WEIGHT").text("");
    $("#SHIP_REVD_NPR").text("");
    $("#SHIP_REVD_WGHT").text("");

    $("#divShowGrid").html("");

    $("#ddlULDNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlULDNo");

    $("#ddlAWBNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlAWBNo");

    $("#ddlShipmentNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlShipmentNo");

    $("#Pieces1").val("").css("background-color", "white");
    $("#ddlUOM1").val("CMT");
    $("#Length1").val("").css("background-color", "white");
    $("#Width1").val("").css("background-color", "white");
    $("#Volume1").val("").css("background-color", "white");
    $("#Height1").val("").css("background-color", "white");

    $("#txtChargeableWt").val("");

    //  $('#ddlEquipmentType').val('0');
    // $('#ddlULDSK1').val('0');

    $("#ddlULDSK1").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlULDSK1");

    $("#txtTareWt").val("");
    $("#txtULDType").val("");
    $("#txtReceivedNetWt").val("");

    $("#spanDiv").hide();
    $("#tableShowwithDta").hide();
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $(".ClearFields input[type=text]").val("");
}

function VehicleNumberValidation() {
    var patternVN = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$");
    var patternVN1 = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$");
    if (!patternVN1.test(this.objVT.vehicleNo))
        if (!patternVN.test(this.objVT.vehicleNo)) {
            this.objVT.vehicleNo = "";
            this.global.showAlert(
                "Please enter valid format in Vehicle Number viz MH04BY3668 OR MH04Y3668."
            );
            return false;
        }
}



function clearAll() {
    AllSHCFinalSave;
    _XmlForSHCCode = ',';
    joinAllValuesWithComma = '';
    $("#txtVCTNo").val("");
    $("#txtDOB").val("");
    $("#acceptedListTable").hide();
    $("#ddlOrigin").empty();
    $("#ddlscaleName").val("0");
    $("#ddlEquipmentType").val("0");
    $("#acceptedListTable").hide();
    $("#txtDriverName").val("");
    $("#txtDriverid").val("");
    $("#txtVehicleNumber").val("");
    // $("#chkLoose").prop("checked", true);
    //$("#txtULDTyped").val("").hide();
    //$("#txtULDNumber").val("").hide();
    //$("#txtOwner").val("").hide();
    radioButtonChange();
    $("#txtAWBNo").val("");
    $("#txtAWBpkgs").val("");
    $("#txtAWBWt").val("");
    $("#txtReceivedPkgs").val("");
    $("#txtReceivedGrossWt").val("");
    $("#txtCustomerName").val("");
    $("#ddlDestination").val("");
    $("#ddlOffPoints").val("");
    $("#txtAirline").val("");
    $("#txtDescription").val("");
    $("#txtSHCCode").val("");
    $("#txtRemark").val("");
    removeRow();
    $("#DN_TOTAL_NPR").text("");
    $("#DN_TOT_WGHT_REC_KG").text("");
    $("#CHARGEABLE_WEIGHT").text("");
    $("#SHIP_REVD_NPR").text("");
    $("#SHIP_REVD_WGHT").text("");
    // $("#divBulk").show();
    // $("#txtBulk").val('BULK');

    $("#divShowGrid").html("");

    $("#ddlULDNo").empty();
    $("#TextBoxDiv").empty();

    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlULDNo");

    $("#ddlAWBNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlAWBNo");

    $("#ddlShipmentNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlShipmentNo");

    $("#Pieces1").val("").css("background-color", "white");
    $("#ddlUOM1").val("CMT");
    $("#Length1").val("").css("background-color", "white");
    $("#Width1").val("").css("background-color", "white");
    $("#Volume1").val("").css("background-color", "white");
    $("#Height1").val("").css("background-color", "white");

    $("#txtChargeableWt").val("");
    $("#ddlULDSK1").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlULDSK1");

    $("#txtTareWt").val("");
    $("#txtULDType").val("");
    $("#txtReceivedNetWt").val("");

    $("#spanDiv").hide();
    $("#tableShowwithDta").hide();
}

function clearAllOnlyifAWBNew() {
    AllSHCFinalSave;
    _XmlForSHCCode = ',';
    joinAllValuesWithComma = '';
    $("#txtVCTNo").val("");
    $("#txtDOB").val("");
    $("#acceptedListTable").hide();
    //$("#ddlOrigin").empty();
    $("#ddlscaleName").val("0");
    $("#ddlEquipmentType").val("0");
    $("#acceptedListTable").hide();
    $("#txtDriverName").val("");
    $("#txtDriverid").val("");
    $("#txtVehicleNumber").val("");
    $("#chkLoose").prop("checked", true);
    $("#txtULDTyped").val("");
    $("#txtULDNumber").val("");
    $("#txtOwner").val("");
    //$("#txtAWBNo").val("");
    $("#txtAWBpkgs").val("");
    $("#txtAWBWt").val("");
    $("#txtReceivedPkgs").val("");
    $("#txtReceivedGrossWt").val("");
    $("#txtCustomerName").val("");
    $("#ddlDestination").val("");
    $("#ddlOffPoints").val("");
    //$("#txtAirline").val("");
    $("#txtDescription").val("");
    $("#txtSHCCode").val("");
    $("#txtRemark").val("");
    removeRow();
    $("#DN_TOTAL_NPR").text("");
    $("#DN_TOT_WGHT_REC_KG").text("");
    $("#CHARGEABLE_WEIGHT").text("");
    $("#SHIP_REVD_NPR").text("");
    $("#SHIP_REVD_WGHT").text("");

    $("#divShowGrid").html("");

    $("#ddlULDNo").empty();
    $("#TextBoxDiv").empty();

    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlULDNo");

    $("#ddlAWBNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlAWBNo");

    $("#ddlShipmentNo").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlShipmentNo");

    $("#Pieces1").val("").css("background-color", "white");
    $("#ddlUOM1").val("CMT");
    $("#Length1").val("").css("background-color", "white");
    $("#Width1").val("").css("background-color", "white");
    $("#Volume1").val("").css("background-color", "white");
    $("#Height1").val("").css("background-color", "white");

    $("#txtChargeableWt").val("");
    $("#ddlULDSK1").empty();
    var newOption = $("<option></option>");
    newOption.val("").text("Select");
    newOption.appendTo("#ddlULDSK1");

    $("#txtTareWt").val("");
    $("#txtULDType").val("");
    $("#txtReceivedNetWt").val("");

    $("#spanDiv").hide();
    $("#tableShowwithDta").hide();
}

function CargoAcceptance_GetAgent() {

    commodiyCode = [];

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    // var InputXML = '<Root><validfor>A</validfor><AirportCity>' + AirportCity + '</AirportCity><CompanyCode>' + companyCode + '</CompanyCode></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CargoWorksServiceURL + "CargoAcceptance_GetAgent",
            data: JSON.stringify({}),
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
                // console.log(xmlDoc);
                commodiyCode = [];
                $(xmlDoc).find('Table').each(function () {
                    //var outMsg = $(this).find('OutMsg').text(); //added on 17/06

                    var Status = $(this).find('Status').text();
                    var OutMsg = $(this).find('OutMsg').text();

                    if (status == 'E') {
                        $.alert($(this).find('OutMsg').text()).css('color', 'red');
                        //$(".alert_btn_ok").click(function () {
                        //    $('#txtGroupId').focus();
                        //});
                        return true;
                    }
                });
                var _data;
                $(xmlDoc).find('Table').each(function () {
                    //var outMsg = $(this).find('OutMsg').text(); //added on 17/06

                    var agentNo = $(this).find("AgtCode").text();
                    var agentName = $(this).find("Name").text();

                    var newOption = $('<option></option>');
                    newOption.val(agentNo).text(agentName);
                    newOption.appendTo('#ddlCustomerName');

                    commodiyCode.push({ 'value': agentNo, 'label': agentName });
                    _data = JSON.stringify(commodiyCode);


                    // $('#attribute').select2();
                    //$("#ddlCommodity").select2({
                    //    data: [
                    //        { id: SrNO, text: SrNO }]
                    //});
                });
                //console.log(_data)
                //$("#ddlCommodity").select2({
                //    data: _data
                //});

                if (selectedRowHAWBNo != '') {
                    //TODO :Change selectedRowHAWBNo to  $("#hawbLists").val()
                    $("#ddlCustomerName option").each(function () {
                        if ($(this).text() == selectedRowHAWBNo) {
                            $(this).attr('selected', 'selected');
                            var selectedCommodity = $(this).val();

                            onChangeComm(selectedCommodity);
                        }
                    });
                }

                if (commodiyCode.length > 0) {
                    $("#txtCustomerName").autocomplete({
                        minChars: 0,
                        minLength: 1,
                        source: commodiyCode,
                        focus: function (event, ui) {
                            // if (this.value == "") {
                            //     $(this).autocomplete("search");
                            // }
                            // $("#txtCommodity").focus();
                            $("#txtCustomerName").val(ui.item.label);
                            return false;
                        },
                        select: function (event, ui) {
                            $("#txtCustomerName").val(ui.item.label);
                            $('#ddlCustomerName').val(ui.item.value)
                            onChangeComm($('#ddlCustomerName').val());
                            // $("#project-id").val(ui.item.label);
                            return false;
                        }
                    })
                    $("#txtCustomerName").focus(function () {
                        // $(this).autocomplete("search", $(this).val());
                    });

                    $.ui.autocomplete.filter = function (array, term) {
                        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
                        return $.grep(array, function (value) {
                            return matcher.test(value.label || value.value || value);
                        });
                    };
                    // $("#txtConsignee").focus();
                }

                $("body").mLoading('hide');

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

//function CargoAcceptance_GetAgent() {
//  agentCode = [];
//  var connectionStatus = navigator.onLine ? "online" : "offline";
//  var errmsg = "";
//  if (errmsg == "" && connectionStatus == "online") {
//    $.ajax({
//      type: "POST",
//      url: CargoWorksServiceURL + "CargoAcceptance_GetAgent",
//      data: JSON.stringify({}),
//      contentType: "application/json; charset=utf-8",
//      dataType: "json",
//      beforeSend: function doStuff() {
//        $("body").mLoading({
//          text: "Loading..",
//        });
//      },
//      success: function (response) {
//        $("body").mLoading("hide");
//        response = response.d;
//        var xmlDoc = $.parseXML(response);

//        agentCode = [];

//        var _data;
//        $(xmlDoc)
//          .find("Table")
//          .each(function () {
//            var agentNo = $(this).find("AgtCode").text();
//            var agentName = $(this).find("Name").text();
//            agentCode.push({ value: agentNo, label: agentName });
//            _data = JSON.stringify(agentCode);
//          });
//        //console.log(_data)
//        //$("#ddlCommodity").select2({
//        //    data: _data
//        //});

//        if (agentCode.length > 0) {
//          $("#txtCustomerName").autocomplete({
//            minChars: 0,
//            minLength: 1,
//            source: agentCode,
//            focus: function (event, ui) {
//              // if (this.value == "") {
//              //     $(this).autocomplete("search");
//              // }
//              // $("#txtCommodity").focus();
//              $("#txtCommodity").val(ui.item.label);
//              return false;
//            },
//            select: function (event, ui) {
//              $("#txtCustomerName").val(ui.item.label);
//              selectedAgentCode = ui.item.value;
//              // onChangeComm($('#ddlCommodity').val());
//              // $("#project-id").val(ui.item.label);
//              return false;
//            },
//          });
//          $("#txtCustomerName").focus(function () {
//            // $(this).autocomplete("search", $(this).val());
//          });

//          $.ui.autocomplete.filter = function (array, term) {
//            var matcher = new RegExp(
//              "^" + $.ui.autocomplete.escapeRegex(term),
//              "i"
//            );
//            return $.grep(array, function (value) {
//              return matcher.test(value.label || value.value || value);
//            });
//          };
//          // $("#txtConsignee").focus();
//        }

//        $("body").mLoading("hide");
//      },
//      error: function (msg) {
//        //debugger;
//        $("body").mLoading("hide");
//        var r = jQuery.parseJSON(msg.responseText);
//        $.alert(r.Message);
//      },
//    });
//  } else if (connectionStatus == "offline") {
//    $("body").mLoading("hide");
//    $.alert("No Internet Connection!");
//  } else if (errmsg != "") {
//    $("body").mLoading("hide");
//    $.alert(errmsg);
//  } else {
//    $("body").mLoading("hide");
//  }
//}

function HHT_ExpGet_CargoAcceptance_Ship_AWBDetails(shipNo) {

    clearOnchanheShipmentData();

    var MAWBNo = $("#txtAWBNo").val();
    if (MAWBNo == "") {
        return;
    }

    if (MAWBNo != "") {
        if (MAWBNo.length != "11") {
            if (MAWBNo.length != "13") {
                errmsg = "Please enter valid AWB No.";
                $.alert(errmsg);
                $("#txtAWBNo").val("");
                return;
            }
        }
    }
    var inputxml = "";
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";
    var AWBNo = $("#txtAWBNo").val();
    inputxml =
        "<Root><DockNo>" +
        AWBNo +
        "</DockNo><AirportCity>" +
        AirportCity +
        "</AirportCity><ShipNo>" +
        shipNo +
        "</ShipNo></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHT_ExpGet_CargoAcceptance_Ship_AWBDetails",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log("VCT With AWB");
                var Loose = '';

                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        var vctno = $(this).find("VCTNO").text();
                        var driverName = $(this).find("DRIVER_NAME").text();
                        var driverId = $(this).find("DRIVER_ID").text();
                        var vehicleNo = $(this).find("VEHICLE_NO").text();
                        // var isComplete = $(this).find('ISCOMPLETE').text();
                        var driverDob = $(this).find("Driver_DOB").text();

                        $("#txtVCTNo").val(vctno);
                        $("#txtDriverName").val(driverName);
                        $("#txtDriverid").val(driverId);
                        $("#txtVehicleNumber").val(vehicleNo);
                        // $("#txtVCTNo").val(isComplete);
                        var formattedDob = driverDob.split("T")[0];
                        $("#txtDOB").val(formattedDob);
                    });

                $(xmlDoc)
                    .find("Table1")
                    .each(function (index) {
                        loose = $(this).find("Loose").text();
                        var ULDType = $(this).find("ULDType").text();
                        var ULDNumber = $(this).find("ULDNumber").text();
                        var ULDOwner = $(this).find("ULDOwner").text();
                        var ULDSeqNo = $(this).find("ULDSeqNo").text();
                        var ULDCount = $(this).find("ULDCount").text();
                        var SEQ_NO = $(this).find("SEQ_NO").text();

                        $("#txtULDTyped").val(ULDType);
                        $("#txtULDNumber").val(ULDNumber);
                        $("#txtOwner").val(ULDOwner);
                    });

                $(xmlDoc)
                    .find("Table2")
                    .each(function (index) {
                        var awbNo = $(this).find("AWBNo").text();
                        var awbNpx = $(this).find("AWB_NPX").text();
                        var awbExpWt = $(this).find("AWB_ExpWt").text();
                        var shipNpx = $(this).find("Ship_NPX").text();
                        var shipExpWt = $(this).find("Ship_ExpWt").text();
                        var destination = $(this).find("Destination").text();
                        var agent = $(this).find("AgentName").text();
                        var Offpoint = $(this).find("Offpoint").text();



                        // $("#txtAWBNo").val(awbNo);
                        $("#txtAWBpkgs").val(awbNpx);
                        $("#txtAWBWt").val(awbExpWt);
                        // $("#txtShipNPX").val(shipNpx);
                        // $("#txtShipExpWt").val(shipExpWt);
                        $("#ddlDestination").val(destination);
                        //$("#ddlOffPoints").val("123");
                        $("#txtCustomerName").val(agent);
                        $("#ddlOffPoints").val(Offpoint);

                    });

                if (loose == '') {
                    $("#chkULD").prop('checked', true);
                    $("#divBulk").hide();
                    $("#divUldTyped").show();
                    $("#divUldNo").show();
                    $("#divUldOwner").show();
                    $("#txtBulk").val("");
                } else {
                    $("#chkLoose").prop('checked', true);
                    $("#divBulk").show();
                    $("#divUldTyped").hide();
                    $("#divUldNo").hide();
                    $("#divUldOwner").hide();
                    $("#txtBulk").val("BULK");
                    $("#txtULDTyped").val("");
                    $("#txtULDNumber").val("");
                    $("#txtOwner").val("");
                }

                // $(xmlDoc).find('Table3').each(function (index) {

                //     var isDisableReceivedWt = $(this).find('IsDisableReceivedWt').text();
                //     console.log("Is Disable Received Weight:", isDisableReceivedWt);
                // });

                // $(xmlDoc).find('Table4').each(function (index) {

                //     var rowId = $(this).find('RowId').text();
                //     var awbPrefix = $(this).find('AWB_PREFIX').text();
                //     var awbNumber = $(this).find('AWB_NUMBER').text();
                //     var shipmentNumber = $(this).find('SHIPMENT_NUMBER').text();
                //     var receivedNop = $(this).find('Received_NOP').text();
                //     var receivedGrossWt = $(this).find('Received_Gross_Wt').text();
                //     var volume = $(this).find('VOLUME').text();
                //     var chargeableWeightKg = $(this).find('chargeable_wght_kg').text();
                //     var isActive = $(this).find('IsActive').text();
                //     var companyCode = $(this).find('CompanyCode').text();
                //     var airportCity = $(this).find('AirportCity').text();
                //     var createdBy = $(this).find('CreatedBy').text();
                //     var createdOn = $(this).find('CreatedOn').text();
                //     var tareWeight = $(this).find('Tare_Weight').text();
                //     var receivedNetWt = $(this).find('Received_Net_Wt').text();
                //     var equiType = $(this).find('Equi_Type').text();
                //     var equiSubType = $(this).find('Equi_SubType').text();
                //     var user = $(this).find('USER').text();
                //     var dateTime = $(this).find('DATETIME').text();

                //     $("#txtVehicleNumber").val(rowId);
                //     var newOption = $('<option></option>');
                //     newOption.val(shipmentNumber).text(shipmentNumber);
                //     newOption.appendTo('#ddlShipmentNo');
                //     $("#txtReceivedPkgs").val(receivedNop);
                //     $("#txtReceivedGrossWt").val(receivedGrossWt);
                //     $("#txtVolume").val(volume);
                //     $("#txtChargeableWeightKg").val(chargeableWeightKg);
                //     $("#chkIsActive").prop('checked', isActive == "True" ? true : false);
                //     // $("#ddlCompanyCode").val(companyCode);
                //     // $("#ddlAirportCity").val(airportCity);
                //     // $("#txtCreatedBy").val(createdBy);
                //     // $("#txtCreatedOn").val(createdOn);
                //     $("#txtTareWt").val(tareWeight);
                //     $("#txtReceivedNetWt").val(receivedNetWt);
                //     $("#ddlEquipmentType").val(equiType);
                //     $("#txtULDType").val(equiSubType);
                //     // $("#txtUser").val(user);
                //     // $("#txtDateTime").val(dateTime);
                // });

                EXP_CargoAcceptance_GetAcceptedList(shipNo);

                // $(xmlDoc).find('Table').each(function (index) {

                //     Status = $(this).find('Status').text();
                //     msg = $(this).find('Column1').text();

                //     if (Status == 'E') {
                //         errmsg = msg;
                //         $('#ddlShipmentNo').empty();
                //         var newOption = $('<option></option>');
                //         newOption.val('1').text('1');
                //         newOption.appendTo('#ddlShipmentNo');
                //         $.alert(errmsg);
                //         return;
                //     }

                //     ShpmentId = $(this).find('SHIPMENT_NUMBER').text();
                //     ShpmentNo = $(this).find('SHIPMENT_NUMBER').text();
                //     AWBNo = $(this).find('AWBNo').text();

                //     if (index == 0) {
                //         var newOption = $('<option></option>');
                //         newOption.val('0').text('Select');
                //         newOption.appendTo('#ddlShipmentNo');
                //     }

                //     var newOption = $('<option></option>');
                //     newOption.val(ShpmentId).text(ShpmentNo);
                //     newOption.appendTo('#ddlShipmentNo');

                //     $('#ddlShipmentNo option').filter(function () {
                //         return ($(this).val().trim() == "" && $(this).text().trim() == "");
                //     }).remove();

                //     var a = new Array();
                //     $("#ddlShipmentNo").children("option").each(function (x) {
                //         test = false;
                //         b = a[x] = $(this).text();
                //         for (i = 0; i < a.length - 1; i++) {
                //             if (b == a[i]) test = true;
                //         }
                //         if (test) $(this).remove();
                //     });
                // });
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}


function clearOnchanheShipmentData() {
    $("#txtReceivedPkgs").val('');
    $("#txtReceivedGrossWt").val('');
    $("#ddlEquipmentType").val('0');
    $("#ddlEquipmentType").trigger('change');
    $("#txtTareWt").val('');
    $("#ddlULDSK1").val('0');
    $("#ddlscaleName").val('0');
    $("#ddlscaleName").val('0');
}

function HHT_ExpGet_CargoAcceptance_AWBDetails() {

    $("#txtReceivedPkgs").val('');
    $("#txtReceivedGrossWt").val('');
    $("#ddlShipmentNo").empty();

    var MAWBNo = $("#txtAWBNo").val();
    if (MAWBNo == "") {
        return;
    }

    if ($("#chkULD").is(":checked")) {
        console.log("ULD is checked");
    }

    if (MAWBNo != "") {
        if (MAWBNo.length != "11") {
            if (MAWBNo.length != "13") {
                errmsg = "Please enter valid AWB No.";
                $.alert(errmsg);
                $("#txtAWBNo").val("");
                $("#ddlShipmentNo").empty();
                $("#txtAWBpkgs").val("");
                $("#txtAWBWt").val("");
                clearAll();
                return;
            }
            clearAll();
        }
    }
    var inputxml = "";
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";
    var AWBNo = $("#txtAWBNo").val();
    inputxml =
        "<Root><DockNo>" +
        AWBNo +
        "</DockNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHT_ExpGet_CargoAcceptance_AWBDetails",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (Result) {
                $("body").mLoading('hide');
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log("HHT_ExpGet_CargoAcceptance_AWBDetails");

                $("#ddlShipmentNo").empty();
                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        var vctno = $(this).find("VCTNO").text();
                        var driverName = $(this).find("DRIVER_NAME").text();
                        var driverId = $(this).find("DRIVER_ID").text();
                        var vehicleNo = $(this).find("VEHICLE_NO").text();
                        // var isComplete = $(this).find('ISCOMPLETE').text();
                        var driverDob = $(this).find("Driver_DOB").text();
                        Status = $(this).find("Status").text();
                        Message = $(this).find("Message").text();
                        var loose = '';
                        if ($(this).find("Status").text() != "E") {
                            // $.alert('AWB already exist');
                            // $('#txtAWBNo').val('');
                            if (index == 0) {

                                $.confirm(
                                    "AWB already exist. Do you want to continue ?",
                                    function (result) {
                                        if (result) {
                                            $("#txtVCTNo").val(vctno);
                                            $("#txtDriverName").val(driverName);
                                            $("#txtDriverid").val(driverId);
                                            $("#txtVehicleNumber").val(vehicleNo);
                                            // $("#txtVCTNo").val(isComplete);
                                            var formattedDob = driverDob.split("T")[0];
                                            $("#txtDOB").val(formattedDob);



                                            $(xmlDoc)
                                                .find("Table1")
                                                .each(function (index) {
                                                    loose = $(this).find("Loose").text();
                                                    console.log("Loose:", loose);

                                                    var ULDType = $(this).find("ULDType").text();
                                                    var ULDNumber = $(this).find("ULDNumber").text();
                                                    var ULDOwner = $(this).find("ULDOwner").text();
                                                    var ULDSeqNo = $(this).find("ULDSeqNo").text();
                                                    var ULDCount = $(this).find("ULDCount").text();
                                                    var SEQ_NO = $(this).find("SEQ_NO").text();

                                                    $("#txtULDTyped").val(ULDType);
                                                    $("#txtULDNumber").val(ULDNumber);
                                                    $("#txtOwner").val(ULDOwner);


                                                });

                                            if (loose == '') {
                                                $("#chkULD").prop('checked', true);
                                                $("#divBulk").hide();
                                                $("#divUldTyped").show();
                                                $("#divUldNo").show();
                                                $("#divUldOwner").show();
                                                $("#txtBulk").val("");
                                            } else {
                                                $("#chkLoose").prop('checked', true);
                                                $("#divBulk").show();
                                                $("#divUldTyped").hide();
                                                $("#divUldNo").hide();
                                                $("#divUldOwner").hide();
                                                $("#txtBulk").val("BULK");
                                                $("#txtULDTyped").val("");
                                                $("#txtULDNumber").val("");
                                                $("#txtOwner").val("");
                                            }

                                            $(xmlDoc)
                                                .find("Table2")
                                                .each(function (index) {
                                                    var awbNo = $(this).find("AWBNo").text();
                                                    var awbNpx = $(this).find("AWB_NPX").text();
                                                    var awbExpWt = $(this).find("AWB_ExpWt").text();
                                                    var shipNpx = $(this).find("Ship_NPX").text();
                                                    var shipExpWt = $(this).find("Ship_ExpWt").text();
                                                    var destination = $(this).find("Destination").text();
                                                    var agent = $(this).find("AgentName").text();
                                                    var DESCRIPTION = $(this).find("DESCRIPTION").text();
                                                    var Remarks = $(this).find("Remarks").text();
                                                    var SHC = $(this).find("SHC").text();
                                                    var AgentCode = $(this).find("AgentCode").text();
                                                    var Offpoint = $(this).find("Offpoint").text();
                                                    if (AgentCode != '') {
                                                        passCustomerID = AgentCode;
                                                    }

                                                    $("#TextBoxDiv").empty();
                                                    if (SHC == '') {
                                                        _XmlForSHCCode = ','
                                                    } else {
                                                        _XmlForSHCCode = SHC;
                                                    }

                                                    SHCSpanHtml(SHC);
                                                    const match = agent.match(/\[(\d+)\]/);
                                                    if (match) {
                                                        const number = match[1];
                                                        console.log(number);
                                                        selectedAgentCode = number;
                                                    }

                                                    // $("#txtAWBNo").val(awbNo);
                                                    $("#txtAWBpkgs").val(awbNpx);
                                                    $("#txtAWBWt").val(awbExpWt);
                                                    // $("#txtShipNPX").val(shipNpx);
                                                    // $("#txtShipExpWt").val(shipExpWt);
                                                    $("#ddlDestination").val(destination);
                                                    // $("#ddlOffPoints").val("123");
                                                    $("#txtCustomerName").val(agent);
                                                    $("#txtDescription").val(DESCRIPTION);
                                                    $("#txtRemark").val(Remarks);
                                                    // $("#txtRemark").val(Remarks);
                                                    $("#ddlOffPoints").val(Offpoint);
                                                });
                                            let lastValue = 0;
                                            $(xmlDoc)
                                                .find("Table4")
                                                .each(function (index) {
                                                    var shipmentNo = $(this).find("SHIPMENT_NUMBER").text();
                                                    if ($("#ddlShipmentNo option[value='0']").length == 0) {
                                                        $("#ddlShipmentNo").append(
                                                            $("<option></option>").val("0").html("Select")
                                                        );
                                                    }
                                                    $("#ddlShipmentNo").append(
                                                        $("<option></option>")
                                                            .val(shipmentNo)
                                                            .html(shipmentNo)
                                                    );
                                                    lastValue = Math.max(
                                                        lastValue,
                                                        parseInt(shipmentNo, 10)
                                                    );
                                                });
                                            const incrementedValue = lastValue + 1;
                                            $("#ddlShipmentNo").append(
                                                new Option(incrementedValue, incrementedValue)
                                            );
                                            $("#ddlShipmentNo").val(incrementedValue);
                                        } else {
                                            $("#_txtAWBNo").val("");
                                            return;
                                        }
                                    }
                                );
                            }
                        } else {
                            if (Status == 'E' && Message == 'Please enter valid AWB Prefix.') {
                                $.alert(Message);
                                //clearAllOnlyifAWBNew();
                                return;
                            }
                            $("#ddlShipmentNo").empty();
                            var newOption = $("<option></option>");
                            newOption.val("1").text("1");
                            newOption.appendTo("#ddlShipmentNo");
                            return;
                        }
                    });


            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function getAWBDetailsAfterSave() {
    var inputxml = "";
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";
    var AWBNo = $("#txtAWBNo").val();
    inputxml =
        "<Root><DockNo>" +
        AWBNo +
        "</DockNo><AirportCity>" +
        AirportCity +
        "</AirportCity></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHT_ExpGet_CargoAcceptance_AWBDetails",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {

                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log("HHT_ExpGet_CargoAcceptance_AWBDetails after save");
                $("#ddlShipmentNo").empty();

                $(xmlDoc).find("Table").each(function (index) {
                    var vctno = $(this).find("VCTNO").text();
                    var driverName = $(this).find("DRIVER_NAME").text();
                    var driverId = $(this).find("DRIVER_ID").text();
                    var vehicleNo = $(this).find("VEHICLE_NO").text();
                    // var isComplete = $(this).find('ISCOMPLETE').text();
                    var driverDob = $(this).find("Driver_DOB").text();

                    if ($(this).find("Status").text() != "E") {
                        // $.alert('AWB already exist');
                        // $('#txtAWBNo').val('');
                        // $.confirm('AWB already exist. Do you want to continue ?', function (result) {

                        //         if (result) {
                        $("#txtVCTNo").val(vctno);
                        $("#txtDriverName").val(driverName);
                        $("#txtDriverid").val(driverId);
                        $("#txtVehicleNumber").val(vehicleNo);
                        // $("#txtVCTNo").val(isComplete);
                        var formattedDob = driverDob.split("T")[0];
                        $("#txtDOB").val(formattedDob);
                    }
                });
                $(xmlDoc).find("Table1").each(function (index) {
                    var loose = $(this).find("Loose").text();
                    console.log("Loose:", loose);
                });

                $(xmlDoc).find("Table2").each(function (index) {
                    var awbNo = $(this).find("AWBNo").text();
                    var awbNpx = $(this).find("AWB_NPX").text();
                    var awbExpWt = $(this).find("AWB_ExpWt").text();
                    var shipNpx = $(this).find("Ship_NPX").text();
                    var shipExpWt = $(this).find("Ship_ExpWt").text();
                    var destination = $(this).find("Destination").text();
                    var agent = $(this).find("AgentName").text();
                    var Offpoint = $(this).find("Offpoint").text();

                    // $("#txtAWBNo").val(awbNo);
                    $("#txtAWBpkgs").val(awbNpx);
                    $("#txtAWBWt").val(awbExpWt);
                    // $("#txtShipNPX").val(shipNpx);
                    // $("#txtShipExpWt").val(shipExpWt);
                    $("#ddlDestination").val(destination);
                    $("#ddlOffPoints").val(Offpoint);
                    $("#txtCustomerName").val(agent);
                    const match = agent.match(/\[(\d+)\]/);
                    if (match) {
                        const number = match[1];
                        console.log(number);
                        selectedAgentCode = number;
                    }
                });
                let lastValue = 0;
                $(xmlDoc).find("Table4").each(function (index) {

                    var shipmentNo = $(this).find("SHIPMENT_NUMBER").text();
                    if ($("#ddlShipmentNo option[value='0']").length == 0) {
                        $("#ddlShipmentNo").append(
                            $("<option></option>").val("0").html("Select")
                        );
                    }
                    $("#ddlShipmentNo").append(
                        $("<option></option>").val(shipmentNo).html(shipmentNo)
                    );
                    lastValue = Math.max(lastValue, parseInt(shipmentNo, 10));
                });

                const incrementedValue = lastValue + 1;
                $("#ddlShipmentNo").append(
                    new Option(incrementedValue, incrementedValue)
                );
                $("#ddlShipmentNo").val(incrementedValue);
                //     }
                //     else {
                //         $("#_txtAWBNo").val('');
                //         return;
                //     }
                // });


            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function EXP_CargoAcceptance_GetAcceptedList(shipNo) {
    var MAWBNo = $("#txtAWBNo").val();
    if (MAWBNo == "") {
        return;
    }

    if (MAWBNo != "") {
        if (MAWBNo.length != "11") {
            if (MAWBNo.length != "13") {
                errmsg = "Please enter valid AWB No.";
                $.alert(errmsg);
                $("#txtAWBNo").val("");
                return;
            }
        }
    }
    var inputxml = "";
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";
    var AWBNo = $("#txtAWBNo").val();
    inputxml =
        "<Root><AWBNo>" +
        AWBNo +
        "</AWBNo><AirportCity>" +
        AirportCity +
        "</AirportCity><ShipmentNo>" +
        shipNo +
        "</ShipmentNo></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "EXP_CargoAcceptance_GetAcceptedList",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                $("#acceptedListTable").show();
                var tableBody = $("#accepted-list tbody");
                tableBody.empty();

                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        if ($(this).find("Status").text() == "E") {
                            $("#acceptedListTable").hide();
                            return;
                        }

                        var NOP = $(this).find("NOP").text();
                        var WEIGHT = $(this).find("WEIGHT").text();
                        var Tare_Wt = $(this).find("Tare_x0020_Wt").text();
                        var Net_Wt = $(this).find("Net_x0020_Wt").text();
                        var USER = $(this).find("USER").text();
                        var DATETIME = $(this).find("DATETIME").text();
                        var rowNo = $(this).find("RowId").text();

                        var tableRow = `
                  <tr>
                <td>${NOP}</td>
          <td>${WEIGHT}</td>
          <td>${Tare_Wt}</td>
          <td>${Net_Wt}</td>
          <td>${USER}</td>
          <td>${DATETIME}</td>
          <td class="delete" onclick="deleteAcceptedRow(${rowNo})"><span class='glyphicon glyphicon-trash'></span></td>
        <td class="print" onclick="printRow(${rowNo})"><span class="glyphicon glyphicon-print"></span></td>
        </tr>
      `;
                        tableBody.append(tableRow);
                    });

            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
            /* <td class="print" onclick="printRow()"><span class="glyphicon glyphicon-print"></span></td>*/
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function printRow(rowID) {

    var inputxml = "";
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";

    inputxml = "<Root><RowId>" + rowID + "</RowId ><UserId>" + UserId + "</UserId><AirportCity>" + AirportCity + "</AirportCity></Root > ";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHT_CargoAcceptance_PRINT",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                if (Result != null && Result != "" && Result != "<NewDataSet />") {
                    var xmlDoc = $.parseXML(Result);

                    $(xmlDoc).find("Table").each(function (index) {
                        console.log(xmlDoc);
                        PrintString = $(this).find("PrintString").text();
                        QRCodeVal = $(this).find("QRCodeVal").text();
                        passValToPrinter(PrintString, QRCodeVal)
                    });
                }
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}


function passValToPrinter(PrintString, QRCodeVal) {
    // plugin use for that // https://snyk.io/advisor/npm-package/cordova-plugin-sunmi-inner-printer-sunmi-v2
    // Method detail link https://github.com/FelOrtiz/SunmiV2-Android-Library
    logoData = 'iVBORw0KGgoAAAANSUhEUgAAAosAAACUCAYAAAD79WNwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAH2gSURBVHhe7Z0HYFNVF8f/bdORrqR7UFrK3nvJEJWhgkwHCIoTt+JWcOCeuDeIioIIKE5E9pIhsvfe3btpkzSr3zk3rzRtkzYtbS1896ePNDcvefve/z33nHM9iglIJBKJRCKRSCRO8FReJRKJRCKRSCSSCkixKJFIJBKJRCJxiRSLEolEIpFIJBKXSLEokUgkEolEInGJFIsSiUQikUgkEpdIsSiRSCQSiUQicYkUixKJRCKRSCQSl0ixKJFIJBKJRCJxiRSLEolEIpFIJBKXSLEokUgkEolEInGJFIsSiUQikUgkEpdIsSiRSCQSiUQicYkUixKJRCKRSCQSl0ixKJFIJBKJRCJxiRSLEolEIpFIJBKXSLEokUgkEolEInGJFIsSiUQikUgkEpdIsSiRSCQSiUQicYkUixKJRCKRSCQSl0ixKJFIJBKJRCJxiRSLEolEIpFIJBKXSLEokUgkEolEInGJFIsSiUQikUgkEpdIsSiRSCQSiUQicYkUixKJRCKRSCQSl0ixKJFIJBKJRCJxiRSLEolEIpFIJBKXSLEokUgkEolEInGJFIsSiUQikUgkEpdIsSiRSCQSiUQicYkUixKJRCKRSCQSl0ixKJFIJBKJRCJxiRSLEolEIpFIJBKXSLEokUgkEolEInGJFIsSiUQikUgkEpdIsSiRSCQSiUQicYkUixKJRCKRSCQSl3gUE8rfFzU2WzHEf/QKDyqgFxu90AkQnzckeI88PWgneT8JfvGg9+I/T6VQIpE0SCxWG6y0+Hh7iedWIpFILnQuKrF4JiUbmbkFyNcZkK83Iiu7EEazGXpDEYxFFpjMFqrIrUKM8T9mC/3dEMUi7ZKPygteXp6w0RsVvaq8vGjxgL+/r/g7NDgQIRo11H4+CArwQ6NILaLCg5VfkEgk/xUbdxwTy/jhPREboVVKJRKJ5MLlghaLLAr/3XcKO/afwikSikdPpSEjh8WiEfoiE4xGEyy2YurlW0VP32otho1UogcdMR+0zUbvGmLHn3bOiy2JHp70ZzE8PdmmSBeLXr1VnvS3J3x9vEkoquDjrYImUC3EYqPoELRsEoXu7RLQrX0TqH297b8nkUjqjS8Xrscn36/GrNduRdc28UqpRCKRXLhckGIxLUuHH//6Fz8u246TSZlIzcpHUZEZXl487GMfsvXy9FREFosuexlTZljI4c8Gh7gq/I+HEIz29/RCl4v/5GF1W7HNPrxOZfzKgtjf3wcxocFo3yIOIwd3xk3De5HAVNm/LJFI6pxvf92EL35Yi09fmIBOrRorpRKJRHLhcmGJRdrTD+euxDc/b8LxM+nQFRYJvyBvWlgc/j/7B5UISqvNBpPJAqvFhqBANbp3SMC4YT1x++i+ypoSiaQu+fbXzZgxfy0+mTZeikWJRHJRcMFEQ+fkF6LfTW/ikdcXYN+RJOFErgmy++yxD9//uyO53YLqIc6Fv9oXgYF+KDKbsfbfw7j7mW/Qd/wbypoSiUQikUgk7nNBiMXNu44LsbNhx1ER4BGg9hG+ehLXsHBkv0Z/EtN+JB43bjuKFlc9o3wqkUgkEolE4h4NXix+8O0K9Ln2FRw+noaQ4AB4e9Eu/59bEasDi0ZvEtZabQCOnc6ER+Q4rN5yUPlUIpFIJBKJpHIatFhcuHQrnv/kN3j5+0Cj8VdKJTWBRSOn2vGNDcXQuz7Exp1HlE8kEomkYSMC+8xm5Z1EIqlvGqxYXLphPx58ZR50OiOC/P1E7kHJ+cHn0F/tIyLHxz34OdKy8pVPJBKJ5L+hRAjajAbYdDpYMtJhOnYExl07ULD8L+R8/jFS77oVp/p2gXHLZuVbEomkPmmQ0dCcXPuu52fjr1W7ECKT2tY6nOhbV2DE1f3bY+7bk6AJ8lM+kUgk54uMhq6IaGasFhQXFcFWUIBiAwlDfSEsOTmwnDwBa0oyzKnJsCYlwZJCS9JZWLMyYcsrgoeKGiofL8DbG3G/LIb60iuUX5VIJPVFgxOLxiITXvj4d7w5cwmCg/zFLCaS2sdksaDIZMGzk67GtAdHKqUSieR8kWKxIrZCPQp+XwTjP5tgJkFoTUuB5ewZEo9GgOoim8VKK9HCWR18fODp4w14kUpUqYQLjc1Kn5mtiJ23EOq+l9p/VCKR1BsNTokdPZ2BT+etgbePSgrFOsSHKmGb1YafV2zHnsNnlVKJRCKpfTxUXig2mZE78zPof/sV5iOHSPyZqdwbHv4B8NJo4BUWTksYvIKC4OHrR5+RUOQvsz2jZJFIJP8JDUqN8Qwk3/22CbrMPOGnKKlbAv19cfBkOn5bvVsMTUskEkld4OHrC83E2xD95XfwjIkSVkMPPxKE3iQWOU8uT6rA69lXl0gkDYwGJRaPnEzDrJ82wFcTKKa0k9QtbLk1W6z4a91eHDudoZRKJBJJ3RA8bgLCX3zN7r9osSilEomkodOgxOKSDXuQlZoDP1+ZcLt+8ECA2g9/bz+CdVsPK2USiURSd2gm3g7/K4fBqtMpJfVIcTGK2f9RjqRIJNWiQYnFtVuOAir7PM+S+oHn1Ya+CMdPpQsro0QikdQ1ltRkMfz8X2A+dhQ2g155J5FI3KHBqDKTyYJ/dh+Dr9pHDkHXIyIYns75riNnkZVToJRKJBJJ3VC4agWKdu+Ah3/9T7RgSToDS3Ym/SW9IyWS6tBgxOLZjBykHkwWcxlL6he1vx82bD+KpPRcpUQikUjqhpy3XwesNnj+B5bFgt9/o+2q4PkfCFWJ5EKmwYjFP9bsEXvDUXF1hc1mg8FYBL2+SPzd0OF9LKR9NRTV7TRXPt5eyE3OQn6BQSmRSCSS2ke35HcU7dwKDz+1UlJ/FK5YBpvRCO8miUqJRCJxlwYjFg8dTwP8fOmvuhmE5uFWi9WKS7u1xIiBnWEyWxq0YLTSvvKZGDmwCwZ0a16nQk4MyPh4IzktT7yXSCSSuiDnjVdEbImnt7dSUj9YkpOQ/+3X8GnRAl4RkUqpRCJxlwYjFg+fSCGx6FVXWhEWEoZeHl4YO7Qnnr7raoRrg2CsY4vd+WCyWBETrsVn08ZjAu2zNa9Q+aSO8PDE6ZRsWGSQi0QiqQMKfvsZ1ox0kXOxPuHo55yP3wWoeVH366+USiSS6tBgxOLp1ByovFV1FtxitdigCVajSaMwdG0Tjyv7tEWR0WQP8GhgCCuoyYLhl3dEmDYQ3mofIFAtkpbXGV4eJBazhMVVIpFIahObrgC6hfNgy82Fp8q91GjF1MG3mc+/js597y3oV69EyOTH4aUNVUolEkl1aDiWxZOp8KnDoQke1g0i0dW0cYR4P2JQFzSKCUVRA7Qu8pzNIUFqPHnnleJ9ZEgQGkWHkJCrQ6ufhwcycwpgJlEtkUgktUnh6hUwbt0i5nqGG37pLBR58QwIhK2w5qMquoU/IPuTD6C55wH4de6mlEokkurSYMQijGZ4etVNOgPumPISHx0qLIvMNZd1wJX92sFG5dYG5LvIvWiD0YRbru2HCBKJTBwJxcRG4SQi61LYeiBHpxd+nRKJRFJb2PR6FPw4H9aMDHi6OQRtzcmBb7uOiHhtOvx69oYtk9PdVI+C339B5gvPIHj8zdDcfJu9UCKR1IiGIxY96i7vVXGxDV4qL7RpEauU8OY8MGFEb2gC1TA3oKHXItoXDVsVb79KKQFCNAGIidIKIVkXw+Z8Ljw8PWAssghRLZFIJDXBkpoC/YZ1yPvua2RPfx3Z772FzOenwLhlIzwD3EtXU2ymTrHFBM3tkxA4cgyiPpkJ327dYUnOoA+VlarAsG4NUm+/Gar4Jgh//mWq3/6bBOASycVCwxGLRF3JRTYc8qwwTeLClRI7V/Rsje4dmoih17oQYTXBkJaLyTcNQkSY3arIBAf4IjE2DL4+3rDV0X6yYGR/xYZyHiQSScPGmpkB/drVyHjmSSRfPwJJo65C+hOTUbBoAYpNZvh26gK/Hr3FsI6toAAeKjfcjNhPUZcPzV33I/CqYaLIO64xor/+HgGjhsGaX3UuWOO+vUgacw38uvdAzNdz4OHrp3wikUhqSgMSix51JxaLbQjw80GbpjFKSSmP3zZY5Bk0N4DhV5uN9qHQiBcfGqGU2GGR2CoxGn6+JBbraMiczz3/ttSKEomkMvTr1yD1/jtxZtClODt8sIhy9mnVGkE33IiwqS8g5OEnxNBvwOCr4NexE4k/HWymIrd8FVlU+nToBM1tk8rM8OLTJBHRn86CL31WGUUH9uPsNYOEwIz5YRFU0RXrfIlEUn0ahFi0p7CpO5VitRYjNlKD1iS4ynN5r9YY0KMljAbzf25Vy0vLw6SHRinvyhIREogAf29Y2cmyDvCgO6HIZEVxHf2+RCK5sDHu3okzA/sj5cbrkPfZLB6uERa/xis3IOyF10gg3gLfNm3h3TgBnmp70u2i/ftg+HczPH2q9lW0makOVnlBc/td8G3XQSktRRUVBRX9tisMWzbj9IDeKM7PQfzWPfDSaJVPJBLJ+dIgxGJdDa2WUoxQTQAiHYZ2HXlgwkAhllhU/lcYTWZ4Banx8kPDlZKyxMeEIjJUA7O57oJxiutQsLtDUloOTiRV35Fd0rDYdzQFKzcfwLe/bMLc3zdj6d/7sO9Ycp3PRCSpOzKmPIEzA3pBv+Fv2AoLEDbtWcQtW4vga2+AKjISHi7S4Zj27ob50EESj1UMBVMbUKzLF9bIwNE3KIUVcTX6ZFi5HMmjrkJxkRGJe0+53B+JxB1ycgzIydMjlxb+2yaNKPAobgBOahz969/ubgSHBsKrlucLZWmlLyzCdVd2wffT77IXOqHJoClISs9BkH/9+7fwJcjNysPN112Kb9+4XSktC1sUxz/0KRYs34GQkECltPbQFRrQOjEGK2Y9iqiIYKXUTlGRCUfPZCJA7Xte1lf2iyzQG9G+RSOlpCzr/j2MIXe8hx/emYRRg7sqpedPAV3/9Ox8IYU9qVfAsVQmEueREUHQBgbYV3LBkZPp8FR51nqvis8Fp21iF4hEJZ2TI9l5hVRZFcJTGbpjJw2DyYRmjSPFd1xhsdpw4mwGVOf1HHkIlwhfXx9EhwfTb1V99GlZOjzz/iIsXLrNPtsQp2AyKYFjtL8ePir40mt4SBBuG9MPj98+GMEB9T/lW33w7a+bMWP+WnwybTw6tWqslF64nO7fHcYt2+Cp8YdXo8aInvEN1OyLWAWWjHRkPPYgCv74FapwuscrqTtsBgM8NFpEvvshAq+0+yq6i37lUiSPuxaWzEK0pGfKk+61/4IzZ/Ox8Ld92L0vFZm0L2s3nMSp3Y8gNLTyOua/ICfXgGMncqDTFQlDiSfVR61ahCMqsvbblqpIzyjA13N34Kff9uPk6dwy3gp8y7gj1Hg9b28PGI0WREUF4aO3hmHwZc2UT6vmxKkcfP39TvxM+3DqbC7VzRZRRzPsxubp6QGtxo9+szmef/JStGhWsc6uCby/n331D+Yu2IPTSXn2YFtlu170yoGn7tpwTBYLrPT1gqRnlZLapUGIxbTMfET3mlw3YtFmg57EzswXbsYto/sqpRU5eDwFbbo9hJDWJGTq+YxwBLSeRFTW5g8RShWyK+57bjY++341QiJqf3ilMrG4bsthDOh1DxCoOXcjVxv+Gp9X3Vl6sLeIovJs3XMSNz78GY7uOoH5c5/CDVfWTl60hUu3Y/y9H8KSlAX4+dj3JS8b9718Fz559kb7Sk4wk/Dy0Yyx9zi8qQarrfuCzyH7yBbmYeqHk/HqgxVdD6Z/sxxPPPElrUPCqyT/aD7t80uT8Mlz4+3vnXD4VDpatb6Dahp6jtzwEXMK75/RDEQGY/6XD9N16K58UJECfRFen7kEr737E9eq8A0Lho/KS4jcks1zXc/PIbvkcoVmpo4RqDK+/Jpe+Ob124TV/GLiYhGLNosVp7q2genIEajCtPCKjEb0dwvg52SI2BnGzZuQdC0JP5WKBBw9d66ge8Oq1yPouhsQ9eEX1apjcj75EOkPToZvz85o/NcaeGmpjqon2H1845ZT+OLrrZjz3XbAkEOlVH/70vNqos5WVCCMKc/bV3aTN95bhymPzqe/2GhRch5M8AkPxb9r70HHthVdqVzBI0U8GcWGLWfw1/LD+HdHMtZtPAUziXh7ZVY+4Mhu+Q9oFIPBA5phQN9EXNa/CTq1j6JL4rwuycgqRGT4ZDrsSDohSiFLiiI9Fvw8CdePaq8UViQzW48X3liNT95ZYz+Zwf5QsdB3lCR0CkpEW1Xw1yx6E9p3isH3M69Hh3ZRyifO4bzFW7edxTOvrcKa33dRCW1bq4Yv7QPXXyUjbdxR5zrMQkrMmmukPwxo1qUpZn08CgP6NBHrVBe9wYypL67AB2/+Se/oOgQHwMvHkwRi6Xl2OAtVQ6fInGdE2y4x2LfpIaWwdqlha1K71LRNcwdx31mLRYBIZbRuGoPWfdoI03N9o88twMRRfRDoX0mFSkRGh8I7wK9uZ3Jxgn8A7VezeGjbJyCMltAaLGHtEhDSNgEIde1zxA+niucHDw3C2Ic+xZ7DScon54c2yA/xLWKhFvsRj3DaFzRpgkaRlYvufUeSoW4RB21H+/47O66aLLwPiAvDpROHOhWKTKQ2EBGt4hBI2xX7TN9DYhPE0T1QGQFqb/iTQNGcx/7y9vzpNYF+JzTItVUkV6fHU9N/FEJRTSIxNC4C/iTGVSQWGQs1VFwh2+h+5WwEPj5eCArwRVhCFIKaRGH18m04dCJVrCtpeKTeMhaWM6egiqZG11OF0MeeclsoMmbqkBWzqaMKA0CxyQSVVovAoSNYGSillVNMnY6cT95H5hMPQ92/N+J+/L1eheKpM7l47uVl6D94JuZ8sxV+Gl+ENGkMbUIoQmKos011+ZDL3bdslbB1O9V53kEIigtFYCMtvVIdFRCEnt3jEBPp3I2qPGZ65lLSdHj25RVo3e0DXDZsFt54aSVWrjhCz6EHNAmNoOV9bRJdbqF6IyEOZlMxflm0B4/cvwCPTP0L6Rmu28Tde/n5VSMgJAD+IWqx+GhJ6Pr4I5rEsity8wx4atoyfPL2GvhHBdG2w6EhocZ++QHU3pxb6Dz6c53mzkLfVQV4o1mTUMRElzV4lOfQkQyMv2Mh+g6ciTWrjiK4cQRduzBog9Xw8/MWdRWLRl74bz9fL2qffaFtpEFwfDSOHcvEZUNmYvrHG6vdHpupE9bz8s9JKK6iaxxFxx4hjp1/X03HUbI4PUYXC9f7/Ox0alt3AV0NQizWJWzC9vPyQO/OVT+4X796K1BgqNck3YYiE4JDg/H0pKvh41358EmPjk0QTY0y32z1iRDcdB45+IXPp3ilB6Q6Cz9QIpKbvlsZbOj2U/vCh3rnHS99DDv3n1E+OT94n0v2374fVadL2nP4LO039SaV/edeenUWPu6S7Tou+ToDgoL88cenrnuAvGvsy8vrV2efRXdU+Z7jUv56VLaIa2Ulkcfbq6R/O+W9n/HpjCUIjgiBn4+32DdO6s7D0JxA3svLkyoyX+oM2t0PcqlTZDCahYhkTeBJgtjPV/qWNURyv/oCBT//BM+QUBQXFEJz8+0InkD1o5tw9LNp1y72n6lUAPK8zTZ6xvyvugYBV1+jlFaOOSUFqXffhvSHHkHAiJFo9NNvUMXFKZ/WPQcOZaDP5TPw2gtLoA7yhSY6UIgKUTfyc8vPKt3nl15SPauTyWTB5u1n4RXsK0QdPz/CqkZ/X9KjMQIDKzcmMCwS2ToZ2+otvPb8Mpw4kyeeQU1cMLThAfDl5432sXz9ULLwZ2q1CkG0rl90CC7t26TSoemfFx8AKTR4qzzg7e0lhBXXfa07xSIizHlHs1BvwoNPLsZXn20isaSh76ns2z5PxG9Yi0koBiA8zLWLy4bNp3DFNV/hp++2IUBL5ybMX5xnMb0kXUCu/1hw81A011Xieir1IF9fvptZ3PkF+uKJB7/Ha++sE5+5A6en63vVl9j3zylo4kPENa6NY+d7j63ZfXrHKyW1z0UvFjklTiMnPmHO6N25KXr3aYv8PH1l9VutwTeh0WDCjcN6onEVFiOmQ4tGYlaX+haL5WFRwAtPS1hoKHJ/MRaROjYpv+Ia+nXqZfnBO1KLgbdNx+Zdx5RP6pfV/xyEifbXSBW/nl7Zt9adRU/Hya+iUubaxQELXTu+fq8/PFpY2eoD3gfept7ZNXGy8HpGfmVhx8PlTjh0Ig2ff/EnAqK08FLZqxEWiFy59u/aHA/edAVeeWgkPpg6Fi8+OBJ3XtsPQ3q3oZ67Pwz02zx8zZT4ZEoaDpzLUDfvO3iFhvHNA48ANQKudR104oxivR7mA3vp69wxqEQsWizCnzH4xglKSeUU0W9mPvkwdHPnQHPXHYj86HN4sT9kPZGSqsPEe35C8ulsaBMiFP/h0uPj+19XQM8+iZarB7dQSt3DYLAi6Wi26ECV1Bol9Ud8vJY6ZK47ViYSCivWHMUt9y7C8y+tINGmgiYhlDqlviTG+BkjMaT8KAsLrg/4OyyIuB7n/RbbokPhy8WZMSJC1Lh6UOXHsGrdCYBEbMlv84vVaEGzxFBoNM79//9cdhhzvtoGNYlQFkuOiLqKhBoLyoJC+6IrKLIvOvtrPr3yOiXbLIG/y/7lEeGuxe2viw/imhvnIjk5n65fiDIKYr9+JrNNbJf9CNlPO4QEIdfX/J73w97ulmzUQwjvgNgoPP/0n/jim3+V8sqZMm0F/t1wEsHxztp7+7HzEHUB3UPnjtthEftB65RHiEU/L3RoW/nQ+/nQIHwWM7LzEdmjbnwWc/ILMXHkJZj9uvPAkfKs//cwLh36HLRNY+pcMBqLTPD388P89+7CwN6tlVLXsGC5/uHPsXzTfhFs4q4vhztU5rP4796T6DliGjQRWuEIzSKXe0i9OzZDVHiw+1ME0u6eTs7BP/OnKAVl+XfPCdz81Fc4mZQpesMMD3UGqH2wdvYT6MrDxzVg+cb9uHvad0jJzIfa11tc12zaj1dIyDxz91BlrYpM/+ov7DhwRuS5rA78+yx2l284gJMpmcLqVlKenZKNieMuw6xXb6k0CGX2z5vw2PSFVFGZhMXZ/t0cvDp1HKbedbWyVkU4orzlkKlQ0TZFr5Ueb65IEuPC0bZZjAiAqeqR523x8DEfw8M3DxSJ68tz30tz8NnMpQiNCxOVtrgH6PVmetZemTwSIcEVrQq87T/W7Mb6rYfx19/7xBD0mtmPo1+36jWqDZ0L3Wcx74e5yJzyGMsLFFMd5dUkEU02blc+dQ/zyeNIGX8dzCeOwTMwSCktB904VoMegYOvRvQ33yuFrtH/vRbpjz4IC/1m6DMvQHPnvfAKrN+AjGtvmYdF3+6AJp6HvOlBUWBrVEGeAf6BvkIktWkVgZW/Vm+KwW07k9G9y1skYiLFM8WwWCnUm7Hs51sqDdj49oedeHTqEmSlFyCQRE5ZEcZ1AAlAEoYmFrI+nggM9hMBFL4+XsKaVkgixECL8FX29eEN48orW+GvXyq3JvtEviBcTITFUiEvNR+PP3kZXnl2UJlyJi2zAFeNmo2dO1OERa8UtugVoyC/CAHBPmjcSCPaGh6VOLfQe/Yj52FXdgNgUe4YfMeW2UDqgH/yzjW4fmQ7pbSU1euO44rhX4sKrqyQpe2SAGV/SfZB7Ns7HtEkZMPD/XHydA6ysg1Yv/Ek/tmWJK4Lb7+UYiHyTRn51AF+TbRVrth3IA29B86AmS4G50x2hPfdYLAgONgX4aH+dBz0O3xoDlU118t8DjIy9cjONQhLbgks+PkeTD/8JLRa92ZKqi4XuVgsRk56Lj5/7XbcPW6AUlYVxeg7/i1sJNEY4iLVTm2Rk56DO8ZfgQ+eGSfEnzs8/NoPmPnj3/DmCN1atMpURyzyLZNL1+zHj+7H5X3aUk/H/ekS+aFo7CKgwZlY5JuzoMCAZvER+OS5CRh4SRtRXh1qKhZ56JQfwOqKcm/qrXIvtPFlT8FSbIMviz0qz6dzzBHAK2Y9gi5VCN/aEovsUsFi8b7xA/D8vcOp4SkS10/8YCXwOryaNkgNNQcFlSP+iifF+eTsAbxuIZ2rK+jazHr5VjSKqjoAa/Ou43Rd9uHGob3QnBrHi4kLXSymTb4Puh/nwcvfH1ZdAfw6dUbc0rXKp+5h3LFNzOrC/oiu5oMWQ9AFOkR9MRtBo69VSp2TzwL22Sdg0xsQ9dHnCBxzQ7Wfy/Mlh8RgqPY5BMRqzvnlMmyVY/eKvj0bY/x1HZGYGIpWzcPRJL56gYjTXl+Fl0jwscWLnz2GrUzhoQH4c+EEdO7g3B/tx1/34fHn/sKpk7kIDvGjuqbseWGLnI32LyZBi8suaYJ27aIQGx0kjoF9BLkTl52tF6Iog4TegWNZIjr4wXsvwYOTXEe9nyYhldDhXQQElvopc12jyzdgxoejMOmWioFxv/91ECPGfIfAMBK0SvvF9QdbywwkgEZd2wGjr2mLFk1DxfXlOszLq1Qwcuq4qMgATLxnETZsPi18+0owGEyIjwnGT9+PR8d2ZWMUUtMK0O/qL3HsSCY0JMZKof0l0RkVFoAH7u6JCTd0QkLjEOWzUg4dzcBX3+3Ap7O2iOvtKIL5Nsyl8/XoMwPxziul0/SW5/4nfsdnX/4rrL3n7l26zpxSjM/FkCuaYeSw1mgaHyLOqWhraRVek19VdB54X6d/tBG//r4fmpDSoXa2iIbR+9TDTykltU/tqY0GCF9UL7Uf+ndrqZS4gweev/8a0djW5ZzRehIBEY3CccPV3d0WikyrptFi6OO/zAkpoApGq/FHaLA/PWjBbi+uhKIr+EEJDPDD0dPpQvBx/r76gi1rmiB/BAeqq7WwuHrk9R+Qn5UvhCLDEe9soXz5oRHo3LaeBQRVxv5+vuI+i+TrEK5xem0cl2haJyZC41Qo5uoM1LMtFKKYYcsEj4Jc2r2lW0KR6d2pKYneYcLiKWlYmI8cYjMwPXzUPHCD5e7IgQM8ZZ81I600kt8JPATtqQ2pVChygEz2ay8h9dab4BUShkZ/rkTQtWPrXSgyU19aIYJ1VA4WHdFRKizCDaPb4+vPxuCeO3riyiuaV1soMpv/PSuGdB0xF1nQskUoQhyEgSOLlx3CvY/9jtNn84R4KCsUi5GXnI/mJLw+/mAkFn4zDp+8OxzPPDYAt03oipvHdsKY4W1xw6j2uOf2nnjm8QF4581hmPnRKMyddQPGk3CrjD2HMqhiK00xw7DoCw8PRBwJamf8toTuLTpnjkKRO+QGvRnPPTcIX7w3AhPHdcYlPePRu0dj9OjaCF07xQqhzAKwW+dY8dvs5yeGXh3g9l6rVaNNy7KdT/bDfvjpJTh2PIvEdNnzyMO9UeEBeHXaIEyl8+JMKDKtmkfg1ecH0XnrAmO+Uex3CfynT1SQsO6mZRQqpWXJztVj4z9nhKh2PF9FdL781So89XA/zPxwJG4b3xUD+iWie2f7cXejpeS1U/sYtGgWBl2hUTyXJfCfFupUdO0Yq5TUDRe1WGTrTmR4MDVg1YuS6962CQb0amn3q3K4KWoLvtHYwnZV33bo4WSIrzIiQoNEI825n/5rWADVB/xwBfqrRcLux95aiJ0HqVJtwPyxbg++mrcGgeGllunCnALhajBuaE86nnp+7LgyoYq0tuAhav5Rj2J7hVXyr7qy9ChOsFsNLuoq6IKk2FyaPJ2TW1uzsmAzUgNVDazJZ1BcaIWHq5EieqatOVkIum6cUlCRooN7kXrHRKQ9Mw3qSy9FzK9/Qd259vKvVpflq46RYPWjE6QUEOz3x3n9WOBwFO758M+2M/CmzllJkyP0gN6Eji0jqJNXcWiRhx4nP/knMlMLqJNa1uDAAizvdA4GXdMaK365FfdP6oW+veKFH15l8PMYH6dFjy6NEFZFfshtO5OoYrHnICyBxWJYqD8inOwv+36vWHscnv5lOxA8BD58aGs8el9fREZU7VaQRAI4M0sv+jIliHNGJywhIUTx0Sxl1pwd+PnP/VDTdh2FGs8cx0O5D91ziRDPXIdVBg9533lLN3TqHCOGrR3xpW1mpuiweYvzgMzNW8+K/WYraQls8GGD1OhhbTHtqctdBgQ5wj6ze/elwdfP8bmi3yQBeeXA5sr7uuGirqnZry6hURg0wdUbww8LCcBDNw2kC1AkrCa1Dc/WEhOpwehBXZz6dlVG59ZxCA8JrNCr+i8oP9xRl3CFFBSoxt5DZ3DLkzOx48Bp5ZOGx/AJb0KtDYQ3NZR8hniIv2mzWDwycRBCqfw/oRYvVWRooJgRyapYnOw5yWxYt/UwUjPyRJnkAobulRLLiYe3N8wk/Ap+XijeuwNHlRqPnQCo7+DqtrMVFcErOAQhTzj3Xy5c9ieSx4xG3ux5iHrzZTRatBg+sc6T+dcHKen5IsCgfOeGO05xscFoRMv5YDCYkZdeCB+f0t9nP0MWQG3aRELtxBfuuVdW4tjBNASxgHUQQTyBQ0F6AZ577Wr8NHscGsfVTUqhjZtJGAm3Hvu2+ZbhbbdsHobo6Ir1XFJKPk7uShJD3yXwsDIPJT9IYlbLKXfcYPueZKRlFYqI8RI4kIrdddq1LWtVZD//GZ9vgoVEvWO2ERH1TPt6/ai2eOwB1/mXy9OudRQu7ddUjKQ4WheFSxgJwb83n1RKyrJ/fwb0ejM8HcSi2WIRvpkP3tNLKamanBwj0k/kiKjzEjgglLoOGD28+i5a1eHiFYt0IW3Uc+jSqmah5D07NsGggZ2Rl6Ur0xs5b+i6shm7d/smQixWl+bxUWLawrqaI7ohwz4cQYH+2H04CY+9tQCpWfnKJw2Hm5/6EjxjiVoJauFofLbq3TisBy7rVXUQU51Ry7eLxWaBmSNdlff+vr5YtnE/lm+qPzcBSd2gSmwGT3YxILXClkEPlQ9y3nsbnE7JLSxmMZTtOhG3B2yGQvh26AhVSEVrXPZnH4ngGNOBo4j6+D2EPvksPOs5kKU8Br1VBFd4lpO/bG1KJ5HHeQPPh517U8Qz6tjWcHCLb6jaqbUtNV2Ht99fDz9tgF2onIOEYnI+RlzXEVMevhTBwe4JsJpw4kwuvBwtXFwf0K5ERwYJ16HybNnKeXNtZQQ3+xl269yIBKb77ijsf2gyWMocNwtrT9qVVollf2fhz/txJCkPPuUCbUwkziNpHx+465IKlsjKYIHKkekBAd4VXcHos1ydcwv8qaRcqjN5+N3h+tL3mzUNRZcO7g8fn02mzjgdd5n7xMz74fw+qU3cP0sXIkYz+nWrfmJUhn22Jo3tD58ANXhquNrCaDYhJDwIIwdXXyiW4EGXrTZyM10o2FMW2OGHRKsJxOp1+zB00vtIzWw4lqxfVu7AnF83IYjuHb463PHkNDRX9muPR28dYl/pv6AObpWvX70NtjOZ535aROZ5FGPi3R/g8x/WKKWSC5GAfgMA6uzYlOFoL7Ua5hPHcXZQP/eGo/nGN5m4ZVUKysJWHU6t43/5QKXEji03B6k33YD0+x6Ch9ofiYcPIOT+h5VPqw8Hw9QWnB6KjULlnTk4gfOZU9n44PNNyHMhFNzhb7bSkRh3HNLlYWYe2m6SUNH/8err5tD6xWUskWzp0ulMaNIuEp+8fU2Z4I/ahq1ih3cll9kGaycVCZnWrcKojq7oh79q3TGqKEo7EELvFJjQo2NMpQm8y3PwUCaKqE1wHNLlDjlHEXfuVBrYwmJu9d/HhNXWURByNg8WaoOubomeXatvrY6LCRYTVfBQvyMsgg/QvpWHM0XsPZAuXBZKBK4YGaTrdUW/RPHeHQpJWG/ceprOYdnnilORtewRX0aI1gXOn+aLAT5vRWb06Vozscj06dwcg/u2RiHnzKsFuPdjsRSjb9fmuG5Izaeyu+KSllBR5WVPFvrf4RgRWFewDwxH3OYX6M89nFzJhERosOOfQ5j41Czk5Nf/rDvl4Xmc73lhDvVgfUSFyXC+RU0guzRcgVBt9dwNag1FzXmparciGdKvHRK6tUJOboFopBgflQrBjSJw7xNf4tKb3kImfSa58AgcNQbeiS1RXOKTTA+cl0aDoj27kDTyShQd2GcvdwU3hPpCu6lHuTfKUEydP3qU/UddrxRQJ3r7Npzq0QnZcxdCM3EsEg+dgk+L87PEJ4++CifbN4dh499KSc1JiNMgPMxfWPsc4booKMQfixbtw/Bxc8XcxjVhw5ZTbKYsIxatJC5iY3i7FeuOnev3IThMTdsvXZ8FiI1E00N396bv1a2VacXak6JDwO1QCTYhXr0Q5cLC9efKw/AM5OwJ9vdm9qMO8MUlveMrpNhxBbd5Kek6lJ84g4diebuRkaXn6uCRdGzflUIitriMFZKHvjl1zkOVRHpXBg+X88gRT1lQBhdVLAcfZaUUlOk7cZ3pRcugasxfrS+0YNvOlDJikS+/rdCES+kcOgZe1QUOu39xIXQF3VBNYmsebRkXHYIxg7sK3zMeTjxfLFYzeFqeMYO7nEsNUxOu7ttR9Kr4IfjPoIotl0Qa57HMzCmgRedyycjWIS0r/5yoqA4FBiPuGdcfowd2Qb5OL3ppJYQ2jsDyVbsw8r6PhFj7L7n/5XniGHm6O8ZCPW+uvG8dfQmGDnB/irRahyoTblA4tQdbOd25Vhn0ylaNymB/1Y+eHUsVlEr8Nl9b3g5bYLT0zK3fsB+x/R/DVwvXix6x5MLBMygY2nvuRbHJWBrsQtdWpdGiaMc2nLmiLzKenwJz0lm7pdHpc13Js86ThPuo4NeqFf2+CXnfzMKZIf1gyc1E9NuvIeabefD0P7/OVTFtwzMyCkUHj+H0oP5InngDTIcPi1Q+NeXy/omw5RhEA+2I8KfWqrF+1TG06vkBvvpuW7WHpc+czgPUqnOnkrWQB6kL9v0TOfcc+P2vQ/Svn3jeHNHrTWjbNhJXD2lVRhw5wnUS+17m5RtdJn7mhRNf86srn/29+0i0sJuBw8ds3YuOChY+nM5IPpAB/4BSQWMxkxiODUKYk2AYV+TmFeHkyRxYLaUCkHeRb6m4RiSsHYJy9h1IR2p6YQURxS5crVuEoX2bmiVzNxo4iTndX8r7EjjmNNjJLDt79qYiQ2egurF0P9jwofbwRM9u7s88xP6XGRmF8KLjKbn2wkJpsqFt6whXWrXWuGjFIs+gEdfRfROvKwb0aIVu7RNQwOHq5wk7Q7dpGiMSF58PbZrHwI8eFE4J8F8RpAnA5Nd/QIcRL6LjyBdo4deKSyda2g2fhtZDnyURUgNLEw83eHhh4Qf3YuSgLtDlFoohEIbrqVAS9Ov/2oabn5ol8lX9Fyz861/8uW4P1H6l+bMMRRb07NAEUyvJ41gfeNB9wo3Z7EWb0Gro8+g0qpJrNepFtB32PPqMewPLNlRhPSKGX94JM1+6WfSY8woM9oqL4FMQEqUVQvKOO95Dz7GvYd2/h8UzKbkwCB57EzQT74Q1N1sIRnFl6V7yCtYIX8TsN9/A6Uu6Iv2+Scif+y1Mhw7AkpqC4qIini/ObpV00XrZdIUIGjpCpM7JnPokkm67Ez7NWyF2/m8IfXyK/QZyAxZ+1pxsWJKTRBJw4/59KFi3GgW//4qcd9+C4e/18G4cBe+YGBT+sggne7ZH+hOTYdyx1b3h9HJ8+s4IgO7p/PyykbAMP2Maxap1x8TZGDDsa2zdmexWB5lzn26nddV+pUO6ImDDxwttW4aL6GJHvpqzTcw97QifMlueEWOubk1CyLWBhNP8fPD5Zgwc8Q2uu+UHXH/LfKfLqPHf497JvyIlRad8sywLft0HD3/fMl0CM3UwmzfW0PYrirBTp3PoX/b4LJUcRUVWMcTOQR7usntfKpKTdcJXtAQhFul8sfXXkf2HMpGVo4e3o0mPYLHYplUkfB3Od3VIyygQo43lxTpXfyEhFYXvlh3JIpE250YugXNbRiRWL3qeU/+kpBeI1Hkl8FC7Z6gaTav5WzWh7Fm8SOBraCZx178WZoZo1jgCIwd2FvnyHH3nqouIHKWexPhretGNfn7mYs4SHx8fKW64/wJhQaKGg310MnN1yM4vrGTRI4sEXi4LxarrTSd4oMBgr5xnvXILBvZrJ3JUlhw7VxQhzWOxePG/uPPpr4RoqU+OnEzDe7NXCiHko/QcOR0CH+rrj45B2H8V/azADzhfrwJqHNlimJXn7BopS56elgJk5xaAp+5zh4mj+uD9KWORGBsmrhNnICiBZ64JbRePA0eTcdWk9/H4Wwtw4HiK8qmkoRP57ocIeeARIchsBoP98aV7yYPEonc8W0SKkf/jD8h47EGcHXMNUu++FVkvPgvdTwtgKzKKSGqn0EOrSmyKlPHXIvvDD6AdPQyRn34pfBgtaSkwnT4J07EjKDq4H0W7d8K49R/o16+BfvUKFP61GLqff0Tu1zOQ9eYryHh8MlLvvBlJ149Cyg3DkXb7BKTdczuyXn8ZHjarSP3DHSZVdIwYStfN+RpJ48Yg89mnoF+7SiQFrw7ffHMDAnyp7suj81FBCHqIpP+a+Gjs3p2M3oNm4NU3VuHwsSzlc+ecOElCKt9AIqC0OeaOFw/x8kwiZSBRdOhoJjzFsG2pWBEBj7Tttq0rT3AfFOSHrp1jcIKEx9Jf9mDpssMVl+WHsXrxAfy78aRLv8ejR7Pg41uuHROR4UFO55Jet5mH2R3FFe0vnT/2/wtxMwqa4WThOoOpjL9iyW9161I2UCSfhKLNyIEwpevyNWN/f1d5K92Bp9xjK2oF6y21STFOjp0DcngKRMf9MJNQvrR39WYkO34qF0UsOh3uE9YknA6pWYIUizWHxOL1V9bcL9CR6wZ3Q9e2CaIBrclQKsOZ+Ns3i8EDE65QSs6Pvp2bVvCfqU9YgPDk+ZzoubKFh9tZ3Pr4+XA7c16w8Jr79iQM6dMOOh6Sdjj+kEZh+P67lbhr2ncin1d98d7sZdi046g4F1wZ8P3BM86MH9pTJKluCPC1Yn9Cvg7OrlHJwtdKTYsvXSvHIZPK4Aj1STcMwM+f3I8xA7uIyitPV2pl5MdFG0wVM52bT79ZjtEPfIJFy3e4HN6SNCzCX3kLIZOftM/mkp1FDa3dU4vnluCZWVRRUfAICEBxfh6MG/9GzkfvkggcK4Sep7/zjpJXaCjyZs+CftVyeMdGwSsyEgU/LUTa3beJ6fzSJ9+H9AcmIe3eO0gITkTKbeNFdHTy2NFIGn0Nksdcj/S77kbOG6+gYNFCGLf9C2vSGdjy8+FBnRUP6qR4abVC1J6D7jdPH194hoTxeC1yP/4QyTddT2LzIRi2bFZWqppbxnXGzE/HCEtOfmahS3cNTpDN+XCfm7oEN9y2AP9sc50bdsnyo2JY3lH8cWdYo6kY4Zqbb0JunpHEUtnns4jESELzMMTGVZ3CZ+iglnjvrWFUZ2rh5+8NbVgAtKH+9iXMn/bdn66RP1p2jEWoE1GVmVVAnUIbeEaREsTzTuIxyoWVcP0GEotUB5ToK7aIeZPgFXNIk4B1lwOHMpCdYyjjL891ri81BeXn4i6k88R5ID3KiUVuhxLiqp80neE259jxbBQWlBWsQhdYrUgsJ9p4ikWemk9ER527vrQulffv475YZF/N3XtT7ffxuYa0GBa6DhFhauFPW9dclGJROM7SDdiuRe3k5eKp5gb2biMsR+UjoNyBv8P5ix++pWz03/mQ2DhCDEPXVLyeL7xdtvCx32Iu9YpdLXkk6nQkHkw8TFkL+8pzUX/8zHgM6ttOJE13vB6aZtFYsHgLHnh1nvC9q2t+XrkDf6zZQz1s73OVF5+PjtSxeH/KDeJ9Q4CvFXd0eOYVZ9fo3ELXqpAWA3W0uBKqDh1bxuHzFybgg6nj0LJJFPLyCkTSW3u95iGsjJpwLY6cysDk1+bhsx9W11tSd8n5Ef7Sq4h48z34de4Ga1YmbIWl/sGiCSTh4unnRwItBKqYWPgkxMFLzY2X8+edv+PppyZBEia+qyPBl/vJe9AtnAf90j9h3LAOxu3bYT54ABb2i8zLs28jMBCqRrHwbhEH78Q4+rsRvCIi7EPjJFg9ff2EQCyxJjqDO068ryq2jNL9l/3FNyIKuzqMHd0B82Zdj9tu6yFED/v/lXSOSqHONImnoMYh2LUzCfc8/BsOHqkYKcv8sewwPMoNK5tNJDzieEiXxK0D7B9cWGAWvsGOsLjkxNxBAe75wo8d0x5jrmlDzyin9rKKKyUW+oePhYVQ69bOffo4cttE3+FzWQJvP0TrjxYuhkOPnsgmMcnTntq/w9vw81MhMT4E3g45A6siNZnqdRLojlY6YVWl/Q0rNwQsajCHfWT4+ETi8cY1yz2Zmam3BzHRNh2Pn9shL+qMd2pfdprBoyeykJScB09vTndjLxMTJFDnoEMb96c55e9s3pYkZvgpaUbFtSLRyTO7lPdrrQsuSrHIqW5iG4WLfIRVkZVb4JaIuX/C5YgJ14gGsLqwY2oLEpwTR/ZRSlzjrm8kzznLPhflo8LqAxYfbEFqkRCBXh2bonv7BJcL+3t269gEHWk9R5+N86EZbffDZ25Eny7NoCPBWBIVzhVRYKAfZv24Ho+8+oN9WqQ64vjZdHzw3UokZeSeC2oRM5vQtZ718sT/Lvl2Ofha8RIToUVvugY8Y5Cz61SydO2YiC5t4t1udBzhY75n7ADMmz4JD906WPSAeUi7RDNwBc/TIXIg0NR3FmHm/HU16nxJ6p/A0dch8rNZCJs6TQzpmlOS7EPT5etOfl++zAmioeX16JWHh1WRUVBFRMIrJJTea0kABgtx6OnvbxeB3t72nI+0vkfJNtzcVnn4G7zvpMgQ+farCBjieq51V/TsGofP3huO91+/Gm1bRUCXo1esjGX3h5+BgCA/7Nqbirc+/LuMm0YJO3cml40G5lPDkdBh/mjcqKwFjIe/87P11DktK4IYfr74tLoDj4Q89kh/9O0dL+otx+vIQk5Fv+XM95DZuSdFdCbLCDb6jZBgP5E3sDzc/u07kAYfDuBRylj88PBpdaZFzKZznJ5NHZVyPojs9hPfvKyoZnzZt6/c/cHnh48vJ7dmGTSOHM/CwaOZwirqCLeHHI3doW3Zc5ZE4pb9FUumN2Q4w0dMo2C0aOp8akFncAT3v+uOI8BBFIprTWKxfdtIqEl41zUXn1ikm6OIBF3z+EhoA6s2zb43ewWS06vuWUaHB+OayzsJYWmphkDjC2pJzsJrD49WSlzDkb7PfPSr8q5y2jSLgTbInxrb/2Aoms5BYYEBj996Jb5/+07MeesO18ubd9A6kzD/3bvFPMu1RZum0eK32ySyFatQDI9xQ+LNw63+vpi/dCueevcnsS4PB1Vo1M4DFjhzfv0Ha7ccRoC6NCqxMCMPk24ZRKKrelM41iV8v/LtOvzyjljw3l34js6Z0+vEC302b/pd+OKVibiEhHhN6dymMd54ZAx++fg+JDaORE5a9rlODZ8qnnO70GjGS5/9jk27jolyScPHt2UrhD4xFVFffIWQx6YIMWdJTYY1P88+f7TyHNQIfj5r8Rl1BW+Bg1ts6VkIf/sDhD0+1f5BDWDBdd8dPbHo23G4+85eMBaakJdfVKGuYd9DTl21bsNJ+/zPDrBl0khix1F4iRy69D6SBIXjTB2MyUTPUZGVPy4Di5FCQ5F4rtylDYnBqwe3FJ143o8SuH4LCvRFp3ZRSklZTp7OUYRp6U5wZg4eCo2NqTgMnpyqQ/rJXDqWUkHDYjE2MhAJTnJIuuLo8Wyc5SnzvMsKI4vRisFOUtB4sFgsf6IIFosnOfq8Buzel4YTx7JEfk1HTEV2f0V2HXAkOTVfBESVBOTwrWEigdeyaRiC2T3HTVgQw6KDt8M5FFjN6NI+uoKluS646MSiuOWpYerdqSndLaKoUn5f8i9m/LBOeVc5j90+BE2p8bNUkVakBN58XoEREa3iMHpw1XOa/rpqNz58Y77yrnJiI7UIDvQr85DXG1xJ0M3bKCoETeLC0SIhqtKFhyVbk7hz7F3VBrztPz5/EJ3bxUOnN51rbHhaJ36Yv5i3BlPfXWTv3avZfF8752r1P4fw/ncrRc9VVAL0uzz83K5zU7z92LXKWg0HzkGmDfYX16tFQmSF6+O48LXiV01gzR3AGbWfDwb1aYu/5z6Jpx8ahfzUXDHcVUJQgB8y0nLx/uyVyC+s36AkyXlAz5K6R2+EP/MCGv2xDOHPvwrfjp1hzcyA+exZu2hswHC0drFBj8hPP4fm9ruU0vOjVcsIvP/GUPw8bzyaJIRAV2AqqYrOwZZDFllrN5xQSuwsX3NMDKOWEV5Up/sH+6Jl84qWvUAScZ7BfvQsld2Al7cn0jL0yMqunsXMwCMz9FMOmxdiilP2OBuqZSvhoaPZZepyHtnh92xVjI2qOJq3YxfPTsOzlyjfoW3x8GmT6AC0bOZ+arsTp3KRml5gnwCgBN7vwiIMvbKif7iNhSIdG6e0KUFYpqmQ/R6ry+mkPCz6Y7/YpqO4Fz6Refl4bHI/pcQOn8dTZ/JEvELpNH+0Q6QfWresXkq/VWv5vvERXy+B3e1UocF0rc5vqkl3uejEooBuzKaNqo4O4gfaRBf6/e9WKCWVE0eN7ZX92oq5nd0RHvwQWfML8OqjVVsVmfdn037kue9rFxIcSPed+1bO2saspLD5L0mMi8CGuVNgNRYJYV7yNLGFkQM1Zv60DtM++Y163eYyTtE1pUBvxLvfrkBOjk4IIoZzcBbTPfHmo9dWex7y+qFY9OT/C2IjtHhl8ig8+fBI6NJyzjWiXGkHagLx0/Jt2Hc42V4ouWBg30BOdxPy+NOI/eVPNFqyBtpHn4Q5ORU2vV48hf9JEBOrHlq4fi6zfSqzGgywJGUi/LmXob3jbqEzagv2vxs1rC0WfD0WoSF+wrfQEc6AYTVYkJ5WNn3Y/kMZ4plw7Eez/19QoA9iYyoKr8AgH2jp9x3zzTLccdWdzUV+tvsiiDtvyWn5wurPp60EPm9sIYwIq+hKU0id8lMnssvsL8PT/EVEBDiNnl619jj1HkvLheWUNqiNqJ7I4TQ47MvpOL8y51vk6VWbN6k4pMv5Gz1puyVuSgzXO2w8KNBX351sy9az2PTPGfiTYHeERzJJruPGMe3tBQos5jKzOAiKLcH2fRYvRit69Wgs3rvLtj0kuD24vSm9p/lcREQFCt/Y+uCiE4tiuIvu5Mt7Vz2p9rZ9J8W0QbqjqXhtxp9KaeV89MyNIs9RVUm6ubLiZMSNm8dh0vWXKqWuWbXlEP7dcRQIDsLuQ2eU0sp5YPxlKM4rLPOg/z/ir/ZB0d6ZsJlNQsyVKBIOquAHdfPO48im81SS2uZ8+JCE4pLfN0KrDRQVD1OQnI2n770GVw8oW1k0KP7De4QdytkN48mHRiL3TNq58yaGpUjgf/3rpjJWR8mFAweSeAUEwb9vP0S+8iaa7D4Az9AwkfuwuLAQbs8nfT7Q887b4eFlS0YGTCfP0vaTUVygswtGut9sBhKwJGJjf/oRIZMfU75Y+/ToEosPXhtKu2QrI1LE80fv9QVlc43uP0TPA//nYKlin7bI8AB0dDIMHBkWgFbNQ2EiweGIeKRIGP321yG3rWY5uUYcPJQt/A1Lp6Gzt10tm4bbf7McO3enUx3LkcCl0oG/wxNXNHERYfzb0iPwdhCLZmsxNGFqdO5cNhikMgoKi7Bnfxp01Ol3dFnkzBdN20cLi255+veOR1yjIPvQvQM8ZPvn0sNCfLoLB7XcOfkXGKk9KWPZJPFmSMnHOx+NUd6XcvJMDrbvSEExiX9HSyTJS9x4bfUmaljDUyVSR+GcVqSfMxea0JdEJ8/FXR9cdGKRe1wajT/CQ6rutZyiXiab1VWNw/DM9B+V0qp58OZBKMzUVdr+8oNmTs3Fq5NHKCWV89F3K1DMfgfUa9m+77RSWjlNGkXQfce9msr25P8DH+rZp//zIcy5hfYhaQXu0bMF0LFyqyknz2bhmdfmIyiGK1Ku4u3T/DXtkIgHbxp4rvcoqQgPQd1JnaagmAilJ25vlODvh9NnM/6TQC1J7ZIx9Qkca9UGpmNHEfn2R9BOvJ0EY8UAQltREcycSPsMLSnJMGekw5qTBYuOxF0BrV+ysNh0XKiM17Hk5sCSnQlLejr9TjJMp5Nhy8qER2AgAq8fi8h33kXc6k3Q3HEPbLl54rvF1BmJeO8jBI2qezcRrdY+DZ/jYYsJFLxVCI0unWHEUGQRaVhYp9lrE7vw4nokvrEWMS5EQKd2MSKQrlQ58LMEBNB2f/x1PxYvO6yUVs7ho5lIS9PBk+rIEljg8vVqXy5Qo4R1G0/AZLFHS5fAwR0BgT7o4MLHMS8ljwRW6fpWWp8D6JrEuR/godOZcSYpTwT+OOY3tND7uKhg4ZdenubNwxBO58RSMguRAvuBZmQV4qU3VisllcPJw6e8uBR5Z/IRzIJNgc85R8JHkrB+YFJPpbSUbNpGBglSxxlkeGiar5tfuQCZyuCcjHsPcl5L79Irzn/QPcXBLTz9YH1wUYlFvh0NJBR6dmwmnI+rYv/xNJE9X0y9Z7Tglc9/Vz6pnLcfvw7q0CDoK4mM5gzvwU0iMW5oL6XENSs3H8Tm3SdF7wwBaixev1f5pHL6d29O+22SDa1CREgQTm7+kCoHU63MuFOe4fd/ROLG95yzsqHIBE2QGh8/MxaxUTXL2/X/hC9Vdu1axlA7Vyrm/ahs6/7T9khyyQVJ3rzvcDjED5mvT0fwiCvR/EQKtPc9gIAx18GTE3NbSutJtvD5xjdBkyNnkbDnEGJ//B1R0z+E5r6HETBwMHy797QvPXvDt0u30qVzF/j26IXAq4ZBQyKUA1MiP/wUjX5fisQTp9Aiz4ymB04iZsZshDz4CPx79YZfx05UP9qHxMNffQvaW+6070Qd89Mf+8AeOg6aRljTtKFqtG1RKqgKeFIDEhSOVkU6Q/BUeYhZTYIchIkjT7JvnNlYRowy3CH29PHEg08uxqq1VQeOnTidi9xCE9Vnjtun3yn2QP8+zmc/O36Kg9V4w6UHx8GFWhJ/7dtUFItHjmXBTOuXFXg2xEUHoksn9y2LPB/0mbOcgqZUeInOpsmMFi5mrImnc9ilSyMxk5SjlZf3haO9Z36zFTNmb1VKnZNG2x16w3f44ett0Igclg4imWMXDBb8Mn+CEHLlOX1WJxKuOwb2FBTQ/naldrsaHDuVJdLUOUbAs1uRb4g/mjYJOdce1TX1s5X6gs8lndRubRuLGVcqg2/4pNQsIbS4J+ejDcBn369VPq2aJ24bDGNugf2GdYTe841p0hnwxmPXOu3xlOe7XzciM1snzNsqH28cPZWufFI1jXu0FNZRiZ2E2FCsm/sUgvz9qNdnbyhqg8feWoi9u49Dq/Gn+8xD9L4N+QZMuLonBvRsrawlqQzuwIVqAmBzCMriSNGsrHylxy25UOCrZVi/FkmjrkLq+InwCg5C1NuvI+7Xv+AVZRcBqphGJPS6i+Hoc42srx/0W7dCpdXCt0VLu/i78x5EvPQ6Yuf+iLjfl9kX+p24xStKlz9XIe63pYj55ntEvvMRQqc8Dw2Jv4ArBsOnUbz9t8tR7E1iy88P4S+8Am0tBbOUwPcrRw1zJ4eHQtnCxMEl9zzyG77+bjsC/DnNT2nzai6yICY6CB3algqqA4czcTZZR+KlVARwu8TT0zVLCBP1jDMSE0LQrGsi8rPKDjezNTMowAd5OXoMHTsHL765WkQQi+np9PZ5oHnOZ04SXUB/r91wEtlZPCOIg+Wr2AZuOVs5SUXDHD2YScfN1j2lgGC/QU2ACtFRFX0ct+1KgZXEaMmR8HlTkaBt1ToKEQ7zOFcFz4LCkdDlo8M5MnzE1c4nP+DRjFvHdxXzNetJ1DnCyci5GuLrNe72BVjz93ERgMTDzWzB3L0vBZ/P2oI2vT/GqiUHoG3MxoDS68EpkAx0vV94aQgu6e7c/5CtthZxfu0niy9nMbUZo4ZW7SLnyP4jmbDkciJ2h/vJYkWIRo2oehqCZi4qsSiGO4rMuKRzM9EIVYauwICkjDy6Yew9Dk63knwiFZ98755p+oEJA+FJ3zGVC/LgSpR9FTt0SMTQ/u3shZXw97YjWLXloL1XSHcTB2Fk5hQgK8+9eZS7t0uA2VDkql6pUyoI5QZC/24tseD9u6i3q6ZK8vwtjOzv+O7r8xAcrhUNAB93QYERnTo1xd3jLzuXZ7HBwpepFi/V5p3HxD1aXfKootx14IwIPCqhiBrb+LjweusdS84f04njyH7zFSSNvxaGjX8j+M6b0Xj1JoQ+/rSyhh1VfALUA4eIwJKSG5BzJdqK6Lrv2iXe1yVeYaEIfWwqtJPuU0qqD3f8eYq5vzedwh/LDuHLr//FF19uwTsfrseb760XQ5nPvLgcdz/yK7pd/jm++GYr/EmwOc6wwv64XiQIhw5qgS6dYpRSu5DioWiVg/LijpS/WoWmiZWPVPzxwwT4BnqLqeccNAzhIWaP4TrqhZdXoE3PDzHqpu/x6NQlmPzUYtz36O+47b5FGHDNV1j4y14RkFLiQ8xwlHWYk/Q3THJKvhCb3p7lrHt0bI1cJOPevZcDM/j37cfIYpRT9bRsFlrOolo5KbTt7DN5ZaYYtBsLrRh8uWtLXb/e8Rg3op0QqWKyjhJot/nYOTBp/o+7MWjUbHS45GP0uWom+l89C70GzsS9JCTzqROgidGUqT4517LRaMGEW7vj8fvLRkCXYBQuBlki+Kbk+ohzZTNjyMDqWRbXrT/JXy4j0E0kkhvFBonpFeuLi6qGFmlktIGIi67aFyIplXoRZzPp4lGvR3lY/MKD8dwH7uU5jAgNxL03XgZ9Sk6Zm57TlFhIoNw66hLEN3LeO3Nk7uItSErLE8NxfENy8MzZtBwcP+M82395xJRyJBbL3M31REiw+z3D+mbgJW3x3Tt3IjZcg5waCBtHhtz5HhAZeq4DwtaExrEhePmhkejYiufIbcDwfUH3t1pde4L2gVe+x73Pzca2faeURMTu8fva3UiiZ06tDMvwY2fW6dGvS3OR7kjSsLEZDcj75kuk3DASGU8/B5+mzcWczjEzvxV/l4drRd/OXeEdHYNiIRjtZV7BKuTNnine1yV+3S9B2JRnlXfV5/SZXLz90QZMvOcnDBg2C8Ov/gqTbv8B90xagCcf+R3PPLkYr764DO9OX4f5P+wWli+OYnYcTWKRUphjQJeO0Xj0vj5CNJbAM7qwL6Nj+2EyscXIH1eRsKwMTpg988NRsJEQ1eUq83afw0O0J8Gh/mJ2lM3/nMWMLzbj61n/Yu7c7fjtt/3YTkKVEz2Xt9SZDWZcNdD5tg8dzUI+fe7hMBzK1lVv2n9X1jIxaw1VmyVCh9toHmFwFpBSGRlpOlKyHFVs/yGuOwoyC9GmVyLUVfj/ffT+CNx1SzfoMwrF+XWE6x2N1l+cL45Cz6TfTErRid8P0qgR4DCzDhuj8nONMJNQvG18F3z+3ggEBFQcfmbSaVsHjmaQIqV9Uy6O0CdqfzSvRjJuZu9B+h2/UlEvMluQGO3TMx5Nm1Sd9aW2uKjEIvuQtW0WK3LKVcXh0+nIytOXsWjw0DVPT/fF/DVKSeVMu384/EMCywwDs69c8xaNMGxAJ3pkSx8qZ+w6dEZYaTxpvZLgCOHbYTJjx373glx6cAJof19xo9crfj74Y81ufL1oI2YuXO/msg7Tv15ao1lwasLQSzvg/SljkUiiPZ+uCwv56jLt49+wbc9JaLUB3LkT8O9EhWlwNjWbjn+Dk+Osevnyx/V475vl2O7mda4pXMHwrbV970nM+W2z2K6z/amwLFiHT75fhQPHKqa1aZ4QhR/nrca4x2bgvhfm4LvfNiEtM1/5tCKpGXl49Ys/8doXi+EbaHf+Z0SuOHr+hl/WqVyEoaQhwT5phSuWIu3uO5D24N0opno2YtpURM/4BsHXjVPWco5fp84IuGoYijmpMD9AbCHRhkD34wJYdXU7JadXQM3SWLH1a9OW07jtgZ/x9HNL8ffGU/D1UyG4UTC0CeG0hNISAm28Fto4Wrg8IgCBJCwcffN4qFCXRZ2hfol457WhiI0ta7E7vD+NxF7xObHIdTifopFDW8HfIXrYFTeP7YQ3XhiCCBKF+SQY+fvKo6U89x7C+KDR+EEbFQRtNC2RgWIuaE2wX4VnTny3wIhrrnQuFnftSYGusKh01I7W5xyCrVuE0z5XdMXR6YqQTuKLh4P5p/n32bqm1fiiRdOqDSklcDDKzv3pgJi9pFh01nMz9XTO/fEFCTZ3ePPFIbj5lq5iesM8ES1unyNaQK98TOxTzZk1Avy9hZ8huwfwwtW+gY5TR99r1zocb9E5f+vlKyudYi+Drjvno+TAS94OLwYSmc1aRyCS7pXqsH7zKfhRJ4R3lO8pnvO6a6/GuHVC52oFypwvHnTxlCbwvyMjOx+RPSZTTyiwjPm+OvB1z87WYcxV3TDzpVsQSo17Zbz55V948ZPfhUnccZsc8NKueSz+nvuUuHGqgn3Z3p2xGNpwrahU83IL8cYT1+PJO6+kG6TkbnTO27OWCjHCgtUxByAneL79un748qWJSolrUtJz0Wb4NOoxWUTvqKboCg1onRiDFbMeRVS5/Ff/ktDoOWIaNBHac6KWfT05xYP97nH/FjKSSE8+PEtMnVief/ecwM1PfYWTSZn2oCMih67p0/cMw+uPVkxN4C5zf/8Hk1/7AXl0jOzLyIeQnZyDV6aOxTN3D1XWqsgWEokDbn5LVBi+PqXnVjwy9BvswcBzLtcUI127Lz+6D3dcW3EoY/bPm/DY9IUwGk2i9yv2OSUHr04dh6l3uZ6eLCktBy2HTBW+ryU+Ltz7Zz8jG+22EMxuXC4+xiLqOH3++m24e+xlSqmdJ6b/iOl03/pRR8lIHS61JgADe7VC5zYJaNo4HGHKVIc8d3c6Pdt/rt2N5ZsOilxwJdeVdyInz4CubRvjt08eQCM3RgMuFL79dTNmzF+LT6aNF9NyXshY0tOQScJQN38Biq1GaO+5H8FjJ8Cvaw9ljarRr1+L9IfvgzUlWczhzPeWJSkZEdPfQ8j9DytrNRw2/Xsat9z7M44cykBAsO85S2Hlj439U84haLEWQ08NOuhr14/qgDdfuQqJ5aa1Y//Bfpd9hn3HsqEm0cEpvswZOgy9vhMWfjMW/uXmiq6M3/86hA++2IyViw/QNqmu0qiVNkUZNXN45EXtzUV0DdjqyQvvL0f8gtouqjSQnTENIeXmWWZ4KPuTL7dA5e0prGzGjEKoNP74bf6NuHpgRb/BHSQurxw6i4QTiTMePuaNF5rRtnMM9v3zkH0lN9h7IB1jbpyLI7vO0v6RiCOh26tHHJ56qC9GDmurrFU1LGwX/LwXs77bir//2kfiM4A6r77C2lu+rebjY0ugiTNr0LUKI3HL82lPHNsZvbpXPZr0+18HMeL6OWxatg9F88HnFWLIqI5Y+vMt9pXcgMV5cOCDgH8EHQDtS5AvRg1vi6ce6Y/eLnwl64rSbtAFjvBXpIueGBcu/BCq4szZTBioF1VenLKJ/NDJVMxY6N6sLreO6gNNaLAQDWxh7Ng2AYP7tq1w85Vnz5EkLFy2XfSSyvtXsjhY++8h5V3lxERqRRRwfSfI5t4i90zZedf+6t5CyovOjfIj9cS4oT3w6sOjEODnI6bEcmcHdHRvPPvBz6K3Xj5Yiq8tNwrC/8bJMbqziOEoEk6tE52nm6hNRPQfNXi8cMPnbH8qLnTMwkpS8VyFk0ikEyN8NUPo/mMxveTvfXh39jI89c5PuP/lubR8j0femI8XqEO2goQiz9hSIhT59HNQAKvthyYMvKiE4sWCtUCH9Ccfxtlhg1Cw+BcE3z4JjVdtRPi0V6slFBn//gOg7tUHxUb2H7bPVuIZFoKcj96H1Vg2SOO/5uDhDNz/6GISJinw8lVR/WwTeQV54SCRkoUbcc79xz58PF9zXrYeeVl6MUzJwq9bzzj8Mv9mfPzu8ApCkdm89SxOpOpgJQHDfoc+VI++9PowfPbO8GoJRWb4Va3w1cej8PWs6zH0mrZCKBbqzWJ/ctMLkMv7xvuYa0BuDi0k8vKoXEeClgUUD+PyMPnTzw7Cn0vvdCoUc6hTuO9QOkx0fJwr0myyYdio9lj+80SnQpHhbTVtHo7O3RuhW+dYdO0Yiw4ktEaT2KkexWjdOgIjbuiCZ18Ygl++H4/vPr+2WkKRYWvtreO74JtPx+DDT27ANcNai7qOh6a5PuJE6mxBZAsgD/UG+nth4MAW+PjzMfiVtvnWi0PcEoosxLl96N07Hn36N0X/vk3Qv08COvVJxJArqjeN6n4Syp17tcfoMdTpoHvjz0UT8cn0a+pdKDIXjWWRrSdFZgs+fOZG3Hldv3MWMGfwDCwTHv0Ci5bvoAejooNoQYEB3VrFYfUPU+BXTiiUh+4JvPTBL3jx9R+gigrBs3cPw7T7r1E+dc2n363E/S/MgSYsWDS2jrDFztNMD/vuz5WSyrnpiZmY+8tGhIZr6EZVCqtJlZbFkdOgCddSx9VulmfEXrs+zU7JPp6G1ANfIIoEdnm27jmBm576CqeSsxSrrgey6d6Ycs8wvPZIzS2LJbz79TJMff9nIZoKs3R4ZYpry+JLJHLe+PIvUZlw5Vv+vJ477Goevx0PaoQsMFmog7H1U6fzes7+ZRMef3shjEWKZZH+y0ply+JYTJ3khmXR11s4zpe5Voyb+8vVQk5uIWa8PLFCUvlvf92EWx78FCGxZYeShAWTetJsrWDEMA7dL5zr0nG7bHHkoKwn6Ny/9MAI6txVr3Fs6FyolkUeGTH+swm6+XNRuHQxPEOo4923P0LuexCq2Ebw9K15Pjf9ujVIv38SLNkZ8PIPovuyGNasLAQMvQaxcxYqa/23FBVZ8P5nm/Dq9LVimJbnc3ZVn3JwBPsbsnEhMJCHLn0Q1ygYzZuG4bJ+TRAfp6HFdZDKzj0pWLz8iHhGOZilFYmqdm2i7J3I8yCNhCAHg7Cw27E7RUT3shEjJ9soLII87SBHTIeFqtEsMRytWoSJ6OoQrR9ioyvORV1CJgnPr+ZsE0K5UYwGXTvFgqcD5OThruBh6AwSqvZDsh8X1yuhIWpxft2Fg0U4xRCfa62m4vB5TeEo8bT0QmTn6EUic6EhSDjy0C6npOEh/NBQfzov1Qsi4XtbpzMhl8Q5uxiUSBG24IbQ/lfn2NkCnU0C3d9PhYhKznV9cNGIRR6G9SIR8Nsn92NAD+c9nRL2H0/BbVO+xvZ9pxDkZA5cIdbo9Y3HrxVBLFWxlcRUj2ueR+uWcZj97iT0bO88R1UJp5OzcfOTs7Bu2yGEagLPNegl8E3LqRa2/0K/2bTqXFQfzVmFh56ahZDGkfSuZpezMrG4eddxXHLFU0AkRwPznV+Tbdi/V3wiHUlnvhWBJ+XZuOMYxj/8OU6dzoAHi0X6SnFWPh6ePBrvkbCrDaZ/tRRPvDSXLrINr1Bj/sxdFcXiys0HcBPtR2p6HjzOCZnafEyoETKaxFRU1n3OHf1nzF+HB1+dB5OxCB4q+zC0jcTitBduxgsPuvbTOZWUjRb9HoGZKjwPEbVYs2vFM1AgT4+P374T90+4Qim3M3/JFoy74XUgJhQ+al/4kzD1FEPedH2dbI73vbjYgzpzJI5zCuAX7I83Hh2De8ddViYH2cXChSQWeS5n447t0C2ci6K9++BJ18O3c3f49esHv07d4BUcLKb2qw0yX5mGvE8/EOlzPOmeLqb7wVZYgEaLV0Dd8xJlrf8OjnxmH7vCAhMJEudWdYbFAHfguOlkVw8WWNwxElZ7H88yAS6u4DqeO1Vcn1aVuaOmsPjlCGA+LvYPZtHG4oX3Vew3d4Td3DYfKw9VczJu/k5VI2eSi4+LRizy8GKT2HAseO8udGpdeQX9y8qduPeFOcgvMAinVmdwoErfbs3x3Zt3iDmhK4MjQie/Mg862oe51LhWBrfBny9cgwdf/kFYzxwDbErgh5uTcL74wAhMcSJmynMyKQuJbe5ESNsEpaT6VCYW9x5JwuiHPkNIkJoqnJpXbMUexUhKycG/Pz3r1Gdx39FkTHl3EU6nZJ/zv8zNL8Q9JNgfvnmQeF8bvPzpH3j+4c/w4vv34vn7ylqBudPxyFsLsHLjfmiD6qgnR/UsB9xc0rEpZr3q3H/lt1U7SdguF/d1SU86I0eHx28bIkSWK9Iy83D13R/Ai4QiuwrUFK4U8uj5ePnB4bj+qorDjlv2nhDXavfBs8jkvKD8hWC1SE7LQ9hsMeH7mK39psIiPmB40DUfM7gbnp50Fbq3r/m92tC50CyLLBiLOXE2ixe+Z0gc1pUY4GFt45ZN8NJoRS/CatBDFRktknP7NK3eEJ1EIqk/LhqxmJNXgKv7t8eMlyYiLrrycPLZv24ksfY9/cW+XM4bVBYN/NkHU8fhllF9lFLXpGTkiuHtRJ6CrxI4Z9+tU77G7yu2IzQ0WLSx5eG4Zj01sNcO7op5706yF1YCi15N/C0Iack5vGpWyVcmFi9GHnvjB2TmGjD7jduUkhL4ishes7uY6J7fezgZf23YJ/xs9xxOQgqJfRaHCPBHRKNQ9O2SiJtH9EFvEsexkZXnj7sYuJgCXGobc9JZnOnbDTZTEbwCg7hnDGteLvz6D0DcIvfm55dIJPVPzU0PDQjRCS40oV/n5lUKRbYC7j+SgiIzT+6tFDqBfTvysgswe/46JGXkKKWuiYnQVikUmc27TuD3H/+GNsS5UGR4tzxIM2eSAHYHHk5o37c1icYipURSFe88Pc6JUGSkUKwOPj7e6No+AVPvHoqlXz6C5HXTUXzkKxSnzUfx8a+Rvv4d/PzhAxgzqOv/hVCUVI53ozjELFosrJlWvV4EUXkFa2BYvRLJY0fDVlC36XQkEknNuCjEot02yrnvqnZEzdXpxbCtxWwhken68Pk3A0MCsGHfSfyxsnZmG2AL4PuzlwH0u1WNEHrRpeEhxWOnM5QS16hUKnRp2wRW9m9TyiQSiaQhou7aHTHfLoAtIxs2jpD28oJXSCgKV/yFlEkTUXTiuLKmRCJpKFwUYpH9orSxIYh0w3KRk68XM6TwUG9VbjkqTy+YLDb8snqnCEo5X9ZtPYzlq/cgOLg0wbMr2BE5OSMPR06lKSWuYb/Hgb1biWTeIoWQRCKRNGACr7wa0bO/Q7GpCNaCAhHEpdJooV/8BzIeuBuGv9eg2Mq1tPtwzVdczynEJJL/FxqGWDxPfVNUZEZibATiqxiCZjJzdEjNzIOfG1GYLCY5l9zf249h087z7+1+MGcl4EO9aK+q7X+cQoHnFE3Ncj0zhiPR4Rp4BPmLieglEomkoRM87iaETXuVBKMJVl0+ir28oIqMhGHzBqTcMh65772Jov17lbUrh79ftG8vbAa9UiKRSGoTrxcI5e//DAOJvbdnLIGvuux0Se6i15twSZemuHFYTwT4l8wQ4Zx/dp/A1z9vEImW3dkWW+3y8/ViHwdd0qbK33fFv3tOYsrrCxCs5SFod47RA2azBfExobiyXzulzDWct++31btElK07qRvKw98PDwnCxJGXIDCgZsf4/wxPYcgWa8epJjnnIE91l033D3c8/BxmgSnPsbMZ4h7jTgynmEnJyBcBUxwVXj4PJ8NxaRwdXWgwIeDcrCgQUfzpuVROzwTnM3S18H1iMJoQSPcz+/HyvnOiYY2TVFJMns6AHQfPYPv+kyJqPS/fIOaw5RQi5eEZiM6kZp+bycUZfKxp1BHiV+6QXUypOHYdOivmzR52WQfRiZO4Rt2jFzyDNDAfOghraio8/Pzss7zo9dCvXQXDpg3w5OhsXz94BAbAQ1X2GTKfPImi3Tth2rdH3EM+zVpcVPfS/yuc81M3bw6M27fBKzTUHj3P5bTwPVG4bAm8mzSFp7pifWXje2fFUhi2bIY35wf190fhkj/ofloNv67dlbXKYjp6GLpfF8GSnARVQoKwdDPGPdSmzvmGOiJ7aF+2ivdFu3bCuPUfWrbAwMs/G+HdtLnYju7Xn1G0dzd8Wra2ZxZwwHz2NPTL/0IBbafgjyV03+5CcZEequgYeHhXbBv0K5ej4K/FdPzh4hyUh7fPn3s3jqdt130OxgYRDa2jhiu4430IDg2odjQ056oq0Btx3/jL8NZj11U55d1H363EQ899i5BqzBrB8zEW6PRY9tWjGNy3auHmjMF3vIsVq3cjNCpENPRVwasUGoxifuNfPr5fKXUNW0xHPvApNu04RoKFH6DqVZgcDd0qMRorRTS0bOCqy8Kl27B80z7MeKF0ikb2UX3t88VYvWE/xlFHZvIdVzpNFn/gWApuvP8jdGsdj0/euhOrNh/Aqx//jrYtY/H8AyPQ2InFnFMrvfvVUiEuH7+zNEn3j8u24ctvV8Lq7WVvNOl/FXeM6G+e8s/Kk9BTmdloRlxsKGa9dhv2H0/F3U9+iZiwYPxC93h5NtA9NWPBOmzcfgTJGbkkgoG4SA36dWuBe8ddjl6dyuYVPXwyDfe9OAefv3gTmsc7n6FmPf3We9RBDA0LEtNjhlciLC80ZDR09dGvWoGc999G4arl8PT1haeG6iBPL9jy8qghVcGnfUf4dukGVVw8PEhMehTbYD58COZjx+DbrQcChlwFP3qVXBwYd2zDqZ7d6T7wR9SnXyL4hhuVT4CsN15B5kvPIW7ZWgT0KzthAGOkzkPyiCHw7dwN0bO+g2dYGE736ADTqdNokV5xpI7nLc+c+hiypn8I9SVdEPfbUniF24NVs6a/juzXXoIqNpbqTQ+6H3NFR8YrjD6n+5Kt4hzRH7d0LXVUmuNEp1bUsfFFwpbdZVrggqVLkPP2KzAdO0riMJru4XCYdu8gUUyd7vsmQ0sLi0ZHkkYPQ94vfyJ8ymOIfG26UlpK2kP3Q7dwHhqv+hu+bao7K071aRDD0PZcgzXTrGy9CfT3Q6sm0VUKxfwCI3YfPsvOiHzd3UZY6qzF+GLBepENv7ocP5uJFct3IDg82C2hyIj9o1VT0nKRR0K1Kji7ffPGESim/ayp/BebrMZ5kZQyc+F6zJy1TFjLSggKUCM+NgxbVu7AZyS2tu87qXxSliff+Qm7Nu5HPglAFn8nzmZg44odWPXPQWEFdAZvZ/qspfhj1S7k5BUqpUB2biHWkbhjgbdp5zFs2X0SS9btwWJab9XmQ2I2Hu5QrN92BFv3nRadLbYablnyL/5cs1v5lVJmLFiLCU98iW/nr8HJ5CzEhGtJ2AXhbHoOZs9eiQkkMvnYHeF5tDfvPo7rJn9Ox5KplJaFLa6L1+7Fik0HYOQKV/J/jf8VgxD50ReIfP9j+PbsjeIiE6wZaaLXzI25YePfyPv0Q2rUH0fm45OR886bsGZlImj8zdDcPkkKxYuMlInjEHjN1fBQq4W1zxFVozh4UZtvPXNGKSnFZjQgf+4c2MzF0NzzAIm6cNjSM2A6ehqBI0Yra5VFv2YFDNu3wq9TS7rXimDNz1M+oTp81LWI+2OZCMiK/HiGSFTv07odIt7/BDHfLUDMnIWI+f4neCc2hSUrG9b0FPh16FhGKOZ89B7S7rwZnhFRiPp4Jq2/CLE//IC4P5dAc8e9yKZOUs7H75XRBux7az5zEurWCcj/akaFaTFtVGeaT5+FT9uO8HRidawLGoRYPB8/O86Ez3M+NnIjuCUrrwAHT6aS8veutqAK0AbgF2rAtx84pZS4z6uf/wmQCOCp8qoDZ9nPzC3A/mMpSolreCivY6s4UbnWCPoaR1XLIZzqs27bYew7ShWa2Yon3v5JKbUL/mGXdUTnQV1wZP8prP33iPJJKWlZOvxB91VAy8Z4QJnGz5uHQILVCKAKkZNbO2PZ+r3IO5OOQyQs128t/d1rh3TFmh+mYMP3T2PDvCn4c8ZktFLmnx4/vCe2/vQc1s95Cpt/fBbfv3uX6GCJbQT7wy+o7JDOmi2H8crnS3Bq62Fc2qcdFn/xkFiWffkwlnzxCHr0a4NjJEhf/uwPWrd0LnO2YkaEBGLXtqMYM/kzpbQsnO7JP8gP/nSMXueR6F1y8eCd0ATaO+9D9MxvEfnpl9A+9BjUl10BH2p82bLoRyIyaNwEhD77IqJonYi3P0DQmOuhiqp6livJhUPRrh0w7D2KsJdeE0O7lpSzyid2vCIiuLGCJamiWDSfOA7dnG8QOHwE/C+3T+RQdPgAbLk6qHtXnCWIo/F1ixbCu0ki/K8aRuvlw5KeqnxK9VTzllD36Q+/rt3g26wFbPpCeLeksksvh1+XblDTPckLDzlbzpyCJVUH345dlG+TEN24HjnvvQnfHj0ROf1DBA4bAZ/EZlCFR8Cvey+ET32BOkpXiqHpop3blW/RPh/Yh6Id+xH2wuswpelQ+Etpu8JYzlJHP/kk7VdnqLT1M7d+g6il2W/KbteqPhYSixEhQYiNqlos5usMOHkmC77KjBjVwZuEm5V6uG98ubRaguzY6XR8vehvITarZc4keE7dvEIDDpPArQoevu/YmsSizVojvch63VNcAykWq8u8P7YgJSMP3hEafDd/tXCLKCEhNgzjr+kNmKz4c+0enErKUj6x88ncVaCLjH5dWmBAtxZKKVHJNSzUF+H97+h72kCkpubgp+XbxET/DPsJ9uzQBF3axovOQ7d2CXS/e7NTqnhOmjWOQGf6rHt7WkeZ6cjeoy27waycArpvN+DMobPoe3UPfPrCTRhCgpFdFdo2j8HlvVrhuzfvRL/BXWidM/hkzirqjNktnPxLPJe1X2gQdu49iT4T3oTZaZQqrSlN2ZJyeMc1RtDIMQh75gVEz/gGsfMWodGixYih18h3P0boQ4/Cv29/kW5HcvGRes+tCB5yKfw6dIanOgDmQ6UdUcaneQt4BgbDmpGulNixmc3Im/MtPHxU1KkYL9wZmKItm0X2E18n/oqGTeuhX/EXAkhYqvtdimKTEcU5pZZFRyzp6bSkUKemqdN50vWb/hatJ8+nztjy85A341Phb8uikHOMlsdTE4zgGyfAmpkB097SFH0smEHVdvANY+HXsgkyn31K+cSO6cABWOj4fdk3UjnOuqbhdOk9KmkdK8FK4oitis3iqk6IfYYa1rPpufAu5yTtDmxx04QEYvH3q0VKG3eZ/NoCFJMS81EcZqsDR03n6PTYfbisGd4V2gB/BGgCYbZalZLq4eXNw/M1uw7/r7BVb/HKnYgloSj8WYvMeOGj35VP7VzRuzVakhBc9c8B/LOnbFT95wvWcG8JN49wfxht/tJ/cfBoMnp3a4nmiTEkFndgx4HTyqdl4bRSNpGBpFhY4d1lJ4nEP9fthk9YEJ648yq0ax6rfFIKC8cXHxhJD4cnFq/fK6ydJfCWxHSD9NkmOu7Bt79PIloON0vcx9NPDa/QMGE55EAFVWQUvIKCzwUfSC4+dL/+iPzNuxE1ex5VWcVQNU6ANb2sK4uHRgsPP19YUsoaUSxnTkL33VcIGHglAi4bqJSSsNq3G14aH/i266CU2LEVFiJ/9hx4RcUjgDon3gkJKNabYT7l3F3IdOIYrDm5UMXG0D1Y0eBUtJHEoloFv+49xXvjtq3I//knBI6+Ab5KmTM4QAVWixjGLqFo6xaowkNE/Rk0fDhMx5Kh37JJ+ZRWz0hDMX3Hq1HFermuaDhikVoX95syO2wQsZmtiIsJQRgJucrgOZnP8DRk1GjWdNSL09kgSoPrXAytlafIYsby9bsQGFgz5S+ipm0eSM10b1YDjk5tlRgJo9GslLgPS0Ru3OUwdPVYtHIHzmzaj3cevxb3T7iMuq9++HLRBnG/ldAqIUoIRmTosGrzQTHfMzN70UZkHExCFN2/E4ZXHCJxxVtfLiN96Y2XHhqJyTcNROHuE1hKQo0DscpT5mpW49Lm5ReKoKkWTaPQokmkUlqR+NgQtOvcFIbsAqTT+gzfQjYRSFOMj58fzyVYu2YnRj7wkfhcIpFInJF+7yQEtImHdzSJIJsVPq1aCbFoPlPq/qWKiIQndRqsuWVFZO4XM6hMh8AJNykldor27YdPfGMRKOWI6dAB6H74FpqbbxKdEBVt08Nf41QsFtN/NhJoXkFB8E50Poe57o+f4dO+9blq1nT8KJBvhl+fPpVWvWJgh9sLnqNdlHCk87/wadlK/B004VZ4edPvz/hUvGcsycn2jpQTa2Vd0XDEoopOZzWNWsXUInvRDaANKk1X4gq90Yg9R86Ki+IsItUd+KJqNIHYtPEQ/tlzTCl1zUOvzIOFtuXlWfOeMKdNycjKR1JqrlLimvjYUAzq0Ro2vbFaI948DMkJcAPVPnZBLHGLLXtP4o+l2xDQIRE9OjXD0P4d0LVrM+TRffb+tyuUtSBSEY24ohMiWjXCFzOXYN+RZFH+wme/0b8eePruoeK9O/yweAsOLduOzu2aYPAlbdA0IQL+HRPx9jdL8e/eE8pa5w9b4JGWixaNI6Cp5PkKo+ehY5vGnDIAGdklYpHuIfq/MLsQN43ojQNLXxc+RqtW7MKg298Vz7mPDz8THqISlkgkkux33oQlJxcJKzbaC7xUUF96BcypKTAdKR2K5hbKSxMGy4njIk0OY83NReZb06G9+x4EXD5YlDHm9FRaMuHbjf0KS62BbFXMnv4G1JdfBs2tt4syVUQUCbAQmE4er5AQniOgjbt3iyFlVWPnGQ6Kcs0IuMK+bfZtNPzzL7xbJkAVlyDKXGFNS6UD8hD+mXxsFr0Blqx02ude4nO/Ll3h26MbClYuF/tmKyiA6fABqBIS4RXuuiNf2zQcscgIie0+ZrqgbE3r0KKRUuKaQqMJB09U7ftXFSLnnbcHXv9iiVLinLOp2fh721Ex5M0GwprC4u1sSjZOJFU97R/nvON0KNwaV/NUEsWICAuEdzVTF/0/s2LDPhw9loLbRvc9N+/xPWP7czgwnnh7oXhfwhW9WmNg95ZAZj72HDyDnQdO4XRSDrxjtHj45tIhk6q4/bnZ8Gweg5vYD5IYSL879uruKM7TY/OOEyK6uTYQ3RsSfRyAwz6SruAUPimZeaKz51+S75F2gSs9unlFGp3WzaLx5Vt3ACSaV/61DQ+9Po8qHk8R5CKRSCQc/a77eSHUnTujKOkMCtevRuGmDTAd3A9PqlbKDzl7aoNhyciArcjuH5715itQkRYInnCLeF+C9dQpFBsL4NuxY5luadHBfdCvWwlVk0QY9+5D4dpVKNrH2SDMsBw9TF8s62Nt0+loXw5C1agJicUmSmkpRSdOijrTp0Mn8Z6PB4V5wq/WM8D1qCen3uE8oZ5qanub2n3WLYf2c8VK24k/t88hDz0OM9WlhatX0rtiWHOyoYqyu2XUFw1GLMbHRcBoqt5UTTy/c4Q2CD06lM3z5gxOP3OKGmdOMXN+Q60eCI3Q4NdvVmLvMbuFyBlvf7UUB4+n1iiYxhFPanBzCw1Iz3ZvJpdGUSEIpv0zm6vpt0giI1wTRJ052YC7w44DZ/DNTxugidBi9JBuIqk5B7lMumEAoPWHlSqbt2b9paxtT23Uv3cbqFrGYdqnf5Bgmi8i9J6+e5iyRtV888sGGM5komObeNw8uo9In2Ox2XBZj1YIjg6l7S1xmaqmuvDUmZ4xoTh6Kg3pDumAypOercO2vScBEorhGnul6JgCggNdmDuu64+fPrgX3mFB+Oib5bjv5bkosthEEJdEIvn/Jm/GJ3ZLIYmn5BFXIWXMcKSMvhq5H04XidjNx8uO5Pn16Q8bdbxFFHJ6KnLeegdhTz4Jv86lkciMYdtW+tcG3zbtlJrITtbLz4MEB4o2b0LS1Zcj5foRODvkMlgzU2E6fLDCtJG2Ah0sxw7Bp0VzePlXHGnRL5onXjkZN+PB6QC9fUmoGkh/uu5s88xD+jUr4d2yFXy72PfduGsnim1WqLt1P7fPgdfdwGlHkf/VV7SPmbCcPAHfdu3hGfx/KBa7tk2AhdR4dXQcW1EiwwKRGBeulLgmLbOAGvMcqMTw1/nBbaFHkwjc/ey3SklZktJzsHLzQZH6hpfzgS2LeoMZZ9wYhmbiorXCymUyV9NvkQ4qhoSPjxSLbrH6n4M4cjwFZhJrj5LwG3L7exh570cYMOEtaAKpMqFKbPHa3SLApIQRl3dA367NhCWO8x96aAJw0zX2oQZ3+OKH9QB950xqFgbfMh0j7v4QQ259B9OpY2Kl65d2Ngt/rOGIOsc+dM1o1jgSbZvFIoPE50/LtrmIZgYWr9kNHW23ZbMYtGtZuYV/1KAueH/qOISFa3D8dIbITmDPsSqRSP5fsaanIW/uNyJaOe7Xv5CwdS8Stu9Hk52HET1nAYkub9iyy46seUdHs4sf/eFDQvE1MZNLyCNP2j90wJJ0Gp4+fvCKLx0K5hQ1hYuXInTqNDReuxkJ2/bR9g4g8eBJBN98Oyz5FhSXaz+tmVmwnM2AKj5eKSkLD1GrIgNFIBbjGayBd4uWMB85AmuW61FB/d/rYNq1A/6XXyECuBhrarIYmvF0GGJmURw6ZQqsSWdQ8Ncf8AgKdjqrS13ScCyLPHxqKusnUBksFD1J2LBQZKtNVRw5lQYD9URqSwwFqn3xz54TWLv1sFJSylc//S0ScVc2vZu7sOWFZwLhWT54SrmqiAgNRlxUqNNgh0qx2pDYOBwqKRar5NCJVMxcsA4qPx+RisZmtSAvrxAFJH4ysvLQMjEKfr4qbN17CguWcM/WTlx0qLACqul7RVn5GHtVd7Rs4nyGk/IsWb8XmzcfQEh4MFomRCE7pwA62h4n4eb+VaMoLTwCfPHGzD9hMjm79lX1wsp+3q55DEZe0Yl9G/DhnFX4/Id1IudnCTzVIJe/NnOJSOFz66g+6NvFueN3CezCcd+Nl+H5+64R0yIWm8y1IGslEsmFTN43X8J09AhCHn0KqrjGIsUMRwjzTCccwewVRcIwp6yxhC1x7BFmJLGV895HCH12SoWp/zhBt/nUCRJd1K45zI6Sfv8k+HZsC+3d98GLRR1ti9M1cdCMTxv7DG3m5LKjhqaTp4R7kU+79kpJWcwnjsE7KqpMwIlfp46w6a0o/O1XpaQshq3/IOPh++HTqSs0t04SZcWkgM1HDkIV2/iceBTQsfoPH0Ui1oi8mZ9BFRYO74SqR1RrkwYjFvt0aUoyu2yW8sqw2Wzw81ahS9vKnUdL2H0kSfhQ1Va0L0cOc4q4t74s67uYlJaD1f8cFsPA1Z260BkcjMPOtslpueeiaCsjKjRIpBHy9PQqMxxYGWI9WthnUVIVxSIB9cHdxzGAhN9n0yZg/vv3Yv5H9+IHWuZ/dB/mvn0niae+0J9Kx7c/rYfN4TrcOroPonj+Zb0Jz94/XCkti/A7JLHPqW5Kbtdn311EtWqBmNbyh3fvxvwPS7ZHy3v3YMZLE4XwTN19CotWlCZ35WvL0/yJ33Phzyj2jz4vduhgsP/rveMGYNSV3WDL0+OxNxfg/pe/x5uzluJNEogPvDoPk1/5HoYsHSZc0xO3jemrfJPPULHwJ+bfdDz2Eu66/lI8PelqeKt9YGDfHolE8n+JiZNo//yjSHejdpJehi1qHHhiOXNa5BUsgeeF9tL6I/PZJ+BFHfaQhytaFXm41rTvIHyatTyXi5ATcBdu3A7t5Mec+hKy2OMqt2i3Qx1qNqHon41QxcTAu7lDLlwFa16emHpSlUgaxgF1/8uguft2IYYzpjwG/bo1JEKTYNiyCXlfz0TqHTfBKywM4W9Mp9+2p8CxZmfRtg/Ap3VbMU+6I75tWsOvdx8Ytx9AMbXvKif7Upc0GLHYv1tzIebcnc2FGyFfXxXUft7Cn+/I6XQcdbKwhY9f/952BJ7USLsroKqCRac/9TQ4z96vq3YqpWwB2oPdh87Clxrb2tClvLc+dIzHkzLxz56TOEti1PWxZiCVGu/gYDV8fNwXi2yFDI0KRWhw3U9GfqFzOiUbXy3aAA86V2OH9kDfrs3RplkMOraMEwsHW7VIiMKTd17FN6mYUm/u75uVbwNNGoWL9XsO7Ow0d+E56OZh0ciibfnG/dhO1x4hAZh23wjEx4SKhNsl22zdNBoDurfEdUO6ApHBePbD35CrJMjmG8iDu+BEpQ87rWcpZ11k/9f3pozFC0+PhVbjjwVzVuHpF+bg6Rfnir8jwoMx9ZExeP3RaxEdXnY+cREIRv9bxFhRWXjWmEdvHYzHbx0i1jO4YTGXSCQXF2wEKfzlRxJI2dDcNgmeQUHKJ6V4eHtDFdsIxUYjbDk5SilJBW0IicQ4ElZ7Ef7Ca/D0q5iezpKSLASj7yX94KUIw6zXpsG3XTNoJtojoMvD1kyv0EASmXuUEtrPwkIU7doOn1bNoQqt6PJmTU+HNSsf/oNL5+hnvDRahD3/EoJvugUFJFLT7r0dydePQOrtE5H93psk/Pohdu6P8O9d2tG2pqbQ+ciAb+cu8FCXFYsczBI0llORkViOT4B3bP2lzWE8SFDUjno6TwqNRYjt/zhMJFzUJMKqQlhfPIrRKEKLAH9fYclwrs08oPLyEAKLLTW16lBPp47nmx7Stw3+nPEwMrILMOn52fiNxKMmKKBWxCLDVlQ+jthIDQLUviSoXQ/XszUzN79QBB6wVdIdS2pOvp7ERgt8+8YddncAiUuySYSxnx4LngE9WyIy1LmDMVvX5vz+DywmK9o0j0HvTqW9zj/X7YXeUIQxJO6cpXE6fCJVTA0Ypg3A1QPai87H3sNJCKTODg9du4LziK7behj6IhMJx24IIUHLHYEltD3uUHVu3VjM3FKezFwd5i/eKlL83DKqj1JaCt9/7IO7YdtRHDiRAs9iDzRpHI6r+rej42pWwQ3EYDThz7W7kaMzYMRlnRBJotIZ7F7Bw+uX92pN57FiQ3Gh8u2vmzFj/lp8Mm08OrVynmZDIvl/h4NZjNu3wJaXB/9+l8EzoKKxghNPsz+gNTMdfj16Q6UtnalNv3qlSDETNPI6ISrLY0lLhWHjevj1vEQMbVsNBhQuWgDvFq3EFH3OsBYWwLByGbwio6Huba8LbUVFMNC2PEJDoO7Wyx684oAlKxOFS/4Q0ws6m6WFI6mNu3fCfIhnXUkTs8/4duoM3y7dzonYEjjCW79xHdTdezn9LWteLgr/Wgyfdh3g176jUlo/NBixyNz+zDf4+oc1CIlgK0XVIoetiyaTGTzlX0nUpVPoI27cxdzMtaXgFDiCO0Dtje/fnoSCQiPGPjZTREB7e59/II0jLI6L6FiFSK4MOjyempC3745Q5FWy03Lx2N1D8crDo8V5klQOPzLVcWcovz7frxYSce6ea77Pq5MbtOSRrs4+ugMLT/tUhh7w9/MmkXj+94p9qN3Dbom8SJBiUSKpmpIcq5W23QolrV51agn+juP61am3Hb/r6u8SnJW5opgNPbQPrvbD3d+qzjZriwYzDM3wcJrIZM5nwg24AfXz9UGgv5+wLrpc1L72xtbNG6U6sDA0FFlw53Oz8eibC0R0Z20LRYYbUw6McHp8jgsdKyc8dvehYN9KT7Uf2rdsJIWim1RXhJVfn++R6pzr6ghFhrdX3X10B2+Vl7BWhgT714pQZDhbwMUkFCUSiXuwSHRHKDK8VnVrifLrV6dOdFzT1d8luP+rtK5n5XET7v5WdbZZWzQosXjz8N4ICg8U4qu2qYvGk+HfZUteVq5eRIg2DMHl/rEW6k24pHNTWiqPZJVIJBKJRPL/SYMSizGRWrwxeQyMyVl1Ju7qAt5Xno3Cx4nfREOGEzp7eAHjr+mBVonRSqlEIpFIJBJJKQ1KLDKD+rdHSLNo6IRvlKQu0en06Nm+CYb0teeWkkgkEolEIilPgxOLzRqH48k7roK50Cic3yV1A09Pp1KpRPqX5vH1Nxm5RCKRSCSSC4sGJxY52fWEoT0x6NIOyM/Xn4vslNQenHqHA1uuv6obLa5TsUgkEolEIpE0OLHINI4NxWuPXosWidHQFRilYKxF+FzynLzd2jbGh1PGITaiNG+VRCKRSCQSSXkapFhkerRPwKsPj0RUhAb5hQYpGGuJPBKKCTFheOnh0Qi/iBIhSyQSiUQiqRsarFhkxgzphrefuA5NYsOQm6+vOiG1xCUstnPSc9C2eQxmv3k7BvVuo3wikUgkEolE4poGLRbZf3H8sJ6Y8+ad6NE+EXnZ+cLXzu2s3RIBzzKTm5KNKwZ0xI/v34MBPVoqn0gkEolEIpFUToMWiyVc0qUZ/vj8AVw/sjcK8guRk1soyi+gVIz1Dud+ZEtsTkYeDPoiPP/kdfjhnbvQummMsoZEIpFIJBJJ1VwQYpGJDAvG16/cim2/TUNi43Dk7D+N7JwCFJksQhRdSEm86wq7QLTBUGRGdnIW8o4m4+br+2PTvKfx3L3DESF9FCUSiUQikVSTC0YsMjzvcdc2CTi85FXs3voxenZqJoRiXmYess9miOCNInOpeGT9WGGh37lgF/qndCmZ/7cYJrMVOfl6u0DMzIcnXdVbxl+Gwzs+xrdv3I7eXZqJ+YglEkk9wM8nv/A/EolEchHgUXyBhxmnZuRh+8EzWLPlIP5YvRtHT6fDnJQFcDCMjzctXrQW1doqEkt8pJ70t9BNF4p4son/BVar/W8b/WOxAEZlDu2YEHRr3wRX92+PAT1aoFu7RIRo/O2fSSSSemXmwnV4f/YKfPvmHfQsJiilEolEcuFywYtFVxQYTDhwLBmHT6TBbLUgI7uAJGMx8goMMJDIsrLwEv3/hk2A2lvMtOLl4YFQbQACA3yhDQpE84RIEdksjRcSScPin13HsX77UYwb2gNxUSFKqUQikVy4XLRiUSKRSCQSiURy/khHNolEIpFIJBKJS6RYlEgkEolEIpG4RIpFiUQikUgkEolLpFiUSCQSiUQikbhEikWJRCKRSCQSiUukWJRIJBKJRCKRuESKRYlEIpFIJBKJS6RYlEgkEolEIpG4RIpFiUQikUgkEokLgP8B6zuoZpdDWhoAAAAASUVORK5CYII=';
    window.sunmiInnerPrinter.printBitmap(logoData, 200, 100);
    window.sunmiInnerPrinter.printTextWithFont(PrintString, 'Calibri', 24);
    window.sunmiInnerPrinter.printQRCode(QRCodeVal, 3, 0);
   // window.sunmiInnerPrinter.exitPrinterBuffer('commit');
}

function deleteAcceptedRow(rowId) {

    let text = "Do you want to delete this record?";
    if (confirm(text) == true) {

        console.log(rowId);
        var inputxml = "";
        var connectionStatus = navigator.onLine ? "online" : "offline";
        var errmsg = "";


        inputxml = "<Root><RowId>" + rowId + "</RowId><UserId>" + UserId + "</UserId><AirportCity>" + AirportCity + "</AirportCity></Root>";

        if (errmsg == "" && connectionStatus == "online") {
            $.ajax({
                type: "POST",
                url: CargoWorksServiceURL + "CargoAcceptance_Delete_AcceptedListRow",
                data: JSON.stringify({
                    InputXML: inputxml,
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (Result) {
                    Result = Result.d;
                    if (Result != null && Result != "" && Result != "<NewDataSet />") {
                        var xmlDoc = $.parseXML(Result);
                        $(xmlDoc)
                            .find("Table")
                            .each(function (index) {
                                Status = $(this).find("Status").text();
                                msg = $(this).find("msg").text();
                                if (Status == "S") {
                                    $.alert(msg);
                                    EXP_CargoAcceptance_GetAcceptedList($('#ddlShipmentNo').val());
                                }

                            });
                    }
                },
                error: function (msg) {
                    $("body").mLoading("hide");
                    $.alert("Data could not be loaded");
                },
            });
            return false;
        } else if (connectionStatus == "offline") {
            $("body").mLoading("hide");
            $.alert("No Internet Connection!");
        } else if (errmsg != "") {
            $("body").mLoading("hide");
            $.alert(errmsg);
        } else {
            $("body").mLoading("hide");
        }
    }
}

function getAirline() {
    var inputxml = "";
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";
    if ($("#txtAWBNo").val().length < 3) {
        return;
    }

    // $('#ddlShipmentNo').empty();
    var prefix = $("#txtAWBNo").val().slice(0, 3);
    inputxml = "<Root><AirId>" + prefix + "</AirId></Root>";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetAirline",
            data: JSON.stringify({
                InputXML: inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                if (Result != null && Result != "" && Result != "<NewDataSet />") {
                    var xmlDoc = $.parseXML(Result);
                    $("#ddlOrigin").empty();
                    $(xmlDoc)
                        .find("Table")
                        .each(function (index) {
                            var newOption = $("<option></option>");
                            newOption
                                .val($(this).find("SHED_AIRPORT_CITY").text())
                                .text($(this).find("SHED_AIRPORT_CITY").text());
                            newOption.appendTo("#ddlOrigin");

                            $("#txtAirline").val($(this).find("Select").text());
                        });
                }
            },
            error: function (msg) {
                $("body").mLoading("hide");
                $.alert("Data could not be loaded");
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function radioButtonChange() {
    if (document.getElementById("chkLoose").checked) {
        $("#divBulk").show();
        $("#divUldTyped").hide();
        $("#divUldNo").hide();
        $("#divUldOwner").hide();
        $("#txtBulk").val("BULK");
        $("#txtULDTyped").val("");
        $("#txtULDNumber").val("");
        $("#txtOwner").val("");
    } else {
        $("#divUldTyped").show();
        $("#divUldNo").show();
        $("#divUldOwner").show();
        $("#divBulk").hide();

        $("#txtBulk").val("");
    }
}

function clearDetails() {
    $("#txtULDTyped").val("");
    $("#txtULDNumber").val("");
    $("#txtOwner").val("");
    $("#txtOwner").val("");
}

function HHT_ExpCargoAcceptance_SaveDetails() {
    var MAWBNo = $("#txtAWBNo").val();

    if ($("#txtDriverName").val() == "") {
        errmsg = "Please enter Driver Name";
        $.alert(errmsg);
        return;
    }

    if ($("#txtDriverid").val() == "") {
        errmsg = "Please enter Driver Id";
        $.alert(errmsg);
        return;
    }
    if ($("#txtVehicleNumber").val() == "") {
        errmsg = "Please enter Vehicle Number";
        $.alert(errmsg);
        return;
    }
    if (MAWBNo == "") {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if (MAWBNo != "") {
        if (MAWBNo.length != "11") {
            if (MAWBNo.length != "13") {
                errmsg = "Please enter valid AWB No.";
                $.alert(errmsg);
                $("#txtAWBNo").val("");
                return;
            }
        }
    }
    if (document.getElementById("chkULD").checked) {
        if ($("#txtULDTyped").val() == "") {
            errmsg = "Please enter ULD type";
            $.alert(errmsg);
            return;
        }
        if ($("#txtULDNumber").val() == "") {
            errmsg = "Please enter ULD No.";
            $.alert(errmsg);
            return;
        }
        if ($("#txtOwner").val() == "") {
            errmsg = "Please enter ULD owner";
            $.alert(errmsg);
            return;
        }
    }

    if ($("#txtAWBpkgs").val() == "") {
        errmsg = "Please enter AWB NOP";
        $.alert(errmsg);
        return;
    }

    if ($("#txtAWBWt").val() == "") {
        errmsg = "Please enter AWB Weight";
        $.alert(errmsg);
        return;
    }

    if ($("#txtReceivedPkgs").val() == "") {
        errmsg = "Please enter Received NOP";
        $.alert(errmsg);
        return;
    }

    if ($("#txtReceivedGrossWt").val() == "") {
        errmsg = "Please enter Received Weight";
        $.alert(errmsg);
        return;
    }
    if ($("#txtCustomerName").val() == "") {
        errmsg = "Please enter Customer Name";
        $.alert(errmsg);
        return;
    }

    if (passCustomerID == undefined || passCustomerID == null) {
        errmsg = "Please select valid Customer Name";
        $.alert(errmsg);
        return;
    }

    if ($("#txtAirline").val() == "") {
        errmsg = "Please enter Airline";
        $.alert(errmsg);
        return;
    }
    if ($("#txtDescription").val() == "") {
        errmsg = "Please enter Description";
        $.alert(errmsg);
        return;
    }

    if ($("#txtSHCCode").val() == "") {
        errmsg = "Please enter SHC code";
        $.alert(errmsg);
        return;
    }

    if ($("#ddlEquipmentType").val() == "0") {
        errmsg = "Please select Equipment Type.</br>";
        $.alert(errmsg);
        return;
    }

    if ($("#ddlEquipmentType").val() == "ULT") {
        if ($("#txtULDType").val() == "") {
            errmsg = "Please enter equipment type.</br>";
            $.alert(errmsg);
            return;
        }
    }

    if ($("#txtDOB").val().length > 0) {
        var formattedDate = new Date($("#txtDOB").val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2)) d = "0" + d;
        var m = formattedDate.getMonth();
        m += 1; // JavaScript months are 0-11  txtUNNos
        if (m.toString().length < Number(2)) m = "0" + m;
        var y = formattedDate.getFullYear();

        var flightDate = m + "/" + d + "/" + y;
    }

    getAllSHCCodefromPopupOnSave();

    var Driverxml = "",
        AWBXml = "",
        ULDxml = "",
        DimLinexml = "";
    var connectionStatus = navigator.onLine ? "online" : "offline";
    var errmsg = "";
    var AWBNo = $("#txtAWBNo").val();
    Driverxml =
        '<ROOT><DriverDetails VCTNO="' +
        $("#txtVCTNo").val() +
        '" DRIVER_NAME="' +
        $("#txtDriverName").val().toUpperCase() +
        '" DRIVER_ID="' +
        $("#txtDriverid").val() +
        '" Driver_DOB="' +
        flightDate +
        '" VEHICLE_NO="' +
        $("#txtVehicleNumber").val().toUpperCase() +
        '" /></ROOT>';
    AWBXml =
        '<ROOT><AWBData AWBNo="' +
        $("#txtAWBNo").val() +
        '"  AWB_NOP="' +
        $("#txtAWBpkgs").val() +
        '" AWB_WT="' +
        $("#txtAWBWt").val() +
        '" Pcs="' +
        $("#txtReceivedPkgs").val() +
        '" Weight="' +
        $("#txtReceivedGrossWt").val() +
        '" WtUnit="KG" TareWt="' +
        $("#txtTareWt").val() +
        '"  EquiType="' +
        $("#ddlEquipmentType").val() +
        '" EquiSubType="' +
        $("#ddlULDSK1").val() +
        '" NetWt="' +
        $("#txtReceivedNetWt").val() +
        '" AgtCode="' +
        passCustomerID +
        '" AgtName="' +
        $("#txtCustomerName").val().toUpperCase() +
        '" Dest="' +
        $("#ddlDestination").val().toUpperCase() +
        '" offpoint="' +
        $("#ddlOffPoints").val().toUpperCase() +
        '" ULDType="' +
        $("#txtULDTyped").val() +
        '" ULDNumber="' +
        $("#txtULDNumber").val() +
        '" ULDOwner="' +
        $("#txtOwner").val() +
        '" ULDSeqNo="-1" ShipNo="' + $("#ddlShipmentNo").val() +
        '" DESCRIPTION="' + $("#txtDescription").val() +
        '" Remarks="' + $("#txtRemark").val() +
        '"  ' + AllSHCFinalSave + '/></ROOT>';

    DimensionsStatus = document.getElementById("chkDimensions").checked;

    if (DimensionsStatus == false) {
        DimLinexml = '';
    } else {

        DimLinexml = '<ROOT>' + inputRowsforDim + '</ROOT>';

        //'<ROOT><DIMData SeqNo="0" Length="' +
        //$("#Length1").val() +
        //'" Width="' +
        //$("#Width1").val() +
        //'" Height="' +
        //$("#Height1").val() +
        //'" Pieces="' +
        //$("#Pieces1").val() +
        //'" Vol="' +
        //$("#Volume1").val() +
        //'" VolCode="' +
        //$("#ddlUOM1").val() +
        //'" /></ROOT>';

    }
    console.log(AWBXml);

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "HHTEXP_CargoAcceptance_SaveDetails",
            data: JSON.stringify({
                Driverxml: Driverxml,
                AWBXml: AWBXml,
                VCTNo: "",
                // 'ULDxml': ULDxml,
                DimLinexml: DimLinexml,
                AcceptanceType: "A",
                Loose: $("#chkULD").is(":checked") ? "ULD" : "BULK",
                AptCity: AirportCity,
                CompCode: CompanyCode,
                UserID: UserId,
                ShedCode: SHEDCODE,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (Result) {
                $("body").mLoading('hide');
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log("VCT With AWB");
                console.log(xmlDoc);
                $(xmlDoc)
                    .find("Table")
                    .each(function (index) {
                        Status = $(this).find("Status").text();
                        msg = $(this).find("Message").text();
                        if (Status == "E") {
                            errmsg = msg;
                            // $('#ddlShipmentNo').empty();
                            // var newOption = $('<option></option>');
                            // newOption.val('1').text('1');
                            // newOption.appendTo('#ddlShipmentNo');
                            $.alert(errmsg);
                            return;
                        } else {
                            errmsg = msg;
                            // clearAll();
                            $.alert(errmsg);
                            $("#txtVCTNo").val($(this).find("VCTNO").text());
                            EXP_CargoAcceptance_GetAcceptedList($("#ddlShipmentNo").val());
                            getAWBDetailsAfterSave();
                            clearOnchanheShipmentData();
                            var $input;

                            $('#TextBoxesGroup').find('input').each(function (i, input) {
                                $(this).val('');
                            });

                            return;
                        }

                    });
            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert("Message: " + r.Message);
            },
        });
        return false;
    } else if (connectionStatus == "offline") {
        $("body").mLoading("hide");
        $.alert("No Internet Connection!");
    } else if (errmsg != "") {
        $("body").mLoading("hide");
        $.alert(errmsg);
    } else {
        $("body").mLoading("hide");
    }
}

function SetTodayDate() {
    var TodayDt = Date.now();
    var formattedDate = new Date(TodayDt);
    var d = formattedDate.getDate();
    if (d.toString().length < Number(2)) d = "0" + d;
    var m = formattedDate.getMonth();
    m += 1; // JavaScript months are 0-11
    if (m.toString().length < Number(2)) m = "0" + m;
    var y = formattedDate.getFullYear();

    var TodayDate = y + "-" + m + "-" + d;
    $("#txtDOB").val(TodayDate);
    OffLoadDate = TodayDate;
}

function getDate() {
    var today = new Date();
    document.getElementById("txtDOB").value =
        today.getFullYear() +
        "-" +
        ("0" + (today.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + today.getDate()).slice(-2);
}




function SHCSpanHtml(newSHC) {
    var spanStr = "<tr class=''>";
    var newSpanSHC = newSHC.split(',');
    var filtered = newSpanSHC.filter(function (el) {
        return el != "";
    });

    for (var n = 0; n < filtered.length; n++) {
        var blink = filtered[n].split('~');
        spanStr += "<td class='foo clsSave'>" + blink[0] + "</td>";
        //if (filtered[n].indexOf('~') > -1) {
        //    if (blink[1] == 'Y' && filtered[n] != '~Y') {
        //        spanStr += "<td class='blink_me'>" + blink[0] + "</td>";
        //        console.log(filtered[n])
        //    }
        //}

        //if (filtered[n].indexOf('~') > -1) {
        //    if (blink[1] == 'N' && filtered[n] != '~N') {
        //        spanStr += "<td class='foo'>" + blink[0] + "</td>";
        //        console.log(filtered[n])
        //    }
        //}
    }
    spanStr += "</tr>";

    $("#TextBoxDiv").html(spanStr);
    return spanStr;

}


function SHCCodePopupField() {
    $('#dvSHCCode').empty();
    //var allSHCCodeSave = '';
    //var joinAllValuesWithComma = '';

    html = '';
    html += '<table id="tblSHCCode"  class="table  table-bordered table-striped mb-0" style="border: 1px solid #eee;">';
    html += '<thead class="theadClass">';
    html += '<tr>';
    html += '<th id="lblRemark">Sr No</th>';
    html += '<th id="lbRemark">SHC Code</th>';

    html += '</tr>';
    html += '</thead>';
    html += '<tbody class="">';


    if (_XmlForSHCCode == ',' && joinAllValuesWithComma == '') {
        for (var n = 0; n < 9; n++) {

            html += '<tr id="row1 ' + n + '">';
            html += '<td style="text-align:center;">' + (n + 1) + '</td>';
            html += "<td><input onkeypress='return blockSpecialChar(event)' maxlength='3'  type='text' id='txtSHC " + n + "' class='form-control' placeholder='' style='text-transform: uppercase;'></td>";
            html += '</tr>';
        }
    }
    var ShcForSave = joinAllValuesWithComma.replace(/\"/g, "")
    if (joinAllValuesWithComma != '') {
        var newSpanSHC = ShcForSave.split(',');
        //var newSpanSHC = newSpanSHC_.replace(/\"/g, "");
        for (var n = 0; n < 9; n++) {

            html += '<tr id="row1 ' + n + '">';
            html += '<td style="text-align:center;">' + (n + 1) + '</td>';
            if (newSpanSHC[n] == undefined) {
                html += "<td><input onkeypress='return blockSpecialChar(event)' maxlength='3' value='' type='text' id='txtSHC " + n + "' class='form-control' placeholder='' style='text-transform: uppercase;'></td>";

            } else {
                html += "<td><input onkeypress='return blockSpecialChar(event)' maxlength='3' value='" + newSpanSHC[n] + "' type='text' id='txtSHC " + n + "' class='form-control' placeholder='' style='text-transform: uppercase;'></td>";

            }
            html += '</tr>';
        }
    } else {
        var newSpanSHC = _XmlForSHCCode.split(',');
        var filtered = newSpanSHC.filter(function (el) {
            return el != "";
        });

        for (var n = 0; n < filtered.length; n++) {
            var blink = filtered[n].split('~');
            html += '<tr id="row1 ' + n + '">';
            html += '<td style="text-align:center;">' + (n + 1) + '</td>';
            html += '<td><input onkeypress="return blockSpecialChar(event)" maxlength="3" value="' + blink[0] + '" type="text" id="txtSHC ' + n + '" class="textfieldClass" placeholder="" style="text-transform: uppercase;"></td>';
            html += '</tr>';
        }
    }



    html += "</tbody></table>";
    $('#dvSHCCode').append(html);
    $('#SHCCode').modal('show');
}


function getAllSHCCodefromPopup() {
    var inputName = "";
    var values = "";
    var htmlVal = '';
    var jionOfComma = '';
    $('#dvSHCCode tr').each(function (i, el) {

        $(this).find("input").each(function () {
            inputName = $(this).attr("Value");
            values = $(this).val();
            if (i == 1) {
                htmlVal += '<SHC1>' + values.toUpperCase() + '</SHC1>';
                jionOfComma += values.toUpperCase() + ','
            }
            if (i == 2) {
                htmlVal += '<SHC2>' + values.toUpperCase() + '</SHC2>';

                jionOfComma += values.toUpperCase() + ','
            }
            if (i == 3) {
                htmlVal += '<SHC3>' + values.toUpperCase() + '</SHC3>';

                jionOfComma += values.toUpperCase() + ','
            }
            if (i == 4) {
                htmlVal += '<SHC4>' + values.toUpperCase() + '</SHC4>';

                jionOfComma += values.toUpperCase() + ','
            }
            if (i == 5) {
                htmlVal += '<SHC5>' + values.toUpperCase() + '</SHC5>';
                jionOfComma += values.toUpperCase() + ','
            }
            if (i == 6) {
                htmlVal += '<SHC6>' + values.toUpperCase() + '</SHC6>';

                jionOfComma += values.toUpperCase() + ','
            }
            if (i == 7) {
                htmlVal += '<SHC7>' + values.toUpperCase() + '</SHC7>';

                jionOfComma += values.toUpperCase() + ','
            }
            if (i == 8) {
                htmlVal += '<SHC8>' + values.toUpperCase() + '</SHC8>';

                jionOfComma += values.toUpperCase() + ','
            }
            if (i == 9) {
                htmlVal += '<SHC9>' + values.toUpperCase() + '</SHC9>';

                jionOfComma += values.toUpperCase()
            }
        });

    });

    allSHCCodeSave = htmlVal;
    joinAllValuesWithComma = jionOfComma;
    SHCSpanHtml(joinAllValuesWithComma);
    console.log("Values====", joinAllValuesWithComma)
    //  ValidateSHCCodes();
    $('#SHCCode').modal('hide');
}


function ValidateSHCCodes() {
    // var awbid = '"' + AWBid + '"';
    // var uname = '"' + UserName + '"';
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
    var InputXML = '<SHCInfo><SHCDetail><AWBNo>' + $("#txtAWBNo").val() + '</AWBNo><AirportCity>' + AirportCity + '</AirportCity>' + allSHCCodeSave + '<CreatedBy>' + UserId + '</CreatedBy></SHCDetail></SHCInfo>';
    console.log("InputXML====   ", InputXML)
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CargoWorksServiceURL + "ExpCheckAWB_HAWB_SHC",
            data: JSON.stringify({ 'InputXML': InputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                $("body").mLoading('hide');
                var str = response.d;
                if (str != null && str != "") {

                    var xmlDoc = $.parseXML(str);
                    $(xmlDoc).find('Table').each(function (index) {

                        Status = $(this).find('Status').text();
                        StrMessage = $(this).find('msg').text();
                        if (Status == 'E') {
                            $("#spnValdatemsg").text(StrMessage).css({ "color": "Red", "font-weight": "bold" });
                            allSHCCodeSave = '';
                            joinAllValuesWithComma = '';
                        } else if (Status == 'S') {
                            $("#spnValdatemsg").text('');
                            $('#SHCCode').modal('hide');
                            if ($('#ddlHAWBNo').val() != '0') {
                                $('#ddlHAWBNo').trigger('change');
                            } else {

                                radioValue = $("input[name='VctNo']:checked").val();

                                if (radioValue == "vct") {
                                    $('#ddlAWBNo').trigger('change');
                                } else {
                                    if ($('#ddlShipmentNo').val() != '0') {
                                        $('#ddlShipmentNo').trigger('change');
                                    }

                                }

                            }

                            // GetShipmentDetailsForTDG();
                        }

                    });

                }
                else {

                }

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
    }
}


function getAllSHCCodefromPopupOnSave() {
    var inputName = "";
    var values = "";
    var htmlVal = '';
    var jionOfComma = '';

    $('#TextBoxDiv .clsSave').each(function (i) {


        if (i == 0) {
            htmlVal += 'SHC1="' + $(this).html() + '" ';
            // jionOfComma += values.toUpperCase() + '","'
        }
        if (i == 1) {
            htmlVal += 'SHC2="' + $(this).html() + '" ';
            // jionOfComma += values.toUpperCase() + '","'
        }
        if (i == 2) {
            htmlVal += 'SHC3="' + $(this).html() + '" ';
            jionOfComma += values.toUpperCase() + '","'
        }
        if (i == 3) {
            htmlVal += 'SHC4="' + $(this).html() + '" ';
            //jionOfComma += values.toUpperCase() + '","'
        }
        if (i == 4) {
            htmlVal += 'SHC5="' + $(this).html() + '" ';
            // jionOfComma += values.toUpperCase() + '","'
        }
        if (i == 5) {
            htmlVal += 'SHC6="' + $(this).html() + '" ';
            // jionOfComma += values.toUpperCase() + '","'
        }
        if (i == 6) {
            htmlVal += 'SHC7="' + $(this).html() + '" ';
            // jionOfComma += values.toUpperCase() + '","'
        }
        if (i == 7) {
            htmlVal += 'SHC8="' + $(this).html() + '" ';
            // jionOfComma += values.toUpperCase() + '","'
        }
        if (i == 8) {
            htmlVal += 'SHC9="' + $(this).html() + '" ';
            //jionOfComma += values.toUpperCase()
        }
        //}
    });
    AllSHCFinalSave = htmlVal;
    console.log(AllSHCFinalSave);
}


function cleatInvalidSHCCode() {
    allSHCCodeSave = '';
}