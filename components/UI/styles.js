
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
    flexDirection: 'row',    
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
    // backgroundColor: 'green',
    backgroundColor: 'transparent',    
    bottom: 0,
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'flex-end',     
    left: 0,
    paddingBottom: 8,
    paddingHorizontal: 8,
    position: 'absolute', 
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