import DB from "./src/database";

async function checkUser() {
  const users = await DB("students").whereILike("first_name", "%Testing%").orWhereILike("last_name", "%Testing%");
  console.log("Found users:", JSON.stringify(users, null, 2));
  process.exit(0);
}

checkUser();
