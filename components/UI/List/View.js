import { View } from 'react-native';

import CreateInput from './CreateInput';
import DefaultListItem from './DefaultListItem';
import FlatList from './FlatList';
import Search from './Search';
import Sort from './Sort';

import styles from '../styles';
import TalkButton from '../Talk/Button';

import DrawerScreen from '../../DrawerScreen';

export default function ListView({options}) {  
  const {
    actions,
    filters,
    ItemTemplate = DefaultListItem,    
    noRedirect,
    storeKey, 
  } = options;

  return (
    <>
      <DrawerScreen title={storeKey[0]} />
      <View style={styles.View}>
        <View style={{...styles.header, paddingVertical: 8}}>   
          <Search            
            keys={storeKey}
            placeholder={filters.placeholder}          
          />
          { Object.hasOwn(filters, 'sort') &&
            <Sort     
              keys={storeKey}    
              fields={filters.sort.fields}
            />
          }        
        </View>
        <View style={{flex: 1, paddingBottom: 0}}>
          <FlatList    
            filters={filters}      
            keys={storeKey}
            renderItem={ItemTemplate}
          />       
        
          <View style={{...styles.footer, backgroundColor: 'transparent', position: 'absolute', bottom: 0}}>
            <CreateInput
              keys={storeKey}
              noRedirect={noRedirect}
              placeholder={actions.placeholder}            
            />
            <TalkButton keys={storeKey} />                  
          </View>
        </View>
      </View>       
    </>
  );  
}
