class Segment2 {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    equals(seg) {
        return this.includes(seg.p1) && this.includes(seg.p2);
    }

    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    extendToDistance(distance) {
        const direction = {
            x: this.p2.x - this.p1.x,
            y: this.p2.y - this.p1.y
        };

        const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        direction.x /= length;
        direction.y /= length;

        const extendedP2 = {
            x: this.p1.x + direction.x * distance,
            y: this.p1.y + direction.y * distance
        };

        return new Segment2(this.p1, new Point2(extendedP2.x, extendedP2.y));
    }

    length() {
        return Math.sqrt((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2);
    }

    calculateColor(distance, maxDistance) {
        let hue = (1 - distance / maxDistance) * 60;
        // Hue must be clamped
        hue = Math.min(Math.max(hue, 0), 60);

        const saturation = 100;
        const lightness = 50;
        const color = this.hslToRgb(hue, saturation, lightness);
        return color;
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    draw(ctx, { width = 2, dash = [], range = 0 } = {}) {
        const distance = Math.sqrt((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2);
        const seg = this.extendToDistance(Math.min(range, distance));
        const color = this.calculateColor(distance, range);
        // console.log(this.p2.x)
        // console.log(this.p2)
        // console.log(this.p1.x)
        // console.log(this.p1)
        // console.log(distance)
        // console.log(seg)
        // console.log(color)

        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;;
        ctx.setLineDash(dash);
        ctx.moveTo(seg.p1.x, seg.p1.y);
        ctx.lineTo(seg.p2.x, seg.p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}