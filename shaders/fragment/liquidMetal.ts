export default `
// https://www.shadertoy.com/view/NltSzB

uniform float iTime;
uniform vec3 iResolution;
varying vec3 fragCoord;
void main()
{
    vec2 p = 10.*(( fragCoord.xy-.5* iResolution.xy )/iResolution.y)-.5 ;
    vec2 i = p;
	float c = 0.0;
	float r = length(p+vec2(sin(iTime),sin(iTime*.222+99.))*1.5);
	float d = length(p);
	float rot = d+iTime+p.x*.15; 
	for (float n = 0.0; n < 4.0; n++) {
		p *= mat2(cos(rot-sin(iTime/4.)), sin(rot), -sin(cos(rot)-iTime), cos(rot))*-0.15;
		float t = r-iTime/(n+1.5);
		i -= p + vec2(cos(t - i.x-r) + sin(t + i.y),sin(t - i.y) + cos(t + i.x)+r);
		c += 1.0/length(vec2((sin(i.x+t)/.15), (cos(i.y+t)/.15)));
	}
	c /= 4.0;
	gl_FragColor = vec4(vec3(c)*vec3(4.3, 3.4, 0.1)-0.35, .1);
}
`;
