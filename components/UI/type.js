import colors from "./colors";

export const singular = (type) => {
    const plural = {
        collection: 'Collection',
        convos: 'Convo',
        lists: 'List',
        notes: 'Note',
    };
    return plural[type];
}

export const drawerTitle = {
    collections: 'Collections',
    convos: 'Convos',
    queue: 'Queue',
    lists: 'Lists',
    notes: 'Notes',
}

export const colorway = (type) => colors[type];

export const listSort = (type) => {
    const mapping = {
        collections: {
            defaults: { property: 'updated_at', direction: 'desc' },
            fields: ['body', 'updated_at'],
        },
        convos: {
            defaults: { property: 'updated_at', direction: 'desc' },
            fields: ['title', 'updated_at'],
        },
        lists: {
            defaults: { property: 'updated_at', direction: 'desc' },
            fields: ['title', 'updated_at'],
        },
        notes: {
            defaults: { property: 'updated_at', direction: 'desc' },
            fields: ['title', 'updated_at'],
        },
        queue: {
            defaults: { property: null, direction: null },
            fields: [],
        }
    };

    return mapping[type];
};

export const detailSort = (type) => {
    const mapping = {
        collections: {
            defaults: { property: 'updated_at', direction: 'desc' },
            fields: ['title', 'updated_at'],
        },
    };

    return mapping[type];
};

export const hasSearch = ([type, uuid]) => {
    const enabled = [
        // 'collections',
        'convos',
        'lists',
        'notes',
        'queue',
    ];

    const enabledWithUUID = [];

    if (!uuid) {
        return enabled.includes(type);
    } else {
        return enabled.includes(type) && enabledWithUUID.includes(type);
    }
}

export const fromModelName = (type) => {
    const mapping = {
        Collection: 'collections',
        Convo: 'convos',
        List: 'lists',
        Note: 'notes'
    };
    return mapping[type];
}