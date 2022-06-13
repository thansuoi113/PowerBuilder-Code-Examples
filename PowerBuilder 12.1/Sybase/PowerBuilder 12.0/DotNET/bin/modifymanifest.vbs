dim filename
dim trustlevel
dim uiaccess

on error resume next
filename = wscript.arguments(0)
trustlevel = wscript.arguments(1)
uiaccess = wscript.arguments(2)
Set xml = CreateObject("Msxml2.DOMDocument.3.0")
xml.async = false
xml.load filename
set objNodeList = xml.getElementsByTagName("requestedExecutionLevel")
for each item in objNodeList
   item.setAttribute "level", trustlevel
   item.setAttribute "uiAccess", uiaccess
next
xml.save filename
