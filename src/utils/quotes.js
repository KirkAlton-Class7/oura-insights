const cleanString = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const formatNameList = (value) => {
  const names = cleanString(value).split(',').map(name => name.trim()).filter(Boolean);
  if (names.length < 2) return names[0] || '';
  return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
};

export const getQuoteKey = (quote) => [
  quote?.text,
  quote?.speaker,
  quote?.author,
  quote?.source,
].map(value => cleanString(value).toLowerCase()).join('|');

export const normalizeQuotes = (data) => {
  if (!Array.isArray(data)) return [];

  const seen = new Set();
  return data.reduce((quotes, rawQuote) => {
    const quote = {
      id: rawQuote?.id ?? null,
      text: cleanString(rawQuote?.text),
      speaker: cleanString(rawQuote?.speaker) || null,
      author: cleanString(rawQuote?.author) || null,
      source: cleanString(rawQuote?.source) || null,
      tags: Array.isArray(rawQuote?.tags)
        ? rawQuote.tags.map(cleanString).filter(Boolean)
        : [],
    };
    const key = getQuoteKey(quote);

    if (!quote.text || seen.has(key)) return quotes;
    seen.add(key);
    quotes.push(quote);
    return quotes;
  }, []);
};

export const getQuoteAttribution = (quote) => {
  const speaker = cleanString(quote?.speaker);
  const author = cleanString(quote?.author);
  const source = cleanString(quote?.source);
  const secondary = [];

  if (speaker) {
    if (source) secondary.push(`from ${source}`);
    if (author && author.toLowerCase() !== speaker.toLowerCase()) {
      secondary.push(`by ${formatNameList(author)}`);
    }
    return { primary: formatNameList(speaker), secondary };
  }

  if (author) {
    if (source) secondary.push(`from ${source}`);
    return { primary: formatNameList(author), secondary };
  }

  return { primary: source || 'Unknown', secondary };
};

export const formatQuoteText = (quote) => {
  const { primary, secondary } = getQuoteAttribution(quote);
  return [`“${quote.text}”`, `— ${primary}`, ...secondary].join('\n');
};
