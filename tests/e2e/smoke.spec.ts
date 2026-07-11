import { test, expect } from "@playwright/test";

test("home page smoke test", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Northstar/i);
  await expect(page.getByRole("link", { name: /northstar/i })).toBeVisible();
});
