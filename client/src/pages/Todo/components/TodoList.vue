<script>
export default {
    props: {
        todos: Object
    },
    methods: {
        toggleTodoStatus(todo) {
            this.$emit('toggle-todo-status', todo.id)
        },
        deleteTodo(todo) {
            this.$emit('delete-todo', todo.id)
        }
    },
}
</script>
<template>
    <div v-if="todos.length < 1" class="h-96 flex items-center justify-center pt-72">
        <div class="flex justify-content">
            <h3 class="text-3xl font-bold dark:text-white">Empty List</h3>
        </div>
    </div>

    <div v-else>
        <ul
            class="w-100 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-6">
            <li v-for="todo in todos" :key="todo.id"
                class="py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                <button type="button" @click="deleteTodo(todo)"
                    class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 float-right">
                    Delete Todo
                </button>
                <button type="button" @click="toggleTodoStatus(todo)"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xs px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 float-right">
                    {{ todo.completed ? 'Mark as not complete' : 'Mark as complete' }}</button>
                <h1 class="text-3xl break-words" :class="`${todo.completed ? 'line-through' : ''}`">{{ todo.text }}</h1>
                <p class="font-light">{{ todo.relativeTime }}</p>
            </li>
        </ul>
    </div>
</template>