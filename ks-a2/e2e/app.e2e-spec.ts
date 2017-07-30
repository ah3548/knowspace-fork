import { KsA2Page } from './app.po';

describe('ks-a2 App', () => {
  let page: KsA2Page;

  beforeEach(() => {
    page = new KsA2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
