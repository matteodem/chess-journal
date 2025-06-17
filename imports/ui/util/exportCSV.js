export const exportCSV = function (items) {
  if (!items.length) {
    alert('Nothing to export!');
    return;
  }

  // Definiere die Spalten
  const columns = [
    'fen',
    'orientation',
    'description',
    'tags',
    'nextReview',
    'interval'
  ];

  // Header
  const header = columns.join(',');

  // Zeilen generieren
  const rows = items.map(m => [
    `"${m.fen}"`,
    m.orientation,
    `"${m.description.replace(/"/g, '""')}"`,
    m.tags ? `"${m.tags.join(';')}"` : '',
    m.nextReview ? new Date(m.nextReview).toISOString() : '',
    m.interval
  ].join(','));

  // Alles zusammenfügen
  const csv = [header, ...rows].join('\r\n');

  // CSV zum Download anbieten
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mistakes.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
