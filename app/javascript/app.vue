<template>
  <div id="app">
    <ol>
      <li v-for="(todo, index) in todos" :key="index">
        <label>
          <input type="checkbox" @change="update_item(index)" v-model="todo.done">
          <del v-if="todo.done">
            {{ todo.text }}
          </del>
          <span v-else>
            {{ todo.text }}
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

      // Push this new item to the this.todos array.
      this.todos.push({ text: this.new_item, done: false })

      // Clear out the new item input by clearing this.new_item
      this.new_item = ''
    },
    clear_completed: function() {
      this.todos = this.todos.filter(todo => !todo.done)
    },
    update_item: function(id) {
      console.log("You just updated item #" + id);
      console.log(this.todos[id].text);
    }
  },

  mounted: function() {
    this.todos = SerializedStorage.fetch();
  },

  watch: {
    todos: {
      handler: SerializedStorage.save,
      deep: true
    }
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
