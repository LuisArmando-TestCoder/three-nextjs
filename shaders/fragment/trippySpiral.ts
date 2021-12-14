export default `
// https://www.shadertoy.com/view/4l3yD7

uniform float iTime;
uniform vec2 iMouse;
uniform vec3 iResolution;
varying vec3 fragCoord;

#define DISTORTION 1.0

#define PI   3.14159265359
#define TAU  6.28318530718
#define PI_2 1.57079632679

const int KEY_SPACE = 32;
const int KEY_1 = 49;
const int KEY_2 = 50;
const int KEY_3 = 51;

vec3 linColor(float value)
{
    value = mod(value * 6.0, 6.0);
    vec3 color;
    
    color.r = 1.0 - clamp(value - 1.0, 0.0, 1.0) + clamp(value - 4.0, 0.0, 1.0);
    color.g = clamp(value, 0.0, 1.0) - clamp(value - 3.0, 0.0, 1.0);
    color.b = clamp(value - 2.0, 0.0, 1.0) - clamp(value - 5.0, 0.0, 1.0);
    
    return color;
}

vec3 sinColor(float value)
{
    value *= TAU;
    vec3 color;
    
    color.r = (1.0 + cos(value)) / 2.0;
    color.g = (1.0 + cos(value - TAU / 3.0)) / 2.0;
    color.b = (1.0 + cos(value + TAU / 3.0)) / 2.0;
    
    return color;
}

void main()
{
    vec2 halfRes = iResolution.xy / 2.0;
    vec2 pos = (fragCoord.xy - halfRes) / halfRes.y;
    
    float mouseX = iMouse.x / iResolution.x;
    float mouseY = (iMouse.y - halfRes.y) / halfRes.y;
    float clicked = iMouse.x > 0.0 || iMouse.y > 0.0 ? 1.0 : 0.0;
    // Increase accuracy per pixel with small values.
    mouseX *= abs(mouseX * mouseX * mouseX * mouseX);
    mouseY *= abs(mouseY * mouseY * mouseY * mouseY);
    
    // Reduce rounding issues (banding) caused by big iTime values.
    float fractTime = fract(iTime);
    float tauTime = mod(iTime, TAU);
    
    float len = length(pos);
    float angle = atan(pos.y, pos.x);
    
    float sinAngle = (sin(angle + tauTime) + 1.0) / 2.0;
    float distortion = 1.0 * 0.1;
    
    float powLen, sine, arms;
    if (clicked > 0.0)
    {
        powLen = pow(len, mouseY * 256.0);
        distortion = pow(distortion, mouseY * 256.0);
        arms = (round(mouseX * 65536.0) / 2.0);
    }
    else
    {
        //float e = -0.1;
        //powLen = pow(len, e);
        //distortion = pow(distortion, e);
        
        distortion = 1.0 / sqrt(distortion);
        powLen = 1.0 / sqrt(len);
        arms = 4.0;
    }
    
    sine = sin(powLen * 16.0 * distortion + angle * arms - tauTime * 8.0);
    sine = abs(sine);
    sine = sqrt(sine);
    
    gl_FragColor = vec4(linColor(powLen * distortion * distortion - fractTime), 1.0) * sine;
}
`;