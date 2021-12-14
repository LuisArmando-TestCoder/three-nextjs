import os

def executeConditionalPath(path, callback):
    if not os.path.exists(path):
        print("Creating: ", path)

        callback(path)

def createFile(path, contents):
    file = open(path, "w")
    file.write(contents)
    file.close()
