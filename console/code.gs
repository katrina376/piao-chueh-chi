var primarySheetName = '表決結果';
var prefix = '投票情形_'
var templateSheetName = prefix + '[範本]'

function onOpen(event) {
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem('設定表決', 'showSetup')
      .addItem('開始投票', 'showStart')
      .addItem('結束投票', 'showEnd')
      .addToUi();
}

function onInstall(event) {
  onOpen(event);
}

function showSidebar() {
  var ui = HtmlService
      .createHtmlOutputFromFile('sidebar')
      .setTitle('設定表決');

  SpreadsheetApp.getUi().showSidebar(ui);
}
