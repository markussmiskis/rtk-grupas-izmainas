const express = require("express");

const app = express();
app.use(express.json());

app.listen(1720, () => {
    console.log("Server listening on port: 1720");
});


function dateToDay(dateStr) {
    var date = new Date(dateStr);
    return date.toLocaleDateString("lv-LV", { weekday: 'long' });
}
  
  function combineString(day) {
    return day.map(entry => {
        return {
            date: entry.scheduleDate,
            day: dateToDay(entry.scheduleDate),
            pair: entry.schedulePairNumber,
            classroom: entry.teacher.cabinet,
            teacher: `${entry.teacher.fName} ${entry.teacher.sName}`,
            lesson: entry.subject.subjectName
        };
    });
}

app.get("/izm/:group", (req, res) => {

    console.log("Received a request for:", req.params.group);

    var output = {
        today: [],
        tomorrow: []
    };
      
    fetch("https://izmainas.rtk.lv/schedule/screenData")
        .then(response => {
          return response.json();
        })
        .then(data => {
            const today = data.result.today.filter(entry => entry.group.groupName.includes(req.params.group));
            const tomorrow = data.result.tomorrow.filter(entry => entry.group.groupName.includes(req.params.group));
            if (today.length > 0) output.today = combineString(today);
            if (tomorrow.length > 0) output.tomorrow = combineString(tomorrow);
            
            res.send(output);
        });
});

