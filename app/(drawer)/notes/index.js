import ListView from '../../../components/UI/List/View';

export default function Notes() {  
  const options = {
    actions: {
      placeholder: 'Create New Note',
      talkUri: '',
    },
    defaultTitle: 'Your Notes',
    detail: '/notes',
    filters: {
      placeholder: 'Search Notes',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['name', 'updated_at'],
      },
    },
    uri: 'notes'
  };

  return (<ListView options={{...options}} />);
}
