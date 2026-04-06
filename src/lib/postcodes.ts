export interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  admin_district: string | null;
  region: string | null;
}

export async function lookupPostcode(postcode: string): Promise<PostcodeResult> {
  const res = await fetch(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.replace(/\s/g, ''))}`
  );
  if (!res.ok) throw new Error(`Postcode not found: ${postcode}`);
  const data = await res.json();
  if (data.status !== 200) throw new Error(`Postcode not found: ${postcode}`);
  const r = data.result;
  return {
    postcode: r.postcode,
    latitude: r.latitude,
    longitude: r.longitude,
    admin_district: r.admin_district,
    region: r.region,
  };
}

export async function autocompletePostcode(partial: string): Promise<string[]> {
  if (partial.length < 2) return [];
  const res = await fetch(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(partial)}/autocomplete`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.result || [];
}
