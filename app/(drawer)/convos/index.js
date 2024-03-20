import ListView from '../../../components/UI/List/View';

export default function Convos() {  
  const options = {
    actions: {
      placeholder: 'Create New Conversation',
      talkUri: '',
    },
    defaultTitle:'Your Conversations',
    detail:'/convos',
    filters: {
      placeholder: 'Search by Title',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['name', 'updated_at'],
      },
    },
    uri:'convos'
  };

  return (<ListView options={{...options}} />);
}
