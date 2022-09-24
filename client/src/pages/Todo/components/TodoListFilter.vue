<script>
export default {
    props: {
        todos: Object,
        selectedFilter: String
    },
    methods: {
        filterTodos(e) {
            this.$emit('filter-todos', e.target.id)
        }
    }
}

</script>
<template>
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        <li class="mr-2">
            <button id="all" @click="filterTodos"
                class="inline-flex p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500 group"
                :class="`${selectedFilter === 'all' ? 'border-b-2 border-blue-600 active' : 'border-b-2 border-transparent'}`">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    class="mr-2 w-5 h-5 pt-0 text-blue-600 dark:text-blue-500" viewBox="0 0 15 15">
                    <path
                        d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.598.598 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.598.598 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.598.598 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535L7.733.063z" />
                    <path
                        d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.598.598 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.659z" />
                </svg>
                All
                <span
                    class="bg-blue-100 text-blue-800 text-xs font-semibold ml-2 mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                    {{ todos.length }}
                </span>
            </button>
        </li>
        <li class="mr-2">
            <button id="active" @click="filterTodos"
                class="inline-flex p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                :class="`${selectedFilter === 'active' ? 'border-b-2 border-blue-600 active' : 'border-b-2 border-transparent'}`">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="mr-2 w-5 h-5"
                    viewBox="0 0 15 15">
                    <path fill-rule="evenodd"
                        d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
                </svg>
                Active
                <span
                    class="bg-blue-100 text-blue-800 text-xs font-semibold ml-2 mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                    {{ todos.filter((k) => !k.completed).length }}
                </span>
            </button>
        </li>
        <li class="mr-2">
            <button id="completed" @click="filterTodos"
                class="inline-flex p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                :class="`${selectedFilter === 'completed' ? 'border-b-2 border-blue-600 active' : 'border-b-2 border-transparent'}`">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="mr-2 w-5 h-5" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path
                        d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                </svg>
                Completed
                <span
                    class="bg-blue-100 text-blue-800 text-xs font-semibold ml-2 mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                    {{ todos.filter((k) => k.completed).length }}
                </span>
            </button>
        </li>
    </ul>
</template>