import ListView from '../../../components/UI/List/View';

export default function Collections() {  
  const options = {
    actions: {
      placeholder: 'Create Collections',
      talkUri: '',
    },
    createKey: 'title',
    viewTitle: 'Collections',    
    details: '/collections',
    filters: {
      placeholder: 'Search Collections',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['body', 'updated_at'],
      },
    },
    uri: 'collections/',
  };

  return (<ListView options={{...options}} />);
}
