import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Goal } from './models/goal.model';

@Injectable()
export class DataService {
  private goalsKey = 'bucketListGoals';
  private categoriesKey = 'bucketListCategories';
  private selectedCategoryKey = 'bucketListSelectedCategory';

  private goalsSubject = new BehaviorSubject<Goal[]>(this.loadGoals());
  goal = this.goalsSubject.asObservable();

  constructor() { }

  // Goals
  private loadGoals(): Goal[] {
    const saved = localStorage.getItem(this.goalsKey);
    return saved ? JSON.parse(saved) : [];
  }

  private saveGoals(goals: Goal[]) {
    localStorage.setItem(this.goalsKey, JSON.stringify(goals));
  }

  changeGoal(goals: Goal[]) {
    this.saveGoals(goals);
    this.goalsSubject.next(goals);
  }

  // Categories
  loadCategories(): string[] {
    const saved = localStorage.getItem(this.categoriesKey);
    return saved ? JSON.parse(saved) : ['Work', 'Personal', 'Health'];
  }

  saveCategories(categories: string[]) {
    localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
  }

  // Selected Category
  loadSelectedCategory(): string {
    return localStorage.getItem(this.selectedCategoryKey) || '';
  }

  saveSelectedCategory(category: string) {
    localStorage.setItem(this.selectedCategoryKey, category);
  }
}
