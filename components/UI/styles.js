
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
    // height: 60,
    justifyContent: 'space-between',
    // paddingVertical: 8,
    // backgroundColor: 'white',
    padding: 8,
    // marginBottom: 8,
    input: {
        container: {
            ...row,
            flex: 1,
            
            // marginRight: 16,
        }
    }
};

const View = { flex: 1,  };

const footer = {
    alignItems: 'center',   
    flexDirection: 'row', 
    height: 56,
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