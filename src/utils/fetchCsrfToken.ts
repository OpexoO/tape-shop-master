import LinkService from '@/services/link.service';

export default async function fetchCsrfToken(): Promise<string> {
  const tokenRes = await fetch(LinkService.apiCsrfToken());
  const { data: token } = await tokenRes.json();
  if (!tokenRes) {
    throw new Error(token);
  }
  return token;
}
