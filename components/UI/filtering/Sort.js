import { Pressable, StyleSheet, View } from 'react-native';

import colors from '../colors';

import Icon, { sorting } from '../icons';

import { queryClient } from '../../../contexts/query-client';

export default function Sort({ fields, keys, size='small', theme='light', update }) {        
  let height = 40;
  let width = 48;

  const Query = queryClient.getQueryData(keys);
  
  const disabled = !Query ||  Query.results.length === 0;
  
  if (size === 'small') {
      height = 32;
      width = 40;
  }

  const buttonThemes = {
    dark: {
      active: {
        backgroundColor: colors.darkText,
        borderColor: colors.darkText,
        color: colors.lightWhite,
      },
      inactive: {
        backgroundColor: 'transparent',
        borderColor: colors.white,
        color: colors.darkText,
      },
    },
    light: {
      inactive: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: colors.sort.inactive,
      },
      active: {
        backgroundColor: 'transparent',
        borderColor: colors.darkText,
        color: colors.sort.active,
      },
    },
  };

  const buttonTheme = buttonThemes[theme];
  
  const SortButton = (property) => {      
    const isActive = Query.params.sortProperty === property;  
    const styles = isActive ? buttonTheme.active : buttonTheme.inactive;
    const buttonStyle = StyleSheet.create({
      alignItems: 'center',
      height,
      justifyContent: 'center',
      marginLeft: 3,
      width,
      backgroundColor: styles.backgroundColor,
      border: 1,
      borderWidth: 1,
      borderColor: styles.borderColor,
      borderRadius: 4,
    });
    
    const sortIcon = () => {            
      let color = styles.color;
      let name = sorting[property].inactive;

      let iconSize = size === 'small' ? 16 : 22;
            
      if (isActive) {      
        name = Query.params.sortDirection === 'asc' ? sorting[property].asc : sorting[property].desc;
        iconSize = size === 'small' ? 19 : 24;
      }
  
      return { color, name, size: iconSize };
    };

    const properties = sortIcon(property);
    
    function chooseSort(property) {     

      if (disabled) {
        return;
      }
      let direction = 'desc';
      if (isActive) {
        direction = ['asc', 'desc'].filter(dir => dir !== Query.params.sortDirection)[0];
      }

      update({ sortProperty: property, sortDirection: direction});
    }

    return (
      <Pressable
        key={property}
        onPress={() => chooseSort(property)}
        style={buttonStyle}
      >
        <Icon name={properties.name} styles={{size: properties.size, color: styles.color }} />
      </Pressable>
    )
  }
      
  return (
    (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            { fields.map(SortButton)}          
        </View>          
    )
  )
}