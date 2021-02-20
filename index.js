const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const funcs = require('./functions');

// TODO: Calculate this. lol
const pageAmount = 24;

const dataModel = {
    date: new Date(),
    games: []
}

for (let index = 0; index <= (pageAmount - 1); index++) {
    var url = funcs.pagesUrl('ngc', index);
    fetch(url)
        .then((response) => response.text())
        .then((html) => {
            console.log(`Gathering GameIds from Url: ${url}`);
            const _$ = cheerio.load(html);
            _$(".table.table-bordered tbody tr td a").each((i, ga) => {
                var gameId = _$(ga).attr("href").replace('/game/','');
                fetch(funcs.gameUrl(gameId))
                    .then((response) => response.text())
                    .then((html) => {
                        console.log(`-- Fetching Cheats for : ${gameId}`);
                        const $ = cheerio.load(html);
                        let model = {
                            id: gameId,
                            gcId: '',
                            names: [],
                            codes:[]
                        };
                        $(".panel-heading a small").each((i, t) => {
                            model.names.push($(t).text());
                        });
                        $(".table-bordered tr:nth-child(2) td:nth-child(5)").each((i, t) => {
                            model.gcId = $(t).text();
                        });
                        $(".table-striped tr td div.codID").each((ri, re) => {
                            $(re).remove("input");
                            $(re).children("span").find("small").remove();
                            $(re).children("span").find("div").remove();
                            $(re).children("span").find("br").remove();
                            $(re).children("span").find("button").remove();
                            var codeTitle = $(re).children("span").text();
                            var codeStrings = $(re).siblings(".col-md-3").children("pre").text();
                            if ((codeTitle != null && codeTitle != "") || (codeStrings != null && codeStrings != "")) {
                                let cd = {
                                    id: ri + 1,
                                    title: funcs.formatTitle(codeTitle),
                                    entries: funcs.formatCode(codeStrings),
                                };
                                model.codes.push(cd);
                            }
                        });
                        dataModel.games.push(model);
                        // ---------------------------------------------
                        let data = JSON.stringify(dataModel, null, 4);
                        fs.writeFileSync('cheats.json', data);
                        // ---------------------------------------------
                        for (let index = 0; index < dataModel.games.length; index++) {
                            const game = dataModel.games[index];
                            if (game.gcId.length >=4) {
                                let cheatData = "";
                                for (let i2 = 0; i2 < game.codes.length; i2++) {
                                    const code = game.codes[i2];
                                    cheatData = cheatData + code.title + "\n";
                                    cheatData = cheatData + code.entries + "\n";
                                    cheatData = cheatData + "\n";
                                }
                                fs.writeFileSync(`cheats\\${game.gcId}.txt`, cheatData);
                            }
                            
                        }
                    });

            });
        });
}