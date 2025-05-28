import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getBucketHeaderText() {
    return element(by.css('.header p')).getText(); // Targets the right-aligned header
  }

  getGoalCount() {
    return element.all(by.css('.goal')).count(); // Counts all goal elements
  }
}
