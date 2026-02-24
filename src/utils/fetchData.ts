// fetchData.ts
export async function fetchData(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network error');
  return response.json();
}
