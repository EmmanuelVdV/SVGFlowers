class Flower {

    constructor(centerX, centerY, isSingularity) {
        this.center = [centerX, centerY];
        this.points = [];
        this.crtlpoints = [];
        this.isSingularity = isSingularity; // is the singularity ?

        this.bendAngle = (Math.random() * 4 - 2) * 30 * angleDelta; // bending positive or negative

        let angle = 0;

        for (let i = 0; i < nStroke; i++) {
            let n = noise.perlin2(this.center[0] + dNoise * Math.cos(angle),
                this.center[1] + dNoise * Math.sin(angle));
            // console.log(n);

            let r = radiusMinScaled + n * radiusDeltaScaled;
            let x1 = this.center[0] + Math.cos(angle) * r;
            let y1 = this.center[1] + Math.sin(angle) * r;

            for (let flo = 0; flo < flowers.length; flo++) {
                for (let j = 0; j < flowers[flo].points.length - 1; j++) {
                    let result = Math.intersect(this.center[0], this.center[1], x1, y1,
                        flowers[flo].points[j][0], flowers[flo].points[j][1], flowers[flo].points[j + 1][0], flowers[flo].points[j + 1][1]);
                    if (result != null) {
                        x1 = result[0];
                        y1 = result[1];
                    }
                }
            }

            let rfinal = Math.dist(this.center[0], this.center[1], x1, y1);
            let cx1 = this.center[0] - (this.center[0] - x1) / 3; // cubic bezier control point at center
            let cy1 = this.center[1] - (this.center[1] - y1) / 3;
            let cx2 = this.center[0] + Math.cos(angle + this.bendAngle) * 0.9 * rfinal; // cubic bezier control point at x1, y1
            let cy2 = this.center[1] + Math.sin(angle + this.bendAngle) * 0.9 * rfinal;
            this.points.push([x1, y1]);
            this.crtlpoints.push([cx1, cy1, cx2, cy2]);
            // console.log(this.center[0], this.center[1], x1, y1, cx1, cy1, cx2, cy2);

            angle += angleDelta + angleDelta * Math.random();
        }
    }

    draw(d, g) { // draw on renderer d and in groups g

        for (let i = 0; i < this.points.length; i++) {
            // let a = new SVG.PointArray([this.center, this.points[i]]);
            // d.line(a).stroke({ color: '#fff', width: sw });
            let p = 'M' + this.center[0] + ' ' + this.center[1] + ' '; // move to center of flower
            p += 'C' + this.crtlpoints[i][0] + ' ' + this.crtlpoints[i][1] + ' ' +
                this.crtlpoints[i][2] + ' ' + this.crtlpoints[i][3] + ' '; // cubic bezier control points (absolute coordinates)
            p += this.points[i][0] + ' ' + this.points[i][1] // target point

            let pa = d.path(p);

            if (this.isSingularity) {
                pa.stroke({ color: '#8B0000', width: sw }).fill('none');
                g[0].add(pa); // add to singularity group
            } else {
                pa.stroke({ color: '#FFFFFF', width: sw }).fill('none'); // draw path
                g[1].add(pa); // add to other group
            }
        }

        // d.polyline(this.points).stroke({ color: '#fff', width: sw }).fill('none');
    }

}