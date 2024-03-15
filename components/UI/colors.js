const black = '#000';
const white = '#fff';

const slate = {
    lightest: '#f1f5f9', // 100
    light: '#e2e8f0', // 200
    medium: '#64748b', // 500
    mediumDark: '#475569', // 800
    dark: '#0f172a', // 900
    darkest: '#020617', // 950
};

const teal = {
    medium: '#2dd4bf', // 400
};

const zinc = {
    light: '#d4d4d8', // zinc 300
    dark: '#18181b' //zinc 900
};

const red = {
    primary: '#ef4444' // red 900
};

const colors = {
    brand: teal.medium, // teal 400
    
    text: slate.dark, 
    darkText: slate.dark, 
    lightText: slate.medium,

    darkBg: slate.light, 
    lightBg: slate.lightest, 

    darkestBg: slate.mediumDark, 
    lightWhite: '#f8fafc',

    black,
    white,

    colorway: {
        dark: {
            primary: slate.light,
            secondary: slate.lightest,
        }
    },

    sort: {
        inactive: zinc.light, // zinc 300
        active: zinc.dark, //zinc 900
    },
    input: {
        dark: {
            backgroundColor: slate.light,
            color: slate.dark,
            icon: slate.medium,
        },        
    },
    header: {
        icon: '',
        text: ''
    },
    remove: red.primary,
}

export default colors;