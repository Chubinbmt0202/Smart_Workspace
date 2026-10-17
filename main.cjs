const path = require('node:path');
const { createHash, randomBytes } = require('node:crypto');
const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');

const APP_PROTOCOL = 'smartworkspace';
const WEB_LOGIN_URL = 'https://smart-workspace-pi.vercel.app/';
const API_BASE_URL = 'https://backendnote-r7ys.onrender.com/api';
const AUTH_TIMEOUT_MS = 4 * 60 * 1000;

let mainWindow;
let pendingLogin = null;

const isCode = (value) => typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value);

function clearPendingLogin() {
    if (!pendingLogin) return null;
    clearTimeout(pendingLogin.timeout);
    const current = pendingLogin;
    pendingLogin = null;
    return current;
}

async function redeemDesktopTicket(code, state, verifier) {
    const response = await fetch(`${API_BASE_URL}/users/desktop-auth/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state, verifier }),
    });

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('Máy chủ đăng nhập trả về phản hồi không hợp lệ.');
    }

    if (!response.ok || result.status !== 'success' || !result.data) {
        throw new Error(result.message || 'Không thể xác nhận đăng nhập từ trình duyệt.');
    }

    return result.data;
}

function handleAuthUrl(rawUrl) {
    if (!pendingLogin) return;

    let callbackUrl;
    try {
        callbackUrl = new URL(rawUrl);
    } catch {
        return;
    }

    if (
        callbackUrl.protocol !== `${APP_PROTOCOL}:` ||
        callbackUrl.hostname !== 'auth' ||
        !isCode(callbackUrl.searchParams.get('code')) ||
        callbackUrl.searchParams.get('state') !== pendingLogin.state
    ) {
        return;
    }

    const current = clearPendingLogin();
    redeemDesktopTicket(
        callbackUrl.searchParams.get('code'),
        current.state,
        current.verifier,
    ).then(current.resolve, current.reject);
}

const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
    app.quit();
} else {
    app.on('second-instance', (_event, commandLine) => {
        const authUrl = commandLine.find((argument) => argument.startsWith(`${APP_PROTOCOL}://`));
        if (authUrl) handleAuthUrl(authUrl);
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1370,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    Menu.setApplicationMenu(null);

    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:5173';
        mainWindow.loadURL(startUrl);
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

ipcMain.handle('desktop-auth:start', async () => {
    if (pendingLogin) {
        throw new Error('Đang có một yêu cầu đăng nhập đang chờ. Hãy hoàn tất hoặc thử lại sau.');
    }

    const state = randomBytes(32).toString('base64url');
    const verifier = randomBytes(32).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    const loginUrl = new URL(WEB_LOGIN_URL);
    loginUrl.searchParams.set('desktop', '1');
    loginUrl.searchParams.set('state', state);
    loginUrl.searchParams.set('code_challenge', challenge);

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            const current = clearPendingLogin();
            if (current) current.reject(new Error('Đăng nhập đã hết thời gian chờ. Vui lòng thử lại.'));
        }, AUTH_TIMEOUT_MS);

        pendingLogin = { state, verifier, resolve, reject, timeout };
        shell.openExternal(loginUrl.toString()).catch((error) => {
            const current = clearPendingLogin();
            if (current) current.reject(error);
        });
    });
});

app.on('window-all-closed', () => {
    const current = clearPendingLogin();
    if (current) current.reject(new Error('Ứng dụng đã đóng trước khi hoàn tất đăng nhập.'));
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('open-url', (event, url) => {
    event.preventDefault();
    handleAuthUrl(url);
});

app.whenReady().then(() => {
    app.setAsDefaultProtocolClient(APP_PROTOCOL);
});