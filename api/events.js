module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return res.status(500).json({
      error: 'Missing environment variables',
      hint: 'Add NOTION_API_KEY and NOTION_DATABASE_ID in Vercel → Settings → Environment Variables'
    });
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
          sorts: [{ property: 'Дата', direction: 'ascending' }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: 'Notion API error',
        status: response.status,
        details: errorData,
        hint: response.status === 401
          ? 'Проверь NOTION_API_KEY'
          : response.status === 404
          ? 'Проверь NOTION_DATABASE_ID и доступ интеграции (Share → Invite)'
          : 'Ошибка Notion API'
      });
    }

    const data = await response.json();

    if (!data.results) {
      return res.status(200).json({ debug: data });
    }

    const events = data.results.map(page => {
      const props = page.properties;

      // Название мероприятия — title field
      const name = props['Название мероприятия']?.title?.[0]?.plain_text || 'Без названия';

      // Дата — date field
      const date = props['Дата']?.date?.start || null;

      // Ссылка для рекламы — url field
      const register = props['Ссылка для рекламы']?.url || null;

      // Description — rich_text field
      const description = props['Description']?.rich_text?.[0]?.plain_text || null;

      // Status — status field (Open / Closed и т.д.)
      const status = props['Status']?.status?.name || null;

      // Image — files field
      const imageFile = props['Image']?.files?.[0];
      let image = null;
      if (imageFile) {
        image = imageFile.type === 'external'
          ? imageFile.external?.url
          : imageFile.file?.url;
      }

      return { name, date, register, description, status, image };
    });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
