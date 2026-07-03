export function isTauriRuntime(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const runtimeWindow = window as any;

  return Boolean(
    runtimeWindow.__TAURI__ ||
    runtimeWindow.__TAURI_INTERNALS__ ||
    navigator.userAgent.includes('Tauri')
  );
}
