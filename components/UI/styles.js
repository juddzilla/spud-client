
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
    padding: 8,
    input: {
        container: {
            ...row,
            flex: 1,
        }
    }
};

const View = { flex: 1,  };

const footer = {
    backgroundColor: colors.lightWhite,    
    paddingVertical: 8,
    paddingHorizontal: 4,
    
    flexDirection: 'row', 
    // height: 64,
    justifyContent: 'flex-end',     
    width: '100%',    
    shadowColor: "#e2e8f0",
    shadowOffset: {
        width: 0,
        height: -20,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
};

export default {
    buttons,
    centered,
    footer,
    header,

    row,
    View,
}