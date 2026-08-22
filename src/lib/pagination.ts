import {z} from "zod";

const cursorSchema=z.object({createdAt:z.string().datetime(),id:z.string().min(1).max(128)}).strict();
export type KeysetCursor=z.infer<typeof cursorSchema>;

export function encodeCursor(cursor:KeysetCursor){return Buffer.from(JSON.stringify(cursor)).toString("base64url")}
export function decodeCursor(value:string|null){
  if(!value)return null;
  try{return cursorSchema.parse(JSON.parse(Buffer.from(value,"base64url").toString("utf8")))}catch{return null}
}
export function pageLimit(value:string|null,defaultValue=25){const parsed=Number(value);return Number.isInteger(parsed)?Math.min(Math.max(parsed,1),100):defaultValue}

