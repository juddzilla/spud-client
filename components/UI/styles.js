
import colors from "./colors";
const buttons = {    
    icon: {
        height: 48,
        width: 48,
    },
    iconSmall: {
        height: 40,
        width: 40,
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
    input: {
        container: {
            ...row,
            flex: 1,
            marginRight: 16,
        }
    }
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

const View = { flex: 1 };

const footer = {
    backgroundColor: 'transparent',
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderTopWidth: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 10,                
    borderColor: colors.darkBg,
    borderLeftWidth: 1,
    borderWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
};

export default {
    buttons,
    centered,
    footer,
    header,
    inputs,
    row,
    View,
}