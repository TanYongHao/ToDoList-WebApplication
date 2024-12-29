const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const squirrelStartup = require('electron-squirrel-startup');

if (squirrelStartup) {
    app.quit();
}

let mainWindow;
const userDataPath = app.getPath('userData');
const todoFilePath = path.join(userDataPath, 'ToDo.txt');

// Ensure the ToDo.txt file exists in the user data path
if (!fs.existsSync(todoFilePath)) {
    fs.copyFileSync(path.join(__dirname, 'ToDo.txt'), todoFilePath);
}

// Function to create shortcuts
function createShortcuts() {
    const desktopPath = path.join(os.homedir(), 'Desktop');
    const appShortcutPath = path.join(desktopPath, 'ToDoList.lnk');
    const todoShortcutPath = path.join(desktopPath, 'ToDo.txt.lnk');

        exec(`powershell -command "$s=(New-Object -COM WScript.Shell).CreateShortcut('${appShortcutPath}');$s.TargetPath='${process.execPath}';$s.Description='To-Do List Application';$s.Save()"`, (error) => {
            if (error) {
                console.error('Error creating application shortcut:', error);
            }
        });


        exec(`powershell -command "$s=(New-Object -COM WScript.Shell).CreateShortcut('${todoShortcutPath}');$s.TargetPath='${todoFilePath.replace(/\\/g, '\\\\')}';$s.Description='Tasks';$s.Save()"`, (error) => {
            if (error) {
                console.error('Error creating ToDo.txt shortcut:', error);
            }
        });
}

// Handle squirrel events
if (!require('electron-squirrel-startup')) {
    app.on('ready', () => {
        createShortcuts();
    });
}

// Creates the main window
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 450,
        height: 250,
        frame: false,
        transparent: true,
        icon: path.join(__dirname, 'public', 'resources', 'app.ico'),
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('public/index.html');

    // Reads the ToDo.txt file and send the data to the frontend
    fs.readFile(todoFilePath, 'utf-8', (err, data) => {
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