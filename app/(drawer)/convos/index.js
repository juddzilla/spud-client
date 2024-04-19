import ListView from '../../../components/UI/List/View';
import DrawerScreen from '../../../components/DrawerScreen';

export default function Convos() {  
  const options = {
    actions: {
      placeholder: 'Create New Conversation',
      talkUri: '',
    },
    detail:'/convos',
    filters: {
      placeholder: 'Search by Title',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['title', 'updated_at'],
      },
    },
    storeKey: ['convos'],
    uri:'convos/'
  };

  return (
    <>
      { DrawerScreen('Your Conversations') }
      <ListView options={{...options}} />
    </>
  );
}
