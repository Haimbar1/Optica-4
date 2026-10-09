// URL parameters (utm_campaign, utm_source, ...) passed on to Cal.com so they reach the booking webhook.
// Cal.com fills a booking question whose identifier matches a parameter's name - the questions are
// hidden ones defined on the event type (utm_campaign, utm_source, utm_medium, utm_content, utm_term, fbclid ...).
export function getCalUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};
  if (typeof window === 'undefined') return params;
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (value) params[key] = value;
  });
  // "?campaign=..." (and the misspelled "?campiagn=..." in live ad links) is also accepted as the campaign name
  const campaign = params.campaign || params.campiagn;
  if (!params.utm_campaign && campaign) params.utm_campaign = campaign;
  return params;
}

// Link to the site's booking page (the embedded Cal.com calendar), keeping the visit's other parameters.
export function bookingPageHref(): string {
  if (typeof window === 'undefined') return '/?page=campaign';
  const params = new URLSearchParams(window.location.search);
  ['page', 'p', 'tryon', 'frame'].forEach((k) => params.delete(k));
  const qs = params.toString();
  return `/?page=campaign${qs ? `&${qs}` : ''}`;
}

export function withCalUrlParams(url: string): string {
  const u = new URL(url);
  Object.entries(getCalUrlParams()).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}
