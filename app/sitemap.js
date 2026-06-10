const SITE = 'https://www.thesevenz.com';

export default function sitemap() {
  const now = new Date();
  const routes = ['', '/services', '/work', '/packages', '/team', '/contact'];
  return routes.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
