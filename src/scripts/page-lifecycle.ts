/** Reinitialize page scripts after navigation and release listeners before swapping the DOM. */
export function onPageLoad(initialize: (signal: AbortSignal) => void) {
  let controller: AbortController | undefined;
  document.addEventListener('astro:before-swap', () => controller?.abort());
  document.addEventListener('astro:page-load', () => {
    controller?.abort();
    controller = new AbortController();
    initialize(controller.signal);
  });
}
