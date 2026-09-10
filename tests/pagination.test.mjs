import test from "node:test";
import assert from "node:assert/strict";
import { decodeCursor, encodeCursor, pageLimit } from "../src/lib/pagination.ts";

test("omitted and empty limits return a full default page", () => {
  for (const value of [null, "", "  ", "invalid", "2.5"]) assert.equal(pageLimit(value), 25);
  assert.equal(pageLimit("1000"), 100);
  assert.equal(pageLimit("0"), 1);
  assert.equal(pageLimit("15"), 15);
});

test("cursor accepts record IDs but rejects PostgREST filter syntax", () => {
  const cursor = { createdAt: "2026-09-09T00:00:00.000Z", id: "12345678-1234-1234-1234-123456789012" };
  assert.deepEqual(decodeCursor(encodeCursor(cursor)), cursor);
  assert.equal(decodeCursor(encodeCursor({ ...cursor, id: "1),id.gt.0" })), null);
  assert.equal(decodeCursor("not-json"), null);
});
