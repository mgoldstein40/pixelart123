import json
import os
import sys

N = 16

P0 = "#include <avr/pgmspace.h>\n#include <SPI.h>\n#include <SD.h>\nFile f;\nconst byte IMG[] PROGMEM = {"
P1 = "};\nvoid setup() {\n\tSerial.begin(9600);\n\twhile (!Serial) { ; }\n\tif (!SD.begin(10)) { while (1); }\n\tSD.remove(\""
P2 = "\");\n\tf = SD.open(\""
P3 = "\", FILE_WRITE);\n\tif (f) {\n\t\tfor (int i = 0; i < 768; i++) { f.write(pgm_read_byte(&IMG[i])); }\n\t\tf.close();\n\t}\n}\nvoid loop() {}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        name = sys.argv[1]
        with open("txt/" + name + ".txt") as f:
            grid = json.load(f)
        new_grid = []
        M = 3 * N
        for i in range(N):
            if i % 2 == 0:
                for j in range(M - 3, -1, -3):
                    new_grid.append(grid[M * i + j])
                    new_grid.append(grid[M * i + j + 1])
                    new_grid.append(grid[M * i + j + 2])
            else:
                for j in range(M):
                    new_grid.append(grid[M * i + j])
        s = json.dumps(new_grid)[1:-1]
        try:
            folder_name = "ino/add-" + name + "/"
            os.mkdir(folder_name)
        except FileExistsError:
            pass
        filename = folder_name + "/add-" + name + ".ino"
        with open(filename, "w+") as f:
            n = name + ".txt"
            f.write(P0 + s + P1 + n + P2 + n + P3)
        print("const char {}[] PROGMEM = \"{}.txt\";".format(name, name))
    else:
        names = os.listdir("txt")
        for name in names:
            with open("txt/" + name) as f:
                grid = json.load(f)
            new_grid = []
            M = 3 * N
            for i in range(N):
                if i % 2 == 0:
                    for j in range(M - 3, -1, -3):
                        new_grid.append(grid[M * i + j])
                        new_grid.append(grid[M * i + j + 1])
                        new_grid.append(grid[M * i + j + 2])
                else:
                    for j in range(M):
                        new_grid.append(grid[M * i + j])
            s = json.dumps(new_grid)[1:-1]
            try:
                folder_name = "ino/add-" + name[:-4] + "/"
                os.mkdir(folder_name)
            except FileExistsError:
                pass
            filename = folder_name + "/add-" + name[:-4] + ".ino"
            with open(filename, "w+") as f:
                f.write(P0 + s + P1 + name + P2 + name + P3)
            print("const char {}[] PROGMEM = \"{}\";".format(name[:-4], name))