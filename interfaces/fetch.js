import environment from "./environment";
// send any combo of text + audio + image

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

const LISTS = [
  {
    id: '23123242343345',
    title: 'Groceries',
    children: 4,
    subtitle: '4 items',
    updated: 12345636789,
    type: 'List',
  },
  {
    id: '231232423433245',
    title: 'ToDO',
    children: 44,
    subtitle: '44 items',
    updated: 15234566789,
    type: 'List',
  },
  {
    id: '233123242343345',
    title: 'Dog Name Ideas',
    children: 9050,
    subtitle: '9050 items',
    updated: 17234566789,
    type: 'List',
  },  
];

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

const LIST = {
  id: '342342424',
  children: [
    { id: '232323', index: 0, body: 'List Item 1', updated: '2024-01-20 07:37:27.065578-08', completed: true},
    { id: '2w32323', index: 1, body: 'List Item 2', updated: '2024-01-21 10:38:27.065578-08', completed: false},
    { id: '23w2323', index: 2, body: 'List Item 3', updated: '2024-01-24 15:37:27.065578-08', completed: false}
  ],
  title: 'List Title Goes Here',
  updated: 3423423424
};

// const Fetch = {
//     get: async (url) => { 
//       // console.log('URL', url);
//         const dataMap = {
//           convos: { results: CONVOS, totalResultsCount: 23 },
//           collections: { results: COLLECTIONS, totalResultsCount: COLLECTIONS.length },
//           lists: { results: LISTS, totalResultsCount: LISTS.length },
//           notes: { results: NOTES, totalResultsCount: NOTES.length },
//           collection: { results: COLLECTION, totalResultsCount: COLLECTION.children.length },
//           convo: CONVO,
//           list: LIST,
//           note: NOTE,
//         };
//         // console.log('dataMap[url]', dataMap[url]);

//         if (dataMap[url]) {
//           return dataMap[url];
//         }
//         return { results: [], totalResultsCount: 0 };
//     }
// };

// export default Fetch;


class Fetch {
  constructor() {
      this.api = environment.apiHost;
  }

  // getCSRFToken() {
  //     var cookieValue = null;
  //     if (document.cookie && document.cookie !== '') {
  //         var cookies = document.cookie.split(';');
  //         for (var i = 0; i < cookies.length; i++) {
  //             var cookie = cookies[i].trim();
  //             if (cookie.substring(0, 10) === ('csrftoken=')) {
  //                 cookieValue = decodeURIComponent(cookie.substring(10));
  //                 break;
  //             }
  //         }
  //     }
  //     return cookieValue;
  // }


  async get(url) {
      return fetch(`${this.api}/${url}`, 
          { 
              credentials: 'include',
              mode: 'cors', // no-cors, cors, *same-origin
              // 'X-CSRFToken': this.getCSRFToken(),
          }
      )
      .then(async (res) => {            
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
      return fetch(`${this.api}/${url}`, 
          { 
              body: JSON.stringify(data),
              credentials: 'include',
              headers: {
                  "Content-Type": "application/json",
                  // 'X-CSRFToken': this.getCSRFToken(),
              },
              method: 'POST',
          }
      )
      .then(res => res.json())        
      .then(res => [null, res])
      .catch(err => {
          console.log('FETCH POST ERR', err);
          return [err, null];
      });
  }
}

const fetcher = new Fetch();

export default fetcher;