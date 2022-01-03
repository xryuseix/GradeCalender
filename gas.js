/** @format */

const getTodaySchedule = () => {
  const schedulesSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("schedules");
  const schedules = schedulesSheet
    .getRange(`A1:E${schedulesSheet.getLastRow()}`)
    .getValues();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate() + 1;
  const todaySchedules = schedules.filter((schedule) => {
    return schedule[0] === year && schedule[1] === month && schedule[2] === day;
  });
  return { todaySchedules, year, month, day };
};

const makeTweetText = (todaySchedules, year, month, day) => {
  const tweetText = `本日(${year}/${month}/${day})は立命館大学 学年歴に\n${todaySchedules
    .map((schedule) => {
      return `・ ${schedule[4]}`;
    })
    .join(
      "\n"
    )}\nが登録されています．\nhttp://www.ritsumei.ac.jp/profile/info/calendar`;
  return tweetText;
};

const main = () => {
  const { todaySchedules, year, month, day } = getTodaySchedule();
  if(todaySchedules.length > 0) {
    const tweetText = makeTweetText(todaySchedules, year, month, day);
    tweet(tweetText);
    console.log(tweetText);
  }
};
