import ListView from '../../../components/UI/List/View';

export default function Lists() {  
  const options = {
    actions: {
      placeholder: 'Create New List',
      talkUri: '',
    },
    defaultTitle: 'Your Lists',
    detail:'/lists',
    filters: {
      placeholder: 'Search Lists',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['name', 'updated_at'],
      },
    },
    uri: 'lists/',
  };

  return (<ListView options={{...options}} />);
}
