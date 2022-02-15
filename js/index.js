// Gets all elements
const elTodoForm = findElement('.todo__form');
const elTodoAddInput = findElement('.todo__add-input');
const elTodoList = findElement('.todos');
const elTodoTemplate = findElement('#todo-template').content;
const elBtns = findElement('.btns');
const elAllBtnInfo = findElement('.btn-all-text');
const elComplatedBtnInfo = findElement('.btn-completed-text');
const elUnComplatedBtnInfo = findElement('.btn-uncompleted-text');

// Global todos array
let todos = JSON.parse(window.localStorage.getItem('todos')) || [];

const renderInfo = (array)=>{
    elAllBtnInfo.textContent = array.length;
    
    const completedTodos = array.filter(todo => todo.isCompleted);
    
    elComplatedBtnInfo.textContent = completedTodos.length;
    elUnComplatedBtnInfo.textContent = array.length - completedTodos.length;
}

// Renders todos

const renderTodos = (array, node)=>{
    node.innerHTML = null;
    
    renderInfo(array);
    
    const todosFragment = document.createDocumentFragment();
    
    // Creates fragment
    
    array.forEach((todo) => {
        
        // Clone template for every todo
        
        const todoTemplate = elTodoTemplate.cloneNode(true);
        
        // Gets elements from template 
        
        const elTodoTitle = findElement('.todo__title', todoTemplate);
        const elTodoInput = findElement('.todo__check-input', todoTemplate);
        const elTodoBtn = findElement('.todo__delete-btn', todoTemplate );
        
        // Assigins todo's values
        
        elTodoTitle.textContent = todo.title;
        elTodoInput.dataset.todoId = todo.id;
        elTodoBtn.dataset.todoId = todo.id;
        
        // Checks completed and uncompleted todos
        
        if(todo.isCompleted){
            elTodoInput.checked = true;
            elTodoTitle.style.textDecoration = 'line-through';
            
        }else{
            elTodoInput.checked = false;
        }
        
        // Appends to fragment
        
        todosFragment.appendChild(todoTemplate);
    });
    
    // Appends to element from DOM
    
    node.append(todosFragment);
};

renderTodos(todos, elTodoList);

// Submits  todos form

elTodoForm.addEventListener('submit',(evt) => {
    evt.preventDefault();
    
    const newTodoTitle = elTodoAddInput.value.trim();
    
    // Early return
    
    if(!newTodoTitle){
        return;
    }
    
    // New todo
    const newTodo = {
        id: todos[todos.length -1]?.id + 1 || 0,
        
        title: newTodoTitle,
        
        isCompleted: false,
    };
    
    todos.push(newTodo);
    
    // Clears input after new todo 
    
    elTodoAddInput.value = null;
    
    renderTodos(todos, elTodoList);
    
    window.localStorage.setItem('todos', JSON.stringify(todos))
    
});

const handleDeletTodo = (id, array) =>{
    const foundTodoIndex = array.findIndex((item) => item.id === id);
    
    array.splice(foundTodoIndex, 1)
    
    renderTodos(array, elTodoList);
    
    window.localStorage.setItem('todos', JSON.stringify(array));
};

const handleCheckTodo = (id, array) =>{
    const foundTodo = array.find((item)=> item.id === id);
    
    foundTodo.isCompleted = !foundTodo.isCompleted;
    
    renderTodos(array, elTodoList);
    
    window.localStorage.setItem('todos', JSON.stringify(array));
};

// Listens list of todos

elTodoList.addEventListener('click', (evt)=>{
    // Delete button clicked 
    
    if (evt.target.matches('.todo__delete-btn')) {
        const clickedTodoId = Number(evt.target.dataset.todoId);
        
        handleDeletTodo(clickedTodoId, todos);
    }
    
    // Check input clicked
    
    if (evt.target.matches('.todo__check-input')) {
        const changedTodoId = Number(evt.target.dataset.todoId);
        
        handleCheckTodo(changedTodoId,  todos);
    }
});

elBtns.addEventListener('click', (evt) =>{
    if(evt.target.matches('.btn-all')){
        renderTodos(todos,  elTodoList);
    }
    if(evt.target.matches('.btn-completed')){
        const completedTodos = todos.filter((todo)=> todo.isCompleted)
        renderTodos(completedTodos,  elTodoList);
    }
    if(evt.target.matches('.btn-uncompleted')){
        const uncompletedTodos = todos.filter((todo)=> !todo.isCompleted)
        renderTodos(uncompletedTodos,  elTodoList);
    }
    if(evt.target.matches('.btn-clear')){
        window.localStorage.removeItem('todos');

        todos = [];
        
        renderTodos(todos, elTodoList);
    }

});


