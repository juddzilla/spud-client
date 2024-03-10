// send any combo of text + audio + image

const CONVOS = [
    {
      id: 'bd7wacbea-c1b1-46c2-aedq5-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
    },
    {
      id: '3acw68afc-c605-48wd3-a4f8-fbd91aa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
    },
    {
      id: '586q94a0f-3da1-471f-bde96-145571e29d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
    },
    {
      id: 'f-cq1b1-46de2-aed5-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
    },
    {
      id: '3ac68afc-c605-48wd3-a4f8-fbd91qaa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
    },
    {
      id: '58694a0f-3da1-4e71f-bd96-145571e2d9d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
    },
    {
      id: 'wss-c1bw1-46c2-aed5a-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
    },
    {
      id: '3qac68afc-c605-48d3-a4f8-fbdd91aa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
    },
    {
      id: '58694a0f-3daq1-471f-bd96-145571e2s9d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
    },
    {
      id: 'bd7acbea-c1b1-46c2-aedq5-3awd53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
    },
    {
      id: '3ac68afc-c605-48rwd3-a4f8-fbd91aa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
    },
    {
      id: '58694a0f-3da1-471f-bde96-14557r1e29d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
    },
    {
      id: 'bd7adcbea-c1b1-46de2-aedr5-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
    },
    {
      id: '3ac68wafc-c605-48d3-a4f8-fbd91qaa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
    },
    {
      id: '58694a0f-3qda1-471f-bd96-145571e2d9d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
    },
    {
      id: 'bd7acbesa-ca1b1-46c2-aed5a-3ad53abb28ba',
      length: 10,
      title: 'First Item',
      updated: '12345',
    },
    {
      id: '3ac68afc-c605-48sd3-a4f8-fbdd91aa97f63',
      length: 30,
      title: 'Second Item',
      updated: '12346',
    },
    {
      id: '58694a0f-3da1-47d1f-bd96-145571e2s9d72',
      length: 20,
      title: 'Third Item',
      updated: '12346',
    },
  ];
  
const NOTES = [
  {
    id: 23123242343345,
    title: 'sfffasdf sadfsdf asdf asdf df adf afd',
    updated: 12345636789,
  },
  {
    id: 231232423433245,
    title: 'asdf sadf asdf assdfsddf df adf afd',
    updated: 15234566789,
  },
  {
    id: 233123242343345,
    title: 'asdf sadf asddfsdff asdf df adf afd',
    updated: 17234566789,
  },
  {
    id: 2312355242343345,
    title: 'asdf sawerdf asdf asdf df adf afd',
    updated: 12345668789,
  }

]

const LISTS = [
  {
    id: '23123242343345',
    title: 'Groceries',
    subtitle: '4 items',
    updated: 12345636789,
  },
  {
    id: '231232423433245',
    title: 'ToDO',
    subtitle: '44 items',
    updated: 15234566789,
  },
  {
    id: '233123242343345',
    title: 'Dog Name Ideas',
    subtitle: '9050 items',
    updated: 17234566789,
  },  
];

const COLLECTIONS = [
  {
    id: '23123242343345',
    title: 'Food Stuff',
    subtitle: '33 items',
    updated: 12345636789,
  },
  {
    id: '231232423433245',
    title: 'Things',
    subtitle: '9 items',
    updated: 15234566789,
  },
  {
    id: '233123242343345',
    title: 'Ideas',
    subtitle: '0 items',
    updated: 17234566789,
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
    { id: '232323', body: 'MEssage 1', type: 'user', updated: 12324234},
    { id: '2w32323', body: 'MEssage 2', type: 'system', updated: 12324235},
    { id: '23w2323', body: 'MEssage 3', type: 'user', updated: 12324237},
    { id: '2w3232h3', body: 'MEssage 4', type: 'system', updated: 12324238},
    { id: '23w2h323', body: 'MEssage 5', type: 'user', updated: 12324239},
  ],
  title: 'Covo Title Goes Here',
  updated: 3423423424
};

const NOTE = {
  id: '342342424',
  body: 'sdf fsdfa sfasdfasdfa dsfsd fadsfds fasfs dfsfasdfasfsdf asdf asdfasdfasdfadsfasdfdsfadsfdsfdsfsdfadfdsf f f',
  title: 'List Title Goes Here',
  updated: 3423423424
};

const LIST = {
  id: '342342424',
  children: [
    { id: '232323', body: 'List Item 1'},
    { id: '2w32323', body: 'List Item 2'},
    { id: '23w2323', body: 'List Item 3'}
  ],
  title: 'List Title Goes Here',
  updated: 3423423424
};

const Fetch = {
    get: async (url) => { 
      console.log('URL', url);
        const dataMap = {
          convos: { results: CONVOS, totalResultsCount: 23 },
          collections: { results: COLLECTIONS, totalResultsCount: COLLECTIONS.length },
          lists: { results: LISTS, totalResultsCount: LISTS.length },
          notes: { results: NOTES, totalResultsCount: NOTES.length },
          collection: COLLECTION,
          convo: CONVO,
          list: LIST,
          note: NOTE,
        };
        console.log('dataMap[url]', dataMap[url]);

        if (dataMap[url]) {
          return dataMap[url];
        }
        return { results: [], totalResultsCount: 0 };
    }
};

export default Fetch;