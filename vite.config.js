export default {
    // 取消压缩和minify
    build: {
        minify: false,
        terserOptions: {
            compress: false,
            mangle: false,
        },
    },
}