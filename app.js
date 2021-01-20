
class PerlinNoise {
    constructor() {
        //
    }

    noise(x, y) {
        const x0 = Math.floor(x);
        const x1 = x0 + 1;
        const y0 = Math.floor(y);
        const y1 = y0 + 1;

        const sx = x - x0;
        const sy = y - y0;

        let n0, n1, ix0, ix1, value;

        n0 = this.#dotGridGradient(x0, y0, x, y);
        n1 = this.#dotGridGradient(x1, y0, x, y);
        ix0 = this.#interpolate(n0, n1, sx);

        n0 = this.#dotGridGradient(x0, y1, x, y);
        n1 = this.#dotGridGradient(x1, y1, x, y);
        ix1 = this.#interpolate(n0, n1, sx);


        value = this.#interpolate(ix0, ix1, sy);
        return value;
    }

    #interpolate(a0, a1, w) {
        return (a1 - a0) * w + a0;
    }

    #randomGradient(ix, iy) {
        const random = 2920.0 * Math.sin(ix * 21942.0 + iy * 171324.0 + 8912.0) * Math.cos(ix * 23157.0 * iy * 217832.0 + 9758.0);
        return { x: Math.cos(random), y: Math.sin(random) };
    }

    #dotGridGradient(ix, iy, x, y) {
        const gradient = this.#randomGradient(ix, iy);

        const dx = x - ix;
        const dy = y - iy;

        return (dx * gradient.x + dy * gradient.y);
    }

}

class App {
    constructor(width, height) {
        this.width = width ?? 512;
        this.height = height ?? 512;
        this.context = this.#createContext();

        this.generator = new PerlinNoise();
    }

    render(offset) {
        this.#clear();

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let value = 0;
                let amp = 1;
                let norm = 0;
                let frequency = 1 / this.width;
                for (let o = 0; o < 4; o++) {
                    amp = Math.pow(0.8, o);
                    norm += amp;
                    frequency *= 2;
                    value += amp * (this.generator.noise(x * frequency + offset, y * frequency) + 1) / 2;
                }
                value = value / norm;
                const color = this.#toColor(value);
                this.#point(x, y, color);
            }
        }
    }

    #createContext() {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        document.body.appendChild(canvas);

        const context = canvas.getContext("2d");

        return context;
    }

    #point(x, y, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, 1, 1);
    }

    #clear() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.width, this.height);
    }

    #toColor(value) {
        const hex = Math.floor(value * 255).toString(16);
        return "#" + hex.repeat(3);
    }
}


const main = () => {
    const app = new App();

    app.render(0);
}


