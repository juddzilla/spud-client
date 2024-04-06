import Fetch from "./fetch";

const views = {
    collections: {
        list: 'collections/',
        detail: (uuid) => `collection/${uuid}`,
    },    
    convos: {
        list: 'convos/',
        detail: (uuid) => `convo/${uuid}`,
    },
    lists: {
        list: 'lists/',
        detail: (uuid) => `list/${uuid}`,
    },
    notes: {
        list: 'notes/',
        detail: (uuid) => `note/${uuid}`,
    },
};

class Store {
    constructor() {
        this.reset();
    }

    config(view, sort) {
        console.log('!!!this.data.view', sort);
        this.data.view = view;
        this.filter.sortDirection = sort.direction;
        this.filter.sortProperty = sort.property;
        this.endpoints = views[view];
    }
  
    subscribe(fxn) {
      this.observers.push(fxn);    
    }
  
    unsubscribe(func) {
      this.observers = this.observers.filter((observer) => observer !== func);
    }
  
    notify() {
      this.observers.forEach((observer) => observer(this.data));
    }

    reset() {
        this.endpoints = {
            get: '',
            detail: '',            
        };
        
        this.filter = {
            search: '',
            sortDirection: '',
            sortProperty: ''
        };
        
        this.observers = [];
        
        this.data = {
            errors: '',
            results: [],
            loading: false,
            total: null,
            view: '',
        };
    }

    async get() {
        this.data.loading = true;
        this.notify(this.data);
        console.log('this.endpoints.list, this.filter', this.endpoints.list, this.filter);
        const response = await Fetch.get(this.endpoints.list, this.filter);
        const [errors, data] = response;

        let updated = {
            loading: false,
        };

        if (errors) {
            updated.errors = errors;
        } else {
            updated = {
                ...updated,
                errors: '',
                results: data.results,
                total: data.count,
            }
        }

        this.data = {...this.data, ...updated};

        this.notify();    
    }

    create(data) {}

    next() {}

    remove(uuid) {
        const results = this.data.results.filter(item => item.uuid !== uuid);
        const total = results.length;

    }

    update(filters) {

    }
  }

export default new Store();