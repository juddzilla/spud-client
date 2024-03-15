
const buttons = {    
    icon: {
        height: 48,
        width: 48,
    }
};

const centered = { alignItems: 'center', justifyContent: 'center' };
const row = { alignItems: 'center', flexDirection: 'row' };

const header = {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    height: 64,
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
};

const inputs = {
    size: {
        small: {                    
            height: 40,                      
            marginRight: 0, 
            flex: 1,
            paddingLeft: 32,
            paddingRight: 8,
        },
    },
};

const View = { flex: 1 }

export default {
    buttons,
    centered,
    header,
    inputs,
    row,
    View,
}