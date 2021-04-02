/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-nocheck
const execa = require("execa");
const fs = require("fs");

(async () => {
  try {
    console.log('Creating branch...');
    await execa("git", ["checkout", "--orphan", "gh-pages"]);
    console.log("Building...");
    await execa("npm", ["run", "build"]);
    // Understand if it's dist or build folder
    console.log('Getting folder...');
    const folderName = fs.existsSync("dist") ? "dist" : "build";
    console.log('Adding changes...');
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    console.log('Committing changes...');
    await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    console.log('Deleting branch files...');
    await execa("rm", ["-r", folderName]);
    console.log('Checking out master...');
    await execa("git", ["checkout", "-f", "master"]);
    console.log('Removing branch..');
    await execa("git", ["branch", "-D", "gh-pages"]);
    console.log("Successfully deployed");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
