import { createContext } from "react";

export const updateTwitchContext = (values = {}) => ({ character: values });

// export const CharacterData = {

// }

const TwitchControlContext = createContext({

}
);

export default  TwitchControlContext;