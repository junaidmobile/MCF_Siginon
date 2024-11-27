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

// ////////////////////////////////////////////////

function clearAll() {
    $("#txtVCTNo").val("");
    $("#acceptedListTable").hide();
    $("#ddlOrigin").empty();
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
                        var loose = $(this).find("Loose").text();

                        console.log("Loose:", loose);
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

                        // $("#txtAWBNo").val(awbNo);
                        $("#txtAWBpkgs").val(awbNpx);
                        $("#txtAWBWt").val(awbExpWt);
                        // $("#txtShipNPX").val(shipNpx);
                        // $("#txtShipExpWt").val(shipExpWt);
                        $("#ddlDestination").val(destination);
                        //$("#ddlOffPoints").val("123");
                        $("#txtCustomerName").val(agent);
                    });

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
    //$("#txtDescription").val('');
    //$("#txtRemark").val('');
}

function HHT_ExpGet_CargoAcceptance_AWBDetails() {
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

                        if ($(this).find("Status").text() != "E") {
                            // $.alert('AWB already exist');
                            // $('#txtAWBNo').val('');
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
                                                var loose = $(this).find("Loose").text();
                                                console.log("Loose:", loose);
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
                                                var DESCRIPTION = $(this).find("DESCRIPTION").text();
                                                var Remarks = $(this).find("Remarks").text();
                                                var SHC = $(this).find("SHC").text();
                                                var AgentCode = $(this).find("AgentCode").text();
                                                // var AgentName = $(this).find("AgentName").text();
                                                if (AgentCode != '') {
                                                    passCustomerID = AgentCode;
                                                }

                                                $("#TextBoxDiv").empty();
                                                _XmlForSHCCode = SHC;
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
                                                $("#txtRemark").val(Remarks);
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
                        } else {
                            $("#ddlShipmentNo").empty();
                            var newOption = $("<option></option>");
                            newOption.val("1").text("1");
                            newOption.appendTo("#ddlShipmentNo");
                            return;
                        }
                    });

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

                // $(xmlDoc).find('Table5').each(function (index) {
                //     var pieces = $(this).find('NUMBER_OF_PIECES').text();
                //     var length = $(this).find('LENGTH').text();
                //     var width = $(this).find('WIDTH').text();
                //     var height = $(this).find('HEIGHT').text();
                //     var volume = $(this).find('AWB_NUMBER').text();
                //     console.log("@@@@@@@" + index);
                //     var idNo = parseInt(index) + 1;
                //     $("#Pieces" + idNo).val(pieces);
                //     $("#Length" + idNo).val(length);
                //     $("#Width" + idNo).val(width);
                //     $("#Height" + idNo).val(height);
                //     $("#Volume" + idNo).val();

                // });
                // EXP_CargoAcceptance_GetAcceptedList( $('#ddlShipmentNo').val());
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
                debugger
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                console.log("HHT_ExpGet_CargoAcceptance_AWBDetails after save");
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

                            $(xmlDoc)
                                .find("Table1")
                                .each(function (index) {
                                    var loose = $(this).find("Loose").text();
                                    console.log("Loose:", loose);
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

                                    // $("#txtAWBNo").val(awbNo);
                                    $("#txtAWBpkgs").val(awbNpx);
                                    $("#txtAWBWt").val(awbExpWt);
                                    // $("#txtShipNPX").val(shipNpx);
                                    // $("#txtShipExpWt").val(shipExpWt);
                                    $("#ddlDestination").val(destination);
                                    $("#ddlOffPoints").val(destination);
                                    $("#txtCustomerName").val(agent);
                                    const match = agent.match(/\[(\d+)\]/);
                                    if (match) {
                                        const number = match[1];
                                        console.log(number);
                                        selectedAgentCode = number;
                                    }
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
          <td class="print" onclick="printRow()"><span class="glyphicon glyphicon-print"></span></td>
        </tr>
      `;
                        tableBody.append(tableRow);
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

function deleteAcceptedRow(rowId) {
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
                            msg = $(this).find("Message").text();
                            if (Status == "S") {
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
        $("#divBulk").hide();
        $("#divUldTyped").show();
        $("#divUldNo").show();
        $("#divUldOwner").show();
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

        DimLinexml =
            '<ROOT><DIMData SeqNo="0" Length="' +
            $("#Length1").val() +
            '" Width="' +
            $("#Width1").val() +
            '" Height="' +
            $("#Height1").val() +
            '" Pieces="' +
            $("#Pieces1").val() +
            '" Vol="' +
            $("#Volume1").val() +
            '" VolCode="' +
            $("#ddlUOM1").val() +
            '" /></ROOT>';

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
                            return;
                        }

                        ShpmentId = $(this).find("SHIPMENT_NUMBER").text();
                        ShpmentNo = $(this).find("SHIPMENT_NUMBER").text();
                        AWBNo = $(this).find("AWBNo").text();

                        if (index == 0) {
                            var newOption = $("<option></option>");
                            newOption.val("0").text("Select");
                            newOption.appendTo("#ddlShipmentNo");
                        }

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
            html += "<td><input onkeypress='return blockSpecialChar(event)' maxlength='3' value='" + newSpanSHC[n] + "' type='text' id='txtSHC " + n + "' class='form-control' placeholder='' style='text-transform: uppercase;'></td>";
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