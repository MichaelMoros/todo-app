import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Todo from '../components/Todo.vue'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/:path',
        name: 'Todo',
        component: Todo
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router