import ListView from '../../../components/UI/List/View';

export default function Notes() {  
  const options = {
    actions: {
      placeholder: 'Create New Note',
      talkUri: '',
    },
    viewTitle: 'Your Notes',
    detail: '/notes',
    filters: {
      placeholder: 'Search Notes',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['title', 'updated_at'],
      },
    },
    storeKey: 'notes',
    uri: 'notes/'
  };

  return (<ListView options={{...options}} />);
}
