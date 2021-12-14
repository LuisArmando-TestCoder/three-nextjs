import os
import sys
from modules.main import executeConditionalPath, createFile

arguments = list(sys.argv)
componentScope = arguments[1]
componentName = arguments[2]
folderPath = f"../components/{componentScope}/{componentName}"

executeConditionalPath(
    folderPath,
    lambda path: os.makedirs(path)
)

executeConditionalPath(
    f"{folderPath}/index.tsx",
    lambda path: createFile(
        path,
        "import React from 'react'\n" +
        "import styles from './styles.module.scss'\n" +
        "\n" +
        "export default ({\n" +
        "\tclassName = '',\n" +
        "\tchildren\n" +
        "}) => {\n" +
        "\treturn (\n" +
        "\t\t<div className={`" + componentName.lower() + " ${className} ${styles[\"" + componentName.lower() + "\"]}`}>\n" +
        "\t\t\t{children}\n" +
        "\t\t</div>\n" +
        "\t)\n" +
        "}"
    )
)

executeConditionalPath(
    f"{folderPath}/styles.module.scss",
    lambda path: createFile(
        path,
        "." + componentName.lower() + "{\n" +
        "}"
    )
)

import modules.export