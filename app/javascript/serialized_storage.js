const storage = {
  // The key where our serialized todos will be stashed in local storage.
  KEY: 'our_vue_todos',

  fetch: function() {
    // Retrieve and deserialize the todos from localstorage.
    return JSON.parse(localStorage.getItem(storage.KEY) || '[]');
  },

  save: function(todos) {
    // Convert todos to JSON and save those to localstorage.
    localStorage.setItem(storage.KEY, JSON.stringify(todos));
  }
};

export default storage;
