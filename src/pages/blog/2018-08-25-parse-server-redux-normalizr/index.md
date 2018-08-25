---
title: 'Normalizing data from Parse with LiveQuery into Redux'
date: '2018-08-25T15:37:21+0800'
categories: ['Code']
tags: ['Redux', 'Parse Server', 'LiveQuery', 'Normalizr']
excerpt: "Redux + Parse LiveQuery + Normalizr = Profits"
---

To put things into context, imagine we have an app that takes data from [Parse Server](https://github.com/parse-community/parse-server) using [Parse JS SDK](https://github.com/parse-community/Parse-SDK-JS). We also enabled [LiveQuery](https://docs.parseplatform.org/parse-server/guide/#live-queries) so that our app feels live.

# Without normalizing data
Storing data from Parse into Redux is as simple as follow

```javascript
import { Query, User } from 'parse';

const convert = user => ({
  id: user.id,
  name: user.get('name'),
  email: user.get('email'),
});

const loadUsers = async (dispatch) => {
  const q = new Query(User);
  const users = await q.find();
  dispatch({ type: 'USERS_LOADED', payload: users.map(convert) });
}

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'USERS_LOADED':
      return { allUsers: [...payload] };
    default:
      return state;
  }
}
```

Your state will then look like this

```javascript
{
  allUsers: [
    { id: 1, name: 'John', email: 'john@doe.com' },
    { id: 2, name: 'Jane', email: 'jane@doe.com' },
  ]
}
```

Your List container can easily get the data from the store using `mapStateToProps` such as below

```javascript
const mapStateToProps = state => ({
  users: state.users.allUsers,
});
```

Everything looks good right? Not until when you handle events from LiveQuery and you want to update a particular user. Your reducer will become something like this.

```javascript
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    // omitted
    case 'USER_UPDATED':
      const allUsers = state.allUsers.slice();
      const user = allUsers.find(u => u.id === payload.id);
      allUsers.splice(user.id, 0, { ...user, ...payload });
      return { allUsers };
  }
}
```

By using `find`, it'll certainly cause performance issues when your number of users becomes large. And of course, if your user data are updated frequently, this will possibly be a bottleneck.

We have the above awkward pattern to avoid mutating the state directly which would cause problem when using `react-redux`, which uses shallow equal. In short, if we mutate the state, your redux-connected container will not see any changes, thus not triggering a render.

This also pose another issue. whenever an user is updated, it will trigger a render for your List container because `allUsers` is changed.

# Let's try normalizing our data
Here, we can either use [Normalizr](https://github.com/paularmstrong/normalizr) or normalize ourself, manually.

```javascript
// Handroll normalization
const users = q.find();
const allIds = [];
const byId = users.reduce((acc, current) => {
  acc[current.id] = { ...current };
  allIds.push(current.id);
}, {});

const state = { allIds, byId };

// With normalizr
import { normalize, schema } from 'normalizr';

const userSchema = new schema.Entity('users');
const { entities, result } = normalize(users, [userSchema]);
const state = { allIds: entities.users, byId: result };

/* Results
state = {
  byId: {
    '1': { id: 1, name: 'John', email: 'john@doe.com' },
    '2': { id: 2, name: 'Jane', email: 'jane@doe.com' },
  },
  allIds: ['1', '2'],
}
*/
```

That's a handful of code, but we will only focus on the result of the normalization, which are `byId` and `allIds`.

`byId` contains all our data in an object keyed by ID, while `allIds` contains all the IDs in the sorted manner of our original result from Parse.

Let's take a look at how we're going to use the normalized state with `mapStateToProps`

```javascript
// In List component
const List = (props) => {
  return props.users.map(id => <Row key={id} id={id} />);
};

// In List container
const mapStateToProps = (state) => ({ users: state.users.allIds });
connect(mapStateToProps)(List);

// In Row container
const mapStateToProps = (state, props) => ({ user: state.users.byId[props.id] });
```

Notice how we don't care about the actual user data in our List component, we're just passing the ID to the Row container, which it will then take the data from Redux store itself.

Advantage? Your List container no longer re-renders whenever an user is updated.

Let's see how we're updating an user with this new structure

```javascript
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    // omitted
    case 'USER_UPDATED':
      return {
        ...state,
        byId: { ...state.byId, [payload.id]: { ...payload } },
      };
  }
}
```

Simple, isn't it? Although we're constructing a new `byId` object, because the object spread operator is only doing a shallow copy, your other Row components will not re-render due to changes in byId.

# Bonus
As we're refining our new project, there are many repeated part of the code, and we refactor them to reducer creator and action creator specifically for loading data from Parse while supporting LiveQuery. With many of the parts from [makeitopen](http://makeitopen.com/docs/en/1-3-data.html#what-about-parse-server). We present to you our version of `loadParseQuery` and `createParseReducer`.

```javascript
// createParseReducer.js
type ById = { [string]: Object };
type AllIds = Array<string>;
type State = {
  byId: ById,
  allIds: AllIds,
};
type Reducer = (state: State, action: any) => State;

const initialState: State = {
  byId: {},
  allIds: [],
};

function createParseReducer(
  key: string,
  sort?: Function,
): Reducer {
  return (state: State = initialState, action: any) => {
    const { type, data } = action;

    switch (type) {
      case 'entities/ADD_ENTITIES':
        if (data.entities[key]) {
          const byId = { ...state.byId, ...data.entities[key] };
          let allIds = [...state.allIds, ...data.result];

          if (sort) {
            allIds = Object.keys(byId).sort((a, b) => sort(byId[a], byId[b]));
          }

          return {
            byId,
            allIds,
          };
        }
        return state;
      case `entities/${key}_CREATE`: {
        const byId = { ...state.byId, [data.id]: data };
        let allIds = [...state.allIds, data.id];

        if (sort) {
          allIds = Object.keys(byId).sort((a, b) => sort(byId[a], byId[b]));
        }

        return {
          byId,
          allIds,
        };
      }
      case `entities/${key}_UPDATE`: {
        const byId = { ...state.byId, [data.id]: data };
        let { allIds } = state;

        if (sort && sort(state.byId[data.id], data) !== 0) {
          allIds = Object.keys(byId).sort((a, b) => sort(byId[a], byId[b]));
        }

        return {
          byId,
          allIds,
        };
      }
      case `entities/${key}_DELETE`: {
        const byId = { ...state.byId };
        delete byId[data.id];
        const allIds = state.allIds.filter(id => id !== data.id);
        return { byId, allIds };
      }
      default:
        return state;
    }
  };
}

export default createParseReducer;

// loadParseQuery.js
import { Query } from 'parse/node';
import { normalize, type Schema } from 'normalizr';

type ParseQueryParams = {
  key: string,
  query: Query,
  schema: Schema,
  convert: Function,
};

function loadParseQuery({
  key,
  query,
  schema,
  convert,
}: ParseQueryParams): Function {
  return () => async (dispatch) => {
    const list = await query.find();
    const normalized = normalize(list.map(convert), [schema]);
    dispatch({ type: 'entities/ADD_ENTITIES', data: normalized });

    const sub = query.subscribe();
    sub.on('create', (data) => dispatch({ type: `entities/${key}_CREATE`, data: convert(data) }));
    sub.on('update', (data) => dispatch({ type: `entities/${key}_UPDATE`, data: convert(data) }));
    sub.on('delete', (data) => dispatch({ type: `entities/${key}_DELETE`, data: convert(data) }));
  };
}

export default loadParseQuery;
```

Example of loading users

```javascript
const loadUsers = loadParseQuery({
  key: 'users',
  query: new Query(User),
  schema: userSchema,
  convert: u => ({ id: u.id, name: u.get('name') }),
});

// Somewhere in your code
dispatch(loadUsers());
```

In your reducer, call `createParseReducer` which returns a reducer (duh?). And since it's a reducer is just a pure function, you're free to embed it in another reducer, or use `combineReducers`. The function also accepts an optional sort function which can be used to sort your IDs when there's new update/creation/deletion.

```javascript
export default createParseReducer('users', (a, b) => a.name.localeCompare(b.name));
```

# Lesson learnt
These are what I have learned after going through days of researching, understanding redux and normalizing data.

1. Spread operator does shallow copy.
1. React Redux calls mapStateToProps every time the state tree changes, which is why we should keep the function short and simple. If you need to derive data from your state, use [Reselect](https://github.com/reduxjs/reselect).
1. React triggers a render of your component if any props/states is changed.
1. React Redux triggers a render as long as mapStateToProps returns different result. Your wrapped component will be re-rendered, which is why you should extract components out as often as possible to reduce renders.
1. Trying to perfect everything in one go is almost impossible and pointless. You should make progress instead of sitting there just thinking for a perfect solution.

That's that. Time to get back to my work.
