uniform vec2 resolution;
uniform float zoom;
uniform vec2 zoomCenter;

#define THRESHOLD 0.000001

#define PI 3.141592653589793238462643383279502884197
#define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
#define cx_div(a, b) vec2(((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y)),((a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y)))
#define cx_modulus(a) length(a)
#define cx_conj(a) vec2(a.x, -a.y)

vec2 cx_sqrt(vec2 a) {
    float r = length(a);
    float rpart = sqrt(0.5*(r+a.x));
    float ipart = sqrt(0.5*(r-a.x));
    if (a.y < 0.0) ipart = -ipart;
    return vec2(rpart,ipart);
}

vec2 cx_log(vec2 a) {
    float rpart = sqrt((a.x*a.x)+(a.y*a.y));
    float ipart = atan(a.y,a.x);
    if (ipart > PI) ipart=ipart-(2.0*PI);
    return vec2(log(rpart),ipart);
}

#define cx_sub(a, b) vec2(a.x - b.x, a.y - b.y)
#define cx_add(a, b) vec2(a.x + b.x, a.y + b.y)
#define cx_abs(a) length(a)
vec2 cx_to_polar(vec2 a) {
    float phi = atan(a.y / a.x);
    float r = length(a);
    return vec2(r, phi); 
}
    
vec2 cx_pow(vec2 a, float n) {
    float angle = atan(a.y, a.x);
    float r = length(a);
    float real = pow(r, n) * cos(n*angle);
    float im = pow(r, n) * sin(n*angle);
    return vec2(real, im);
}



float interp(float x, float a, float b, float c, float d) {
    return ((a + x) * d + (b - x) * c) / (a + b);
}

vec2 Function(vec2 z) {
     return cx_pow(z, 3.0) - vec2(1, 0);
}

vec2 Derivative(vec2 z) {
     return 3.0*cx_mul(z, z);
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
    int max_iter = 100;
    vec2 roots[3];
    roots[0] = vec2(1.0, 0.0);
    roots[1] = vec2(-0.5, sqrt(3.0)/2.0);
    roots[2] = vec2(-0.5, -sqrt(3.0)/2.0);
    vec3 col = vec3(0);
    vec3 colors[3];
    colors[0] = vec3(0.5725, 0.0118, 0.5725);
    colors[1] = vec3(0.5725, 0.5725, 0.0118);
    colors[2] = vec3(0.0118, 0.5373, 0.5373);
    
    vec2 z = (gl_FragCoord.xy / zoom - resolution)/ resolution.y +zoomCenter;
    int iter = 0;

    while (iter < max_iter) {
        iter++;
        vec2 to_sub = cx_div(Function(z), Derivative(z));
        z = cx_sub(z, 1.0*to_sub);
        bool breakOut = false;
        for (int i = 0; i < 3; i++) {
            vec2 difference = cx_sub(z, roots[i]);

            if (cx_abs(difference.x) < THRESHOLD && cx_abs(difference.y) < THRESHOLD) {
               // vec2 diff = cx_sub(z, roots[i]);
               // if (cx_abs(difference) < THRESHOLD) {
                  // col = colors[i];
               // }
               breakOut = true;
            }
        }
        if (breakOut) {
           break;
        }
    }
    if (iter != max_iter) {
        float t = log(float(iter)) / log(float(max_iter));
        col = colormap(t);
    }
    gl_FragColor = vec4(col, 1.0);
}
