class DetailObserver {
    constructor() {
      this.observers = [];
   }
  
    subscribe(func) {
      this.observers.push(func);
    }
  
    unsubscribe(inputFunc) {
      this.observers.filter(func => func != inputFunc);
    }
  
    notify(data) {
      this.observers.forEach(func => func(data));
    }
  }
  
  export const DetailObservable = new DetailObserver();