import ListView from '../../../components/UI/List/View';

export default function Convos() {  
  const options = {
    actions: {
      placeholder: 'Create New Conversation',      
    },
    filters: {
      placeholder: 'Search by Title',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['title', 'updated_at'],
      },
    },
    menuOptions: [{display: 'Summarize', name: 'summarize'}],
    storeKey: ['convos'],    
  };

  return (
    <ListView options={{...options}} />    
  );
}
