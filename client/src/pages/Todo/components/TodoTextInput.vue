<script>
export default {
    props: {
        todoName: String,
        handleChangeTodoName: Function
    },
    methods: {
        addTodo(e) {
            e.preventDefault()
            this.$emit('add-todo')
        }
    }
}
</script>
<template>
    <form class="mt-6">
        <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
            New Todo
        </label>
        <div class="relative">
            <input type="search" id="search" @change="handleChangeTodoName" maxlength="64"
                class="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="New Todo" required v-model="todoName">
            <button type="submit" @click="addTodo"
                class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Add Todo
            </button>
        </div>
    </form>
</template>