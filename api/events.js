export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [{ property: 'Date', direction: 'ascending' }],
        }),
      }
    );

    const data = await response.json();
if (!data.results) { return res.status(200).json({ debug: data }); 
}

    const events = data.results.map(page => {
      const props = page.properties;

      const name = props.Name?.title?.[0]?.plain_text || 'Untitled';
      const date = props.Date?.date?.start || null;
      const city = props.City?.select?.name || props.City?.rich_text?.[0]?.plain_text || null;
      const register = props.Register?.url || null;
      const spots = props.Spots?.number || null;

      // Image — Files & Media field
      const imageFile = props.Image?.files?.[0];
      let image = null;
      if (imageFile) {
        image = imageFile.type === 'external'
          ? imageFile.external?.url
          : imageFile.file?.url;
      }

      return { name, date, city, register, spots, image };
    });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
