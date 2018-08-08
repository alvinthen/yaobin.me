---
title: 'Minimal and practical template to start developing on React Native'
date: '2018-08-08T19:30:37+0800'
categories: ['Code']
tags: ['React Native', 'Template']
excerpt: "We present to you the most practical and minimal, yet extensible template to start a React Native project."
---

## TL;DR
```bash
# sh
git clone --depth 1 \
https://github.com/alvinthen/react-native-starter-pack \
my-new-project
```

---

# Preface / Some rants
It's always a headache to start off something with React Native. The HelloWorld template is too bare, the HelloNavigation while it comes with `react-navigation` but it's still too simple to start off.

If you try to search for "react native template" in GitHub, you'll find the number of boilerplate / starter kits / templates out there is huge. We sorted them based on stars, and recent activities (naming them here is not a good idea as this is very subjective), thus isolated those outdated. Due to the nature of our work, which requires many iterations of prototyping, these templates are either too bloated, not suitable for prototyping, or too simple for our practice.

Hence, we present to you the most _(for us)_ practical and minimal, yet extensible template to start off a React Native project, the [react-native-starter-pack](https://github.com/alvinthen/react-native-starter-pack), with the following _tools_ configured off the shelf.

* [Redux](https://redux.js.org/)
* [Redux Thunk](https://github.com/reduxjs/redux-thunk)
* [Redux Pack](https://github.com/lelandrichardson/redux-pack)
* [Redux Persist](https://github.com/rt2zz/redux-persist)
* [Redux Logger](https://github.com/evgenyrodionov/redux-logger)
* [React Navigation](https://reactnavigation.org/)
* [Airbnb ESLint config](https://github.com/airbnb/javascript)
* [Flow](https://flow.org/)
* [Ducks](https://github.com/erikras/ducks-modular-redux)
* [CircleCI](https://circleci.com/) ready
* Monthly React Native and dependencies upgrade

Let's go through them why we chose the packages swiftly.

# Redux
As much as we agree with this [article](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) on why you might not need redux, we included it, because we found at some point of the time, we will need to share states across the app, of course we could also use the new React Context API, you just have to wire things together manually.

We proceed to move business logic into the Redux store, which brings us to the middleware we'll see later. Although we're including it in the starter pack, we highly encourage you to read the above article and decide what states should live in the store and what should live in your local states.

# Redux Thunk
While it is now often replaced by redux-saga or redux-observable, we find that thunk is still useful to make simple async functions, especially those that you can fire off once and forget.

# Redux Pack
Again, while dominated by sagas and observables, we find that Redux Pack has its own place as well for its simplicity and minimal effort to setup. If you found yourself writing many actions that's suffixed with `_DONE`, `_STARTED`, `_FAILED`, it's where this middleware shines.

Here's one of the example redux module in the starter pack ([Source](https://github.com/alvinthen/react-native-starter-pack/blob/8dfb21bbf19b6ab5d034b80f7ea4ffcd79e3cd11/src/redux/modules/people.js)).

```js
import { handle } from 'redux-pack';
import { fetchPeople } from './swapi';

const FETCH_PEOPLE = 'rn/people/FETCH_PEOPLE';

const doFetchPeople = () => ({
  type: FETCH_PEOPLE,
  promise: fetchPeople(),
});

const applyFetchPeople = (state, action) => handle(state, action, {
  start: prevState => ({
    ...prevState, isLoading: true, error: null, people: [],
  }),
  finish: prevState => ({ ...prevState, isLoading: false }),
  failure: prevState => ({ ...prevState, error: action.payload }),
  success: prevState => ({ ...prevState, people: action.payload.results }),
});

export default function reducer(state, action) {
  switch (action.type) {
    case FETCH_PEOPLE:
      return applyFetchPeople(state, action);
    default:
      return state;
  }
}
```

Instead of handling all the different suffixed actions in the reducer, we let redux-pack to handle the states of a promise for us.

The `handle` function from redux-pack is a smaller reducer that will handle all the different states that your promise may return.

All we need to do is to dispatch the action returned by `doFetchPeople`, note the `promise` property in the action object, this is what the middleware will execute.

In short, you dispatch an object with the action type and a promise, use `handle` from Redux Pack to handle that action type.

# Redux Persist & Redux Logger
These two are the usual necessity for redux, okay, maybe not that necessary but it helps with development in one way or another.

Having logger definitely benefits both dev and production environments. You can collect the logs of action dispatched before a bug occurred, send it back to your issue collector, this helps a lot on debugging production environment.

Redux Persist is used for storing states locally on users' device. Most of the time you'll be storing session token here. Else, you can manually save it using React Native's `AsyncStorage` API, which is also used by Redux Persist by default.

# React Navigation
We're a fan of this, it provides simplest API and easy to set up. We even upgraded to version 2 of `react-navigation` recently with all these [changes/improvements](https://reactnavigation.org/blog/2018/05/07/react-navigation-2.0.html). The best things are it comes with transition animation as how a native Android/iOS should behave, and handling of back button in Android.

Setting up a Navigator is as simple as declaring the routes and components to use.

```js
import { createStackNavigator } from 'react-navigation';
import People from './containers/People';
import Person from './components/Person';

export default createStackNavigator({
  People: {
    screen: People,
    navigationOptions: {
      title: 'SW Characters',
    },
  },
  Person: { screen: Person },
}, {
  initialRouteName: 'People',
});
```

The components will then receive a `navigation` prop to do the actual navigation, or to define the header title.

```js
// Declaring `navigationOptions` to set the header title via params given.
Person.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('name', 'Person name'),
});

// Navigate to Person component together with params (name, etc)
navigate = (item) => {
  const { navigation } = this.props;
  navigation.navigate('Person', { ...item });
}
```

# ESLint & Flow
These duo definitely help in development, by adding style guide and  a static type checker, you spend more time to write better and quality codes, lesser time in debugging what's going wrong (typo errors especially). We must admit that at some point, we spent much more time trying to fix these ESLint and Flow errors than actually coding.

You can always suppress the errors by overriding the ESLint config in `.eslintrc` or putting a comment around a Flow error.

```js
// $FlowFixMe I'm too lazy to fix this Flow error now
```

Remember that you are still free to override any rules in `.eslintrc` or `.flowconfig`.

# Ducks and Project Structure
This is where it is very opinionated, there's no silver bullet, every team should have their own preference. For us, this has worked well, by separating Components and Containers into different folder. With this, we do not mean the smart/dumb or container/presentational couple, while it's fairly similar.

The components folder are for common components that you can use everywhere, it can have both container and presentational components. For example, if you have a cart button that exists everywhere in your app, it should live in this folder.

```bash
src/components
└── Cart
    ├── index.js
    ├── presenter.js
    └── styles.js
```

In the example above, `index.js` can contain the codes to connect to the Redux store, obtain the number of items in the cart. `presenter.js` is where the UI lives, with its styling in `styles.js`.

The containers folder are largely the same except that it's where the major containers live, such as the main screens.

[Ducks](https://github.com/erikras/ducks-modular-redux) is a convention to organize redux modules, by organizing every related codes in a single file. All the actions, action creators, reducers live under one hood. Of course, if your redux module became too large, you can break it down into smaller chunk, and use [combineReducers](https://redux.js.org/api/combinereducers) at the top level.

# CircleCI
This starter pack also comes with CircleCI config that's ready to be used. The CI will run ESLint and flow, then run the jest tests.

After running the tests on JS side, the workflow will continue to build an Android APK and store in the artifacts, this is part of the effort to enable CD.

# Ending
There's a whole lot of features for a minimal starter pack, which works great for us. We try to maintain the repo monthly to keep it fresh and its dependencies updated.

Hopefully you will find this helpful for your future projects.
