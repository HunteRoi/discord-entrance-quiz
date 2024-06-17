/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    entryPoints: ["src/index.ts"],
    out: "docs/api-docs",
    hideGenerator: true,
    excludePrivate: true,
    excludeExternals: true,
    navigationLinks: {
        GitHub: "https://github.com/hunteroi/discord-form"
    }
}
