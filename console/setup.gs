function showSetup() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
      '設定表決',
      '請輸入新的識別碼',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var code = result.getResponseText();
  if (button == ui.Button.OK) {
    var is_valid = validateNew(code);
    if (is_valid) {
      setup(code);
    } else {
      ui.alert('這個識別碼被用過了喔！');
    }
  } else if (button == ui.Button.CANCEL) {
    '';

  } else if (button == ui.Button.CLOSE) {
    '';
  }
}

function validateNew(code) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primarySheetName);
  var list = sheet.getRange('A2:A').getValues();
  var codes = list.map(function(row) { if (row[0]) {return row[0]} });
  return codes.indexOf(code) == -1;
}

function setup(code) {
  var active = SpreadsheetApp.getActiveSpreadsheet();

  // Setup configuration
  var primary = active.getSheetByName(primarySheetName);
  primary.appendRow([code, new Date()]);

  // Create record sheet
  var template = active.getSheetByName(templateSheetName);
  var recordName = prefix + code;
  var record = active.insertSheet(recordName, {template: template})

  // Set permission
  var protection = record.protect().setDescription(recordName);
  var unprotected = record.getRange('D:E');
  protection.setUnprotectedRanges([unprotected]);

  var emailRange = record.getRange('C2:C');
  for (var row = 1; row < emailRange.getNumRows() + 1; ++row) {
    var email = emailRange.getCell(row, 1).getValue();
    var rowIndex = emailRange.getCell(row, 1).getRow();
    var editableRange = record.getRange('D' + rowIndex + ':E' + rowIndex);
    if (email.length > 0) {
      var protection = editableRange.protect().setDescription(email);
      protection.addEditor(email);
    } else {
      var protection = editableRange.protect().setDescription(recordName);
    }
  }

  var ui = SpreadsheetApp.getUi();
  ui.alert('設定完成！識別碼：' + code);
}
