import colors from "../colors";

export const typeColorMap = (section) => {
    const mapping = {
        collections: colors.university,
        convos: colors.infrared,
        lists: colors.brand,
        notes: colors.concord,
        queue: colors.tiffany,
    };

    return mapping[section];
};