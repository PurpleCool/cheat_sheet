export type StoreSubscriber<Data> = (data: Data) => void;

export class Store<Data> {
  private _data: Data;
  private subscribers = new Set<StoreSubscriber<Data>>();

  constructor(_initialData: Data) {
    // TODO
    this._data = _initialData;
  }

  subscribe(_callback: StoreSubscriber<Data>) {
    // TODO
    this.subscribers.add(_callback);
  }

  unsubscribe(_callback: StoreSubscriber<Data>) {
    // TODO
    this.subscribers.delete(_callback);
  }

  get data(): Data {
    return this._data;
  } 

  set data(value: Data) {
    this._data = value
    for (const cb of this.subscribers) {
      cb(this._data)
    }
  }

  // TODO: обработка изменения data
}
