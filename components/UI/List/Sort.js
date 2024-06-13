import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useSegments } from 'expo-router';

import colors from '../colors';

import { sorting } from '../icons';

import { queryClient } from '../../../contexts/query-client';
import { useEffect, useState } from 'react';

import Fetch from '../../../interfaces/fetch';

import { HeaderToggleableIcon } from '../View/Header';
import { listSort } from '../type';

export default function Sort() {
  const [disabled, setDisabled] = useState(true);
  const segments = useSegments();
  const local = useLocalSearchParams();
  const type = segments[1];
  const uuid = local.slug;
  const context = [type, uuid].filter(Boolean);
  const { fields } = listSort(type);

  const DataQuery = useQuery({
    enabled: false,
    queryKey: context,
  });

  useEffect(() => {
    if (DataQuery.data && DataQuery.data.results) {
      setDisabled(DataQuery.data.results.length === 0);
    }
  }, [DataQuery.data]);

  const buttonTheme = {
    inactive: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: colors.white,
    },
    active: {
      backgroundColor: 'transparent',
      borderColor: colors.white,//colors.darkText,
      color: colors.white, //colors.sort.active,
    }
  };

  function update(param) {
    const params = { ...DataQuery.data.params, ...param };
    Fetch.get(context, params)
      .then(response => queryClient.setQueryData(context, response));
  }

  const SortButton = (property) => {
    const isActive = DataQuery.data && DataQuery.data.params && DataQuery.data.params.sortProperty === property;
    const styles = isActive ? buttonTheme.active : buttonTheme.inactive;

    const sortIcon = () => {
      const color = styles.color;
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

      update({ sortProperty: property, sortDirection: direction });
    }

    return (
      <HeaderToggleableIcon
        key={`sort-${properties.name}`}
        icon={properties.name}
        onPress={() => chooseSort(property)}
        style={{
          button: { ...styles },
          icon: {
            color: properties.color,
            size: properties.size
          }
        }}
      />
    );
  }

  return (
    (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
        {fields.map(SortButton)}
      </View>
    )
  )
}