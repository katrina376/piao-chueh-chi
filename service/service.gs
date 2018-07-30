function doGet(e) {
  var email = Session.getActiveUser().getEmail();
  var ret;

  Logger.log(Session.getActiveUser())

  if (validateAuthority(email)) {
    ret = HtmlService.createTemplateFromFile('view').evaluate();
  } else {
    ret = HtmlService.createTemplateFromFile('error').evaluate();
  }

  ret.setTitle('NTUSC 電子表決器');
  ret.addMetaTag('viewport','width=device-width, initial-scale=1.0');

  return ret;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getInformation(email) {
  var db = SpreadsheetApp.openById(SPREADSHEET_ID);
  var list = db.getSheetByName(authoritySheetName).getRange('A2:C').getValues();
  var data = {college: '', name: ''};
  for (var idx in list) {
    if (list[idx][2] == email) {
      data.name = list[idx][1];
      data.college = list[idx][0];
      break;
    }
  }
  return data;
}

function validateStarted(code) {
  var db = SpreadsheetApp.openById(SPREADSHEET_ID);
  var list = db.getRange('A2:D').getValues();
  var codes = list.map(function(row) { if (row[3] && row[0] && row[2] != "") {return row[0]} });
  return codes.indexOf(code) != -1;
}

function validateAuthority(email) {
  var db = SpreadsheetApp.openById(SPREADSHEET_ID);
  var list = db.getSheetByName(authoritySheetName).getRange('C2:D').getValues();
  var authorityList = list.map(function(row) { if (row[1] && row[0]) {return row[0]} });
  return authorityList.indexOf(email) != -1;
}

function validateChairperson(email, chairpersonName) {
  var db = SpreadsheetApp.openById(SPREADSHEET_ID);
  var list = db.getSheetByName(authoritySheetName).getRange('B2:C').getValues();
  var isChairperson = false;
  for (var idx in list) {
    isChairperson = ((list[idx][0] == chairpersonName) && (list[idx][1] == email));
    if (isChairperson) {
      break;
    }
  }
  return isChairperson;
}

function vote(fObj) {
  var code = fObj.code;
  var option = fObj.option;
  var email = Session.getActiveUser().getEmail();
  Logger.log(email);

  var db = SpreadsheetApp.openById(SPREADSHEET_ID);
  var primary = db.getSheetByName(primarySheetName);
  var success = false;

  var range = primary.getRange('A2:A');
  for (var row = 1; row != range.getNumRows() + 1; ++row) {
    if (range.getCell(row, 1).getValue() == code) {
      Logger.log("MATCH");
      var rowIndex = range.getCell(row,1).getRowIndex();
      var data = primary.getRange('A' + rowIndex + ':D' + rowIndex).getValues();
      var isValid = data[0][3];
      var chairpersonName = data[0][2];

      // Check if has authority
      if (!validateAuthority(email)) {
        break;
      }

      // Check if is chairperson
      if (!isValid) {
        break;
      }

      if (validateChairperson(email, chairpersonName)) {
        break;
      }

      var range = db.getSheetByName(prefix + code).getRange('C2:E');
      for (var per = 1; per != range.getNumRows() + 1; ++per) {
        if (range.getCell(per,1).getValue() == email) {
          range.getCell(per,2).setValue(option);
          range.getCell(per,3).setValue(new Date());
        }
      }

      success = true;
      break;
    } else {
      Logger.log("NO MATCH");
    }
  }

  return success;
}
