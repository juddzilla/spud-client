import ListView from '../../../components/UI/List/View';

export default function Lists() {  
  const options = {
    actions: {
      placeholder: 'Create New List',
      
    },    
    filters: {
      placeholder: 'Search Lists',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['title', 'updated_at'],
      },
    },    
    storeKey: ['lists'],
  };
  return (
    <ListView options={{...options}} />    
  );
}
