import Store from 'electron-store';

const store = new Store<StoreSchemaType>();

type StoreSchemaType = { password: 'password' };

export default store;
