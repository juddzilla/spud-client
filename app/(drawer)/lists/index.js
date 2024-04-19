import ListView from '../../../components/UI/List/View';
import DrawerScreen from '../../../components/DrawerScreen';

export default function Lists() {  
  const options = {
    actions: {
      placeholder: 'Create New List',
      talkUri: '',
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
    <>
      { DrawerScreen('Your Lists') }
      <ListView options={{...options}} />
    </>
  );
}
