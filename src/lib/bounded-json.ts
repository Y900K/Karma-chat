type Result={ok:true;value:unknown}|{ok:false;status:400|413;error:string};
export async function readBoundedJson(request:Request,maxBytes:number):Promise<Result>{
  if(Number(request.headers.get("content-length")||0)>maxBytes)return{ok:false,status:413,error:"Request is too large"};
  const reader=request.body?.getReader();if(!reader)return{ok:false,status:400,error:"JSON body is required"};
  const decoder=new TextDecoder();let size=0,text="";
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();return{ok:false,status:413,error:"Request is too large"};}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();return{ok:true,value:JSON.parse(text)};}catch{return{ok:false,status:400,error:"Invalid JSON"};}finally{reader.releaseLock();}
}
