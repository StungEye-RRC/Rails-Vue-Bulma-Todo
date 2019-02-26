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
import RailsAPI from 'rails_api.js';

export default {
  data: function () {
    return {
      new_item: '',
      todos: []
    }
  },

  /*
    Had to enable @babel/polyfill to get async/await working:
    https://github.com/rails/webpacker/issues/518#issuecomment-437778297
  */
  methods: {
    add_item: async function() {
      // Early return if the new item is empty.
      if (this.new_item === '') return;

      const todo = await RailsAPI.createToDo(this.new_item);
      this.todos.push(todo);
      this.new_item = '';
    },
    clear_completed: async function() {
      let todones = this.todos.filter(todo => todo.done);

      for(const todone of todones) {
        const response = await RailsAPI.deleteToDo(todone.id);

        if (response.status === 204) {
          this.todos = this.todos.filter(todo => todo.id !== todone.id);
        }
      }
    },
    update_item: async function(id) {
      const todo = this.todos[id];
      const response = RailsAPI.updateToDo(todo);
    }
  },

  mounted: async function() {
    this.todos = await RailsAPI.getToDos();
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
