uniform vec2 resolution;
uniform float zoom;
uniform vec2 zoomCenter;

float interp(float x, float a, float b, float c, float d) {
    return ((a + x) * d + (b - x) * c) / (a + b);
}

vec3 colormap(float t) {
    vec3 colors[5];
    colors[0] = vec3(0.07059, 0, 0.58039);
    colors[1] = vec3(0.00784, 0.51765, 0.76078);
    colors[2] = vec3(0.97647, 0.98431, 0.98824);
    colors[3] = vec3(0.23922, 0, 0.50588);
    colors[4] = vec3(0.41569, 0.20784, 0.61569);

    float histogram[5];
    histogram[0] = 0.0;
    histogram[1] = 0.2;
    histogram[2] = 0.4;
    histogram[3] = 0.6;
    histogram[4] = 1.0;

    for (int i = 0; i < 4; i++) {
        if (t >= histogram[i] && t <= histogram[i+1]) {
            float factor = (t - histogram[i]) / (histogram[i+1] - histogram[i]);
            return mix(colors[i], colors[i+1], factor);
        }
    }
    return colors[0];
}

void main() {
    //vec2 uv = (gl_FragCoord.xy / resolution) / zoom + zoomCenter;

    vec2 uv = (gl_FragCoord.xy / zoom - resolution)/ resolution.y +zoomCenter;
    vec3 col = vec3(0);

    float zx = uv.x;
    float zy = -uv.y;

    int iter = 0;
    int max_iter = 100;

    while (zx * zx + zy * zy < 4.0 && iter < max_iter) {
        float xtemp = zx * zx - zy * zy + uv.x;
        zy = 2.0 * abs(zx * zy) - uv.y;
        zx = xtemp;
        iter += 1;
    }

    if (iter != max_iter) {
        float t = log(float(iter)) / log(float(max_iter));
        col = colormap(t);
    }

    gl_FragColor = vec4(col, 1.0);
}
