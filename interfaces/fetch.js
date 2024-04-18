import environment from "./environment";
import { Storage } from './storage';

class CustomFetch {
  constructor() {
      this.api = environment.apiHost;
  }

  async token() {
    const token = await Storage.get('session');    
    return `Token ${token}`;
  }

  async get(url, query) {
    const headers = {
      Authorization: await this.token(),
    };
    let target = `${this.api}/${url}`;
    
    if (query && Object.keys(query).length) {
      target += `?${new URLSearchParams(query).toString()}`;
    }

      return fetch(target, 
          { 
              credentials: 'include',
              mode: 'cors', // no-cors, cors, *same-origin
              headers
          }
      )
      .then(async (res) => {            
        // console.log('GET', res);
          if ([400, 401, 403, 404, 420].includes(res.status)) {
              return { error: 'Not Authorized', statusCode: res.status };
          }
          
          return await res.json();
      })   
      .catch(err => {
          console.log('FETCH GET ERR', err);
          return { error: err };
      });
  }

  async post(url, data) {  
      const target =  `${this.api}/${url}`;     
      const body = JSON.stringify(data);    
      const headers = {
        Authorization: await this.token(),
        "Content-Type": "application/json",
      };  
      return fetch(target, 
          { 
              body,
              credentials: 'include',
              headers,
              method: 'POST',
          }
      )
      .then(async (res) => {      
        // console.log('POST', res);      
        if ([400, 401, 403, 404, 420].includes(res.statusCode)) {
            return { error: 'Not Authorized', statusCode: res.statusCode };
        }
        // console.log("res.json()", res.json());
        return await res.json();
    })  
      .catch(error => {
          console.log('FETCH POST ERR', err);
          return { error };
      });
  }

  async put(url, data) {
    const target =  `${this.api}/${url}`;     
      const body = JSON.stringify(data);    
      const headers = {
        Authorization: await this.token(),
        "Content-Type": "application/json",
      };  
      return fetch(target, 
          { 
              body,
              credentials: 'include',
              headers,
              method: 'PUT',
          }
      )
      .then(async (res) => {      
        // console.log('PUT', res);      
        if ([400, 401, 403, 404, 420].includes(res.statusCode)) {
            return { error: 'Not Authorized', statusCode: res.statusCode };
        }
        // console.log("res.json()", res.json());
        return await res.json();
    })  
      .catch(error => {
          console.log('FETCH POST ERR', error);
          return {error};
      });
  }

  async remove(url) {
    const headers = {
      Authorization: await this.token(),
    };
    let target = `${this.api}/${url}`;
    

      return fetch(target, 
          { 
              credentials: 'include',
              mode: 'cors', // no-cors, cors, *same-origin
              headers,
              method: 'DELETE'
          }
      )
      .then(async (res) => {            
        // console.log('DELETE', res);
          if ([400, 401, 403, 404, 420].includes(res.status)) {
              return [{ error: 'Not Authorized', statusCode: res.status }, null];
          }
          
          return [null, await res.json()];
      })   
      .catch(err => {
          console.log('FETCH GET ERR', err);
          return [{ error: err }, null];
      });
  }
}

const Fetcher = new CustomFetch();

export default Fetcher;