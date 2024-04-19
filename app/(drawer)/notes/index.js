import ListView from '../../../components/UI/List/View';
import DrawerScreen from '../../../components/DrawerScreen';

export default function Notes() {  
  const options = {
    actions: {
      placeholder: 'Create New Note',
      talkUri: '',
    },
    detail: '/notes',
    filters: {
      placeholder: 'Search Notes',
      sort: {
        defaults: { property: 'updated_at', direction: 'desc'},
        fields: ['title', 'updated_at'],
      },
    },
    storeKey: ['notes'],
    uri: 'notes/'
  };

  return (
    <>
      { DrawerScreen('Your Notes') }
      <ListView options={{...options}} />
    </>
);
}
