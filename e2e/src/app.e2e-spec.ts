import { AppPage } from './app.po';

describe('Bucket List App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display bucket list header', async () => {
    await page.navigateTo();
    const header = await page.getBucketHeaderText();
    expect(header).toContain('Your Bucket List');
  });

  it('should show initial goals or be empty', async () => {
    await page.navigateTo();
    const count = await page.getGoalCount();
    expect(count).toBeGreaterThanOrEqual(0); // You can set expected initial count
  });
});
