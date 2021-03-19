const initialState = {
    user: '',
    classes: '',
    subjects: '',
  }

  export default function rootReducer(state = initialState, action) {
    if (action.type == 'UPDATE_STATE') {
        console.log(action.user);
        let obj  = {user: action.user, classes: action.classes, subjects: action.subjects};
        return { 
          obj
        }
    }

    return state;
  }

//   export default function(state=defaultState, action = {}) {
//     switch(action.type) {
//       case 'UPDATE':
//         return {
//           ...state,
//           text: action.text,
//           foo: {
//             ...state.foo,
//             bar: action.text,
//           },
//         };
//       default:
//         return state;
//     }
//   }