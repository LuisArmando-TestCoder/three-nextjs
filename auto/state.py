import os
from modules.main import executeConditionalPath, createFile

stateName = input("State name: ")
folderPath = f"../state/{stateName}"

executeConditionalPath(
    folderPath,
    lambda path: os.makedirs(path)
)

executeConditionalPath(
    f"{folderPath}/index.ts",
    lambda path: createFile(
        path,
        "import { atom } from 'recoil'\n\n" +

        "export default atom({\n" +
            "\tkey: '" + stateName + "',\n" +
            "\tdefault: null\n" +
        "})"
    )
)

import modules.export