import { expect, type Page } from "@playwright/test";
// Test helper: explicitly dismiss a new guide rather than interacting through a modal.
export async function skipTour(page: Page, tour: string) {
  const response = await page.request.get(
    new URL("/api/training", page.url()).href,
  );
  if (!response.ok()) throw Error("Training state unavailable");
  const state = await response.json();
  if (
    !state.progress.some(
      (p: { tour: string; version: number }) =>
        p.tour === tour && p.version === 1,
    )
  ) {
    await page.getByRole("button", { name: "Ver depois", exact: true }).click();
    await expect(page.locator("dialog.training-dialog")).not.toBeVisible();
  }
}
