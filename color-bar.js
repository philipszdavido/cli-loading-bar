const process = require("process")
const rdl = require("readline")
const l = console.log
const std = process.stdout

const colors = {
    "yellow": [33, 89],
    "blue": [34, 89],
    "green": [32, 89],
    "red": [35,89],
    "cyan": [31,89],
    "magenta": [36,89]
}

function shuffle(arr) {
    let what;

    if (shuffle.lastIndex != undefined) {
        if (shuffle.lastIndex >= arr.length - 1) {
            shuffle.lastIndex = 0
            what = 0
        } else {
            what = shuffle.lastIndex + 1
            shuffle.lastIndex = shuffle.lastIndex + 1
        }
    } else {
        shuffle.lastIndex = 0
        return arr[0]
    }
    return arr[what]
}


class LoadingBar {
    constructor(size, type = "bar") {
        this.type = type
        this.size = size
        this.sizeToRender = 0
        this.percent = 0
        this.sizeNow = 0
        this.cursor = 0
        this.random=false
        this.timer = null
        this.str = "\u2588"
        this._color = {
            start: "\x1b[93m",
            stop: "\x1b[39m\x1b[0m"
        }
        this.resetColor = "\x1b[0m"
    }

    render() {
        if(this.random)
            this.randomise()        
        this.cursor = 1
        rdl.cursorTo(std, this.cursor, 0);
        for (let i = 0; i < this.sizeToRender; i++) {
            std.write(this._color.start + this.str + this._color.stop)

            rdl.cursorTo(std, 52, 0);
            this.calcPercent()
            std.write(this.percent + "%")

            this.cursor += 1
            rdl.cursorTo(std, this.cursor, 0);

        }
    }

    setColor(color) {
        let {0: start,1:stop} = color
        start = "\x1b[" + start+"m"
        stop = "\x1b[" + stop+ "m\x1b[0m"
        this._color.start = start
        this._color.stop = stop
    }

    randomise() {
        if(!this.random)
            this.random=true
        const colorKeys = Object.keys(colors)
        const colorToSelect = shuffle(colorKeys)
        const color = colors[colorToSelect]
        this.setColor(color)
        return this
    }

    color(colorName) {
        const color = colors[colorName]
        this.setColor(color)
        return this        
    }

    start() {
        std.write("\x1B[?25l")
        std.write("[")
        for (let i = 0; i < 50; i++) {
            std.write("\u2591")
        }
        std.write("]")
        this.cursor += 1
        std.write(this.calcPercent() + "%")
        rdl.cursorTo(std, this.cursor, 0);
    }

    calcPercent() {
        this.sizeToRender = this.sizeNow / this.size * 50
        this.percent = this.sizeToRender / 50 * 100
        return this.sizeToRender
    }

    incr(val) {
        if (typeof val === 'undefined') {
            this.sizeNow += 1
        } else
            this.sizeNow = val
        this.calcPercent()
        this.render()
    }

    stop() {
        clearInterval(this.timer)
    }
}

const cl = new LoadingBar(10)
cl.randomise().start()
// cl.color('green').start()

let count = 0

let timer = setInterval(() => {
    if (count == 10) {
        clearInterval(timer)
    } else {
        cl.incr()
        count++
    }
}, 500)

module.exports = LoadingBar

/*        this.timer = setInterval(() => {
            this.render()

        }, 100)*/
/*std.write(this.color.start + this.str + this.color.stop)
this.cursor++;
if (this.cursor >= this.size) {
    clearTimeout(this.timer)
}*/