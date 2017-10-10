rem myspotlight.bat
rem Test on Windows 10
rem This batch file can be saved in temporary folder.
rem === 1 : Copy section ===
mkdir %userprofile%\desktop\myspotlight
cd %localappdata%\Packages\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\LocalState\Assets
copy *.* %userprofile%\desktop\myspotlight
cd %userprofile%\desktop\myspotlight
rem === 2 : Delete small size section ===
FOR %%F IN (*.*) DO ( IF %%~zF LSS 100000 del %%F )
rem === 3 : Rename section ===
ren *.* *.jpg
SET COUNT=1
SET PREFIX=me
FOR /f "tokens=*" %%G IN ('dir /b *.jpg') DO (call :renum "%%G")
GOTO :end
:renum
 ren %1 %PREFIX%_%count%.jpg
 set /a count+=1
 GOTO :EOF
:end
rem === 4 : Open first photo section ===
call explorer %userprofile%\desktop\myspotlight
call explorer me_1.jpg
