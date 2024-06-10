
import { View } from 'react-native';

import DefaultListItem from './DefaultListItem';
import FlatList from './FlatList';

import styles from '../styles';
import ViewHeading from './Header';

export default function ListView({ options }) {
  const {
    actions,
    filters,
    ItemTemplate = DefaultListItem,
    noRedirect,
    storeKey,

  } = options;


  return (
    <>
      {/* <DrawerScreen /> */}
      <View style={{ ...styles.View }}>
        <ViewHeading />
        <View style={{ flex: 1, }}>
          <FlatList
            filters={filters}
            context={storeKey}
            renderItem={ItemTemplate}
          />

          {/* <View style={{ ...styles.footer, backgroundColor: 'transparent', position: 'absolute', bottom: 0, paddingHorizontal: 8 }}>
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
