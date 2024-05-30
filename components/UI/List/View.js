
import { View } from 'react-native';

import CreateInput from './CreateInput';
import DefaultListItem from './DefaultListItem';
import FlatList from './FlatList';
import Sort from './Sort';

import styles from '../styles';
import TalkButton from '../Talk/Button';

import DrawerScreen from '../../DrawerScreen';

export default function ListView({options}) {  
  console.log(0);
  const {
    actions,
    filters,
    ItemTemplate = DefaultListItem,    
    noRedirect,
    storeKey,     
  } = options;

  function headerRight() {
    if (Object.hasOwn(filters, 'sort')) {
      return (
        <Sort     
          keys={storeKey}    
          fields={filters.sort.fields}
        />
      )
    }
  }

  return (
    <>
      <DrawerScreen headerRight={headerRight} title={'name me'} />
      <View style={styles.View}>        
        <View style={{flex: 1, paddingBottom: 0}}>
          <FlatList    
            filters={filters}      
            keys={storeKey}
            renderItem={ItemTemplate}
          />       
        
          {/* <View style={{...styles.footer, backgroundColor: 'transparent', position: 'absolute', bottom: 0, paddingHorizontal: 8}}>
            <CreateInput
              keys={storeKey}
              noRedirect={noRedirect}
              placeholder={actions.placeholder}            
            />
            <TalkButton keys={storeKey} />                  
          </View> */}
        </View>
      </View>       
    </>
  );  
}
