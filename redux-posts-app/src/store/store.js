import axios from "axios";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { confirmedGetPostsAction, GET_POSTS } from "./actions/PostActions";
import PostsReducer from "./reducers/PostsReducer";
import thunk from "redux-thunk";
import { AuthReducer } from "./reducers/AuthReducer";

const loggerMiddleware = (store) => (next) => (action) => {
  console.log("dispatching action", action);
  console.log("before dispatching state", store.getState());
  let result = next(action);
  setTimeout(() => {
    console.log("dispatch time out");
  }, 5000);
  console.log("next state", store.getState());
  return result;
};

const fetchDataMiddleware = (store) => (next) => (action) => {
  if (action.type === GET_POSTS) {
    //ajax call
    axios
      .get(`https://react-my-burger-2db41.firebaseio.com/posts.json`)
      .then((response) => {
        console.log(response.data); 
        let posts = [];
        for(let key in response.data){
            posts.push({...response.data[key],id:key});
        } 
        store.dispatch(confirmedGetPostsAction(posts));
      });
  }

  return next(action);
};

const middleware = applyMiddleware(thunk);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; 
const reducers = combineReducers({posts:PostsReducer,
auth:AuthReducer,}) // combining the reducer

export const store = createStore(reducers, composeEnhancers(middleware));
