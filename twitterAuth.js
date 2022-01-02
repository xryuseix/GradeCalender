/** @format */

//メニューを構築する
function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("▶OAuth認証")
    .addItem("認証の実行", "startOAuth")
    .addItem("テストツイート", "testTweet")
    .addSeparator()
    .addItem("ログアウト", "reset")
    .addItem("スクリプトプロパティ", "openScriptProperties")
    .addToUi();
}

//認証用の各種変数
const apikey = "";
const apisecret = "";
const tokenurl = "https://api.twitter.com/oauth/access_token";
const reqtoken = "https://api.twitter.com/oauth/request_token";
const authurl = "https://api.twitter.com/oauth/authorize";

//認証実行
function startOAuth() {
  //UIを取得する
  const ui = SpreadsheetApp.getUi();

  //認証済みかチェックする
  const service = checkOAuth(appname);
  if (!service.hasAccess()) {
    //認証画面を出力
    const output = HtmlService.createHtmlOutputFromFile("template")
      .setHeight(450)
      .setWidth(500)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    ui.showModalDialog(output, "OAuth1.0認証");
  } else {
    //認証済みなので終了する
    ui.alert("すでに認証済みです。");
  }
}

//認証チェック用関数
function checkOAuth(serviceName) {
  return OAuth1.createService(serviceName)
    .setAccessTokenUrl(tokenurl)
    .setRequestTokenUrl(reqtoken)
    .setAuthorizationUrl(authurl)
    .setConsumerKey(apikey)
    .setConsumerSecret(apisecret)
    .setCallbackFunction("authCallback")
    .setPropertyStore(PropertiesService.getUserProperties());
}

//認証コールバック
function authCallback(request) {
  const service = checkOAuth(request.parameter.serviceName);
  const isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput("認証が正常に終了しました");
  } else {
    return HtmlService.createHtmlOutput("認証がキャンセルされました");
  }
}

//アクセストークンURLを含んだHTMLを返す関数
function authpage() {
  const service = checkOAuth(appname);
  const authorizationUrl = service.authorize();
  const html =
    "<center><b><a href='" +
    authorizationUrl +
    "' target='_blank' onclick='closeMe();'>アクセス承認</a></b></center>";
  return html;
}

//ログアウト
function reset() {
  OAuth1.createService(appname)
    .setPropertyStore(PropertiesService.getUserProperties())
    .reset();
  SpreadsheetApp.getUi().alert("ログアウトしました。");
}

// スクリプトプロパティを取得
const openScriptProperties = () => {
  const properties = PropertiesService.getScriptProperties()
    .getKeys()
    .map((key) => {
      return {
        key: key,
        value: PropertiesService.getScriptProperties().getProperty(key),
      };
    });
  SpreadsheetApp.getUi().alert(JSON.stringify(properties));
};
