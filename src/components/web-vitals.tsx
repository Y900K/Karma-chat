"use client";
import {useReportWebVitals} from "next/web-vitals";

export default function WebVitals(){useReportWebVitals(metric=>{const body=JSON.stringify({id:metric.id,name:metric.name,value:metric.value,rating:metric.rating,path:location.pathname,navigationType:metric.navigationType});if(navigator.sendBeacon)navigator.sendBeacon("/api/vitals",new Blob([body],{type:"application/json"}));else void fetch("/api/vitals",{method:"POST",headers:{"content-type":"application/json"},body,keepalive:true})});return null}
