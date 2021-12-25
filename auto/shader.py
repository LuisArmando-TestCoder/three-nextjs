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