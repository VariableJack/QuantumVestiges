#!/bin/bash
find src -type f \( -name "*.java" -o -name "*.xml" \) -print0 | xargs -0 sed -i 's/\t/    /g'