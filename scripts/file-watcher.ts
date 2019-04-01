import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

const __dist = path.join(__dirname, '../', 'dist');
const browserPath = path.join(__dist, 'browser');
const serverPath = path.join(__dist, 'server');
const completed = [];


const getFilename = (pathname: string): string => {
  const paths = pathname.split(path.sep);
  return paths[paths.length - 1];
};

const addToCompleted = (filename: string) => {
  console.log(`${filename} has been added`);
  completed.push(filename);
};

const handleOnAdd = (pathname: string) => {
  const files = { 'index.html': 1, 'main.js': 1 };
  const filename = getFilename(pathname);
  if (files[filename]) {
    addToCompleted(filename);
  }
  if (completed.length === 2) {
    console.log('exiting file-watcher');
    process.exit();
  }
};

if (!fs.existsSync(__dist)) {
  fs.mkdirSync(__dist);
}

console.log(`file-watcher running, waiting for ${browserPath}`);
console.log(`file-watcher running, waiting for ${serverPath}`);
chokidar.watch(browserPath).on('add', handleOnAdd);
chokidar.watch(serverPath).on('add', handleOnAdd);







