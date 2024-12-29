const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Creates the main window
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 450,
        height: 250,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('public/index.html');

    // Reads the ToDo.txt file and send the data to the frontend
    fs.readFile(path.join(__dirname, 'ToDo.txt'), 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading ToDo.txt:', err);
            return;
        }
        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.webContents.send('load-tasks', data);
        });
    });
});

ipcMain.on('close-window', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
        window.close();
    }
});