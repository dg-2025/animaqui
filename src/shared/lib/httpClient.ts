export async function httpClient<T>(url: string): Promise<T> {
  const resposta = await fetch(url);
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok || dados === null) throw new Error(dados?.erro ?? 'Não foi possível carregar.');
  return dados as T;
}
