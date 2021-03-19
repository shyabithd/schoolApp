import { createStore } from 'redux';

let today = new Date();
const initialState = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
};

function reducer(state = initialState, action) {
  if(action.type === "YEAR") {
    return {
      year: action.year,
      month: state.month
    };
  }
  else if(action.type === "MONTH") {
    return {
      year: state.year,
      month: action.month
    };
  }

  return state;
}

const calstore = createStore(reducer);
export default calstore;