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
    light: '#fca5a5', // red 300
    primary: '#ef4444' // red 900
};

const theme = {
    backgroundColor: 'rgb(249,249,249)',
    color: 'rgb(34,34,34)',
    text: {
        darkest: 'rgb(77,77,78)',
        dark: 'rgb(34,34,34)',
        // light: 'rgb(170,171,172)',
        light: 'rgb(212,212,212)',
        lightest: 'rgb(228,229,230)',
        medium: 'rgb(136,136,136)',
    },
    inputs: {
        light: {
            backgroundColor: 'rgb(239,241,242)',
            color: 'rgb(34,34,34)',
            text: {
                dark: 'rgb(34,34,34)',
                light: 'rgb(90,90,90)'
            }
        },
        dark: {
            backgroundColor: 'rgb(34,37,39)',
            color: 'rgb(212,212,212)',
            text: {
                dark: 'rgb(88,91,92)',
                light: 'rgb(211,211,211)'
            }
        }

    },
    light: {
        background: {
            primary: '',
            secondary: '',
            tertiary: '',            
        },
        text: {
            primary: '',
            secondary: '',
            tertiary: '',            
        }
    }
}

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

    button: {
        disabled: slate.medium,
        enabled: slate.dark,
    },

    colorway: {
        dark: {
            primary: slate.light,
            secondary: slate.lightest,
        }
    },

    detail: {
        background: slate.darkest,
    },

    sort: {
        inactive: zinc.light, // zinc 300
        active: zinc.dark, //zinc 900
    },
    input: {
        border: 'rgb(228,229,230)',
        color: 'rgb(34,34,34)',
        dark: {
            backgroundColor: slate.light,
            color: slate.dark,
            icon: slate.medium,
        },
        icon: {            
            unfocused: slate.medium,
        }
    },
    header: {
        icon: '',
        text: ''
    },
    remove: red.primary,
    removeHint: red.light,
    theme,
}

export default colors;