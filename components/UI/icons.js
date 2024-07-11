
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';

const icons = {

    alphabeticalAsc: { library: MaterialCommunityIcons, name: 'sort-alphabetical-ascending' },
    alphabeticalDesc: { library: MaterialCommunityIcons, name: 'sort-alphabetical-descending' },
    alphabeticalInactive: { library: MaterialCommunityIcons, name: 'sort-alphabetical-variant' },
    check: { library: MaterialCommunityIcons, name: 'check' },
    checkedOutline: { library: MaterialCommunityIcons, name: 'checkbox-outline' },
    checkOutline: { library: MaterialCommunityIcons, name: 'checkbox-blank-outline' },
    checkedFilled: { library: MaterialCommunityIcons, name: 'checkbox-intermediate' },
    chevronLeft: { library: MaterialCommunityIcons, name: 'chevron-left' },
    close: { library: Ionicons, name: 'close' },
    closeModal: { library: MaterialCommunityIcons, name: 'close-circle-outline' },
    completedAll: { library: MaterialCommunityIcons, name: 'dots-square' },
    completedNot: { library: MaterialCommunityIcons, name: 'checkbox-blank-outline' },
    completedOnly: { library: MaterialCommunityIcons, name: 'checkbox-marked-outline' },
    collection: { library: MaterialIcons, name: 'collections-bookmark' },
    collectionAdd: { library: MaterialIcons, name: 'library-add' },
    convoAdd: { library: MaterialCommunityIcons, name: 'chat-plus-outline' },
    convo: { library: MaterialCommunityIcons, name: 'chat-processing-outline' },
    // the below 2 icons are named incorrectly at the source. below is visually correct.
    dateAsc: { library: MaterialCommunityIcons, name: 'sort-calendar-descending' },
    dateDesc: { library: MaterialCommunityIcons, name: 'sort-calendar-ascending' },

    dateInactive: { library: MaterialCommunityIcons, name: 'calendar-range' },
    dots: { library: MaterialCommunityIcons, name: 'dots-vertical' },
    down: { library: SimpleLineIcons, name: 'arrow-down-circle' },
    history: { library: MaterialIcons, name: 'history' },
    home: { library: MaterialCommunityIcons, name: 'home-lightning-bolt-outline' },
    layers: { library: SimpleLineIcons, name: 'layers' },
    leftArrowLong: { library: FontAwesome, name: 'long-arrow-left' },
    list: { library: MaterialIcons, name: 'list' },
    listAdd: { library: MaterialCommunityIcons, name: 'playlist-plus' },
    listItem: { library: '', name: '' },
    mic: { library: Ionicons, name: 'mic-outline' },
    micOff: { library: Ionicons, name: 'mic-off' },
    navicon: { library: FontAwesome, name: 'navicon' },
    numericSortAsc: { library: MaterialCommunityIcons, name: 'sort-numeric-ascending-variant' },
    numericSortDesc: { library: MaterialCommunityIcons, name: 'sort-numeric-descending-variant' },
    numericSortInactive: { library: MaterialCommunityIcons, name: 'sort-numeric-variant' },
    noteAdd: { library: MaterialCommunityIcons, name: 'notebook-plus-outline' },
    notes: { library: MaterialCommunityIcons, name: 'notebook-outline' },
    pencil: { library: Ionicons, name: 'pencil' },
    plus: { library: FontAwesome, name: 'plus' },
    plusCircleOutline: { library: MaterialCommunityIcons, name: 'plus-circle-outline' },
    queue: { library: MaterialCommunityIcons, name: 'arrow-right-thin' },
    rain: { library: MaterialCommunityIcons, name: 'weather-rainy' },
    rocket: { library: SimpleLineIcons, name: 'rocket' },
    search: { library: FontAwesome, name: 'search' },
    send: { library: MaterialCommunityIcons, name: 'send' },
    summarize: { library: MaterialCommunityIcons, name: 'note-plus-outline' },
    sun: { library: Feather, name: 'sun' },
    trash: { library: FontAwesome, name: 'trash' },
    up: { library: SimpleLineIcons, name: 'arrow-up-circle' },
    webSearch: { library: MaterialCommunityIcons, name: 'search-web' },
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
        icon.style = { ...icon.style, ...rest };
    }

    return (<Component name={icon.name} size={icon.size} color={icon.color} style={icon.style} />)
}

export const sorting = {
    body: {
        asc: 'alphabeticalAsc',
        desc: 'alphabeticalDesc',
        inactive: 'alphabeticalInactive',
    },
    colors: {
        active: '',
        inactive: '',
    },
    created_at: {
        asc: 'dateAsc',
        desc: 'dateDesc',
        inactive: 'dateInactive',
    },
    title: {
        asc: 'alphabeticalAsc',
        desc: 'alphabeticalDesc',
        inactive: 'alphabeticalInactive',
    },
    order: {
        asc: 'numericSortAsc',
        desc: 'numericSortDesc',
        inactive: 'numericSortInactive'
    },
    updated_at: {
        asc: 'dateAsc',
        desc: 'dateDesc',
        inactive: 'dateInactive',
    }
};