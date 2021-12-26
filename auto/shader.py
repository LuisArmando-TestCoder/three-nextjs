from modules.main import executeConditionalPath, createFile

shaderName = input("Shader name: ")

executeConditionalPath(
    f"../shaders/fragment/{shaderName}.ts",
    lambda path: createFile(
        path,
        "export default `\n" +
        "uniform float iTime;\n" +
        "uniform vec3 iResolution;\n" +
        "varying vec3 fragCoord;\n\n" +
        "void main()\n" +
        "{\n" +
        "    // Normalized pixel coordinates (from 0 to 1)\n" +
        "    // - .5 so center of the screen is the center of the screen\n" +
        "    vec2 uv = fragCoord.xy / iResolution.xy - .5;\n" +
        "\n" +
        "    // Sets ratio into 1:1\n" +
        "    uv.x *= iResolution.x / iResolution.y;\n" +
        "\n" +
        "    // Time varying pixel color\n" +
        "    vec3 col = 0.5 + 0.5*cos(iTime + uv.xyx + vec3(0,2,4));\n" +
        "\n" +
        "    // Output to screen\n" +
        "    if (distance(uv, vec2(0.)) < .5) gl_FragColor = vec4(col,1.0);\n" +
        "}\n" +
        "`;\n"
    )
)

executeConditionalPath(
    f"../materials/{shaderName}.ts",
    lambda path: createFile(
        path,
        "import * as THREE from \"three\";\n" +
        f"import fragmentShader from \"../shaders/fragment/{shaderName}\";\n" +
        "import vertexShader from \"../shaders/vertex/default\";\n" +
        "\n" +
        "export default new THREE.ShaderMaterial({\n" +
        "  side: THREE.DoubleSide,\n" +
        "  // transparent: true,\n" +
        "  // blending: THREE.NormalBlending,\n" +
        "  fragmentShader,\n" +
        "  vertexShader,\n" +
        "});\n"
    )
)