
import { View } from 'react-native';

import CreateInput from './CreateInput';
import DefaultListItem from './DefaultListItem';
import FlatList from './FlatList';
import Sort from './Sort';
import Search from './Search';
import ListHeader from './Header';

import colors from '../colors';
import styles from '../styles';
import Bold from '../text/Bold';

import TalkButton from '../Talk/Button';
import DrawerScreen from '../../DrawerScreen';

export default function ListView({ options }) {
  const {
    actions,
    filters,
    ItemTemplate = DefaultListItem,
    noRedirect,
    storeKey,
    title,
  } = options;


  return (
    <>
      <DrawerScreen title={title} />
      <View style={styles.View}>
        <View style={{ flex: 1, paddingBottom: 0 }}>
          <ListHeader keys={storeKey} />
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
