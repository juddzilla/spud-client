
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
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    input: {
        container: {
            ...row,
            flex: 1,
        }
    }
};

const View = { flex: 1,  };

const footer = {
    backgroundColor: 'transparent',    
    paddingVertical: 8,
    // paddingRight: 4,
    // paddingLeft: 16,
    
    flexDirection: 'row', 
    // height: 64,
    justifyContent: 'flex-end',     
    width: '100%',
};

export default {
    buttons,
    centered,
    footer,
    header,

    row,
    View,
}