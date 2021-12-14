export default `
// https://www.shadertoy.com/view/Wttyzf

uniform float iTime;
uniform vec3 iResolution;
varying vec3 fragCoord;

void main() {
    vec3 haloColors;
    float intensity = .5;
	float distance;
    float brightnessDiffuse = .5;
    float waveNear = .5;
    float fov = 15.;
    float wavingSpeed = .5;
    float timeStepOffset = .5;
    float zoomOut = 5.;
    vec3 color = sqrt(pow(fragCoord, vec3(2.))) * intensity;
	for(int index = 0; index < 3; index++) {
        float time = iTime + timeStepOffset * float(index);
		vec2 coordinates2D, aspectRatio = color.xy / (iResolution.xy / zoomOut);
        // assign aspect ratio to, uv
		coordinates2D = aspectRatio;
        // centering aspect ratio
		aspectRatio -= .5;
        // scaling aspect ratio axis to fit square coordinates
		aspectRatio.x *= iResolution.x / iResolution.y;
        // offsets time for each axis
		time += timeStepOffset;
        
        // gets distance from vec2(0,0)
        distance = length(aspectRatio);
        
		coordinates2D += aspectRatio / distance * (sin(time) + waveNear) * abs(sin(distance * fov - time));
		haloColors[index] = length(abs(mod(coordinates2D, 1.) - .5));
	}
    // dividing for distance to get light
	gl_FragColor = vec4(
        haloColors /
        distance /
        brightnessDiffuse *
        intensity,
        1.
    );
}
`;
