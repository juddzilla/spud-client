class DetailObserver {
    constructor() {
      this.observers = [];
      this.data = null;
    }

    getData() {
      return this.data;
    }
  
    subscribe(func) {
      this.observers.push(func);
    }
  
    unsubscribe(inputFunc) {
      this.observers.filter(func => func != inputFunc);
    }
  
    notify(data) {
      this.data = data;
      this.observers.forEach(func => func(data));
    }
  }
  
  export const DetailObservable = new DetailObserver();