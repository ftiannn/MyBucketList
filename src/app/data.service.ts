import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
  private storageKey = 'bucketListGoals';
  private goalsSubject = new BehaviorSubject<string[]>(this.loadGoals());
  goal = this.goalsSubject.asObservable();

  constructor() { }

  private loadGoals(): string[] {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }

  private saveGoals(goals: string[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(goals));
  }

  changeGoal(goals: string[]) {
    this.saveGoals(goals);
    this.goalsSubject.next(goals);
  }
}
