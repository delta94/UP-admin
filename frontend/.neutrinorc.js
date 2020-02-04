const os = require("os")
const path = require("path")
const react = require("@neutrinojs/react")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin")

// bez .local by nefungovalo na iOS
const hostName = os.hostname().toLowerCase() + ".local"
const port = 3000
const url = `http://${hostName}:${port}/`
const urlProduction = "/static/"
const htmlFile = "react-autogenerate.html"
const htmlSource = "src/index.html"
const htmlTarget = path.resolve(__dirname + "/../", "admin", "templates")

module.exports = {
    options: {
        root: __dirname
    },
    use: [
        react({
            babel: {
                presets: ["@babel/preset-flow"]
            }
        }),
        neutrino => {
            const isProduction = process.env.NODE_ENV === "production"

            neutrino.config.resolve.alias.set("react-dom", "@hot-loader/react-dom")
            neutrino.config.devServer
                .host("0.0.0.0")
                .port(port)
                .headers({ "Access-Control-Allow-Origin": "*" })
            // pro povoleni pristupu odkudkoliv (a z Djanga)
            neutrino.config.devServer.allowedHosts.add("0.0.0.0").add(hostName)
            neutrino.config
                .entry("index")
                .add("react-hot-loader/patch")
                .add("./src/index")

            neutrino.config.plugin("html-index").use(HtmlWebpackPlugin, [
                {
                    // diky teto moznosti muze pak pracovat HtmlWebpackHarddiskPlugin
                    alwaysWriteToDisk: true,
                    template: htmlSource,
                    filename: htmlFile,
                    minify: isProduction
                        ? {
                              collapseWhitespace: true,
                              removeComments: true,
                              removeRedundantAttributes: true,
                              removeScriptTypeAttributes: true,
                              removeStyleLinkTypeAttributes: true,
                              useShortDoctype: true,
                              // ignoruj Django sablonovaci jazyk
                              ignoreCustomFragments: [/{%[\s\S]*?%}/]
                          }
                        : false
                }
            ])
            // automaticke generovani html souboru do templates slozky s injected odkazy na zdrojove soubory
            neutrino.config.plugin("html-webpack-harddisk-plugin").use(HtmlWebpackHarddiskPlugin, [
                {
                    outputPath: htmlTarget
                }
            ])
            neutrino.config.output.publicPath(isProduction ? urlProduction : url)
        }
    ]
}
