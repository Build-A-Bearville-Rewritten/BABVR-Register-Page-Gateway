export interface Observer {
  onSubjectUpdate(): void;
}

export class Subject {
  private observers: Observer[] = [];

  protected notifyObservers() {
    for (const o of this.observers) {
      o.onSubjectUpdate();
    }
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
    observer.onSubjectUpdate();
  }

  removeObserver(observer: Observer) {
    this.observers.splice(this.observers.indexOf(observer), 1);
  }
}
