import environment from "./environment";
import { Storage } from './storage';

const CONVOS = [
    {
      id: 'bd7wacbea-c1b1-46c2-aedq5-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
      type: 'Convo',
    },
    {
      id: '3acw68afc-c605-48wd3-a4f8-fbd91aa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: '586q94a0f-3da1-471f-bde96-145571e29d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: 'f-cq1b1-46de2-aed5-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
      type: 'Convo',
    },
    {
      id: '3ac68afc-c605-48wd3-a4f8-fbd91qaa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: '58694a0f-3da1-4e71f-bd96-145571e2d9d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: 'wss-c1bw1-46c2-aed5a-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
      type: 'Convo',
    },
    {
      id: '3qac68afc-c605-48d3-a4f8-fbdd91aa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: '58694a0f-3daq1-471f-bd96-145571e2s9d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: 'bd7acbea-c1b1-46c2-aedq5-3awd53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
      type: 'Convo',
    },
    {
      id: '3ac68afc-c605-48rwd3-a4f8-fbd91aa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: '58694a0f-3da1-471f-bde96-14557r1e29d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: 'bd7adcbea-c1b1-46de2-aedr5-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
      type: 'Convo',
    },
    {
      id: '3ac68wafc-c605-48d3-a4f8-fbd91qaa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: '58694a0f-3qda1-471f-bd96-145571e2d9d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: 'bd7acbesa-ca1b1-46c2-aed5a-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
      type: 'Convo',
    },
    {
      id: '3ac68afc-c605-48sd3-a4f8-fbdd91aa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
      type: 'Convo',
    },
    {
      id: '58694a0f-3da1-47d1f-bd96-145571e2s9d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
      type: 'Convo',
    },
  ];
  
const NOTES = [
  {
    id: 23123242343345,
    title: 'sfffasdf sadfsdf asdf asdf df adf afd',
    updated: 12345636789,
    type: 'Note',
  },
  {
    id: 231232423433245,
    title: 'asdf sadf asdf assdfsddf df adf afd',
    updated: 15234566789,
    type: 'Note',
  },
  {
    id: 233123242343345,
    title: 'asdf sadf asddfsdff asdf df adf afd',
    updated: 17234566789,
    type: 'Note',
  },
  {
    id: 2312355242343345,
    title: 'asdf sawerdf asdf asdf df adf afd',
    updated: 12345668789,
    type: 'Note',
  }

]

const COLLECTIONS = [
  {
    id: '23123242343345',
    title: 'Food Stuff',
    subtitle: '33 items',
    updated: 12345636789,
    type: 'Collection',
  },
  {
    id: '231232423433245',
    title: 'Things',
    subtitle: '9 items',
    updated: 15234566789,
    type: 'Collection',
  },
  {
    id: '233123242343345',
    title: 'Ideas',
    subtitle: '0 items',
    updated: 17234566789,
    type: 'Collection',
  }, 
];

const COLLECTION = {
  id: '342342424',
  children: [
    { id: '232323', title: 'List Item 1', type: 'Note'},
    { id: '2w32323', title: 'List Item 2', type: 'Convo'},
    { id: '23w2323', title: 'List Item 3', type: 'List'}
  ],
  title: 'Collection Title Goes Here',
  updated: 3423423424
};

const CONVO = {
  id: '342342424',
  messages: [    
    { id: 5, body: 'Can you clarify?', type: 'system', updated: 12324235},
    { id: 4, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', type: 'user', updated: 12324237},
    { id: 3, body: 'Lssorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet mauris commodo quis imperdiet massa tincidunt. Porttitor leo a diam sollicitudin. Aliquam ut porttitor leo a diam. Elit eget gravida cum sociis natoque. Eget felis eget nunc lobortis mattis aliquam faucibus purus in. Nisl nisi scelerisque eu ultrices vitae auctor. Neque sodales ut etiam sit amet nisl. Dictumst quisque sagittis purus sit. Odio ut sem nulla pharetra diam sit. Iaculis eu non diam phasellus. Pretium fusce id velit ut tortor. Sit amet commodo nulla facilisi nullam vehicula. Eget nunc lobortis mattis aliquam faucibus purus in massa. Varius sit amet mattis vulputate enim nulla aliquet porttitor lacus. Eget nulla facilisi etiam dignissim diam quis. Nec sagittis aliquam malesuada bibendum arcu vitae. Scelerisque in dictum non consectetur a erat.', type: 'system', updated: 12324235},
    { id: 2, body: 'MEssage 5', type: 'user', updated: 12324239},
    { id: 1, body: `Yes, if you change the order of a ListItem, you would typically need to update the order field for all related ListItems accordingly to maintain the desired order.

    However, to minimize the overhead of updating all related ListItems, you can implement logic to handle reordering efficiently. For example, if you want to move an item from one position to another, you can swap the order values of the two relevant ListItems rather than updating all items.
    
    Here's a simplified example of how you might implement such logic:`, type: 'system', updated: 12324238},
    { id: 0, body: 'what the hell is going on?', type: 'user', updated: 12324238},
  ],
  title: 'Covo Title Goes Here',
  updated: 3423423424
};

const NOTE = {
  id: '342342424',
  body: 'sdf fsdfa sfasdfasdfa dsfsd fadsfds fasfs dfsfasdfasfsdf asdf asdfasdfasdfadsfasdfdsfadsfdsfdsfsdfadfdsf f f',
  title: 'Note Title Goes Here',
  updated: 3423423424
};

class Fetch {
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
        console.log('GET', res);
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
        console.log('POST', res);      
        if ([400, 401, 403, 404, 420].includes(res.statusCode)) {
            return [{ error: 'Not Authorized', statusCode: res.statusCode }, null];
        }
        // console.log("res.json()", res.json());
        return [null, await res.json()];
    })  
      .catch(err => {
          console.log('FETCH POST ERR', err);
          return [err, null];
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
        console.log('PUT', res);      
        if ([400, 401, 403, 404, 420].includes(res.statusCode)) {
            return [{ error: 'Not Authorized', statusCode: res.statusCode }, null];
        }
        // console.log("res.json()", res.json());
        return [null, await res.json()];
    })  
      .catch(err => {
          console.log('FETCH POST ERR', err);
          return [err, null];
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
        console.log('DELETE', res);
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

const fetcher = new Fetch();

export default fetcher;