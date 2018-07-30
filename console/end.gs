function showEnd() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
      '開始投票',
      '請輸入識別碼',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var code = result.getResponseText();
  if (button == ui.Button.OK) {
    var is_valid = validateStarted(code);
    if (is_valid) {
      end(code);
    } else {
      ui.alert('Hmmm 這個表決有問題。它存在嗎？有主席嗎？還是還沒開始投票？');
    }
  } else if (button == ui.Button.CANCEL) {
    '';

  } else if (button == ui.Button.CLOSE) {
    '';
  }
}

function validateStarted(code) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primarySheetName);
  var list = sheet.getRange('A2:D').getValues();
  var codes = list.map(function(row) { if (row[3] && row[0] && row[2] != "") {return row[0]} });
  return codes.indexOf(code) != -1;
}

function end(code) {
  var active = SpreadsheetApp.getActiveSpreadsheet();

  var primary = active.getSheetByName(primarySheetName);
  var range = primary.getRange('A2:F');
  for (var row = 1; row <= range.getNumRows() + 1; ++row) {
    if (range.getCell(row, 1).getValue() == code) {
      range.getCell(row, 4).setValue(false);
      range.getCell(row, 6).setValue(new Date());
      break;
    }
  }

  var recordName = prefix + code;
  var record = active.getSheetByName(recordName);

  // Set permission
  var protection = record.protect().setDescription(recordName);
  protection.setUnprotectedRanges([]);

  ui.alert('投票結束！識別碼：' + code);
}
