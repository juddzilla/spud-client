import ListView from '../../../components/UI/List/View';

export default function Convos() {  
  const options = {
    actions: {
      placeholder: 'Create New Conversation',
      talkUri: '',
    },
    viewTitle:'Your Conversations',
    detail:'/convos',
    filters: {
      placeholder: 'Search by Title',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['title', 'updated_at'],
      },
    },
    uri:'convos/'
  };

  return (<ListView options={{...options}} />);
}
