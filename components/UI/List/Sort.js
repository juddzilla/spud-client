import { Pressable, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import colors from '../colors';

import Icon, { sorting } from '../icons';

import { queryClient } from '../../../contexts/query-client';
import { useEffect, useState } from 'react';

import Fetch from '../../../interfaces/fetch';

export default function Sort({ fields, keys }) {       
  const [disabled, setDisabled] = useState(true);
  const uri = `${keys[0]}/`;  

  const DataQuery = useQuery({
    enabled: false,
    queryKey: keys,
  });

  useEffect(() => {  
    if (DataQuery.data) {
      setDisabled(DataQuery.data.results.length === 0);
    }
  }, [DataQuery.data]);

  const buttonTheme = {
    inactive: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: colors.sort.inactive,
    },
    active: {
      backgroundColor: 'transparent',
      borderColor: colors.darkText,
      color: colors.sort.active,
    }
  };

  function update(param) {
    const params = {...DataQuery.data.params, ...param};    
    Fetch.get(uri, params)
      .then(response => queryClient.setQueryData(keys, response));
  }
  
  const SortButton = (property) => {    
    const isActive = DataQuery.data && DataQuery.data.params && DataQuery.data.params.sortProperty === property;  
    const styles = isActive ? buttonTheme.active : buttonTheme.inactive;
    const buttonStyle = StyleSheet.create({
      alignItems: 'center',
      height: 32,
      justifyContent: 'center',
      marginLeft: 3,
      width: 40,
      backgroundColor: styles.backgroundColor,
      border: 1,
      borderWidth: 1,
      borderColor: styles.borderColor,
      borderRadius: 4,
    });
    
    const sortIcon = () => {            
      let color = styles.color;
      let name = sorting[property].inactive;

      let iconSize = 16;
            
      if (isActive) {      
        name = DataQuery.data.params.sortDirection === 'asc' ? sorting[property].asc : sorting[property].desc;
        iconSize = 19;
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
        direction = ['asc', 'desc'].filter(dir => dir !== DataQuery.data.params.sortDirection)[0];
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