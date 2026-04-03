export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  const { sheet_id, range, value, api_key } = req.body;
 
  if (!sheet_id || !range || value === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/${range}?valueInputOption=RAW&key=${api_key}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values: [[value]]
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
 
