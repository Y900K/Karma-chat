import test from "node:test";
import assert from "node:assert/strict";
import {readBoundedJson} from "../src/lib/bounded-json.ts";
test("JSON byte limit applies without Content-Length, including multibyte input",async()=>{
  const bytes=new TextEncoder().encode(JSON.stringify({value:"ह".repeat(10)}));
  const body=new ReadableStream({start(c){c.enqueue(bytes);c.close();}});
  const result=await readBoundedJson(new Request("https://example.test",{method:"POST",body,duplex:"half"}),20);
  assert.equal(result.status,413);
  assert.deepEqual(await readBoundedJson(new Request("https://example.test",{method:"POST",body:'{"ok":true}'}),100),{ok:true,value:{ok:true}});
});
