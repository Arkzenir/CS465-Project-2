//Frame buffer implementation of polygon index - RGBA transformations
class ColorToID{
    redBits = gl.getParameter(gl.RED_BITS);
    greenBits = gl.getParameter(gl.GREEN_BITS);
    blueBits = gl.getParameter(gl.BLUE_BITS);
    alphaBits = gl.getParameter(gl.ALPHA_BITS);

    redShift = Math.pow(2, this.greenBits + this.blueBits + this.alphaBits);
    greenShift = Math.pow(2, this.blueBits + this.alphaBits);
    blueShift = Math.pow(2, this.alphaBits);

    color = new Float32Array(4);

    //Get integer ID for a given RGBA value
    getID(r, g, b, a) {
        // Shift each component to its bit position in the integer
        return (r * this.redShift + g * this.greenShift + b * this.blueShift + a);
    }

    //Get RGBA value from given id
    createColor(id) {
        let r, g, b, a;

        r = Math.floor(id / this.redShift);
        id = id - (r * this.redShift);

        g = Math.floor(id / this.greenShift);
        id = id - (g * this.greenShift);

        b = Math.floor(id / this.blueShift);
        id = id - (b * this.blueShift);

        a = id;

        this.color[0] = r / (Math.pow(2, this.redBits) - 1);
        this.color[1] = g / (Math.pow(2, this.greenBits) - 1);
        this.color[2] = b / (Math.pow(2, this.blueBits) - 1);
        this.color[3] = a / (Math.pow(2, this.alphaBits) - 1);

        return this.color;
    }
}