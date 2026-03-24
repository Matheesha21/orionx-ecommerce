import { model } from "./client.mjs";

async function main() {
  const result = await model.generateContent("what is the capital of France?");

  const text = result.response.text();
  console.log(text);
}

main();