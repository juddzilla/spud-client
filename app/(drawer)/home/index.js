import ListView from '../../../components/UI/List/View';

export default function Lists() {  
  const options = {
    actions: {
      placeholder: 'Create New Queue Item',
      talkUri: '',
    },
    createKey: 'body',
    defaultTitle: 'Quick Queue',    
    filters: {
      placeholder: 'Search Queue',
      sort: {
        defaults: { property: 'created_at', direction: 'desc'},
        fields: ['body', 'created_at'],
      },
    },
    hasSwipeLTR: true,
    uri: 'queue/',
  };

  return (<ListView options={{...options}} />);
}
