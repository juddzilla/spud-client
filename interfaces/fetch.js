import environment from "./environment";
import { Storage } from './storage';

const uriFromContext = (context) => context.join('/') + '/';

class CustomFetch {
  constructor() {
    this.api = environment.apiHost;
  }

  async token() {
    const token = await Storage.get('session');
    return `Token ${token}`;
  }

  async get(context, query) {
    const url = uriFromContext(context);
    const headers = {
      Authorization: await this.token(),
    };
    let target = `${this.api}/${url}`;

    if (query && Object.keys(query).length) {
      const nonNullKeys = Object.keys(query).reduce((acc, key) => {
        if (query[key] !== null) {
          acc[key] = query[key];
        }
        return acc;
      }, {});
      target += `?${new URLSearchParams(nonNullKeys).toString()}`;
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

  async post(context, data) {
    const url = uriFromContext(context);
    const target = `${this.api}/${url}`;
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
        console.log('POST', res);
        if ([400, 401, 403, 404, 420].includes(res.statusCode)) {
          return { error: 'Not Authorized', statusCode: res.statusCode };
        }
        if ([500].includes(res.statusCode)) {
          console.warn('FETCH POST 500', res);
          return { error: 'Our bad!', statusCode: res.statusCode };
        }
        // console.log("res.json()", res.json());
        return await res.json();
      })
      .catch(error => {
        console.log('FETCH POST ERR', error);
        return { error };
      });
  }

  async put(context, data) {
    const url = uriFromContext(context);
    const target = `${this.api}/${url}`;
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
        return { error };
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