export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null;
  
  return ((...args: unknown[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  }) as T;
}
