import ListView from "../List/View";
import InboxListItem from "./List-Item";

export default function InboxList() {
    return (
        <ListView
            options={{
                context: ['queue'],
                ItemTemplate: InboxListItem
            }}
        />
    )
}