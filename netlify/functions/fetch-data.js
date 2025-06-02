// netlify/functions/fetch-data.js

export async function handler(event, context) {

  let url;

  // エンドポイントに応じてURLを分岐
  const endpoint = event.queryStringParameters.endpoint;
  switch (endpoint) {
    case 'first':
      const word = event.queryStringParameters.word;
      url = `https://navitime-transport.p.rapidapi.com/transport_node?coord_unit=degree&word=${word}&offset=0&datum=wgs84&limit=10`;
      break;
    case 'second':
      const stationId = event.queryStringParameters.stationId;
      url = `https://navitime-transport.p.rapidapi.com/transport_node/id?id=${stationId}&datum=wgs84&coord_unit=degree&options=detail`;
      break;
    case 'third':
      const routeId = event.queryStringParameters.routeId;
      url = `https://navitime-transport.p.rapidapi.com/transport_link/id?options=node&id=${routeId}&coord_unit=degree&datum=wgs84`;
      break;
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Unknown endpoint: ${endpoint}` }),
      };
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      }
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
