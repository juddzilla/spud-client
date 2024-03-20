// list of convos
import {
  Pressable,
  View,
} from 'react-native';

import colors from '../colors';

import Icon, { sorting } from '../icons';

export default function Sort({ disabled, fields, query, update }) {  
  const sortIcon = (property) => {      
    const active = query.property === property;
    const activeColor = colors.sort.active;
    const inactiveColor = colors.sort.inactive;
    let color = inactiveColor;
    let name = sorting[property].inactive;        
    let size = 22;
    
    if (!disabled && active) {
      color = activeColor;
      name = query.direction === 'asc' ? sorting[property].asc : sorting[property].desc;
      size = 24;
    }

    return { color, name, size };
  };
    
  function chooseSort(property) {      
    if (disabled) {
      return;
    }
    let direction = 'desc';
    if (query.property === property) {
      direction = ['asc', 'desc'].filter(dir => dir !== query.direction)[0];
    }
    update({ sortProperty: property, sortDirection: direction});
  }
  
      
  return (
    (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            { fields.map(property => {
            const properties = sortIcon(property);
            return (
                <Pressable
                  key={property}
                  onPress={() => chooseSort(property)}
                  style={{ width: 48, height: 64, alignItems: 'center', justifyContent: 'center'}}
                >
                  <Icon name={properties.name} styles={{size: properties.size, color: properties.color }} />
                </Pressable>
            )
            })}          
        </View>          
    )
  )
}