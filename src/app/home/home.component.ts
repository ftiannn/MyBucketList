import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Goal } from '../models/goal.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import confetti from 'canvas-confetti';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  goals: Goal[] = [];
  goalText = '';
  selectedCategory = '';
  categories: string[] = [];
  expandedCategories: { [category: string]: boolean } = {};

  showCategoryModal = false;
  showDeleteModal = false;
  newCategory = '';
  categoryToDelete: string | null = null;

  showToast = false;
  toastMessage = '';

  constructor(
    private readonly _data: DataService,
  ) { }

  ngOnInit() {
    this._data.goal.subscribe(res => {
      this.goals = res;
    });

    this.categories = this._data.loadCategories();
    this.categories.forEach(cat => {
      this.expandedCategories[cat] = true;
    });

    this.selectedCategory = this._data.loadSelectedCategory() || this.categories[0] || '';
  }

  get itemCount(): number {
    return this.goals.length;
  }

  addItem() {
    const trimmedText = this.goalText.trim();
    if (!trimmedText) return;

    const newGoal: Goal = {
      text: trimmedText,
      category: this.selectedCategory
    };

    this.goals.push(newGoal);
    this.goalText = '';
    this.updateGoals();
    this.showToastWithMessage('New goal added!');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  completeGoal(goal: Goal) {
    this.goals = this.goals.filter(g => g !== goal);
    this.updateGoals();
  }

  goalsByCategory(category: string): Goal[] {
    return this.goals.filter(goal => goal.category === category);
  }

  onDrop(event: CdkDragDrop<Goal[]>, newCategory: string) {
    const prevList = event.previousContainer.data;
    const currentList = event.container.data;
    const movedGoal = prevList[event.previousIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(currentList, event.previousIndex, event.currentIndex);
    } else {
      currentList.splice(event.currentIndex, 0, {
        ...movedGoal,
        category: newCategory
      });
      prevList.splice(event.previousIndex, 1);
    }

    this.goals = this.categories.flatMap(cat => this.goalsByCategory(cat));
    this.updateGoals();
  }

  toggleCategory(category: string) {
    this.expandedCategories[category] = !this.expandedCategories[category];
  }

  openAddCategoryModal() {
    this.showCategoryModal = true;
  }

  addCategory() {
    const trimmed = this.newCategory.trim();
    if (!trimmed) return;

    if (this.categories.includes(trimmed)) {
      this.showToastWithMessage('❗ Category already exists!');
    } else {
      this.categories.push(trimmed);
      this.expandedCategories[trimmed] = true;
      this.selectedCategory = trimmed;

      this._data.saveCategories(this.categories);
      this._data.saveSelectedCategory(this.selectedCategory);

      this.showToastWithMessage('🎉 Category added!');
    }

    this.closeModal('category');
  }

  requestDeleteCategory(category: string) {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  confirmDeleteCategory() {
    if (this.categories.length <= 1) {
      this.showToastWithMessage('🚫 You must have at least one category!');
    } else if (this.categoryToDelete) {
      const cat = this.categoryToDelete;
      this.categories = this.categories.filter(c => c !== cat);
      this.goals = this.goals.filter(g => g.category !== cat);
      delete this.expandedCategories[cat];

      this._data.saveCategories(this.categories);
      this._data.saveSelectedCategory(this.selectedCategory);
      this.updateGoals();

      this.showToastWithMessage(`🗑️ Deleted "${cat}" category`);
    }
    this.closeModal('delete');
  }

  closeModal(type: 'category' | 'delete') {
    if (type === 'category') {
      this.showCategoryModal = false;
      this.newCategory = '';

      if (!this.selectedCategory && this.categories.length > 0) {
        this.selectedCategory = this.categories[0];
        this._data.saveSelectedCategory(this.selectedCategory);
      }
    } else {
      this.showDeleteModal = false;
      this.categoryToDelete = null;
    }
  }

  private updateGoals() {
    this._data.changeGoal(this.goals);
  }

  private showToastWithMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
    }, 2000);
  }
}
