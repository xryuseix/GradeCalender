import requests
from bs4 import BeautifulSoup
import re
import csv

year = 2022
url = f"http://www.ritsumei.ac.jp/profile/info/calendar/{year}"
class_name = "mod-wysiwyg"

html = requests.get(url).text
soup = BeautifulSoup(html, "html.parser")

lines = "".join(
    [div.text for div in soup.find_all("div", class_=class_name)[:2]]
).split("\n\n\n")[2:-2]

schedules = []

for line in lines:
    day_schedule = [col for col in line.split("\n") if col != ""]
    if len(day_schedule) == 0 or day_schedule == ["月", "日", "曜", "行事"]:
        continue
    # 行事しかない時は日と曜日を入れる
    if len(day_schedule) == 1:
        day_schedule = [schedules[-1]["week"], schedules[-1]["day"], day_schedule[0]]

    assert len(day_schedule) != 2

    # 月がない時は月を入れる
    if len(day_schedule) == 3:
        day_schedule = [
            schedules[-1]["month"],
            day_schedule[0],
            day_schedule[1],
            re.sub(r" *\d+", "", day_schedule[2]),
        ]

    assert len(day_schedule) == 4

    schedules.append(
        {
            "year": year if int(day_schedule[0]) >= 4 or len(schedules)==0 else year + 1,
            "month": day_schedule[0],
            "week": day_schedule[1],
            "day": day_schedule[2],
            "event": day_schedule[3],
        }
    )

print(str(schedules).replace("], [", "],\n["))

with open('schedule.csv', 'a') as f:
    writer = csv.writer(f)
    for schedule in schedules:
        writer.writerow([schedule['year'], schedule['month'], schedule['week'], schedule['day'], schedule['event']])