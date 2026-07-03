#!/bin/bash
dotnet publish -c Release -r win-x64 --self-contained false -p:PublishSingleFile=true
cp bin/Release/net8.0-windows/win-x64/publish/QuantumVestigesInstaller.exe .
& "C:/Program Files (x86)/Windows Kits/10/bin/10.0.22621.0/x64/signtool.exe" sign /debug /fd SHA256 /s My /n "Quantum Vestiges" QuantumVestigesInstaller.exe
