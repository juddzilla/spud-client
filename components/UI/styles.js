
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
    // paddingVertical: 8,
    // backgroundColor: 'red',
    paddingHorizontal: 16,
    // marginBottom: 8,
    input: {
        container: {
            ...row,
            flex: 1,
            
            // marginRight: 16,
        }
    }
};

const View = { flex: 1, backgroundColor: colors.theme.inputs.light.backgroundColor, };

const footer = {
    alignItems: 'center',   
    flexDirection: 'row', 
    height: 56,
    justifyContent: 'flex-end', 
    paddingHorizontal: 16,
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