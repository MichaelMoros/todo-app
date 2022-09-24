import { createRouter, createWebHistory } from 'vue-router'
import Index from '../pages/Index/Index.vue'
import Todo from '../pages/Todo/Todo.vue'
import NotFound from '../pages/404/404.vue'

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/:path',
        name: 'Todo',
        component: Todo
    },
    {
        path: "/:catchAll(.*)",
        name: '404',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router