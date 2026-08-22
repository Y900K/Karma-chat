import {performance} from 'node:perf_hooks';

const base=(process.env.LOAD_BASE_URL||'http://127.0.0.1:3000').replace(/\/$/,'');
const concurrency=Math.min(Math.max(Number(process.env.LOAD_CONCURRENCY||20),1),100);
const requests=Math.min(Math.max(Number(process.env.LOAD_REQUESTS||200),10),5000);
const routes=['/','/roles','/trust','/api/health','/api/capabilities'];
const samples=[];let failures=0,index=0;
async function worker(){while(index<requests){const current=index++,route=routes[current%routes.length],started=performance.now();try{const response=await fetch(base+route,{redirect:'manual',headers:{'user-agent':'KarmaSetu-Scale-Audit/1.0'}});samples.push(performance.now()-started);if(response.status>=500)failures++}catch{samples.push(performance.now()-started);failures++}}}
await Promise.all(Array.from({length:concurrency},worker));samples.sort((a,b)=>a-b);const percentile=p=>samples[Math.min(samples.length-1,Math.floor(samples.length*p))]||0;const report={base,requests,concurrency,failures,errorRate:Number((failures/requests).toFixed(4)),p50Ms:Math.round(percentile(.5)),p95Ms:Math.round(percentile(.95)),p99Ms:Math.round(percentile(.99))};console.log(JSON.stringify(report,null,2));if(report.errorRate>.01||report.p95Ms>1500)process.exitCode=1;

