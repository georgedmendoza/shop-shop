export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
};

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database `shop-shop` with the versino of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to the db, transaction (tx), & obj store
    let db, tx, store;

    // if version has changed (or if this is the first time using the db), run this method and create the 3 obj stores
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // create obj store for each type of data and set 'primary key index to be `_id' of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories',{ keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // handle any errors w connecting
    request.onerror = function(e) {
      console.log('There was an error');
    }

    // on db open success
    request.onsuccess = function(e) {
      // save a ref of the db to the `db` var
      db = request.result;
      // open a trans do whatever we pass into `storeName` (must match one of the obj store names)
      tx = db.transaction(storeName, 'readwrite');
      // save a ref to that obj store
      store = tx.objectStore(storeName);

      // if theres any errors, let us know
      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          // overwrites data on obj store 
          store.put(object);
          resolve(object);
          break;
        case 'get':
          // gets all data and return (from store)
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // when the trans is complete, close the conn
      tx.oncomplete = function() {
        db.close();
      };
    }
  });
}
