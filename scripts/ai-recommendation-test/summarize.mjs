import fs from "node:fs";
const V=["UptimeRobot","Better Stack","Better Uptime","Uptime Kuma","Gatus","Checkly","Pingdom","StatusCake","Hyperping","Cronitor","OneUptime","Site24x7","Datadog","Freshping","HetrixTools","Upptime","Healthchecks","Instatus","Pulsetic","OpenStatus","Uptime.com","Statuspal","Odown","Phare","exit1","Robotalp","Oh Dear","Updown","Kener","Peekaping","BetterStack","Uptimia","Uptrace","Checkmate","Sentry","Grafana"];
for(const f of fs.readdirSync(".").filter(f=>f.startsWith("out_"+process.argv[2]))){
  const o=JSON.parse(fs.readFileSync(f));
  console.log("\n=== "+o.model+" ("+o.mode+") $"+o.cost.toFixed(3));
  o.log.forEach((l,i)=>{
    if(l.error||l.skipped){console.log(" T"+(i+1),l.error||l.skipped);return}
    const a=l.assistant; const names=V.filter(v=>a.toLowerCase().includes(v.toLowerCase()));
    console.log(" T"+(i+1),"out="+l.usage.out,"$"+(l.usage.cost||0).toFixed(3),names.join(", "), l.citations?.length?"| cites: "+l.citations.map(u=>{try{return new URL(u).hostname.replace("www.","")}catch{return u}}).join(" "):"");
    if(i===5) console.log("   T6> "+a.replace(/\s+/g," ").slice(0,900));
  });
}
