const react = require("@neutrinojs/react")
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const os = require("os")

// bez .local by nefungovalo na iOS
const hostName = os.hostname().toLowerCase() + ".local"
const url = "http://" + hostName + ":3000/"

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
            neutrino.config.resolve.alias.set('react-dom', '@hot-loader/react-dom')
            neutrino.config.devServer.host("0.0.0.0").port("3000").headers({ 'Access-Control-Allow-Origin': '*' })
            neutrino.config.devServer.allowedHosts.add("0.0.0.0").add(hostName)
            neutrino.config
                .entry("index")
                .add("react-hot-loader/patch")
                .add("webpack-dev-server/client?http://0.0.0.0:3000")
                .add("webpack/hot/only-dev-server")
                .add("./src/index")
            neutrino.config.plugins.delete("html-index")
            neutrino.config.plugin("html-index").use(HtmlWebpackPlugin, [
                {
                    //this setting is required for HtmlWebpackHarddiskPlugin to work
                    alwaysWriteToDisk: true,
                    template: "src/index.html",
                    filename: "react-autogenerate.html"
                }
            ])
            neutrino.config.plugin("html-webpack-harddisk-plugin").use(HtmlWebpackHarddiskPlugin, [
                {
                    outputPath: path.resolve(__dirname + "/../", "admin", "templates")
                }
            ])
            neutrino.config.output.publicPath(process.env.NODE_ENV === "production" ? "/static/" : url)
            //console.log(neutrino.config)
            //console.log(process.env.NODE_ENV)
        }
    ]
}
