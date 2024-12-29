const { ipcRenderer } = require('electron');

// Event listener for the close button
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.getElementById('close_button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            ipcRenderer.send('close-window');
        });
    }

// Receives the tasks from the main process and creates the tasks in the frontend
ipcRenderer.on('load-tasks', (event, data) => {
    const tasksWrapper = document.getElementById('tasks-wrapper');
    const tasks = data.split('\n').filter(task => task.trim() !== '');
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('tasks');

        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');

        const unhoverImg = document.createElement('img');
        unhoverImg.src = './resources/unhover.png';

        const hoverImg = document.createElement('img');
        hoverImg.src = './resources/hover.png';
        hoverImg.classList.add('hover-img');

        imageWrapper.appendChild(unhoverImg);
        imageWrapper.appendChild(hoverImg);

        const taskText = document.createElement('div');
        taskText.classList.add('task-text');
        taskText.id = `text_${index + 1}`;

        const taskParagraph = document.createElement('p');
        taskParagraph.textContent = task;

        taskText.appendChild(taskParagraph);
        taskElement.appendChild(imageWrapper);
        taskElement.appendChild(taskText);
        tasksWrapper.appendChild(taskElement);

        // Event listener to toggle the task when clicking on it
        const toggleTask = () => {
            imageWrapper.classList.toggle('permanent-hover');
            taskParagraph.classList.toggle('strikethrough');
        };

        imageWrapper.addEventListener('click', toggleTask);
        taskParagraph.addEventListener('click', toggleTask);
    });
});
});