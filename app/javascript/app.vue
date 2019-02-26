<template>
  <div id="app">
    <ol>
      <li v-for="(todo, index) in todos" :key="index">
        <label>
          <input type="checkbox" @change="update_item(index)" v-model="todo.done">
          <del v-if="todo.done">
            {{ todo.description }}
          </del>
          <span v-else>
            {{ todo.description }}
          </span>
        </label>
      </li>
    </ol>
    <input v-model.trim="new_item" @keyup.enter="add_item" placeholder="New Item">
    <button @click="add_item">Add</button>
    <button @click="clear_completed">Clear Completed</button>
  </div>
</template>

<script>
import SerializedStorage from 'serialized_storage.js';

export default {
  data: function () {
    return {
      new_item: '',
      todos: []
    }
  },

  methods: {
    add_item: function() {
      // The new item can be found in this.new_item
      // Early return if the new item is empty.
      if (this.new_item === '') return

      fetch('http://localhost:3000/to_dos.json', {
        method: 'POST',
        body: JSON.stringify({ description: this.new_item, done: false }),
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      }).then(response => response.json())
        .then((todo) => {
          // Push this new item to the this.todos array.
          this.todos.push(todo)

          // Clear out the new item input by clearing this.new_item
          this.new_item = ''
        });

    },
    /*
      Had to enable @babel/polyfill to get async/await working:
      https://github.com/rails/webpacker/issues/518#issuecomment-437778297
    */
    clear_completed: async function() {
      let todones = this.todos.filter(todo => todo.done);

      for(const todone of todones) {
        const response = await fetch(`http://localhost:3000/to_dos/${todone.id}.json`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json; charset=utf-8',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          }
        })
        if (response.status === 204) {
          this.todos = this.todos.filter(todo => todo.id !== todone.id);
        }
      }

    },
    update_item: function(id) {
      const todo = this.todos[id];

      fetch(`http://localhost:3000/to_dos/${todo.id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ done: todo.done }),
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      }).then(response => response.json())
        .then((todo) => {
          // Nothing?
        });
    }
  },

  mounted: function() {
    fetch('http://localhost:3000/to_dos.json')
      .then(result => result.json())
      .then(todos => {
        this.todos = todos;
      });
  }
}
</script>

<style scoped>
body {
  background: #20262e;
  padding: 20px;
  font-family: Helvetica, sans-serif;
}

#app {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
}

ol {
  margin-bottom: 2em;
}

li {
  margin: 8px 0;
}

h2 {
  font-weight: bold;
  margin-bottom: 15px;
}

del {
  color: rgba(0, 0, 0, 0.3);
}
</style>
