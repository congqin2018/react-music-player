import { RECEIVE_SEARCH_RESULT } from '../actions/index'

export default (state = [], action) => {
    switch (action.type) {
        case RECEIVE_SEARCH_RESULT: {
            return [...action.songs];
        }
        default: {
            return state;
        }
    }
};