function dateToDay(dateStr)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString("lv-LV", { weekday: 'long' });        
}

function combineString(day) {
    return day.map(entry => {
        return `${dateToDay(entry.scheduleDate)} ------\n> Pāris: ${entry.schedulePairNumber}\n> Kabinets: ${entry.teacher.cabinet}\n> Skolotājs: ${entry.teacher.fName} ${entry.teacher.sName}\n> Grupa: ${entry.group.groupName}\n> Priekšmets: ${entry.subject.subjectName}`;
    }).join('\n');
}

const group = "DT1-2"

fetch("https://izmainas.rtk.lv/schedule/screenData")
    .then(response => {
        return response.json();
    })
    .then(data => {
        const today = data.result.today.filter(entry => entry.group.groupName.includes(group));
        const tomorrow = data.result.tomorrow.filter(entry => entry.group.groupName.includes(group));

        if (today.length < 0) return console.log(`----- Šodien - ${dateToDay(data.result.today[0].scheduleDate)} ----\n> Izmaiņu nav!`);
        if (today.length > 0) console.log(`----- Šodien - ${combineString(today)}`);
        console.log("\n");
        if (tomorrow.length == []) console.log( `----- ${dateToDay(data.result.tomorrow[0].scheduleDate)} ------\n> Izmaiņu nav!`);
        if (tomorrow.length > 0) console.log(`----- ${combineString(tomorrow)}`);
    })