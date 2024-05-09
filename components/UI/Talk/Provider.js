import { useState } from "react";
import { TalkContext } from "../../../contexts/talk";
import TalkModal from "./Modal";

export default function TalkProvider(props) {
    const [talkContext, setTalkContext] = useState(null);
    function modifiedSetTalkContext(context) {  
        if (!context) {
            setTalkContext(null);
            return;
        }
        setTalkContext(context.map((element, index) => {
            if (index === 0) {
                return element + ':audio';
            } else {
                return element;
            }
        }));
    }

    return (
        <TalkContext.Provider value={{ talkContext, setTalkContext: modifiedSetTalkContext }}>
            { true &&
                <TalkModal />                
            }
            { props.children }
        </TalkContext.Provider>
    )
  }
  