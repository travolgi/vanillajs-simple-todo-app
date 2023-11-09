/*
 *  Simple To Do app
 *  Author: Travolgi
 *  Author URI: https://travolgi.it
 *  Version: 1.0.0
 */

function Todolist() {
    let ulTodo, input, btnAll, btnCompleted, btnTodo;
    
    let todos=[];

    const loadTodosFromLocalStorage = () => {
        const localTodos = localStorage.getItem('todos');
        if(localTodos) {
            const todoArr = JSON.parse(localTodos);
            if(todoArr) {
                todos = todoArr;
            }
        } 
    };
    const saveTodosToLocalStorage = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const removeTodo = (id) => {
        todos = todos.filter (todo => todo.id !== id);
        saveTodosToLocalStorage();
        ulTodo.removeChild(ulTodo.querySelector('#todo-'+id));
    };
    const toggleTodo = (id, ele) => {
        todos = todos.map (ele => {
            if(ele.id === id){
                ele.completed = !ele.completed;
            }
            return ele;
        });
        saveTodosToLocalStorage();
        const oldClass = ele.classList.contains('completed') ? 'completed' : 'uncompleted';
        const newClass = oldClass === 'completed' ? 'uncompleted' : 'completed';
        ele.classList.replace(oldClass, newClass);
        ele.parentNode.classList.toggle('completed');
    }

    const createLi = ({text, id, completed}) => {
        const li = document.createElement('li');
        li.id = 'todo-' + id;
        if(completed){
            li.classList.add('completed');
        }

        const spanCheck = document.createElement('span');
        spanCheck.classList.add(completed ? 'completed' : 'uncompleted');
        spanCheck.addEventListener('click', (e) => {
            toggleTodo(id, e.target);
        });

        const spanCross = document.createElement('span');
        spanCross.classList.add('cross');
        spanCross.addEventListener('click', (e) => {
            removeTodo(id);
        });

        const textNode = document.createTextNode(text);

        li.appendChild(spanCheck);
        li.appendChild(textNode);
        li.appendChild(spanCross);

        return li;
    }

    const addNewTodo = (todo) => {
        todos.unshift(todo);
        saveTodosToLocalStorage();
        const li = createLi(todo);
        const firstLi = ulTodo.firstChild;
        if(!firstLi) {
            ulTodo.appendChild(li);
        } else {
            ulTodo.insertBefore(li, firstLi);
        }
    }

    const addTodo = (e) => {
        const key = e.keyCode, ele = e.target;
        if(key === 13 && ele.value.trim().length <=3) {
            alert('You must enter at least 4 characters');
        }
        if(key === 13 && ele.value.trim().length >=4) {
            const todo = {
                text: ele.value.trim(),
                id: todos.length,
                completed: false
            };
            addNewTodo(todo);
            ele.value='';
        }
    }

    const renderTodos = (todoType) => {
        const lis = document.querySelectorAll('li');
        if(lis) {
            lis.forEach (li => ulTodo.removeChild(li));
        }
        const currentTodos = todos.filter(todo => {
            if(todoType === 'all'){
                return todo;
            }
            return (todoType === 'completed') ? todo.completed : !todo.completed;
        });
        currentTodos.map(todo => createLi(todo)).forEach(li => ulTodo.appendChild(li));
    }

    const toggleBtnClasses = (target, btns=[]) => {
        target.classList.toggle('active');
        target.setAttribute('disabled', true);
        btns.forEach(btn => {
            btn.classList.remove('active');
            btn.removeAttribute('disabled');
        });
    }
    const addListeners = () => {
        btnAll = document.querySelector('#btnAll');
        btnCompleted = document.querySelector('#btnCompleted');
        btnTodo = document.querySelector('#btnTodo');

        btnAll.addEventListener('click', e => {
            toggleBtnClasses(e.target, [btnCompleted, btnTodo]);
            renderTodos('all');
        });

        btnCompleted.addEventListener('click', e => {
            toggleBtnClasses(e.target, [btnAll, btnTodo]);
            renderTodos('completed');
        });

        btnTodo.addEventListener('click', e => {            
            toggleBtnClasses(e.target, [btnAll, btnCompleted]);
            renderTodos('uncompleted');
        });
    }

    const renderTodosList = () => {
        loadTodosFromLocalStorage();
        ulTodo = document.querySelector('ul#todoList');
        if(!ulTodo){
            ulTodo = document.createElement('ul');
            ulTodo.id = 'todoList';
            document.body.appendChild(ulTodo);
        }
        renderTodos('all');

        input = document.querySelector('#todo');
        if(!input){
            input = document.createElement('input');
            input.id = 'todo';
            input.name = 'todo';
            input.placeholder = 'Add new Todo';
            ulTodo.parentNode.insertBefore(input, ulTodo);
        }
        input.addEventListener('keyup', addTodo);
        addListeners();
    };

    return {
        getTodos : () => { todos; },
        init : function() {
            renderTodosList();
        }
    }
}

//render
const myTodo = Todolist();
myTodo.init();
//console.log(myTodo.getTodos())

document.querySelector('#date').innerHTML = new Date().getFullYear();