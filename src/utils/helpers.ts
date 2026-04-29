export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}