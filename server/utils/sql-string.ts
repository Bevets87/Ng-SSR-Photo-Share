export function sql(strings: TemplateStringsArray, ...others: any[]) {
  const out: string[] = [strings[0]];
  for (let i = 0; i < others.length; i++) {
    out.push(others[i], strings[i + 1]);
  }
  return out.join('');
}
