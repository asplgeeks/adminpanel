import { combineReducers } from "redux";
import globalReducer from "./globalReducer";

const rootReducer = combineReducers({
  globalStore: globalReducer,
});

export default rootReducer;
