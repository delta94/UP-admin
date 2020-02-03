const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin")
const path = require("path")
const isProduction = process.env.NODE_ENV === "production"
const chalk = require("chalk")
const os = require("os")

// bez .local by nefungovalo na iOS
const hostName = os.hostname().toLowerCase() + ".local"

const url = "http://" + hostName + ":3000/"

module.exports = function({ command }) {
    let config = {
        type: "react-app"
    }
    // react-hot-loader
    // * Only include react-hot-loader config when serving a development build
    if (command.startsWith("serve")) {
        config.babel = { plugins: "react-hot-loader/babel" }
        config.webpack = {
            config(webpackConfig) {
                // React Hot Loader's patch module needs to run before your app
                webpackConfig.entry.unshift("react-hot-loader/patch")
                return webpackConfig
            }
        }

        console.log(chalk.magenta.bold("Frontend je přístupný v celé síti na adrese: " + url))
    }
    config.webpack = {
        // react-hot-loader
        aliases: {
            "react-dom": "@hot-loader/react-dom"
        },
        // automaticke generovani html souboru do templates slozky s prislusnymi odkazy na zdrojove soubory
        html: {
            //this setting is required for HtmlWebpackHarddiskPlugin to work
            alwaysWriteToDisk: true,
            filename: "react-autogenerate.html"
        },
        publicPath: process.env.NODE_ENV === "production" ? "/static/" : url,
        extra: {
            plugins: [
                // this will copy an `index.html` for django to use
                new HtmlWebpackHarddiskPlugin({
                    outputPath: path.resolve(__dirname + "/../", "admin", "templates")
                })
            ]
        },
        config: function(webpackConfig) {
            if (!process.env.NODE_ENV === "production") {
                webpackConfig.entry = [
                    "webpack-dev-server/client?http://0.0.0.0:3000",
                    "webpack/hot/only-dev-server",
                    "./src/index.js"
                ]
            }
            return webpackConfig
        },
        rules: {
            postcss: {
                plugins: [
                    // dependence z nwb
                    require("autoprefixer"),
                    require("cssnano")
                ]
            }
        }
    }
    config.devServer = {
        // allow django host, in case you use custom domain for django app
        allowedHosts: ["0.0.0.0", hostName]
    }
    config.babel = {
        presets: ["flow"]
    }
    return config
}
