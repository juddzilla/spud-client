
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const icons = {        
    alphabeticalAsc: { library: MaterialCommunityIcons, name: 'sort-alphabetical-ascending'},
    alphabeticalDesc: { library: MaterialCommunityIcons, name: 'sort-alphabetical-descending'},
    alphabeticalInactive: { library: MaterialCommunityIcons, name: 'sort-alphabetical-variant'},
    check: { library: MaterialCommunityIcons, name: 'check'},
    checkedOutline: { library: MaterialCommunityIcons, name: 'checkbox-outline'},
    checkOutline: { library: MaterialCommunityIcons, name: 'checkbox-blank-outline'},
    close: { library: Ionicons, name: 'close'},
    collection: { library: MaterialIcons, name: 'collections-bookmark' },
    convo: { library: Ionicons, name: 'chatbubble-outline'},

    // the below 2 icons are named incorrectly at the source. below is visually correct.
    dateAsc: { library: MaterialCommunityIcons, name: 'sort-calendar-descending'},
    dateDesc: { library: MaterialCommunityIcons, name: 'sort-calendar-ascending'},
    
    dateInactive: { library: MaterialCommunityIcons, name: 'calendar-range'},        
    dots: { library: MaterialCommunityIcons, name: 'dots-vertical'},
    leftArrowLong: { library: FontAwesome, name: 'long-arrow-left'},
    list: { library: Ionicons, name: 'list'},
    listItem: { library: '', name: ''},
    mic: { library: Ionicons, name: 'mic-outline'},
    micOff: { library: Ionicons, name: 'mic-off'},
    navicon: { library: FontAwesome, name: 'navicon'},
    numericSortAsc: { library: MaterialCommunityIcons, name: 'sort-numeric-ascending-variant'},
    numericSortDesc: { library: MaterialCommunityIcons, name: 'sort-numeric-descending-variant'},
    numericSortInactive: { library: MaterialCommunityIcons, name: 'sort-numeric-variant'},
    notes: { library: Ionicons, name: 'documents-sharp'},
    note: { library: '', name: ''},
    pencil: { library: Ionicons, name: 'pencil'},
    plus: { library: FontAwesome, name: 'plus'},
    plusCircleOutline: { library: MaterialCommunityIcons, name: 'plus-circle-outline'},
    search: { library: FontAwesome, name: 'search'},
    send: { library: MaterialCommunityIcons, name: 'send'},
    trash: { library: FontAwesome, name: 'trash'}
};

export default function Icon({ name, styles }) {
    const defaultColor = 'black';
    const defaultSize = 24;   
    
    const choice = icons[name];
    
    const Component = choice.library;
    const icon = {
        color: defaultColor,
        size: defaultSize,
        name: choice.name,        
        style: {},
    };

    if (styles) {    
        const { color, size, ...rest } = styles;
        icon.color = color || icon.color;
        icon.size = size || icon.size;
        icon.style = {...rest};
    }

    return (<Component name={icon.name} size={icon.size} color={icon.color} style={icon.style} />)
}

export const sorting = {
    colors: {
        active: '',
        inactive: '',
    },
    name: {
        asc: 'alphabeticalAsc',
        desc: 'alphabeticalDesc',
        inactive: 'alphabeticalInactive',
    },      
    order: {
        asc: 'numericSortAsc',
        desc: 'numericSortDesc',
        inactive: 'numericSortInactive'
    },
    updated: {
        asc: 'dateAsc',
        desc: 'dateDesc',
        inactive: 'dateInactive',
    }
  };