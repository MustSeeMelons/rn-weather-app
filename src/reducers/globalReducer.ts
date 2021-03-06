import { GlobalState, initialGlobalState } from "../definitions/storeDefinitions";
import { Action } from "../actions";
import { GlobalActionTypes } from "../actions/globalActions";

export const globalReducer = (state: GlobalState = initialGlobalState, action: Action): GlobalState => {
    switch (action.type) {
        case GlobalActionTypes.SET_POSITION_DATA:
            return {
                ...state,
                position: action.payload.position
            }
        case GlobalActionTypes.SHOW_ERROR:
            return {
                ...state,
                displayError: action.payload.value,
                isLoading: false
            }
        case GlobalActionTypes.CLEAR_WEATHER:
            return {
                ...state,
                processedWeatherData: null
            }
        case GlobalActionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload.value
            }
        case GlobalActionTypes.SET_WEATHER:
            return {
                ...state,
                processedWeatherData: action.payload.data
            }
        case GlobalActionTypes.REFRESH:
            return {
                ...state,
                isRefreshing: action.payload.value
            }
        default:
            return state;
    }
}