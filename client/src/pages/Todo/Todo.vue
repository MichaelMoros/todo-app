<script>
import FullScreenSpinner from './components/FullScreenSpinner.vue'
import Error from './components/TodoError.vue'
import TodoTextInput from './components/TodoTextInput.vue'
import TodoListFilter from './components/TodoListFilter.vue'
import TodoList from './components/TodoList.vue'
import TodoAuth from './components/TodoAuth.vue'
import TodoHeader from './components/TodoHeader.vue'
import { getBoolValue } from '../../helpers/helpers'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
const getRelativeTime = (dateA) => dayjs(dateA).fromNow()

dayjs.extend(relativeTime);

const FILTER_TYPES = ['all', 'active', 'completed']
const API_ROUTE = import.meta.env.VITE_BASE_URL

export default {
    components: {
        FullScreenSpinner,
        Error,
        TodoTextInput,
        TodoListFilter,
        TodoList,
        TodoAuth,
        TodoHeader
    },
    data() {
        return {
            data: null,
            loading: true,
            todoName: '',
            selectedFilter: null,
            error: null,
            accessToken: null,
            currentTime: null,
            interval: null
        }
    },
    mounted() {
        this.fetchData()
        this.interval = setInterval(() => {
            if (this.data && this.data.todos.length > 0) {
                this.data.todos = this.data.todos.map((todo) => {
                    todo.relativeTime = getRelativeTime(todo.created_at)
                    return todo
                })
            }
        }, 30000)
    },
    destroyed() {
        clearInterval(this.interval)
    },
    methods: {
        debounce(func, timeout = 300) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, timeout);
            };
        },
        handleChangeTodoName(e) {
            this.todoName = e.target.value
        },
        updateRequireAuthState(val) {
            const bool = getBoolValue(val)
            this.data.requireauth = bool
        },
        async fetchData() {
            try {
                const response = await fetch(API_ROUTE + '/' + this.$route.params.path)
                const responseData = await response.json()
                const { data, error } = responseData

                if (error) throw error

                this.loading = false

                const formattedTodos = data.todos.map((todo) => {
                    todo.relativeTime = getRelativeTime(todo.created_at)
                    return todo
                })

                this.data = {
                    ...data,
                    todos: formattedTodos
                }

                this.selectedFilter = 'all'
            } catch (e) {
                console.log('e =>', e)
                this.data = null
                this.loading = false
                this.error = e
            }
        },
        setSelectedFilter(type) {
            if (!FILTER_TYPES.includes(type)) return
            this.selectedFilter = type
        },
        async toggleTodoCompletedStatus(todoId) {
            const thisTodo = this.data.todos.find((todo) => todo.id === todoId)

            if (!thisTodo) return
            const path = thisTodo.path_id

            try {
                const endpoint = API_ROUTE + '/' + path + '/todo/' + todoId
                const payload = { completed: !thisTodo.completed, accessToken: this.accessToken, path_id: path }

                await fetch(endpoint, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                thisTodo.completed = !thisTodo.completed

                this.data.todos = this.data.todos.map((todo) => {
                    if (todo.id === todoId) {
                        todo = thisTodo
                    }

                    return todo
                })
            } catch (error) {
                alert(error.message)
            }
        },
        async deleteTodo(todoId) {
            if (confirm('Are you sure?')) {
                const thisTodo = this.data.todos.find((todo) => todo.id === todoId)

                if (!thisTodo) return
                const path = thisTodo.path_id
                const payload = { accessToken: this.accessToken }
                try {
                    const endpoint = API_ROUTE + '/' + path + '/todo/' + todoId
                    await fetch(endpoint,
                        {
                            body: JSON.stringify(payload),
                            method: 'DELETE'
                        })
                    this.data.todos = this.data.todos.filter((todo) => todo.id !== todoId)
                } catch (error) {
                    alert(error.message)
                }
            }
        },
        async addTodo() {
            const todoName = this.todoName.trim()

            if (!todoName) {
                alert('Todo Name is required')
                return
            }

            const duplicateTodo = this.data.todos.find((todo) => todo.text === todoName)

            // todo: add toast?
            if (duplicateTodo) {
                alert('Duplicate todo')
                return
            }

            const currentPath = this.data.path
            const todo = {
                completed: false,
                text: todoName,
                path_id: currentPath,
                accessToken: this.accessToken
            }

            try {
                const endpoint = API_ROUTE + '/' + currentPath + '/todo'
                const response = await fetch(endpoint, {
                    body: JSON.stringify(todo),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const res = await response.json()
                const { data, error } = res

                if (error) throw error
                data.relativeTime = 'a few seconds ago'
                this.data.todos = [data, ...this.data.todos]
                this.todoName = ''
            } catch (err) {
                alert(err.message)
            }
        },
        async verifyPassword(password) {
            try {
                const path = this.$route.params.path
                const endpoint = API_ROUTE + '/' + path + '/token'
                const payload = { password }

                const res = await fetch(endpoint, {
                    body: JSON.stringify(payload),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const response = await res.json()
                const { data, error } = response

                if (error) throw error

                const record = {
                    path: data.path,
                    todos: data.todos.map((todo) => {
                        todo.relativeTime = getRelativeTime(todo.created)
                        return todo
                    }),
                    requireauth: data.requireauth
                }

                this.accessToken = data.accessToken
                this.error = null
                this.data = record
                this.selectedFilter = 'all'
            } catch (error) {
                alert(error.message)
                this.error = error
            }
        }
    },
    computed: {
        filteredData() {
            if (this.data) {
                return this.data.todos.filter((todo) => {
                    if (this.selectedFilter === 'all') return todo
                    else if (this.selectedFilter === 'active') {
                        if (!todo.completed) return todo
                    }
                    else if (this.selectedFilter === 'completed') {
                        if (todo.completed) return todo
                    }
                })
            }
        }
    }
}

</script>
    
<template>
    <div v-if="loading && data === null">
        <FullScreenSpinner />
    </div>
    <div v-else-if="data === null && loading === false && (error.code === 401 || error.code === 403)">
        <TodoAuth @verify-user="verifyPassword" />
    </div>
    <div
        v-else-if="data === null && loading === false && (error.code !== 401 || error.code !== 403 || error.code >= 500)">
        <Error :code="error.code" :messsage="error.message" />
    </div>
    <div v-else class="container mx-auto mt-6">
        <TodoHeader :path="this.data.path" :authConfig="this.data.requireauth" :accessToken="accessToken"
            @update-requireauth-state="updateRequireAuthState" />
        <TodoTextInput :todoName="todoName" @add-todo="addTodo" :handleChangeTodoName="handleChangeTodoName" />
        <TodoListFilter :todos="data.todos" :selectedFilter="selectedFilter" @filter-todos="setSelectedFilter" />
        <TodoList :todos="filteredData" @toggle-todo-status="toggleTodoCompletedStatus" @delete-todo="deleteTodo"
            :currentTime="currentTime" />
    </div>
</template>