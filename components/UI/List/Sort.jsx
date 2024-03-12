// list of convos
import {
  Pressable,
  View,
} from 'react-native';

import Regular from '../text/Regular';

import Icon from '../icons';

export default function Sort({ query, update }) {
    const iconsMap = {
        name: {
          asc: 'alphabeticalAsc',
          desc: 'alphabeticalDesc',
          inactive: 'alphabeticalInactive'
        },
        updated: {
          asc: 'dateAsc',
          desc: 'dateDesc',
          inactive: 'dateInactive'
        }
      };
    
      const sortIcon = (property) => {
        const active = query.sortProperty === property;
        const activeColor = '#000';
        const inactiveColor = '#d4d4d8';
        let color = inactiveColor;
        let name = iconsMap[property].inactive
        let size = 22;
        
        if (active) {
          color = activeColor;
          name = query.sortDirection === 'asc' ? iconsMap[property].asc : iconsMap[property].desc;
          size = 24;
        }
    
        return { color, name, size };
      };
    
      function chooseSort(property) {
        let direction = 'desc';
        if (query.sortProperty === property) {
          direction = ['asc', 'desc'].filter(dir => dir !== query.sortDirection)[0];        
        }
        // setSort({ property, direction });
        update({ sortProperty: property, sortDirection: direction});
      }
  
      
      return (
        (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                { Object.keys(iconsMap).map(property => {
                const properties = sortIcon(property);
                // console.log('properties', properties);
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