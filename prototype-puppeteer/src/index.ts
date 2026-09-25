import { listMembers, setApiBaseUrl } from "prototype-client";

async function main() {
  console.log("STARTING!!!!!");

  // Node fetch needs an absolute URL because there is no Vite development proxy.
  setApiBaseUrl("http://localhost:3000");
  const response = await listMembers();
  console.log(response);
}

main();
