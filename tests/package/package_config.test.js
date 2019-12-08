const tmp = require("tmp");
const path = require("path");
const fs = require("fs");
const toml = require("@iarna/toml");
const packageConfig = require("../../package/package_config");

test("Import config file", () => {
  const config = packageConfig.get_package_config(
    path.join(__dirname, "cliopkg.test.toml")
  );
  expect(config.title).toBeDefined();
});

test("Write config file", () => {
  const config = {
    title: "test",
    dependencies: [{ name: "Foo", version: "1.2.3" }]
  };

  const tmpDir = tmp.dirSync();
  const filePath = path.join(tmpDir.name, packageConfig.configFileName);

  packageConfig.write_package_config(config, filePath);

  const file = fs.readFileSync(filePath);
  const contents = toml.parse(file.toString());
  expect(contents.title).toBe("test");
  expect(contents.dependencies).toEqual({ Foo: "1.2.3" });
});
