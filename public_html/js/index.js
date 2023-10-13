var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var jpdbName = 'School-DB';
var studentRelationName = 'Student-Table';
var connToken = '90931610|-31949332647204311|90961783';

$('#rollno').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getStudentIdAsJsonObj() {
    var rollno = $('#rollno').val();
    var jsonStr = {
        "Rollno": rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    console.log(data);
    $('#fullname').val(data.FullName);
    $('#class').val(data.Class);
    $('#birthdate').val(data.BirthDate);
    $('#address').val(data.Address);
    $('#enrollmentdate').val(data.EnrollmentDate);
}

function getStudent() {
    var studentIdJsonObj = getStudentIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, jpdbName, studentRelationName, studentIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $('#fullname').prop("disabled", false);
        $('#class').prop("disabled", false);
        $('#birthdate').prop("disabled", false);
        $('#address').prop("disabled", false);
        $('#enrollmentdate').prop("disabled", false);
        $('#fullname').focus();
    } else if (resJsonObj.status === 200) {
        $("#rollno").prop("disabled", true);
        $('#fullname').prop("disabled", false);
        $('#class').prop("disabled", false);
        $('#birthdate').prop("disabled", false);
        $('#address').prop("disabled", false);
        $('#enrollmentdate').prop("disabled", false);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $('#fullname').focus();
    }
}

function resetForm() {
    $('#rollno').val("");
    $('#fullname').val("");
    $('#class').val("");
    $('#birthdate').val("");
    $('#address').val("");
    $('#enrollmentdate').val("");
    $('#rollno').prop("disabled", false);
    $('#save').prop('disabled', true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#fullname').prop("disabled", true);
    $('#class').prop("disabled", true);
    $('#birthdate').prop("disabled", true);
    $('#address').prop("disabled", true);
    $('#enrollmentdate').prop("disabled", true);
    $('#rollno').focus();
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, jpdbName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    resetForm();
    $('#rollno').focus();
}

function changeData(){
    $('#change').prop('disabled',true);
    
    jsonChg  = validateData();
    
    var updateRequest= createUPDATERecordRequest(connToken ,jsonChg,jpdbName,studentRelationName ,localStorage.getItem("recno"));
    
    jQuery.ajax({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#rollno").focus();
}
function validateData() {
    var rollno, fullname, classVal, birthdate, address, enrollmentdate;
    rollno = $('#rollno').val();
    fullname = $('#fullname').val();
    classVal = $('#class').val();
    birthdate = $('#birthdate').val();
    address = $('#address').val();
    enrollmentdate = $('#enrollmentdate').val();

    if (rollno === '') {
        alert("Roll No missing");
        $('#rollno').focus();
        return "";
    }
    if (fullname === "") {
        alert("Full Name missing");
        $('#fullname').focus();
        return "";
    }
    if (classVal === '') {
        alert("Class missing");
        $('#class').focus();
        return "";
    }
    if (birthdate === "") {
        alert("Birth Date missing");
        $('#birthdate').focus();
        return "";
    }
    if (address === '') {
        alert("Address missing");
        $('#address').focus();
        return "";
    }
    if (enrollmentdate === '') {
        alert("Enrollment Date missing");
        $('#enrollmentdate').focus();
        return "";
    }

    var jsonStrObj = {
        "Rollno": rollno,
        "FullName": fullname,
        "Class": classVal,
        "BirthDate": birthdate,
        "Address": address,
        "EnrollmentDate": enrollmentdate
    };

    return JSON.stringify(jsonStrObj);
}
