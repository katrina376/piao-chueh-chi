function showStart() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
      '開始投票',
      '請輸入識別碼',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var code = result.getResponseText();
  if (button == ui.Button.OK) {
    var is_valid = validateUnstart(code);
    if (is_valid) {
      start(code);
    } else {
      ui.alert('Hmmm 這個表決有問題。它存在嗎？有主席嗎？還是已經結束了？');
    }
  } else if (button == ui.Button.CANCEL) {
    '';

  } else if (button == ui.Button.CLOSE) {
    '';
  }
}

function validateUnstart(code) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primarySheetName);
  var list = sheet.getRange('A2:D').getValues();
  var codes = list.map(function(row) { if (row[3] == "" && row[0] && row[2] != "") {return row[0]} });
  return codes.indexOf(code) != -1;
}

function start(code) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primarySheetName);
  var range = sheet.getRange('A2:E');
  for (var row = 1; row <= range.getNumRows() + 1; ++row) {
    if (range.getCell(row, 1).getValue() == code) {
      range.getCell(row, 4).setValue(true);
      range.getCell(row, 5).setValue(new Date());
      break;
    }
  }
  ui.alert('開始投票！識別碼：' + code);
}
