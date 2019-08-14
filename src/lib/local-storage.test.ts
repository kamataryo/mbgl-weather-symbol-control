import { asyncLocalStorage } from "./local-storage";

test("works", async () => {
  await asyncLocalStorage.setItem("hello", "world");
  const data = await asyncLocalStorage.getItem("hello");
  expect(data).toBe("world");
});
