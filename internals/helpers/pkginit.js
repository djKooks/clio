const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { getDependencies } = require("../deps");
const { writePackageConfig } = require("../../package/packageConfig");

/**
 * @method initPackage
 * @param void
 * @returns {Promise}
 * @description creates new Package.json file and installs it.
 */

async function initPackage() {
  const cwd = process.cwd();
  const dir = path.basename(cwd);

  if (fs.existsSync(path.join(cwd, "package.json"))) {
    const pkg = require(path.join(cwd, "package.json"));
    if (!pkg.clioDependencies) {
      pkg.clioDependencies = ["stdlib"];
    } else if (!pkg.clioDependencies.includes("stdlib")) {
      pkg.clioDependencies.push("stdlib");
    }
    const stringified = JSON.stringify(pkg, null, 2);
    return fs.writeFile(
      path.join(cwd, "package.json"),
      stringified,
      "utf8",
      getDependencies
    );
  }

  const rInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  async function ask(message) {
    return new Promise(function(resolve) {
      rInterface.question(message, resolve);
    });
  }

  let pkg = {};
  pkg.title = (await ask(`Package name: (${dir}) `)) || dir;
  pkg.version = (await ask("Version: (1.0.0) ")) || "1.0.0";
  pkg.description = (await ask("Description: ")) || "";
  pkg.main = (await ask("Entry point: (index.clio) ")) || "index.clio";
  pkg.git = (await ask("Git repository: ")) || "";
  pkg.keywords = (await ask("Keywords: ")) || "";
  pkg.author = {};
  pkg.author.name = (await ask("Author name: ")) || "";
  pkg.author.email = (await ask("Author email: ")) || "";
  pkg.license = (await ask("License: (ISC) ")) || "ISC";
  pkg.dependencies = [{ name: "stdlib", version: "latest" }];
  pkg.scripts = {
    test:
      (await ask("Test command: ")) ||
      'echo "Error: no test specified" && exit 1'
  };

  const stringified = JSON.stringify(pkg, null, 2);
  console.log(`\n${stringified}\n`);
  const ok =
    ((await ask("Is this ok? (yes) ")) || "yes") == "yes" ? true : false;
  process.stdin.destroy();
  if (ok) {
    writePackageConfig(pkg);
    getDependencies();
  } else {
    return initPackage();
  }
}

module.exports = {
  initPackage
};
