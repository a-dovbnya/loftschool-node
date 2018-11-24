const commander = require("commander");
const fs = require("fs");
const path = require("path");
const del = require("del");
const Observable = require("./libs/observer");

commander
  .version("0.0.1")
  .option("-e, --entry <req>", "The path of the source directory")
  .option("-o, --output [opt]", "The path of the output directory")
  .option("-D, --delete", "Delete source directory")
  .parse(process.argv);

process.on("exit", code => {
  switch (code) {
    case 400:
      console.error("parameter --entry is required (see help) \n");
      commander.outputHelp();
      break;
    case 500:
      console.error("Directory read failed");
      break;
    case 404:
      console.error("Directory is clear.");
      break;
    default:
      break;
  }
});

if (!commander.entry) {
  process.exit(400);
}

const entry = commander.entry;
const outputDir = commander.output || "./output";
const removeFolder = commander.delete;

const sourceDir = path.normalize(path.join(__dirname, entry));
const targetDir = path.normalize(path.join(__dirname, outputDir));

const observable = new Observable(() => {
  if (removeFolder) {
    del.sync(`${path.join(sourceDir, path.sep)}**`);
  }
  console.log("done!");
});

const getDirectory = async dir => {
  if (!fs.existsSync(dir)) {
    await fs.mkdirSync(dir);
  }
};

const copyFile = async (currentFile, newFile) => {
  if (!fs.existsSync(newFile)) {
    await fs.linkSync(currentFile, newFile);
  } else {
    console.log("file is exist");
  }
};

const processingFiles = async (src, files) => {
  files.forEach(file => {
    const currentSrc = path.join(src, file);
    const entityStat = fs.statSync(currentSrc);

    if (entityStat.isDirectory()) {
      filesOrder(currentSrc);
    } else {
      const dirPath = path.join(targetDir, file[0].toUpperCase());
      const filePath = path.join(dirPath, file);

      getDirectory(dirPath)
        .then(() => copyFile(currentSrc, filePath));
    }
  });
}

const filesOrder = src => {
  observable.addObserver(src);
  fs.readdir(src, (err, files) => {
    if (err) {
      process.exit(500);
    }

    if (!files.length) {
      process.exit(404);
    }

    processingFiles(src, files)
      .then(() => observable.removeObserver(src));
  });
};

getDirectory(targetDir)
  .then(() => filesOrder(sourceDir));

observable.start("sorting...");
