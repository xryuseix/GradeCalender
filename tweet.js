/** @format */

const endpoint = "https://api.twitter.com/2/tweets";
const appname = "学年歴のツイート";

// テストツイート
const testTweet = () => {
  tweet("ツイートテスト");
};

// ツイートする
const tweet = (tweetMessage) => {
  // トークン確認
  const service = checkOAuth(appname);
  // message本文
  const message = {
    text: tweetMessage,
  };

  // リクエストオプション
  const options = {
    method: "post",
    muteHttpExceptions: true,
    contentType: "application/json",
    payload: JSON.stringify(message),
  };

  // リクエスト実行
  const response = JSON.parse(service.fetch(endpoint, options));

  // リクエスト結果
  console.log(response);
};
