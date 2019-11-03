const process = require("process")
const rdl = require("readline")
const l = console.log
const std = process.stdout

class LoadingBar {
    constructor(size, type = "bar") {
        this.type = type
        this.size = size
        this.cursor = 0
        this.timer = null
        this.str = "\u2588"
        this.color = {
            start: "\x1b[93m",
            stop: "\x1b[39m\x1b[0m"
        }
    }

    start() {
        std.write("\x1B[?25l")
        for (let i = 0; i < this.size; i++) {
            process.stdout.write("\u2591")
        }
        std.write(this.size + "%")
        rdl.cursorTo(process.stdout, this.cursor, 0);
        this.timer = setInterval(() => {
            process.stdout.write(this.color.start + this.str + this.color.stop)
            this.cursor++;
            if (this.cursor >= this.size) {
                clearTimeout(this.timer)
            }
        }, 100)
    }

    next() {

    }
}

module.exports = LoadingBar
module.exports = LoadingBar