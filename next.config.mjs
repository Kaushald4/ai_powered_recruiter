/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.worklet\.js$/,
            loader: "worklet-loader",
            options: {
                name: "[name].[hash].worklet.js",
            },
        });
        return config;
    },
};

export default nextConfig;
