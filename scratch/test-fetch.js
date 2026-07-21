const url = "https://zjbljyfazzxwekjakifg.supabase.co/auth/v1/health";
console.log("Fetching health endpoint:", url);

fetch(url)
  .then(res => {
    console.log("Status:", res.status);
    return res.text();
  })
  .then(text => {
    console.log("Response text:", text);
  })
  .catch(err => {
    console.error("Fetch failed!");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Error cause:", err.cause);
  });
